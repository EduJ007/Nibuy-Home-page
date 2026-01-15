import fs from "fs";
import path from "path";

const PRODUCTS_FILE = path.resolve("./products.ts");
const INPUT_FILE = path.resolve("./produtos.txt");

// ---------- helpers ----------
function toReal(value) {
  if (!value) return "R$ 0,00";
  return (
    "R$ " +
    (Number(value) / 100000)
      .toFixed(2)
      .replace(".", ",")
  );
}

// ---------- ler products.ts ----------
let existingProducts = [];
let lastId = 1;
let existingShopeeIds = new Set();

if (fs.existsSync(PRODUCTS_FILE)) {
  const file = fs.readFileSync(PRODUCTS_FILE, "utf8");

  const match = file.match(/productsData:\s*Product\[]\s*=\s*(\[[\s\S]*\]);/);

  if (match) {
    existingProducts = eval(match[1]);
    lastId =
      existingProducts.reduce((max, p) => Math.max(max, p.id), 0) + 1;

    existingProducts.forEach(p => {
      if (p.idShopee) existingShopeeIds.add(String(p.idShopee));
    });
  }
}

// ---------- ler produtos.txt ----------
const raw = fs.readFileSync(INPUT_FILE, "utf8");
const json = JSON.parse(raw);

const list = json?.data?.list || [];

let added = 0;

for (const item of list) {
  const p = item.batch_item_for_item_card_full;
  if (!p) continue;

  const shopeeId = String(item.item_id);
  if (existingShopeeIds.has(shopeeId)) continue;

  existingProducts.push({
    id: lastId++,
    idShopee: shopeeId,
    name: p.name,
    price: toReal(p.price),
    oldPrice: p.price_before_discount
      ? toReal(p.price_before_discount)
      : undefined,
    img: `https://down-br.img.susercontent.com/file/${p.image}`,
    sold: p.historical_sold_text || p.sold_text || "0 vendidos",
    stock: p.stock || 0,
    rating: Number(p.item_rating?.rating_star?.toFixed(1) || 0),
    location: p.shop_location || "Brasil",
    isFlashSale: p.is_on_flash_sale === true,
    link: item.product_link || ""
  });

  existingShopeeIds.add(shopeeId);
  added++;
}

// ---------- salvar products.ts ----------
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

export const productsData: Product[] = ${JSON.stringify(
  existingProducts,
  null,
  2
)};
`;

fs.writeFileSync(PRODUCTS_FILE, output, "utf8");

console.log("✅ Produtos adicionados:", added);
console.log("📦 Total agora:", existingProducts.length);
