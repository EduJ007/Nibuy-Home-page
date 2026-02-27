import fs from "fs";
import path from "path";

const PRODUCTS_FILE = path.resolve("./products.ts");
const INPUT_FILE = path.resolve("./produtos.txt");

// ---------- helpers ----------
function toReal(value) {
  if (!value) return "R$ 0,00";
  return "R$ " + (Number(value) / 100000).toFixed(2).replace(".", ",");
}

function detectCategory(name) {
  const n = name.toLowerCase();
  if (/(celular|smartphone|iphone|android|xiaomi)/.test(n)) return "Tecnologia & Eletrônicos";
  if (/(fone|teclado|mouse|notebook|pc|tablet|monitor|ssd|hd)/.test(n)) return "Tecnologia & Eletrônicos";
  if (/(camisa|blusa|calça|vestido|roupa|jaqueta)/.test(n)) return "Moda & Beleza";
  if (/(sofá|mesa|cadeira|decoração|luminária)/.test(n)) return "Casa & Decoração";
  return "Todos";
}

// ---------- processamento ----------
const rawData = fs.readFileSync(INPUT_FILE, "utf8");
const jsonData = JSON.parse(rawData);
const items = jsonData.data.list;

let existingProducts = [];
let added = 0;

for (const item of items) {
  const p = item.batch_item_for_item_card_full;
  const idShopeeAtual = item.item_id;

  const newProduct = {
    id: Math.floor(Math.random() * 100000), // Gerando um ID temporário
    idShopee: idShopeeAtual,
    name: p.name,
    price: toReal(p.price),
    oldPrice: p.price_before_discount ? toReal(p.price_before_discount) : undefined,
    img: `https://down-br.img.susercontent.com/file/${p.image}`,
    sold: p.historical_sold_text || p.sold_text || "0 vendidos",
    stock: p.stock || 0,
    rating: Number(p.item_rating?.rating_star?.toFixed(1) || 0),
    location: p.shop_location || "Brasil",
    isFlashSale: p.is_on_flash_sale === true,
    link: item.long_link || item.product_link || "",
    category: detectCategory(p.name),
    // NOVOS CAMPOS FUNCIONAIS
    isOfficial: p.is_official_shop === true,
    isVerified: p.shopee_verified === true || p.show_shopee_verified_label === true
  };

  existingProducts.push(newProduct);
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
  category: string;
  isOfficial: boolean;
  isVerified: boolean;
}

export const productsData: Product[] = ${JSON.stringify(existingProducts, null, 2)};
`;

fs.writeFileSync(PRODUCTS_FILE, output, "utf8");
console.log(`✅ Sucesso! ${added} produtos gerados com info de Loja Oficial.`);