import fs from "fs";
import path from "path";

const PRODUCTS_FILE = path.resolve("./products.ts");
const INPUT_FILE = path.resolve("./produtos.txt");

// --- FUNÇÕES DE APOIO ---

function formatPrice(value) {
  if (!value) return "Consultar";
  // A Temu envia o preço em centavos (ex: 477 vira 4,77)
  const num = Number(value) / 100;
  return "R$ " + num.toFixed(2).replace(".", ",");
}

function detectCategory(name) {
  const n = name.toLowerCase();
  const categories = [
    { cat: 'Smartphone & Tablets', keywords: /(iphone|celular|smartphone|android|xiaomi|samsung|motorola|realme|tablet|ipad|kindle|redmi|poco|lg|nokia|carregador iphone|película|capinha)/ },
    { cat: 'Informática & PC', keywords: /(notebook|laptop|ssd|memória|ram|placa|cpu|gpu|teclado|mouse|monitor|roteador|wifi|impressora|nobreak|hub|hd externo|cooler|gabinete|macbook|acer|dell|lenovo|hp|tp-link|processador|pentium|ryzen|core i|rtx|gtx)/ },
    { cat: 'Áudio & Vídeo', keywords: /(fone|headset|bluetooth|caixa de som|alexa|echo|projetor|smart tv|televisão|microfone|webcam|soundbar|jbl|sony|philips|tcl|roku|fire stick|chromecast|home theater)/ },
    { cat: 'Games & Geek', keywords: /(ps5|ps4|playstation|xbox|nintendo|switch|gamer|jogo|controle|joystick|card|pokémon|funko|geek|action figure|lego|console|dualshock|cadeira gamer|headset gamer)/ },
    { cat: 'Beleza & Skincare', keywords: /(maquiagem|batom|perfume|creme|skincare|shampoo|cabelo|esmaltes|base|corretivo|protetor solar|gloss|hidratante|sérum|secador|chapinha|esmalte|condicionador|eudora|oboticário|vult)/ },
    { cat: 'Moda Masculina', keywords: /(camisa|camiseta|calça|bermuda|cueca|short|jaqueta|moletom|sapato|tênis|boné|sunga|carteira|cinto|blazer|polo)/ },
    { cat: 'Moda Feminina', keywords: /(vestido|blusa|saia|lingerie|biquíni|body|tricô|salto|sandália|bolsa|joia|brinco|colar|anel|sutiã|calcinha|macacão|pijama)/ },
    { cat: 'Eletrodomésticos', keywords: /(geladeira|fogão|máquina de lavar|climatizador|ar condicionado|micro-ondas|freezer|adega|lava louça|ventilador|circulador|lavadora|cooktop|depurador|exaustor)/ },
    { cat: 'Eletroportáteis', keywords: /(air fryer|fritadeira|mixer|liquidificador|batedeira|cafeteira|aspirador|ferro de passar|sanduicheira|panela elétrica|grill|multiprocessador|espremedor|torradeira|moura)/ },
    { cat: 'Cozinha & Mesa', keywords: /(faca|tábua|pote|garrafa|termos|copo|stanley|talher|prato|assadeira|escorredor|abridor|balança digital|pano de prato|tupperware|jogo de jantar|panela|frigideira)/ },
    { cat: 'Casa & Decoração', keywords: /(luminária|led|tapete|cortina|almofada|espelho|quadro|vaso|vela|difusor|organizador|cabide|prateleira|estátua|parede|sofá|poltrona|mesa|cadeira|guarda-roupa|estante|painel)/ },
    { cat: 'Cama, Mesa & Banho', keywords: /(lençol|fronha|cobertor|edredom|toalha|travesseiro|manta|colchão|jogo de cama|piso de banheiro)/ },
    { cat: 'Saúde & Cuidados', keywords: /(suplemento|whey|creatina|vitamina|termômetro|medidor|massageador|curativo|irrigador|escova elétrica|dental|lixa pés|maca peruana|omega 3|colágeno|máscara)/ },
    { cat: 'Ferramentas & Obra', keywords: /(furadeira|parafusadeira|martelo|trena|chave|alicate|pintura|tinta|torneira|chuveiro|disjuntor|cloro|serra|escada|genco|lixadeira|esmerilhadeira|vonder|makita|bosch|tramontina)/ },
    { cat: 'Automotivo & Moto', keywords: /(pneu|capacete|óleo|carro|moto|retrovisor|multimídia|limpador|som automotivo|peças|partida|arranque|titan|bros|fan|aro|pastilha de freio|lâmpada automotiva)/ },
    { cat: 'Esporte & Lazer', keywords: /(academia|musculação|bicicleta|bike|bola|yoga|crossfit|luva|skate|patins|lanterna|canivete|camping|chuteira|halter|anilhas|esteira)/ },
    { cat: 'Bebês & Brinquedos', keywords: /(bebê|infantil|brinquedo|fralda|mamadeira|carrinho|chupeta|boneca|pelúcia|escolar|mochila|patinete|barbie|hot wheels|fisher price|pampers|huggies)/ },
    { cat: 'Pets', keywords: /(pet|cachorro|gato|ração|coleira|aquário|areia|shampoo pet|bebedouro|comedouro|petisco|whiskas|pedigree|royal canin|arranhador)/ },
    { cat: 'Papelaria & Envio', keywords: /(papel|caneta|caderno|estojo|organizador|envelope|segurança|embalagem|correios|etiqueta|fita|calculadora|lápis|faber castell)/ },
    { cat: 'Acessórios & Outros', keywords: /(relógio|smartwatch|óculos|sol|pulseira|isqueiro|pilha|carregador portátil|power bank|guarda-chuva|mochila notebook)/ }
  ];
  for (const item of categories) {
    if (item.keywords.test(n)) return item.cat;
  }
  return "Diversos";
}

