import fs from "fs";
import path from "path";

const PRODUCTS_FILE = path.resolve("./products.ts");

// Ler arquivo
const file = fs.readFileSync(PRODUCTS_FILE, "utf8");

// Extrair array
const match = file.match(
  /export const productsData:\s*Product\[\]\s*=\s*(\[[\s\S]*?\]);/
);

if (!match) {
  console.log("❌ Não foi possível ler products.ts");
  process.exit(1);
}

const products = JSON.parse(match[1]);

// 🔥 Remover duplicados pelo idShopee
const uniqueMap = new Map();

for (const p of products) {
  if (!uniqueMap.has(String(p.idShopee))) {
    uniqueMap.set(String(p.idShopee), p);
  }
}

const cleaned = Array.from(uniqueMap.values());

// Reorganizar IDs
cleaned.forEach((p, i) => {
  p.id = i + 1;
});

// Salvar de volta
const output = `export interface Product {
  id: number;
  idShopee: string;
  name: string;
  price: string;
  oldPrice?: string;
  img: string;
  sold: string;
  stock: number;
  rating: number;
  location: string;
  isFlashSale: boolean;
  link?: string;
}

export const productsData: Product[] = ${JSON.stringify(cleaned, null, 2)};
`;

fs.writeFileSync(PRODUCTS_FILE, output, "utf8");

console.log("--------------------------------");
console.log(`🧹 Antes: ${products.length} produtos`);
console.log(`✅ Depois: ${cleaned.length} produtos únicos`);
console.log("--------------------------------");