import { useAuth } from "@/context/AuthContext";
import { useProductsData } from "@/context/ProductsContext";
import {
  Product,
  ProductInput,
  emptyProductInput,
  formatPrice,
  normalizeSlug,
  slugToLabel,
} from "@/data/products";
import {
  OrderRecord,
  OrderStatus,
  addProduct,
  deleteProductById,
  productToInput,
  subscribeOrders,
  updateOrderStatus,
  updateProduct,
  uploadProductImage,
} from "@/services/store";
import { brandHierarchy } from "@/data/brandStructure";
import { motion } from "framer-motion";
import {
  BadgeCheck,
  Box,
  LayoutDashboard,
  LogOut,
  Package,
  ShoppingCart,
  Trash2,
} from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

type AdminTab = "products" | "orders";

const orderStatuses: OrderStatus[] = ["pending", "processing", "delivered", "cancelled"];

function notesToString(value: string[]): string {
  return value.join(", ");
}

function csvToNotes(value: string): string[] {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function formatOrderDate(value: number | null): string {
  if (!value) return "Just now";
  return new Date(value).toLocaleString();
}

const defaultNoteInputs = {
  topNotes: "",
  middleNotes: "",
  baseNotes: "",
  scentProfile: "",
};

export default function AdminDashboardPage() {
  const { logout, user } = useAuth();
  const { products, loading: productsLoading, categories } = useProductsData();
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<AdminTab>("products");
  const [form, setForm] = useState<ProductInput>(emptyProductInput);
  const [noteInputs, setNoteInputs] = useState(defaultNoteInputs);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [productSubmitting, setProductSubmitting] = useState(false);
  const [busyOrderId, setBusyOrderId] = useState<string | null>(null);

  useEffect(() => {
    const unsub = subscribeOrders(
      (nextOrders) => {
        setOrders(nextOrders);
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

  const stats = useMemo(() => {
    const pendingOrders = orders.filter((order) => order.status === "pending").length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    return {
      products: products.length,
      orders: orders.length,
      pendingOrders,
      totalRevenue,
    };
  }, [orders, products.length]);

  const resetProductForm = () => {
    setForm(emptyProductInput);
    setNoteInputs(defaultNoteInputs);
    setEditingProductId(null);
    setImageFile(null);
  };

  const startEdit = (product: Product) => {
    setEditingProductId(product.id);
    setForm(productToInput(product));
      setNoteInputs({
        topNotes: notesToString(product.top_notes),
        middleNotes: notesToString(product.middle_notes),
        baseNotes: notesToString(product.base_notes),
        scentProfile: product.scent_profile.join(", "),
      });
    setImageFile(null);
    setActiveTab("products");
  };

  const handleDeleteProduct = async (productId: string, imageUrl: string) => {
    if (!confirm("Delete this product permanently?")) return;

    try {
      await deleteProductById(productId, imageUrl);
      toast.success("Product deleted");
      if (editingProductId === productId) resetProductForm();
    } catch (error) {
      console.error(error);
      toast.error("Could not delete product");
    }
  };

  const handleProductSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setProductSubmitting(true);

    try {
      const slug = normalizeSlug(form.slug || form.name);
      const category = normalizeSlug(form.category);
      const brandName = form.brand || "Saria 69";
      const brandSlug = normalizeSlug(brandName);

      let imageUrl = form.image_url;
      if (imageFile) {
        imageUrl = await uploadProductImage(imageFile, slug);
      }

      const payload: ProductInput = {
        ...form,
        slug,
        category,
        image_url: imageUrl,
        top_notes: csvToNotes(noteInputs.topNotes),
        middle_notes: csvToNotes(noteInputs.middleNotes),
        base_notes: csvToNotes(noteInputs.baseNotes),
        scent_profile: csvToNotes(noteInputs.scentProfile),
        brand: brandName,
        brandSlug,
      };

      if (!payload.image_url) {
        toast.error("Please add a product image");
        setProductSubmitting(false);
        return;
      }

      if (editingProductId) {
        await updateProduct(editingProductId, payload);
        toast.success("Product updated");
      } else {
        await addProduct(payload);
        toast.success("Product created");
      }

      resetProductForm();
    } catch (error) {
      console.error(error);
      toast.error("Could not save product");
    } finally {
      setProductSubmitting(false);
    }
  };

  const handleOrderStatusChange = async (orderId: string, status: OrderStatus) => {
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

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-6 py-8 md:py-10">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-primary text-xs tracking-[0.3em] uppercase mb-2">Admin Dashboard</p>
            <h1 className="font-display text-3xl md:text-4xl font-bold">Saria Commerce Control</h1>
            <p className="text-sm text-muted-foreground mt-2">Signed in as {user?.email}</p>
          </div>
          <button
            onClick={logout}
            className="inline-flex items-center gap-2 border border-border px-5 py-3 text-sm uppercase tracking-[0.15em] hover:border-primary hover:text-primary transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="border border-border bg-card p-4">
            <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">Products</p>
            <p className="font-display text-2xl mt-2">{stats.products}</p>
          </div>
          <div className="border border-border bg-card p-4">
            <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">Orders</p>
            <p className="font-display text-2xl mt-2">{stats.orders}</p>
          </div>
          <div className="border border-border bg-card p-4">
            <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">Pending</p>
            <p className="font-display text-2xl mt-2">{stats.pendingOrders}</p>
          </div>
          <div className="border border-border bg-card p-4">
            <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">Revenue</p>
            <p className="font-display text-2xl mt-2">{formatPrice(stats.totalRevenue)}</p>
          </div>
        </div>

        <div className="mb-8 flex flex-wrap gap-2 border-b border-border pb-4">
          <button
            onClick={() => setActiveTab("products")}
            className={`inline-flex items-center gap-2 px-4 py-2 text-sm uppercase tracking-[0.15em] transition-colors ${
              activeTab === "products" ? "bg-primary text-primary-foreground" : "border border-border"
            }`}
          >
            <Package className="h-4 w-4" />
            Products
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`inline-flex items-center gap-2 px-4 py-2 text-sm uppercase tracking-[0.15em] transition-colors ${
              activeTab === "orders" ? "bg-primary text-primary-foreground" : "border border-border"
            }`}
          >
            <ShoppingCart className="h-4 w-4" />
            Orders
          </button>
        </div>

        {activeTab === "products" && (
          <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="xl:col-span-2 border border-border bg-card p-6"
            >
              <div className="mb-5 flex items-center justify-between">
                <h2 className="font-display text-2xl">
                  {editingProductId ? "Edit Product" : "Create Product"}
                </h2>
                {editingProductId && (
                  <button
                    onClick={resetProductForm}
                    className="text-xs uppercase tracking-[0.15em] text-muted-foreground hover:text-foreground"
                  >
                    Cancel edit
                  </button>
                )}
              </div>

              <form onSubmit={handleProductSubmit} className="space-y-4">
                <div>
                  <label className="block mb-1 text-xs uppercase tracking-[0.12em] text-muted-foreground">Name</label>
                  <input
                    required
                    value={form.name}
                    onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                    className="w-full border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block mb-1 text-xs uppercase tracking-[0.12em] text-muted-foreground">Slug</label>
                    <input
                      value={form.slug}
                      onChange={(e) => setForm((prev) => ({ ...prev, slug: normalizeSlug(e.target.value) }))}
                      className="w-full border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                      placeholder="auto-from-name-if-empty"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-xs uppercase tracking-[0.12em] text-muted-foreground">Category</label>
                    <input
                      required
                      list="category-options"
                      value={form.category}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, category: normalizeSlug(e.target.value) }))
                      }
                      className="w-full border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                      placeholder="royal-touch"
                    />
                    <datalist id="category-options">
                      {categories.map((category) => (
                        <option key={category.slug} value={category.slug} />
                      ))}
                    </datalist>
                  </div>
                </div>
                <div>
                  <label className="block mb-1 text-xs uppercase tracking-[0.12em] text-muted-foreground">Brand</label>
                  <input
                    required
                    list="brand-options"
                    value={form.brand}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        brand: e.target.value,
                        brandSlug: normalizeSlug(e.target.value),
                      }))
                    }
                    className="w-full border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                    placeholder="Saria 69"
                  />
                  <datalist id="brand-options">
                    {brandHierarchy.map((brand) => (
                      <option key={brand.slug} value={brand.name} />
                    ))}
                  </datalist>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block mb-1 text-xs uppercase tracking-[0.12em] text-muted-foreground">Price</label>
                    <input
                      required
                      min={0}
                      type="number"
                      value={form.price}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, price: Math.max(0, Number(e.target.value) || 0) }))
                      }
                      className="w-full border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-xs uppercase tracking-[0.12em] text-muted-foreground">Volume (ml)</label>
                    <input
                      required
                      min={1}
                      type="number"
                      value={form.volume_ml}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, volume_ml: Math.max(1, Number(e.target.value) || 1) }))
                      }
                      className="w-full border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block mb-1 text-xs uppercase tracking-[0.12em] text-muted-foreground">Gender</label>
                    <select
                      value={form.gender}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          gender: e.target.value as ProductInput["gender"],
                        }))
                      }
                      className="w-full border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                    >
                      <option value="unisex">Unisex</option>
                      <option value="men">Men</option>
                      <option value="women">Women</option>
                    </select>
                  </div>
                  <div>
                    <label className="block mb-1 text-xs uppercase tracking-[0.12em] text-muted-foreground">Stock</label>
                    <input
                      required
                      min={0}
                      type="number"
                      value={form.stock_quantity}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          stock_quantity: Math.max(0, Number(e.target.value) || 0),
                        }))
                      }
                      className="w-full border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-1 text-xs uppercase tracking-[0.12em] text-muted-foreground">Short Description</label>
                  <textarea
                    required
                    rows={2}
                    value={form.short_description}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, short_description: e.target.value }))
                    }
                    className="w-full border border-border bg-background px-3 py-2 text-sm outline-none resize-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-xs uppercase tracking-[0.12em] text-muted-foreground">Long Description</label>
                  <textarea
                    required
                    rows={4}
                    value={form.long_description}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, long_description: e.target.value }))
                    }
                    className="w-full border border-border bg-background px-3 py-2 text-sm outline-none resize-none focus:border-primary"
                  />
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <label className="block mb-1 text-xs uppercase tracking-[0.12em] text-muted-foreground">Top Notes (comma separated)</label>
                    <input
                      value={noteInputs.topNotes}
                      onChange={(e) =>
                        setNoteInputs((prev) => ({ ...prev, topNotes: e.target.value }))
                      }
                      className="w-full border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-xs uppercase tracking-[0.12em] text-muted-foreground">Middle Notes (comma separated)</label>
                    <input
                      value={noteInputs.middleNotes}
                      onChange={(e) =>
                        setNoteInputs((prev) => ({ ...prev, middleNotes: e.target.value }))
                      }
                      className="w-full border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-xs uppercase tracking-[0.12em] text-muted-foreground">Base Notes (comma separated)</label>
                    <input
                      value={noteInputs.baseNotes}
                      onChange={(e) =>
                        setNoteInputs((prev) => ({ ...prev, baseNotes: e.target.value }))
                      }
                      className="w-full border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-xs uppercase tracking-[0.12em] text-muted-foreground">
                      Scent Profile (comma separated)
                    </label>
                    <input
                      value={noteInputs.scentProfile}
                      onChange={(e) =>
                        setNoteInputs((prev) => ({ ...prev, scentProfile: e.target.value }))
                      }
                      className="w-full border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                      placeholder="Spicy, Woody"
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-1 text-xs uppercase tracking-[0.12em] text-muted-foreground">Product Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
                    className="w-full border border-border bg-background px-3 py-2 text-sm file:mr-3 file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-primary-foreground"
                  />
                  {form.image_url && (
                    <p className="text-xs text-muted-foreground mt-2 break-all">
                      Existing: {form.image_url}
                    </p>
                  )}
                </div>

                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(e) => setForm((prev) => ({ ...prev, featured: e.target.checked }))}
                  />
                  Featured product
                </label>

                <button
                  disabled={productSubmitting}
                  className="w-full bg-primary text-primary-foreground py-3 text-sm uppercase tracking-[0.2em] font-medium hover:bg-gold-light transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {productSubmitting
                    ? "Saving..."
                    : editingProductId
                      ? "Update Product"
                      : "Create Product"}
                </button>
              </form>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
              className="xl:col-span-3"
            >
              <div className="mb-4 flex items-center gap-2">
                <Box className="h-4 w-4 text-primary" />
                <h2 className="font-display text-2xl">All Products</h2>
              </div>
              {productsLoading ? (
                <div className="border border-border bg-card p-6 text-muted-foreground">
                  Loading products...
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {products.map((product) => (
                    <div key={product.id} className="border border-border bg-card p-4">
                      <div className="flex gap-4">
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="h-24 w-24 object-cover shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="text-xs uppercase tracking-[0.15em] text-primary">
                            {slugToLabel(product.category)}
                          </p>
                          <h3 className="font-display text-lg truncate">{product.name}</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {formatPrice(product.price)} - {product.volume_ml}ml - {product.gender}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Stock: {product.stock_quantity}
                          </p>
                          {product.featured && (
                            <div className="mt-2 inline-flex items-center gap-1 text-xs text-primary">
                              <BadgeCheck className="h-3.5 w-3.5" />
                              Featured
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="mt-4 flex gap-2">
                        <button
                          onClick={() => startEdit(product)}
                          className="flex-1 border border-border px-3 py-2 text-xs uppercase tracking-[0.15em] hover:border-primary hover:text-primary transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id, product.image_url)}
                          className="inline-flex items-center justify-center border border-destructive/50 px-3 py-2 text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {products.length === 0 && (
                    <div className="border border-border bg-card p-6 text-muted-foreground">
                      No products found. Create your first product from the form.
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        )}

        {activeTab === "orders" && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
            <div className="mb-4 flex items-center gap-2">
              <LayoutDashboard className="h-4 w-4 text-primary" />
              <h2 className="font-display text-2xl">Orders Management</h2>
            </div>

            {ordersLoading ? (
              <div className="border border-border bg-card p-6 text-muted-foreground">Loading orders...</div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="border border-border bg-card p-5">
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-[0.15em] text-primary mb-1">
                          Order #{order.id.slice(0, 8)}
                        </p>
                        <h3 className="font-display text-xl">{order.full_name}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {order.phone} - {order.email}
                        </p>
                        <p className="text-sm text-muted-foreground">{order.address}, {order.city}</p>
                        {order.notes && (
                          <p className="text-sm text-muted-foreground mt-1">Note: {order.notes}</p>
                        )}
                      </div>

                      <div className="md:text-right">
                        <p className="font-display text-2xl text-primary">{formatPrice(order.totalAmount)}</p>
                        <p className="text-sm text-muted-foreground">{order.totalItems} item(s)</p>
                        <p className="text-xs text-muted-foreground mt-2">{formatOrderDate(order.createdAtMs)}</p>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {order.items.map((item) => (
                        <div
                          key={`${order.id}-${item.product_id}-${item.slug}`}
                          className="inline-flex items-center gap-2 border border-border px-2 py-1 text-xs"
                        >
                          <img
                            src={item.image_url}
                            alt={item.name}
                            className="h-7 w-7 object-cover"
                          />
                          <span>{item.name}</span>
                          <span className="text-muted-foreground">x{item.quantity}</span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 flex items-center gap-3">
                      <select
                        value={order.status}
                        disabled={busyOrderId === order.id}
                        onChange={(e) =>
                          handleOrderStatusChange(order.id, e.target.value as OrderStatus)
                        }
                        className="border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                      >
                        {orderStatuses.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}

                {orders.length === 0 && (
                  <div className="border border-border bg-card p-6 text-muted-foreground">
                    No orders yet.
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
