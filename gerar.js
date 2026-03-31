import fs from "fs";
import path from "path";

const PRODUCTS_FILE = path.resolve("./products.ts");
const INPUT_FILE = path.resolve("./produtos.txt");

// --- FUNÇÕES DE APOIO ---

function toReal(value) {
  if (value === undefined || value === null) return "R$ 0,00";
  // Se for Shopee (valor gigante em centavos) divide, se for ML usa normal
  const num = value > 10000 ? Number(value) / 100000 : Number(value);
  return "R$ " + num.toFixed(2).replace(".", ",");
}

function detectCategory(name) {
  const n = name.toLowerCase();
  const categories = [
    { cat: 'Smartphone & Tablets', keywords: /(iphone|celular|smartphone|android|xiaomi|samsung|motorola|realme|tablet|ipad|kindle|redmi|poco)/ },
    { cat: 'Informática & PC', keywords: /(notebook|laptop|ssd|memória|ram|placa|cpu|gpu|teclado|mouse|monitor|roteador|wifi|impressora|nobreak|hub|hd externo|cooler|gabinete)/ },
    { cat: 'Áudio & Vídeo', keywords: /(fone|headset|bluetooth|caixa de som|alexa|echo|projetor|smart tv|televisão|microfone|webcam|soundbar|jbl)/ },
    { cat: 'Games & Geek', keywords: /(ps5|xbox|nintendo|switch|gamer|jogo|controle|joystick|card|pokémon|funko|geek|action figure|lego|console)/ },
    { cat: 'Beleza & Skincare', keywords: /(maquiagem|batom|perfume|creme|skincare|shampoo|cabelo|esmaltes|base|corretivo|protetor solar|gloss|hidratante|sérum|secador|chapinha)/ },
    { cat: 'Moda Masculina', keywords: /(camisa|camiseta|calça|bermuda|cueca|short|jaqueta|moletom|sapato|tênis|boné|sunga|carteira|cinto)/ },
    { cat: 'Moda Feminina', keywords: /(vestido|blusa|saia|lingerie|biquíni|body|tricô|salto|sandália|bolsa|joia|brinco|colar|anel)/ },
    { cat: 'Eletrodomésticos', keywords: /(geladeira|fogão|máquina de lavar|climatizador|ar condicionado|micro-ondas|freezer|adega|lava louça)/ },
    { cat: 'Eletroportáteis', keywords: /(air fryer|fritadeira|mixer|liquidificador|batedeira|cafeteira|aspirador|ferro de passar|sanduicheira|panela elétrica)/ },
    { cat: 'Cozinha & Mesa', keywords: /(faca|tábua|pote|garrafa|termos|copo|stanley|talher|prato|assadeira|escorredor|abridor|balança digital|pano de prato)/ },
    { cat: 'Casa & Decoração', keywords: /(luminária|led|tapete|cortina|almofada|espelho|quadro|vaso|vela|difusor|organizador|cabide|prateleira|estátua|parede)/ },
    { cat: 'Cama, Mesa & Banho', keywords: /(lençol|fronha|cobertor|edredom|toalha|travesseiro|manta|colchão)/ },
    { cat: 'Saúde & Cuidados', keywords: /(suplemento|whey|creatina|vitamina|termômetro|medidor|massageador|curativo|irrigador|escova elétrica|dental|lixa pés|maca peruana)/ },
    { cat: 'Ferramentas & Obra', keywords: /(furadeira|parafusadeira|martelo|trena|chave|alicate|pintura|tinta|torneira|chuveiro|disjuntor|cloro|serra|escada|genco)/ },
    { cat: 'Automotivo & Moto', keywords: /(pneu|capacete|óleo|carro|moto|retrovisor|multimídia|limpador|som automotivo|peças|partida|arranque|titan|bros|fan)/ },
    { cat: 'Esporte & Lazer', keywords: /(academia|musculação|bicicleta|bike|bola|yoga|crossfit|luva|skate|patins|lanterna|canivete|camping)/ },
    { cat: 'Bebês & Brinquedos', keywords: /(bebê|infantil|brinquedo|fralda|mamadeira|carrinho|chupeta|boneca|pelúcia|escolar|mochila|patinete)/ },
    { cat: 'Pets', keywords: /(pet|cachorro|gato|ração|coleira|aquário|areia|shampoo pet|bebedouro|comedouro|petisco)/ },
    { cat: 'Papelaria & Envio', keywords: /(papel|caneta|caderno|estojo|organizador|envelope|segurança|embalagem|correios|etiqueta|fita)/ },
    { cat: 'Acessórios & Outros', keywords: /(relógio|smartwatch|óculos|sol|pulseira|isqueiro|pilha|carregador portátil|power bank)/ }
  ];
  for (const item of categories) {
    if (item.keywords.test(n)) return item.cat;
  }
  return "Diversos";
}

