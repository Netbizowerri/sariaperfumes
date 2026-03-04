import { db, firebaseInitError } from "@/firebase/config";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";

function requireDb() {
  if (!db) {
    throw firebaseInitError ?? new Error("Firestore is unavailable");
  }
  return db;
}

function sanitizeProductInput(input) {
  if (!input || typeof input !== "object") {
    throw new Error("Product payload is required");
  }

  const name = String(input.name || "").trim();
  const slug = String(input.slug || "").trim();
  const brand = String(input.brand || "").trim();
  const brandSlug = String(input.brandSlug || "").trim();
  const category = String(input.category || "").trim();
  const imageUrl = String(input.image_url || "").trim();
  const description = String(input.description || input.long_description || input.short_description || "").trim();
  const price = Number(input.price || 0);
  const volumeMl = Number(input.volume_ml || 0);
  const qty = Number(input.qty ?? input.stock_quantity ?? 0);

  if (!name) throw new Error("Product name is required");
  if (!slug) throw new Error("Product slug is required");
  if (!brand) throw new Error("Brand is required");
  if (!category) throw new Error("Sub-category is required");
  if (!description) throw new Error("Description is required");
  if (!imageUrl) throw new Error("Image URL is required");

  return {
    name,
    slug,
    brand,
    brandSlug,
    category,
    image_url: imageUrl,
    short_description: description,
    long_description: description,
    description,
    price: Number.isFinite(price) ? Math.max(0, price) : 0,
    volume_ml: Number.isFinite(volumeMl) ? Math.max(1, volumeMl) : 1,
    stock_quantity: Number.isFinite(qty) ? Math.max(0, qty) : 0,
    qty: Number.isFinite(qty) ? Math.max(0, qty) : 0,
    featured: Boolean(input.featured),
    gender: input.gender || "unisex",
    top_notes: Array.isArray(input.top_notes) ? input.top_notes : [],
    middle_notes: Array.isArray(input.middle_notes) ? input.middle_notes : [],
    base_notes: Array.isArray(input.base_notes) ? input.base_notes : [],
    scent_profile: Array.isArray(input.scent_profile) ? input.scent_profile : [],
  };
}

export async function createProduct(productInput) {
  const safeDb = requireDb();
  const payload = sanitizeProductInput(productInput);
  return addDoc(collection(safeDb, "products"), {
    ...payload,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function getProductById(productId) {
  const safeDb = requireDb();
  const ref = doc(safeDb, "products", productId);
  const snapshot = await getDoc(ref);
  if (!snapshot.exists()) return null;
  return { id: snapshot.id, ...snapshot.data() };
}

export async function getProductsByBrand(brandSlug, max = 100) {
  const safeDb = requireDb();
  const productsQuery = query(
    collection(safeDb, "products"),
    where("brandSlug", "==", brandSlug),
    orderBy("updatedAt", "desc"),
    limit(max),
  );
  const snapshot = await getDocs(productsQuery);
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
}

export async function updateProductById(productId, productInput) {
  const safeDb = requireDb();
  const payload = sanitizeProductInput(productInput);
  await updateDoc(doc(safeDb, "products", productId), {
    ...payload,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteProductById(productId) {
  const safeDb = requireDb();
  await deleteDoc(doc(safeDb, "products", productId));
}

export async function createBrand(name, slug) {
  const safeDb = requireDb();
  const value = String(name || "").trim();
  if (!value) throw new Error("Brand name is required");
  return addDoc(collection(safeDb, "brands"), {
    name: value,
    slug: String(slug || "").trim(),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function deleteBrand(brandId) {
  const safeDb = requireDb();
  await deleteDoc(doc(safeDb, "brands", brandId));
}

export async function createSubCategory(name, slug) {
  const safeDb = requireDb();
  const value = String(name || "").trim();
  if (!value) throw new Error("Sub-category name is required");
  return addDoc(collection(safeDb, "subcategories"), {
    name: value,
    slug: String(slug || "").trim(),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function deleteSubCategory(subCategoryId) {
  const safeDb = requireDb();
  await deleteDoc(doc(safeDb, "subcategories", subCategoryId));
}
