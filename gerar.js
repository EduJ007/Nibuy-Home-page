import fs from "fs";
import path from "path";

const PRODUCTS_FILE = path.resolve("./products.ts");
const INPUT_FILE = path.resolve("./produtos.txt");

// ---------- helpers ----------
function toReal(value) {
  if (!value) return "R$ 0,00";
  return "R$ " + (Number(value) / 100000).toFixed(2).replace(".", ",");
}

// ---------- ler products.ts ----------
let existingProducts = [];
let lastId = 0;

if (fs.existsSync(PRODUCTS_FILE)) {
  const file = fs.readFileSync(PRODUCTS_FILE, "utf8");
  const match = file.match(
    /export const productsData:\s*Product\[\]\s*=\s*(\[[\s\S]*?\]);/
  );

  if (match) {
    try {
      existingProducts = JSON.parse(match[1]);
      // Pegamos o maior ID para continuar a contagem corretamente
      lastId = existingProducts.reduce((max, p) => Math.max(max, p.id), 0);
    } catch {
      console.log("⚠️ Erro ao ler products.ts");
    }
  }
}

// Criamos um Set com todos os idShopee que já estão no arquivo para busca rápida
const existingIds = new Set(existingProducts.map(p => String(p.idShopee)));

// ---------- ler produtos.txt ----------
try {
  const raw = fs.readFileSync(INPUT_FILE, "utf8");
  const json = JSON.parse(raw);
  const list = json?.data?.list || [];

  console.log(`Recebidos no TXT: ${list.length} produtos.`);

  let added = 0;
  let skipped = 0;

  for (const item of list) {
    const p = item.batch_item_for_item_card_full;
    if (!p) continue;

    const idShopeeAtual = String(item.item_id);

    // VERIFICAÇÃO: Se o ID já existir na lista, a gente pula este produto
    if (existingIds.has(idShopeeAtual)) {
      skipped++;
      continue;
    }

    const newProduct = {
      id: ++lastId, // Incrementa o ID global
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
      link: item.long_link || item.product_link || ""
    };

    existingProducts.push(newProduct);
    existingIds.add(idShopeeAtual); // Adiciona ao Set para evitar duplicados no mesmo lote
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

export const productsData: Product[] = ${JSON.stringify(existingProducts, null, 2)};
`;

  fs.writeFileSync(PRODUCTS_FILE, output, "utf8");

  console.log("-----------------------------------------");
  console.log(`✅ Sucesso: ${added} novos produtos adicionados.`);
  console.log(`🚫 Ignorados: ${skipped} produtos já existiam na lista.`);
  console.log(`📦 Total agora: ${existingProducts.length} produtos únicos.`);
  console.log("-----------------------------------------");

} catch (err) {
  console.log("❌ Erro ao processar produtos: Verifique o formato do produtos.txt");
}