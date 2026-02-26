import { db, firebaseInitError, storage } from "@/lib/firebase";
import { Product, ProductInput, formatPrice } from "@/data/products";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";

export type OrderStatus = "pending" | "processing" | "delivered" | "cancelled";

export interface OrderItem {
  product_id: string;
  slug: string;
  name: string;
  image_url: string;
  volume_ml: number;
  quantity: number;
  price: number;
}

export interface OrderInput {
  full_name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  notes?: string;
  totalAmount: number;
  totalItems: number;
  items: OrderItem[];
}

export interface OrderRecord extends OrderInput {
  id: string;
  status: OrderStatus;
  createdAtMs: number | null;
}

const ORDER_FORMSPREE_ENDPOINT = "https://formspree.io/f/xojnrlnp";

function buildOrderMessage(input: OrderInput) {
  const lines = input.items.map(
    (item) =>
      `${item.quantity} × ${item.name} (${item.volume_ml}ml) • ${formatPrice(
        item.price * item.quantity,
      )}`,
  );
  return [
    "Order Summary",
    ...lines,
    `Total Items: ${input.totalItems}`,
    `Total Amount: ${formatPrice(input.totalAmount)}`,
    `Notes: ${input.notes?.trim() || "None"}`,
  ].join("\n");
}

async function postOrderToFormspree(input: OrderInput) {
  const payload = {
    name: input.full_name,
    email: input.email,
    phone: input.phone,
    address: `${input.address}, ${input.city}`,
    subject: "New Saria Perfumes Order",
    message: buildOrderMessage(input),
    order_items: JSON.stringify(
      input.items.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        volume_ml: item.volume_ml,
        price: item.price,
      })),
    ),
  };

  const response = await fetch(ORDER_FORMSPREE_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(
      `Order notification failed: ${response.status} ${
        text || response.statusText
      }`,
    );
  }
}

function requireDb() {
  if (!db) {
    throw firebaseInitError ?? new Error("Firestore is unavailable");
  }
  return db;
}

function requireStorage() {
  if (!storage) {
    throw firebaseInitError ?? new Error("Firebase Storage is unavailable");
  }
  return storage;
}

export async function uploadProductImage(file: File, slug: string): Promise<string> {
  const safeStorage = requireStorage();
  const fileName = `${Date.now()}-${slug || "product"}-${file.name}`;
  const imageRef = ref(safeStorage, `products/${fileName}`);
  await uploadBytes(imageRef, file);
  return getDownloadURL(imageRef);
}

export async function addProduct(input: ProductInput): Promise<void> {
  const safeDb = requireDb();
  await addDoc(collection(safeDb, "products"), {
    ...input,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateProduct(id: string, input: ProductInput): Promise<void> {
  const safeDb = requireDb();
  await updateDoc(doc(safeDb, "products", id), {
    ...input,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteProductById(id: string, imageUrl?: string): Promise<void> {
  const safeDb = requireDb();
  await deleteDoc(doc(safeDb, "products", id));

  if (!imageUrl || !imageUrl.includes("firebasestorage.googleapis.com")) return;

  try {
    const safeStorage = requireStorage();
    const imageRef = ref(safeStorage, imageUrl);
    await deleteObject(imageRef);
  } catch (error) {
    console.warn("Image delete skipped:", error);
  }
}

export async function createOrder(input: OrderInput): Promise<void> {
  await postOrderToFormspree(input);
  const safeDb = requireDb();
  await addDoc(collection(safeDb, "orders"), {
    ...input,
    status: "pending",
    createdAt: serverTimestamp(),
  });
}

function parseOrder(docId: string, payload: Record<string, unknown>): OrderRecord {
  const getString = (value: unknown) => (typeof value === "string" ? value : "");
  const getNumber = (value: unknown) =>
    typeof value === "number" && Number.isFinite(value) ? value : 0;

  const rawItems = Array.isArray(payload.items) ? payload.items : [];
  const items: OrderItem[] = rawItems.map((item) => {
    const row = typeof item === "object" && item !== null ? (item as Record<string, unknown>) : {};
    return {
      product_id: getString(row.product_id),
      slug: getString(row.slug),
      name: getString(row.name),
      image_url: getString(row.image_url),
      volume_ml: getNumber(row.volume_ml),
      quantity: getNumber(row.quantity),
      price: getNumber(row.price),
    };
  });

  const statusRaw = getString(payload.status);
  const status: OrderStatus =
    statusRaw === "processing" || statusRaw === "delivered" || statusRaw === "cancelled"
      ? statusRaw
      : "pending";

  const createdAtRaw = payload.createdAt as { toMillis?: () => number } | undefined;
  const createdAtMs = createdAtRaw?.toMillis ? createdAtRaw.toMillis() : null;

  return {
    id: docId,
    full_name: getString(payload.full_name),
    phone: getString(payload.phone),
    email: getString(payload.email),
    address: getString(payload.address),
    city: getString(payload.city),
    notes: getString(payload.notes),
    totalAmount: getNumber(payload.totalAmount),
    totalItems: getNumber(payload.totalItems),
    items,
    status,
    createdAtMs,
  };
}

export function subscribeOrders(
  onChange: (orders: OrderRecord[]) => void,
  onError: (error: unknown) => void,
) {
  if (!db) {
    onError(firebaseInitError ?? new Error("Firestore is unavailable"));
    return () => {};
  }
  const ordersQuery = query(collection(db, "orders"), orderBy("createdAt", "desc"));

  return onSnapshot(
    ordersQuery,
    (snapshot) => {
      const orders = snapshot.docs.map((orderDoc) => parseOrder(orderDoc.id, orderDoc.data()));
      onChange(orders);
    },
    onError,
  );
}

export async function updateOrderStatus(orderId: string, status: OrderStatus): Promise<void> {
  const safeDb = requireDb();
  await updateDoc(doc(safeDb, "orders", orderId), {
    status,
    updatedAt: serverTimestamp(),
  });
}

export function productToInput(product: Product): ProductInput {
  return {
    name: product.name,
    slug: product.slug,
    brand: product.brand,
    brandSlug: product.brandSlug,
    category: product.category,
    price: product.price,
    volume_ml: product.volume_ml,
    gender: product.gender,
    short_description: product.short_description,
    long_description: product.long_description,
    top_notes: product.top_notes,
    middle_notes: product.middle_notes,
    base_notes: product.base_notes,
    stock_quantity: product.stock_quantity,
    featured: product.featured,
    image_url: product.image_url,
    scent_profile: product.scent_profile,
  };
}
