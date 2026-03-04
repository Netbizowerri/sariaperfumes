import { useAuth } from "@/context/AuthContext";
import { useProductsData } from "@/context/ProductsContext";
import { brandHierarchy } from "@/data/brandStructure";
import { subCategoryDefaults } from "@/data/categoryConfig";
import {
  Product,
  ProductInput,
  emptyProductInput,
  formatPrice,
  normalizeSlug,
  slugToLabel,
} from "@/data/products";
import {
  AdminCatalogItem,
  OrderRecord,
  OrderStatus,
  addBrand,
  addProduct,
  addSubCategory,
  deleteBrandById,
  deleteProductById,
  deleteSubCategoryById,
  productToInput,
  subscribeBrands,
  subscribeOrders,
  subscribeSubCategories,
  updateOrderStatus,
  updateProduct,
  uploadProductImage,
} from "@/services/store";
import { AnimatePresence, motion } from "framer-motion";
import {
  BarChart3,
  Boxes,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Pencil,
  Plus,
  Shapes,
  ShoppingCart,
  Tags,
  Trash2,
  X,
} from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

type AdminView = "overview" | "products" | "brands" | "subcategories" | "orders";
type Option = { id: string; name: string; slug: string };

const orderStatuses: OrderStatus[] = ["pending", "processing", "delivered", "cancelled"];
const control =
  "w-full rounded-xl border border-border/80 bg-background/85 px-3 py-2.5 text-sm outline-none transition focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20";
const panel =
  "rounded-2xl border border-border/70 bg-card/90 p-5 shadow-[0_20px_55px_-35px_rgba(15,23,42,0.55)] backdrop-blur";

const navItems = [
  { id: "overview" as const, label: "Overview", icon: BarChart3, desc: "Website stats" },
  { id: "products" as const, label: "Products", icon: Package, desc: "Catalog items" },
  { id: "brands" as const, label: "Brands", icon: Tags, desc: "Brand options" },
  { id: "subcategories" as const, label: "Sub-categories", icon: Shapes, desc: "Scent groups" },
  { id: "orders" as const, label: "Orders", icon: ShoppingCart, desc: "Customer orders" },
];

const formatDate = (value: number | null) =>
  value ? new Date(value).toLocaleString() : "Just now";

const getErrorMessage = (error: unknown) => {
  if (typeof error === "object" && error !== null && "message" in error) {
    const message = (error as { message?: unknown }).message;
    if (typeof message === "string") return message;
  }
  return "Unknown error";
};

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Could not read image file"));
    reader.readAsDataURL(file);
  });
}

