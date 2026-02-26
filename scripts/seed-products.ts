import { inventoryProducts } from "../src/data/productInventory";
import { db, firebaseInitError } from "../src/lib/firebase";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";

async function seedProducts() {
  if (!db) {
    throw firebaseInitError ?? new Error("Firestore is unavailable");
  }

  console.log("Seeding products to Firestore...");
  for (const product of inventoryProducts) {
    const ref = doc(db, "products", product.id);
    await setDoc(
      ref,
      {
        ...product,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );
    console.log(`  - ${product.name} (${product.id})`);
  }
  console.log("All products seeded.");
}

seedProducts().catch((error) => {
  console.error("Seeding failed:", error);
  process.exit(1);
});
