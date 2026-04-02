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

  // DEFINIÇÃO DAS CATEGORIAS COM HIERARQUIA (ORDEM IMPORTA)
  const categories = [
    // 1. Tecnologia & Eletrônicos (Alta Prioridade)
    { cat: 'Tecnologia & Eletrônicos', keywords: /(iphone|celular|smartphone|android|xiaomi|samsung|motorola|tablet|ipad|kindle|notebook|laptop|ssd|ram|cpu|gpu|placa|teclado|mouse|monitor|roteador|wifi|hub|caixa de som|alexa|echo|projetor|smart tv|microfone|webcam|carregador|cabo|power bank|fone|headset|bluetooth|earphone)/ },
    
    // 2. Games & Hobby
    { cat: 'Games & Hobby', keywords: /(ps5|ps4|playstation|xbox|nintendo|switch|gamer|jogo|controle|joystick|card|pokémon|funko|geek|action figure|lego|console|quebra-cabeça|rpg|baralho|board game)/ },
    
    // 3. Segurança & Monitoramento
    { cat: 'Segurança & Monitoramento', keywords: /(câmera|monitoramento|alarme|sensor|fechadura digital|interfone|vigilância|dvr|nvr|porteiro eletrônico|cadeado|cerca)/ },

    // 4. Moda & Beleza
    { cat: 'Moda & Beleza', keywords: /(maquiagem|batom|perfume|creme|skincare|shampoo|cabelo|esmalte|base|corretivo|protetor solar|hidratante|sérum|secador|chapinha|vestido|blusa|saia|lingerie|biquíni|camisa|camiseta|calça|bermuda|cueca|short|jaqueta|moletom|sapato|tênis|boné|bolsa|joia|brinco|colar|anel)/ },

    // 5. Relógios & Acessórios
    { cat: 'Relógios & Acessórios', keywords: /(relógio|smartwatch|pulseira|analógico|digital|cronômetro|boné|touca|óculos|carteira)/ },

    // 6. Bebês & Infantil
    { cat: 'Bebês & Infantil', keywords: /(bebê|infantil|baby|mamadeira|fralda|carrinho de bebê|berço|chocalho|babador|mordedor|brinquedo|boneca|lego|pelúcia|body bebê|escolar|slime)/ },

    // 7. Automotivo
    { cat: 'Automotivo', keywords: /(carro|automotivo|moto|veículo|pneu|calibrador|compressor|limpador|óleo|led carro|multimídia|som automotivo|capacete|luva moto|suporte celular carro)/ },

    // 8. Esporte & Lazer
    { cat: 'Esporte & Lazer', keywords: /(esporte|fitness|academia|bola|corrida|bike|bicicleta|suplemento|whey|creatina|halter|anilha|elástico|ioga|yoga|skate|patins|natação|camping|barraca|pesca)/ },

    // 9. Pets
    { cat: 'Pets', keywords: /(pet|cachorro|gato|cão|ração|coleira|guia|aquário|shampoo pet|sanitário|arranhador|caminha pet|brinquedo pet|antipulgas|higiênico)/ },

    // 10. Eletrodomésticos
    { cat: 'Eletrodomésticos', keywords: /(geladeira|microondas|liquidificador|air fryer|aspirador|batedeira|cafeteira|máquina de lavar|tanquinho|secadora|fogão|cooktop|refrigerador|ventilador|ar condicionado|ferro de passar|mixer)/ },

    // 11. Móveis
    { cat: 'Móveis', keywords: /(mesa|cadeira|sofá|estante|armário|cama|puf|escrivaninha|comoda|guarda-roupa|rack|painel|cabeceira|poltrona|banqueta)/ },

    // 12. Iluminação
    { cat: 'Iluminação', keywords: /(lâmpada|luminária|lustre|led|abajur|refletor|fita led|painel solar|spot|plafon|arandela|neon|lanterna)/ },

    // 13. Papelaria & Escritório
    { cat: 'Papelaria & Escritório', keywords: /(caneta|caderno|papel|escritório|agenda|estojo|tesoura|mochila escolar|calculadora|grampeador|lápis|borracha|pasta|impressora)/ },

    // 14. Ferramentas & Construção
    { cat: 'Ferramentas & Construção', keywords: /(furadeira|martelo|chave|serra|ferramenta|parafuso|trena|nível|alicates|lixadeira|parafusadeira|broca|tinta|pincel|escada|chuveiro|reparo|solda|torneira)/ },

    // 15. Joias & Bijuterias
    { cat: 'Joias & Bijuterias', keywords: /(anel|colar|brinco|pulseira|joia|prata|ouro|bijuteria|semijoia|pingente|tornozeleira|corrente|gargantilha)/ },

    // 16. Livros & Educação
    { cat: 'Livros & Educação', keywords: /(livro|curso|educação|apostila|estudo|dicionário|revista|didático|biografia|romance|mangá|hq)/ },

    // 17. Viagem & Malas
    { cat: 'Viagem & Malas', keywords: /(mala|viagem|passaporte|frasqueira|necessaire|mala de bordo|organizador de mala|etiqueta mala|bolsa de viagem)/ },

    // 18. Casa & Decoração (Filtro Geral/Sobra)
    { cat: 'Casa & Decoração', keywords: /(tapete|cortina|almofada|quadro|espelho|lençol|enxoval|fronha|manta|cobertor|edredom|toalha|banho|rosto|difusor|essência|vaso|planta|estátua|organizador|cabide|porta retrato|panela|prato|talher|copo|taça|pote|fatiador|mop|varal|lixo|lixeira|utensílios|marmita|vasilha|cozinha|filtro|balança|parede)/ }
  ];

  for (const item of categories) {
    if (item.keywords.test(n)) return item.cat;
  }

  return "Casa & Decoração"; // Retorno padrão caso nada seja detectado
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