async function compressImageToDataUrl(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) {
    return fileToDataUrl(file);
  }

  const objectUrl = URL.createObjectURL(file);
  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("Could not load image"));
      img.src = objectUrl;
    });

    const maxEdge = 1280;
    const scale = Math.min(1, maxEdge / Math.max(image.width, image.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(image.width * scale));
    canvas.height = Math.max(1, Math.round(image.height * scale));
    const context = canvas.getContext("2d");
    if (!context) return fileToDataUrl(file);
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", 0.82);
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

function mergeOptions(...sets: Option[][]): Option[] {
  const map = new Map<string, Option>();
  sets.forEach((set) => {
    set.forEach((item) => {
      if (!item.slug) return;
      if (!map.has(item.slug)) map.set(item.slug, item);
    });
  });
  return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
}

export default function AdminDashboardPage() {
  const { logout, user } = useAuth();
  const { products, loading: productsLoading, categories } = useProductsData();

  const [view, setView] = useState<AdminView>("overview");
  const [menuOpen, setMenuOpen] = useState(false);
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [busyOrderId, setBusyOrderId] = useState<string | null>(null);
  const [brands, setBrands] = useState<AdminCatalogItem[]>([]);
  const [subCategories, setSubCategories] = useState<AdminCatalogItem[]>([]);
  const [brandsLoading, setBrandsLoading] = useState(true);
  const [subLoading, setSubLoading] = useState(true);
  const [brandInput, setBrandInput] = useState("");
  const [subInput, setSubInput] = useState("");
  const [brandSubmitting, setBrandSubmitting] = useState(false);
  const [subSubmitting, setSubSubmitting] = useState(false);
  const [form, setForm] = useState<ProductInput>(emptyProductInput);
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [productSubmitting, setProductSubmitting] = useState(false);

  useEffect(() => {
    const unsub = subscribeOrders(
      (next) => {
        setOrders(next);
        setOrdersLoading(false);
      },
      (error) => {
        console.error(error);
        toast.error("Could not load orders");
        setOrdersLoading(false);
      },
    );
    return () => unsub();
  }, []);

  useEffect(() => {
    const unsub = subscribeBrands(
      (next) => {
        setBrands(next);
        setBrandsLoading(false);
      },
      () => setBrandsLoading(false),
    );
    return () => unsub();
  }, []);

  useEffect(() => {
    const unsub = subscribeSubCategories(
      (next) => {
        setSubCategories(next);
        setSubLoading(false);
      },
      () => setSubLoading(false),
    );
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onEscape = (event: KeyboardEvent) => event.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onEscape);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onEscape);
    };
  }, [menuOpen]);

  const imagePreview = useMemo(() => (imageFile ? URL.createObjectURL(imageFile) : null), [imageFile]);
  useEffect(() => () => imagePreview && URL.revokeObjectURL(imagePreview), [imagePreview]);

  const brandOptions = useMemo(() => {
    const fromDb = brands.map((item) => ({ id: item.id, name: item.name, slug: item.slug }));
    const fromDefaults = brandHierarchy.map((item) => ({
      id: `default-${item.slug}`,
      name: item.name,
      slug: item.slug,
    }));
    const fromProducts = products.map((item) => {
      const name = item.brand || slugToLabel(item.brandSlug);
      const slug = item.brandSlug || normalizeSlug(name);
      return { id: `product-${slug}`, name, slug };
    });
    return mergeOptions(fromDb, fromDefaults, fromProducts);
  }, [brands, products]);

  const subOptions = useMemo(() => {
    const fromDb = subCategories.map((item) => ({ id: item.id, name: item.name, slug: item.slug }));
    const fromDefaults = subCategoryDefaults.map((item) => ({
      id: `default-${item.slug}`,
      name: item.name,
      slug: item.slug,
    }));
    const fromProducts = categories.map((item) => ({
      id: `product-${item.slug}`,
      name: item.name,
      slug: item.slug,
    }));
    return mergeOptions(fromDb, fromDefaults, fromProducts);
  }, [subCategories, categories]);

  const categoryNameBySlug = useMemo(() => {
    const map = new Map<string, string>();
    subOptions.forEach((item) => map.set(item.slug, item.name));
    categories.forEach((item) => map.set(item.slug, item.name));
    return map;
  }, [subOptions, categories]);

  const productCountByBrand = useMemo(() => {
    const map = new Map<string, number>();
    products.forEach((product) => {
      const slug = product.brandSlug || normalizeSlug(product.brand);
      if (!slug) return;
      map.set(slug, (map.get(slug) ?? 0) + 1);
    });
    return map;
  }, [products]);

  const productCountByCategory = useMemo(() => {
    const map = new Map<string, number>();
    products.forEach((product) => {
      if (!product.category) return;
      map.set(product.category, (map.get(product.category) ?? 0) + 1);
    });
    return map;
  }, [products]);

  const stats = useMemo(() => {
    const pending = orders.filter((o) => o.status === "pending").length;
    const revenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    return {
      products: products.length,
      categories: new Set(categories.map((item) => item.slug)).size,
      brands: new Set(brandOptions.map((item) => item.slug)).size,
      subCategories: new Set(subOptions.map((item) => item.slug)).size,
      orders: orders.length,
      pending,
      revenue,
    };
  }, [orders, products.length, categories, brandOptions, subOptions]);

  const resetProductForm = () => {
    setForm(emptyProductInput);
    setDescription("");
    setEditingId(null);
    setImageFile(null);
  };

  const startEdit = (product: Product) => {
    setEditingId(product.id);
    setForm(productToInput(product));
    setDescription(product.long_description || product.short_description || "");
    setImageFile(null);
    setView("products");
  };

  const handleDeleteProduct = async (id: string, imageUrl: string) => {
    if (!confirm("Delete this product permanently?")) return;
    try {
      await deleteProductById(id, imageUrl);
      toast.success("Product deleted");
      if (editingId === id) resetProductForm();
    } catch (error) {
      console.error(error);
      toast.error("Could not delete product");
    }
  };

  const handleProductSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const slug = normalizeSlug(form.slug || form.name);
    const category = normalizeSlug(form.category);
    const brandName = form.brand.trim();

    if (!brandName) return toast.error("Brand is required");
    if (!category) return toast.error("Sub-category is required");
    if (!description.trim()) return toast.error("Description is required");

    setProductSubmitting(true);
    try {
      let imageUrl = form.image_url;
      if (imageFile) {
        imageUrl = await compressImageToDataUrl(imageFile);
      }
      if (!imageUrl) return toast.error("Please add a product image");

      const payload: ProductInput = {
        ...form,
        name: form.name.trim(),
        slug,
        brand: brandName,
        brandSlug: normalizeSlug(brandName),
        category,
        image_url: imageUrl,
        short_description: description.trim(),
        long_description: description.trim(),
        top_notes: form.top_notes || [],
        middle_notes: form.middle_notes || [],
        base_notes: form.base_notes || [],
        scent_profile: form.scent_profile || [],
      };

      if (editingId) {
        await updateProduct(editingId, payload);
        toast.success("Product updated");
      } else {
        await addProduct(payload);
        toast.success("Product created");
      }
      resetProductForm();
    } catch (error) {
      console.error(error);
      toast.error(`Could not save product: ${getErrorMessage(error)}`);
    } finally {
      setProductSubmitting(false);
    }
  };

  const handleAddBrand = async (event: FormEvent) => {
    event.preventDefault();
    const name = brandInput.trim();
    const slug = normalizeSlug(name);
    if (!name) return toast.error("Enter a brand name");
    if (brandOptions.some((item) => item.slug === slug)) return toast.error("Brand already exists");
    setBrandSubmitting(true);
    try {
      await addBrand(name);
      setBrandInput("");
      toast.success("Brand added");
    } catch (error) {
      console.error(error);
      toast.error("Could not add brand");
    } finally {
      setBrandSubmitting(false);
    }
  };

  const handleDeleteBrand = async (brand: AdminCatalogItem) => {
    const count = productCountByBrand.get(brand.slug) ?? 0;
    const ok = confirm(
      count > 0
        ? `Delete ${brand.name} from managed brands? ${count} product(s) currently use this brand.`
        : `Delete ${brand.name}?`,
    );
    if (!ok) return;
    try {
      await deleteBrandById(brand.id);
      toast.success("Brand deleted");
    } catch (error) {
      console.error(error);
      toast.error("Could not delete brand");
    }
  };

  const handleAddSubCategory = async (event: FormEvent) => {
    event.preventDefault();
    const name = subInput.trim();
    const slug = normalizeSlug(name);
    if (!name) return toast.error("Enter a sub-category name");
    if (subOptions.some((item) => item.slug === slug)) return toast.error("Sub-category already exists");
    setSubSubmitting(true);
    try {
      await addSubCategory(name);
      setSubInput("");
      toast.success("Sub-category added");
    } catch (error) {
      console.error(error);
      toast.error("Could not add sub-category");
    } finally {
      setSubSubmitting(false);
    }
  };

  const handleDeleteSubCategory = async (item: AdminCatalogItem) => {
    const count = productCountByCategory.get(item.slug) ?? 0;
    const ok = confirm(
      count > 0
        ? `Delete ${item.name} from managed sub-categories? ${count} product(s) currently use it.`
        : `Delete ${item.name}?`,
    );
    if (!ok) return;
    try {
      await deleteSubCategoryById(item.id);
      toast.success("Sub-category deleted");
    } catch (error) {
      console.error(error);
      toast.error("Could not delete sub-category");
    }
  };

  const handleOrderStatus = async (orderId: string, status: OrderStatus) => {
    setBusyOrderId(orderId);
    try {
      await updateOrderStatus(orderId, status);
      toast.success("Order status updated");
    } catch (error) {
      console.error(error);
      toast.error("Could not update order status");
    } finally {
      setBusyOrderId(null);
    }
  };

  const metrics = [
    { label: "Products", value: String(stats.products), icon: Package },
    { label: "Categories", value: String(stats.categories), icon: Boxes },
    { label: "Brands", value: String(stats.brands), icon: Tags },
    { label: "Sub-categories", value: String(stats.subCategories), icon: Shapes },
    { label: "Orders", value: String(stats.orders), icon: ShoppingCart },
    { label: "Pending", value: String(stats.pending), icon: LayoutDashboard },
    { label: "Revenue", value: formatPrice(stats.revenue), icon: BarChart3 },
  ];

  const overviewView = (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {metrics.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03, duration: 0.25 }}
            className={`${panel} transition-all duration-300 hover:scale-[1.02]`}
          >
            <div className="mb-3 inline-flex rounded-lg border border-primary/30 bg-primary/10 p-2 text-primary">
              <item.icon className="h-4 w-4" />
            </div>
            <p className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">{item.label}</p>
            <p className="mt-2 font-display text-3xl">{item.value}</p>
          </motion.div>
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <div className={panel}>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display text-2xl">Latest Products</h3>
            <button
              onClick={() => setView("products")}
              className="rounded-full border border-border/70 px-4 py-1.5 text-xs uppercase tracking-[0.14em] transition hover:border-primary hover:text-primary"
            >
              Manage
            </button>
          </div>
          <div className="space-y-3">
            {products.slice(0, 6).map((product) => (
              <div key={product.id} className="flex gap-3 rounded-xl border border-border/70 bg-background/55 p-3">
                <img src={product.image_url} alt={product.name} className="h-12 w-12 rounded-lg object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{product.name}</p>
                  <p className="text-xs text-muted-foreground">{formatPrice(product.price)} - {product.brand}</p>
                </div>
              </div>
            ))}
            {products.length === 0 && (
              <p className="rounded-xl border border-border/70 bg-background/55 p-4 text-sm text-muted-foreground">
                No products yet.
              </p>
            )}
          </div>
        </div>
        <div className={panel}>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display text-2xl">Latest Orders</h3>
            <button
              onClick={() => setView("orders")}
              className="rounded-full border border-border/70 px-4 py-1.5 text-xs uppercase tracking-[0.14em] transition hover:border-primary hover:text-primary"
            >
              Open Orders
            </button>
          </div>
          <div className="space-y-3">
            {orders.slice(0, 6).map((order) => (
              <div key={order.id} className="rounded-xl border border-border/70 bg-background/55 p-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium">{order.full_name}</p>
                  <p className="text-sm text-primary">{formatPrice(order.totalAmount)}</p>
                </div>
                <p className="text-xs text-muted-foreground">
                  {order.totalItems} item(s) - {order.status} - {formatDate(order.createdAtMs)}
                </p>
              </div>
            ))}
            {!ordersLoading && orders.length === 0 && (
              <p className="rounded-xl border border-border/70 bg-background/55 p-4 text-sm text-muted-foreground">
                No orders yet.
              </p>
            )}
            {ordersLoading && (
              <p className="rounded-xl border border-border/70 bg-background/55 p-4 text-sm text-muted-foreground">
                Loading orders...
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const productsView = (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,430px)_minmax(0,1fr)]">
      <div className={panel}>
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-display text-2xl">{editingId ? "Edit Product" : "Add Product"}</h2>
          {editingId && (
            <button onClick={resetProductForm} className="text-xs uppercase tracking-[0.14em] text-muted-foreground hover:text-primary">
              Cancel
            </button>
          )}
        </div>
        <form onSubmit={handleProductSubmit} className="space-y-4">
          <input required className={control} value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder="Product name" />
          <div className="grid gap-3 md:grid-cols-2">
            <input className={control} value={form.slug} onChange={(e) => setForm((p) => ({ ...p, slug: normalizeSlug(e.target.value) }))} placeholder="slug" />
            <input required className={control} value={form.brand} list="brand-options" onChange={(e) => setForm((p) => ({ ...p, brand: e.target.value, brandSlug: normalizeSlug(e.target.value) }))} placeholder="brand" />
            <datalist id="brand-options">
              {brandOptions.map((brand) => <option key={brand.slug} value={brand.name} />)}
            </datalist>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <select required className={control} value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: normalizeSlug(e.target.value) }))}>
              <option value="">Select sub-category</option>
              {subOptions.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
            </select>
            <select className={control} value={form.gender} onChange={(e) => setForm((p) => ({ ...p, gender: e.target.value as ProductInput["gender"] }))}>
              <option value="unisex">Unisex</option>
              <option value="men">Men</option>
              <option value="women">Women</option>
            </select>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            <div>
              <label className="mb-1.5 block text-xs text-muted-foreground">Price</label>
              <input required min={0} type="number" className={control} value={form.price} onChange={(e) => setForm((p) => ({ ...p, price: Math.max(0, Number(e.target.value) || 0) }))} />
            </div>
            <div>
              <label className="mb-1.5 block text-xs text-muted-foreground">Qty</label>
              <input required min={0} type="number" className={control} value={form.stock_quantity} onChange={(e) => setForm((p) => ({ ...p, stock_quantity: Math.max(0, Number(e.target.value) || 0) }))} />
            </div>
            <div>
              <label className="mb-1.5 block text-xs text-muted-foreground">Volume (ml)</label>
              <input required min={1} type="number" className={control} value={form.volume_ml} onChange={(e) => setForm((p) => ({ ...p, volume_ml: Math.max(1, Number(e.target.value) || 1) }))} />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-xs text-muted-foreground">Description</label>
            <textarea required rows={4} className={`${control} resize-none`} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Product description" />
          </div>
          <input type="file" accept="image/*" className="w-full rounded-xl border border-border/80 bg-background/85 px-3 py-2 text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-xs file:text-primary-foreground" onChange={(e) => setImageFile(e.target.files?.[0] ?? null)} />
          {(imagePreview || form.image_url) && <img src={imagePreview || form.image_url} alt="preview" className="h-36 w-full rounded-xl object-cover" />}
          <label className="flex items-center gap-2 rounded-xl border border-border/70 bg-background/55 p-3 text-sm">
            <input type="checkbox" checked={form.featured} onChange={(e) => setForm((p) => ({ ...p, featured: e.target.checked }))} />
            Featured product
          </label>
          <button disabled={productSubmitting} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground transition hover:bg-gold-light disabled:opacity-60">
            <Pencil className="h-4 w-4" />
            {productSubmitting ? "Saving..." : editingId ? "Update Product" : "Create Product"}
          </button>
        </form>
      </div>
      <div className={panel}>
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-display text-2xl">All Products</h2>
          <span className="rounded-full border border-border/70 bg-background/60 px-3 py-1 text-xs uppercase tracking-[0.14em] text-muted-foreground">{products.length} items</span>
        </div>
        {productsLoading ? (
          <div className="rounded-xl border border-border/70 bg-background/55 p-5 text-sm text-muted-foreground">Loading products...</div>
        ) : (
          <div className="space-y-3">
            {products.map((product) => (
              <div key={product.id} className="rounded-xl border border-border/70 bg-background/55 p-4 transition hover:shadow-md">
                <div className="flex gap-4">
                  <img src={product.image_url} alt={product.name} className="h-20 w-20 rounded-lg object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs uppercase tracking-[0.14em] text-primary">{categoryNameBySlug.get(product.category) || slugToLabel(product.category)}</p>
                    <h3 className="truncate font-display text-xl">{product.name}</h3>
                    <p className="text-sm text-muted-foreground">{formatPrice(product.price)} - {product.volume_ml}ml - {product.gender}</p>
                    <p className="text-xs text-muted-foreground">Stock: {product.stock_quantity}</p>
                  </div>
                </div>
                <div className="mt-3 flex gap-2">
                  <button onClick={() => startEdit(product)} className="flex-1 rounded-lg border border-border/70 px-3 py-2 text-xs uppercase tracking-[0.14em] transition hover:border-primary hover:text-primary">Edit</button>
                  <button onClick={() => handleDeleteProduct(product.id, product.image_url)} className="rounded-lg border border-destructive/50 px-3 py-2 text-destructive transition hover:bg-destructive hover:text-destructive-foreground"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const brandsView = (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,340px)_minmax(0,1fr)]">
      <div className={panel}>
        <h2 className="font-display text-2xl">Add Brand</h2>
        <form onSubmit={handleAddBrand} className="mt-4 space-y-4">
          <input className={control} value={brandInput} onChange={(e) => setBrandInput(e.target.value)} placeholder="Brand name" />
          <button disabled={brandSubmitting} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground transition hover:bg-gold-light disabled:opacity-60">
            <Plus className="h-4 w-4" />
            {brandSubmitting ? "Adding..." : "Add Brand"}
          </button>
        </form>
      </div>
      <div className={panel}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-2xl">Managed Brands</h2>
          <span className="rounded-full border border-border/70 bg-background/60 px-3 py-1 text-xs uppercase tracking-[0.14em] text-muted-foreground">{brands.length}</span>
        </div>
        {brandsLoading ? (
          <p className="rounded-xl border border-border/70 bg-background/55 p-5 text-sm text-muted-foreground">Loading brands...</p>
        ) : (
          <div className="space-y-3">
            {brands.map((brand) => (
              <div key={brand.id} className="flex items-center justify-between gap-3 rounded-xl border border-border/70 bg-background/55 p-3">
                <div>
                  <p className="font-medium">{brand.name}</p>
                  <p className="text-xs text-muted-foreground">{brand.slug} - {productCountByBrand.get(brand.slug) ?? 0} product(s)</p>
                </div>
                <button onClick={() => handleDeleteBrand(brand)} className="rounded-lg border border-destructive/50 p-2 text-destructive transition hover:bg-destructive hover:text-destructive-foreground">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
            {brands.length === 0 && <p className="rounded-xl border border-border/70 bg-background/55 p-5 text-sm text-muted-foreground">No managed brands yet.</p>}
          </div>
        )}
      </div>
    </div>
  );

  const subCategoriesView = (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,340px)_minmax(0,1fr)]">
      <div className={panel}>
        <h2 className="font-display text-2xl">Add Sub-category</h2>
        <form onSubmit={handleAddSubCategory} className="mt-4 space-y-4">
          <input className={control} value={subInput} onChange={(e) => setSubInput(e.target.value)} placeholder="Sub-category name" />
          <button disabled={subSubmitting} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground transition hover:bg-gold-light disabled:opacity-60">
            <Plus className="h-4 w-4" />
            {subSubmitting ? "Adding..." : "Add Sub-category"}
          </button>
        </form>
      </div>
      <div className={panel}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-2xl">Managed Sub-categories</h2>
          <span className="rounded-full border border-border/70 bg-background/60 px-3 py-1 text-xs uppercase tracking-[0.14em] text-muted-foreground">{subCategories.length}</span>
        </div>
        {subLoading ? (
          <p className="rounded-xl border border-border/70 bg-background/55 p-5 text-sm text-muted-foreground">Loading sub-categories...</p>
        ) : (
          <div className="space-y-3">
            {subCategories.map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-3 rounded-xl border border-border/70 bg-background/55 p-3">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.slug} - {productCountByCategory.get(item.slug) ?? 0} product(s)</p>
                </div>
                <button onClick={() => handleDeleteSubCategory(item)} className="rounded-lg border border-destructive/50 p-2 text-destructive transition hover:bg-destructive hover:text-destructive-foreground">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
            {subCategories.length === 0 && <p className="rounded-xl border border-border/70 bg-background/55 p-5 text-sm text-muted-foreground">No managed sub-categories yet.</p>}
          </div>
        )}
      </div>
    </div>
  );

  const ordersView = (
    <div className={panel}>
      <div className="mb-5 flex items-center justify-between">
        <h2 className="font-display text-2xl">Orders Management</h2>
        <span className="rounded-full border border-border/70 bg-background/60 px-3 py-1 text-xs uppercase tracking-[0.14em] text-muted-foreground">{orders.length}</span>
      </div>
      {ordersLoading ? (
        <div className="rounded-xl border border-border/70 bg-background/55 p-6 text-sm text-muted-foreground">Loading orders...</div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="rounded-xl border border-border/70 bg-background/55 p-5">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.15em] text-primary">Order #{order.id.slice(0, 8)}</p>
                  <h3 className="font-display text-xl">{order.full_name}</h3>
                  <p className="text-sm text-muted-foreground">{order.phone} - {order.email}</p>
                  <p className="text-sm text-muted-foreground">{order.address}, {order.city}</p>
                </div>
                <div className="md:text-right">
                  <p className="font-display text-3xl text-primary">{formatPrice(order.totalAmount)}</p>
                  <p className="text-sm text-muted-foreground">{order.totalItems} item(s)</p>
                  <p className="text-xs text-muted-foreground">{formatDate(order.createdAtMs)}</p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {order.items.map((item) => (
                  <div key={`${order.id}-${item.product_id}-${item.slug}`} className="inline-flex items-center gap-2 rounded-lg border border-border/70 bg-background/55 px-2 py-1 text-xs">
                    <img src={item.image_url} alt={item.name} className="h-7 w-7 rounded object-cover" />
                    <span>{item.name}</span>
                    <span className="text-muted-foreground">x{item.quantity}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <select value={order.status} disabled={busyOrderId === order.id} onChange={(e) => handleOrderStatus(order.id, e.target.value as OrderStatus)} className={`${control} max-w-xs`}>
                  {orderStatuses.map((status) => <option key={status} value={status}>{status}</option>)}
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const body =
    view === "overview"
      ? overviewView
      : view === "products"
        ? productsView
        : view === "brands"
          ? brandsView
          : view === "subcategories"
            ? subCategoriesView
            : ordersView;

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,hsl(43_56%_42%/.2),transparent_30%),radial-gradient(circle_at_bottom_right,hsl(210_40%_15%/.12),transparent_35%)] px-3 py-4 text-foreground sm:px-5 sm:py-6 lg:px-8">
      <div className="mx-auto w-full max-w-[1500px]">
        <div className="mb-4 flex items-center justify-between rounded-2xl border border-border/70 bg-card/70 px-4 py-3 backdrop-blur lg:hidden">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-primary">Admin Dashboard</p>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
          </div>
          <button onClick={() => setMenuOpen(true)} className="rounded-lg border border-border/70 p-2 transition hover:border-primary hover:text-primary"><Menu className="h-5 w-5" /></button>
        </div>
        <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)] xl:grid-cols-[320px_minmax(0,1fr)]">
          <aside className={`${panel} hidden h-fit lg:sticky lg:top-6 lg:block`}>
            <div className="mb-6 border-b border-border/60 pb-5">
              <p className="text-[10px] uppercase tracking-[0.35em] text-primary">Admin Dashboard</p>
              <h1 className="mt-2 font-display text-3xl">Control Center</h1>
              <p className="mt-2 text-xs text-muted-foreground">Signed in as {user?.email}</p>
            </div>
            <nav className="space-y-2">
              {navItems.map((item) => {
                const active = view === item.id;
                return (
                  <button key={item.id} onClick={() => setView(item.id)} className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition ${active ? "bg-primary text-primary-foreground shadow-md" : "border border-border/60 bg-background/60 hover:border-primary/70 hover:text-primary"}`}>
                    <item.icon className="h-4 w-4" />
                    <span className="min-w-0 flex-1"><span className="block text-sm font-medium">{item.label}</span><span className={`block text-[11px] ${active ? "text-primary-foreground/80" : "text-muted-foreground"}`}>{item.desc}</span></span>
                  </button>
                );
              })}
            </nav>
            <button onClick={logout} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border/70 px-4 py-3 text-xs uppercase tracking-[0.18em] transition hover:border-primary hover:text-primary"><LogOut className="h-4 w-4" />Logout</button>
          </aside>
          <section className="space-y-4">
            <div className="rounded-2xl border border-border/70 bg-card/80 p-4 backdrop-blur">
              <p className="text-[11px] uppercase tracking-[0.25em] text-primary">{navItems.find((item) => item.id === view)?.label}</p>
              <h2 className="mt-2 font-display text-3xl">Saria Perfumes Admin Workspace</h2>
              <p className="mt-1 text-sm text-muted-foreground">Manage products, prices, descriptions, images, brands, sub-categories, and orders.</p>
            </div>
            <AnimatePresence mode="wait">
              <motion.div key={view} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
                {body}
              </motion.div>
            </AnimatePresence>
          </section>
        </div>
      </div>
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMenuOpen(false)} className="fixed inset-0 z-40 bg-black/45 lg:hidden" />
            <motion.aside initial={{ x: -320 }} animate={{ x: 0 }} exit={{ x: -320 }} transition={{ type: "tween", duration: 0.25 }} className="fixed inset-y-0 left-0 z-50 w-[85%] max-w-[320px] overflow-y-auto border-r border-border/70 bg-card p-4 lg:hidden">
              <div className="mb-5 flex items-start justify-between"><h2 className="font-display text-2xl">Menu</h2><button onClick={() => setMenuOpen(false)} className="rounded-lg border border-border/70 p-2"><X className="h-4 w-4" /></button></div>
              <nav className="space-y-2">
                {navItems.map((item) => (
                  <button key={item.id} onClick={() => { setView(item.id); setMenuOpen(false); }} className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left ${view === item.id ? "bg-primary text-primary-foreground" : "border border-border/60 bg-background/60"}`}>
                    <item.icon className="h-4 w-4" /><span>{item.label}</span>
                  </button>
                ))}
              </nav>
              <button onClick={logout} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border/70 px-4 py-3 text-xs uppercase tracking-[0.18em]"><LogOut className="h-4 w-4" />Logout</button>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
