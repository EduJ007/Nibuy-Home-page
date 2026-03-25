import fs from "fs";
import path from "path";

const PRODUCTS_FILE = path.resolve("./products.ts");
const INPUT_FILE = path.resolve("./produtos.txt");

// --- FUNÇÕES DE APOIO (MANTIDAS) ---
function toReal(value) {
  if (!value) return "R$ 0,00";
  return "R$ " + (Number(value) / 100000).toFixed(2).replace(".", ",");
}

function formatNumber(num) {
  if (!num) return "0";
  if (num >= 1000) return (num / 1000).toFixed(1).replace('.', ',') + 'mil';
  return num.toString();
}

function detectCategory(name) {
  const n = name.toLowerCase();
  const categories = [
    { cat: 'Tecnologia & Eletrônicos', keywords: /(celular|smartphone|iphone|android|xiaomi|fone|headset|teclado|mouse|gamer|notebook|laptop|pc|tablet|monitor|ssd|hd|memória|ram|placa|cpu|gpu|carregador|cabo|usb|adaptador|projetor|caixa de som|bluetooth|informática|smart|watch|led|ring light|tripé|microfone|webcam|roteador|wifi)/ },
    { cat: 'Moda & Beleza', keywords: /(camisa|blusa|calça|vestido|roupa|jaqueta|tênis|sapato|sandália|maquiagem|batom|perfume|creme|skincare|cabelo|shampoo|esmaltes|base|máscara|cílios|biquíni|lingerie|meia|short|bermuda|moletom|tricô|unha|pincel|corretivo|protetor solar)/ },
    { cat: 'Casa & Decoração', keywords: /(decoração|luminária|cama|banho|cortina|tapete|espelho|quadro|almofada|vaso|vela|organizador|cabide|piscina|jardim|lençol|fronha|toalha|difusor|estátua|prateleira)/ },
    { cat: 'Móveis', keywords: /(sofá|mesa|cadeira|estante|armário|guarda-roupa|escrivaninha|comoda|rack|poltrona|banqueta|móvel|balcão|cabeceira|puf|escritório)/ },
    { cat: 'Games & Hobby', keywords: /(game|jogo|ps5|ps4|ps3|xbox|nintendo|switch|controle|joystick|card|colecionável|action figure|tabuleiro|quebra-cabeça|drone|retro|fliperama|manche|lego|pokémon|funko)/ },
    { cat: 'Bebês & Infantil', keywords: /(bebê|infantil|criança|brinquedo|fralda|mamadeira|carrinho|chupeta|boneca|body|kids|maternidade|mordedor|andador|pelúcia|slime)/ },
    { cat: 'Automotivo', keywords: /(carro|moto|veículo|pneu|capacete|limpador|som automotivo|led automotivo|óleo|peças|acessório|retrovisor|chaveiro|multimídia|capa de banco)/ },
    { cat: 'Esporte & Lazer', keywords: /(esporte|academia|fitness|musculação|bicicleta|bike|bola|pesca|camping|trilha|yoga|crossfit|suplemento|garrafa|whey|creatina|luva|skate|patins)/ },
    { cat: 'Pets', keywords: /(pet|cachorro|gato|ração|coleira|aquário|brinquedo pet|caixa de areia|shampoo pet|guia|peitoral|comedouro|bebedouro|petisco)/ },
    { cat: 'Eletrodomésticos', keywords: /(geladeira|fogão|micro-ondas|máquina de lavar|air fryer|liquidificador|batedeira|aspirador|ferro|ventilador|ar condicionado|mixer|cafeteira|torredeira|umidificador)/ },
    { cat: 'Papelaria & Escritório', keywords: /(papelaria|caderno|caneta|lápis|estojo|mochila|impressora|tinta|papel|agenda|calculadora|post-it|marca texto|tesoura|grampeador)/ },
    { cat: 'Ferramentas & Construção', keywords: /(ferramenta|furadeira|parafusadeira|martelo|chave|trena|escada|pintura|tinta|reforma|cement|torneira|chuveiro|disjuntor|alicate|serra)/ },
    { cat: 'Segurança & Monitoramento', keywords: /(câmera|segurança|monitoramento|alarme|sensor|fechadura|interfone|vigilância|dvr|ip cam|babá eletrônica)/ },
    { cat: 'Relógios & Acessórios', keywords: /(relógio|smartwatch|pulseira|óculos|sol|carteira|cinto|boné|chapéu|touca|luva|cachecol)/ },
    { cat: 'Joias & Bijuterias', keywords: /(joia|bijuteria|anel|colar|brinco|corrente|pingente|prata|ouro|semijoia|tornozeleira|aliança)/ },
    { cat: 'Livros & Education', keywords: /(livro|e-book|curso|apostila|didático|literatura|leitura|kindle|mangá|hq|quadrinhos|dicionário)/ },
    { cat: 'Viagem & Malas', keywords: /(viagem|mala|mochila de viagem|frasqueira|necessaire|passaporte|cadeado|etiqueta de mala|almofada de pescoço)/ }
  ];
  for (const item of categories) {
    if (item.keywords.test(n)) return item.cat;
  }
  return "Outros";
}