// --- LÓGICA PRINCIPAL ---
try {
  let existingProducts = [];
  
  if (fs.existsSync(PRODUCTS_FILE)) {
    const content = fs.readFileSync(PRODUCTS_FILE, "utf8");
    const match = content.match(/productsData: Product\[\] = (\[[\s\S]*?\]);/);
    if (match) {
      existingProducts = JSON.parse(match[1].replace(/,\s*]/g, "]").replace(/,\s*}/g, "}"));
    }
  }

  const seenIds = new Set(existingProducts.map(p => String(p.externalId)));
  const newItems = [];
  
  const rawData = JSON.parse(fs.readFileSync(INPUT_FILE, "utf8"));

  // --- EXTRAÇÃO TEMU (Ajustada para a estrutura correta) ---
  const temuSource = rawData.result?.result?.kp_ds_item_list || [];

  temuSource.forEach(item => {
    const p = item.common_rec_goods;
    if (!p) return;

    const extId = String(p.goods_id);
    if (seenIds.has(extId)) return;

    // PREÇO: Na Temu fica em price_info.price 
    const priceVal = p.price_info?.price || 0;
    const oldPriceVal = p.price_info?.original_price || p.price_info?.market_price;

    // NOTA: Fica em comment.goods_score 
    const ratingVal = p.comment?.goods_score ? Number(p.comment.goods_score) : 4.7;

    // LINK: Gerando link via SEO ou ID
    const finalLink = p.seo_link_url 
      ? `https://www.temu.com${p.seo_link_url}` 
      : `https://www.temu.com/goods.html?goods_id=${p.goods_id}`;

    newItems.push({
      id: Math.floor(Math.random() * 10000000),
      externalId: extId,
      platform: "temu",
      name: p.title,
      category: detectCategory(p.title),
      link: finalLink,
      price: formatPrice(priceVal),
      oldPrice: oldPriceVal ? formatPrice(oldPriceVal) : undefined,
      discount: p.price_info?.reduction_text?.[0] || "",
      img: p.thumb_url || "",
      gallery: [p.thumb_url],
      sold: p.sales_tip || "Destaque",
      rating: ratingVal, // Agora pegando a nota real do JSON
      isFlashSale: false,
      freeShipping: true,
      description: "Oferta selecionada na Temu."
    });
    seenIds.add(extId);
  });

  if (newItems.length > 0 || existingProducts.length > 0) {
    const finalArray = [...existingProducts, ...newItems];
    const output = `export interface Product {
  id: number;
  externalId: string;
  platform: 'shopee' | 'mercadolivre' | 'magalu' | 'temu';
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
    console.log(`✅ Sucesso! Foram adicionados ${newItems.length} novos produtos da Temu.`);
  }

} catch (e) {
  console.error("❌ Erro fatal:", e.message);
}