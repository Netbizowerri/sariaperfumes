import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db, firebaseInitError } from "@/lib/firebase";
import { Product, ProductCategory, slugToLabel } from "@/data/products";
import { inventoryProducts } from "@/data/productInventory";
import { subCategoryDefaults } from "@/data/categoryConfig";
import { normalizeSlug } from "@/lib/slug";

interface ProductsContextType {
  products: Product[];
  categories: ProductCategory[];
  loading: boolean;
  error: string | null;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

const excludedProductSlugs = new Set([
  "kill-god-bad",
  "flue-narcotik",
  "bakarat-540",
  "black-kiss-signature",
  "royal-gold",
  "holigan-rush",
]);

function parseProducts(snapshotData: Record<string, unknown>, id: string): Product {
  const getString = (value: unknown) => (typeof value === "string" ? value : "");
  const getNumber = (value: unknown, fallback = 0) =>
    typeof value === "number" && Number.isFinite(value) ? value : fallback;
  const getStringArray = (value: unknown) =>
    Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];

  const genderRaw = getString(snapshotData.gender);
  const gender = genderRaw === "men" || genderRaw === "women" || genderRaw === "unisex"
    ? genderRaw
    : "unisex";
  const brandRaw = getString(snapshotData.brand) || "Saria 69";
  const rawBrandSlug = getString(snapshotData.brandSlug) || getString(snapshotData.brand_slug);
  const brandSlug = rawBrandSlug || normalizeSlug(brandRaw);

  return {
    id,
    name: getString(snapshotData.name),
    slug: getString(snapshotData.slug),
    brand: brandRaw,
    brandSlug,
    category: getString(snapshotData.category),
    price: getNumber(snapshotData.price),
    volume_ml: getNumber(snapshotData.volume_ml, 100),
    gender,
    short_description: getString(snapshotData.short_description),
    long_description: getString(snapshotData.long_description),
    top_notes: getStringArray(snapshotData.top_notes),
    middle_notes: getStringArray(snapshotData.middle_notes),
    base_notes: getStringArray(snapshotData.base_notes),
    scent_profile: getStringArray(snapshotData.scent_profile),
    stock_quantity: getNumber(snapshotData.stock_quantity),
    featured: Boolean(snapshotData.featured),
    image_url: getString(snapshotData.image_url),
  };
}

export function ProductsProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(() => [...inventoryProducts]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!db) {
      setLoading(false);
      setError(firebaseInitError?.message || "Could not initialize Firebase.");
      return;
    }

    const unsub = onSnapshot(
      collection(db, "products"),
      (snapshot) => {
        const nextProducts = snapshot.docs
          .map((doc) => parseProducts(doc.data(), doc.id))
          .filter((item) => item.slug && !excludedProductSlugs.has(item.slug));

        const merged = new Map<string, Product>();
        for (const item of inventoryProducts) {
          merged.set(item.slug, item);
        }
        for (const item of nextProducts) {
          merged.set(item.slug, item);
        }

        setProducts(Array.from(merged.values()));
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error("Failed to read products from Firestore:", err);
        setError("Could not load products.");
        setLoading(false);
      },
    );

    return unsub;
  }, []);

  const categories = useMemo<ProductCategory[]>(() => {
    const bySlug = new Map<string, ProductCategory>();

    for (const category of subCategoryDefaults) {
      bySlug.set(category.slug, {
        id: category.slug,
        slug: category.slug,
        name: category.name,
      });
    }

    for (const product of products) {
      if (!product.category) continue;
      if (bySlug.has(product.category)) continue;

      bySlug.set(product.category, {
        id: product.category,
        slug: product.category,
        name: slugToLabel(product.category),
      });
    }

    return Array.from(bySlug.values());
  }, [products]);

  const value = useMemo<ProductsContextType>(
    () => ({
      products,
      categories,
      loading,
      error,
    }),
    [products, categories, loading, error],
  );

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>;
}

export function useProductsData() {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error("useProductsData must be inside ProductsProvider");
  return ctx;
}