// --- LÓGICA PRINCIPAL ---

try {
  // 1. Carregar produtos que já existem
  let existingProducts = [];
  if (fs.existsSync(PRODUCTS_FILE)) {
    const content = fs.readFileSync(PRODUCTS_FILE, "utf8");
    const match = content.match(/export const productsData: Product\[\] = (\[[\s\S]*\]);/);
    if (match) existingProducts = JSON.parse(match[1]);
  }

  const seenIds = new Set(existingProducts.map(p => p.externalId));
  const newItems = [];

  // 2. Ler o arquivo de entrada
  if (!fs.existsSync(INPUT_FILE)) {
    console.error("❌ Arquivo produtos.txt não encontrado!");
    process.exit(1);
  }
  const rawData = fs.readFileSync(INPUT_FILE, "utf8");
  const jsonData = JSON.parse(rawData);

  // 3. Identificar se é ML ou Shopee e processar
  
  // --- CASO MERCADO LIVRE ---
  if (jsonData.polycard_client_model) {
    const cards = jsonData.polycard_client_model.polycards || [];
    cards.forEach(card => {
      const meta = card.metadata;
      if (seenIds.has(meta.id)) return;

      const title = card.components.find(c => c.type === "title")?.title?.text || "Produto ML";
      const priceVal = card.components.find(c => c.type === "price")?.price?.current_price?.value;
      const discountText = card.components.find(c => c.type === "chip")?.chip?.label?.text || "";

      newItems.push({
        id: Math.floor(Math.random() * 10000000),
        externalId: meta.id,
        platform: "mercadolivre",
        name: title,
        category: detectCategory(title),
        link: meta.url.startsWith('http') ? meta.url : `https://${meta.url}`,
        price: toReal(priceVal),
        discount: discountText,
        img: `https://http2.mlstatic.com/D_Q_NP_${card.pictures.pictures[0].id}-F.webp`,
        gallery: [],
        sold: "Destaque",
        rating: 4.9,
        isFlashSale: false,
        freeShipping: true,
        description: "Selecionado do Mercado Livre."
      });
      seenIds.add(meta.id);
    });
  } 
  
  // --- CASO SHOPEE ---
  else if (jsonData.data?.list) {
    jsonData.data.list.forEach(item => {
      const p = item.batch_item_for_item_card_full;
      if (!p) return;
      const extId = String(item.item_id || p.itemid);
      if (seenIds.has(extId)) return;

      newItems.push({
        id: Math.floor(Math.random() * 10000000),
        externalId: extId,
        platform: "shopee",
        name: p.name,
        category: detectCategory(p.name),
        link: item.long_link || item.product_link,
        price: toReal(p.price),
        oldPrice: p.price_before_discount ? toReal(p.price_before_discount) : undefined,
        discount: p.discount || "",
        img: `https://down-br.img.susercontent.com/file/${p.image}`,
        gallery: (p.images || []).map(img => `https://down-br.img.susercontent.com/file/${img}`),
        sold: p.historical_sold_text || "0 vendidos",
        rating: Number(p.item_rating?.rating_star?.toFixed(1) || 0),
        isFlashSale: p.is_on_flash_sale || false,
        freeShipping: p.show_free_shipping || false,
        description: "Confira na Shopee."
      });
      seenIds.add(extId);
    });
  }

  // 4. Salvar tudo de volta no products.ts
  const finalArray = [...existingProducts, ...newItems];
  const output = `export interface Product {
  id: number;
  externalId: string;
  platform: 'shopee' | 'mercadolivre';
  name: string;
  category: string;
  link: string;
  price: string;
  oldPrice?: string;
  discount: string;
  img: string;
  gallery: string[];
  sold: string;
  rating: number;
  isFlashSale: boolean;
  freeShipping: boolean;
  description: string;
}

export const productsData: Product[] = ${JSON.stringify(finalArray, null, 2)};`;

  fs.writeFileSync(PRODUCTS_FILE, output, "utf8");
  console.log(`🚀 Sucesso! Adicionados: ${newItems.length} | Total na base: ${finalArray.length}`);

} catch (e) {
  console.error("❌ Erro ao processar:", e.message);
}