try {
  // 1. CARREGAR PRODUTOS EXISTENTES
  let existingProducts = [];
  if (fs.existsSync(PRODUCTS_FILE)) {
    const fileContent = fs.readFileSync(PRODUCTS_FILE, "utf8");
    // Extrai o JSON de dentro da string do arquivo .ts
    const jsonMatch = fileContent.match(/export const productsData: Product\[\] = (\[[\s\S]*\]);/);
    if (jsonMatch && jsonMatch[1]) {
      existingProducts = JSON.parse(jsonMatch[1]);
    }
  }

  // 2. CRIAR SET DE IDs PARA NÃO REPETIR
  const seenIds = new Set(existingProducts.map(p => p.externalId));
  const finalProducts = [...existingProducts];

  // 3. PROCESSAR NOVOS PRODUTOS
  const rawData = fs.readFileSync(INPUT_FILE, "utf8");
  const jsonData = JSON.parse(rawData);
  const items = jsonData.data.list;

  let newCount = 0;

  for (const item of items) {
    const p = item.batch_item_for_item_card_full;
    if (!p) continue;

    const externalId = String(item.item_id || p.itemid || "");

    // Se o ID já existe no arquivo (ou foi visto agora), pula
    if (seenIds.has(externalId)) continue;
    
    seenIds.add(externalId);
    newCount++;

    const mainImg = `https://down-br.img.susercontent.com/file/${p.image}`;
    const rawImages = Array.from(new Set(p.images || []));
    const gallery = rawImages
        .map(img => `https://down-br.img.susercontent.com/file/${img}`)
        .filter(url => url !== mainImg);

    const filteredVariations = (p.tier_variations || [])
      .filter(v => v.options && v.options.length > 0)
      .map(v => ({
        name: v.name,
        options: v.options.slice(0, 6),
        images: v.images ? v.images.map(img => `https://down-br.img.susercontent.com/file/${img}`) : []
      }));

    finalProducts.push({
      id: Math.floor(Math.random() * 10000000),
      externalId: externalId,
      shopId: String(item.shopid || p.shopid || ""),
      shopName: p.shop_name || "Loja Oficial",
      shopImg: p.shop_avatar ? `https://down-br.img.susercontent.com/file/${p.shop_avatar}` : null,
      shopRating: Number(p.shop_rating?.toFixed(1) || 0),
      name: p.name,
      category: detectCategory(p.name),
      link: item.long_link || item.product_link || "",
      price: toReal(p.price),
      oldPrice: p.price_before_discount ? toReal(p.price_before_discount) : undefined,
      discount: p.discount || "",
      img: mainImg,
      gallery: gallery,
      sold: p.historical_sold_text || "0 vendidos",
      historicalSold: p.historical_sold || 0,
      likedCount: p.liked_count || 0,
      rating: Number(p.item_rating?.rating_star?.toFixed(1) || 0),
      ratingCount: formatNumber(p.item_rating?.rating_count?.[0] || 0),
      ratingDetailed: p.item_rating?.rating_count || [],
      isFlashSale: p.is_on_flash_sale || false,
      freeShipping: p.show_free_shipping || item.is_free_shipping || false,
      isOfficialShop: p.is_official_shop || false,
      isVerified: p.shopee_verified || false,
      location: p.shop_location || "Brasil",
      stock: p.stock || 0,
      brand: "Shopee", 
      description: "Confira todos os detalhes deste produto diretamente na loja oficial clicando em Comprar Agora.",
      specs: (p.attributes || []).map(attr => ({ label: attr.name, value: attr.value })),
      variations: filteredVariations.length > 0 ? filteredVariations : null, 
      voucher: p.voucher_info ? { 
        code: p.voucher_info.voucher_code, 
        label: p.voucher_info.label,
        discount: p.voucher_info.discount_value 
      } : null,
      bundle: p.bundle_deal_info ? { label: p.bundle_deal_info.bundle_deal_label } : null
    });
  }

  // 4. SALVAR TUDO JUNTO
  const output = `export interface Product {
  id: number;
  externalId: string;
  shopId: string;
  shopName: string;
  shopImg: string | null;
  shopRating: number;
  name: string;
  category: string;
  link: string;
  price: string;
  oldPrice?: string;
  discount: string;
  img: string;
  gallery: string[];
  sold: string;
  historicalSold: number;
  likedCount: number;
  rating: number;
  ratingCount: string;
  ratingDetailed: number[];
  isFlashSale: boolean;
  freeShipping: boolean;
  isOfficialShop: boolean;
  isVerified: boolean;
  location: string;
  stock: number;
  brand: string;
  description: string;
  specs: { label: string, value: string }[];
  variations: { name: string; options: string[]; images?: string[] }[] | null;
  voucher?: { code?: string; label: string; discount?: any } | null;
  bundle?: { label: string } | null;
}
export const productsData: Product[] = ${JSON.stringify(finalProducts, null, 2)};`;

  fs.writeFileSync(PRODUCTS_FILE, output, "utf8");
  console.log(`✅ Finalizado! Total: ${finalProducts.length} produtos (${newCount} novos adicionados).`);

} catch (e) {
  console.error("❌ Erro:", e);
}