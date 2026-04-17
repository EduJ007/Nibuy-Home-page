import fs from "fs";
import path from "path";

const PRODUCTS_FILE = path.resolve("./products.ts");
const INPUT_FILE = path.resolve("./produtos.txt");

function formatPrice(value) {
  if (!value) return "Consultar";
  const num = Number(value) / 100000;
  return "R$ " + num.toFixed(2).replace(".", ",");
}
function detectCategory(name) {
  const n = name.toLowerCase();
  const categories = [
    { 
      cat: 'Moda & Beleza', 
      keywords: /(vestido|blusa|saia|lingerie|biquíni|camisa|camiseta|calça|bermuda|cueca|short|jaqueta|moletom|sapato|tênis|tenis|sandália|bota|salto|maquiagem|batom|perfume|creme|skincare|shampoo|condicionador|cabelo|esmalte|base|corretivo|protetor solar|hidratante|sérum|secador|chapinha|babyliss|wepink|virgínia|nativa spa|body splash|corpo|estética)/ 
    },
    { 
      cat: 'Tecnologia & Eletrônicos', 
      keywords: /(iphone|celular|smartphone|android|xiaomi|samsung|motorola|tablet|ipad|kindle|notebook|laptop|ssd|ram|cpu|gpu|placa|teclado|mouse|monitor|roteador|wifi|hub|caixa de som|alexa|echo|projetor|smart tv|microfone|webcam|carregador|cabo|power bank|fone|headset|bluetooth|earphone|tipo-c|lightning|hdmi|pendrive|cartao de memoria|cooler|case|bateria externa|20000mah|caixinha)/ 
    },
    { 
      cat: 'Casa & Decoração', 
      keywords: /(tapete|cortina|almofada|quadro|espelho|lençol|fronha|manta|cobertor|edredom|toalha|banho|rosto|difusor|essência|vaso|planta|estátua|organizador|cabide|porta retrato|panela|prato|talher|copo|taça|pote|fatiador|mop|varal|lixo|lixeira|utensílios|marmita|vasilha|cozinha|filtro|balança|parede|decoração|churrasco|tábua de corte|aço inoxidável|quadro decorativo|luminária|abajur)/ 
    },
    { 
      cat: 'Games & Hobby', 
      keywords: /(ps5|ps4|playstation|xbox|nintendo|switch|gamer|jogo|controle|joystick|pokémon|pokemon|funko|geek|action figure|lego|console|quebra-cabeça|rpg|baralho|board game|fliperama|retro|estatua|miniatura|animes|manga|deck|dualshock|gamepad|headset gamer|cadeira gamer)/ 
    },
    { 
      cat: 'Bebês & Infantil', 
      keywords: /(bebê|bebe|infantil|baby|mamadeira|fralda|carrinho de bebê|berço|chocalho|babador|mordedor|brinquedo|boneca|lego|pelúcia|body bebê|escolar|slime|massinha|fantasia|educativo|kids|pampers|huggies|turma da mônica)/ 
    },
    { 
      cat: 'Automotivo', 
      keywords: /(carro|automotivo|moto|veículo|pneu|calibrador|compressor|limpador|óleo|led carro|multimídia|som automotivo|capacete|luva moto|suporte celular carro|obd2|rastreador|xenon|polimento|cerâmica|pulverizador|espuma|snow foam|estética automotiva|central multimídia)/ 
    },
    { 
      cat: 'Esporte & Lazer', 
      keywords: /(esporte|fitness|academia|bola|corrida|bike|bicicleta|suplemento|whey|creatina|halter|anilha|elástico|ioga|yoga|skate|patins|natação|camping|barraca|pesca|crossfit|termica|garrafa|treino|musculação|funcional|kettlebell|stanley|pre treino)/ 
    },
    { 
      cat: 'Pets', 
      keywords: /(pet|cachorro|gato|cão|ração|coleira|guia|aquário|shampoo pet|sanitário|arranhador|caminha pet|brinquedo pet|antipulgas|higiênico|adestramento|petshop|caixa de areia|bebedouro pet)/ 
    },
    { 
      cat: 'Eletrodomésticos', 
      keywords: /(geladeira|fogão|micro-ondas|microondas|máquina de lavar|maquina de lavar|lava louças|aspirador|air fryer|fritadeira|liquidificador|batedeira|cafeteira|torradeira|ventilador|ar condicionado|climatizador|mixer|purificador|cooktop|adega)/ 
    },
    { 
      cat: 'Móveis', 
      keywords: /(sofá|sofa|mesa|cadeira|guarda-roupa|armário|cama|colchão|estante|rack|painel|escrivaninha|penteadeira|comoda|poltrona|banqueta|puff|cabeceira|balcão)/ 
    },
    { 
      cat: 'Papelaria & Escritório', 
      keywords: /(caderno|caneta|lápis|estojo|mochila|agenda|planner|grampeador|post-it|folha sulfite|calculadora|organizador de mesa|tesoura|cola|tinta|pincel|bloco de notas|impressora|cartucho|toner)/ 
    },
    { 
      cat: 'Ferramentas & Construção', 
      keywords: /(soquetes|catraca|ferramentas|chave|maleta|jogo de ferramentas|parafusadeira|furadeira|alicate|martelo|trena|nivel|serra|broca|fio|cabo|eletrico|antichamas|flexivel|2,5mm|vonder|makita|bosch|dewalt|lixadeira|tinta de parede|torneira|chuveiro|piso|revestimento)/ 
    },
    { 
      cat: 'Segurança & Monitoramento', 
      keywords: /(câmera|monitoramento|alarme|sensor|fechadura digital|interfone|vigilância|dvr|nvr|porteiro eletrônico|cadeado|cerca|infravermelho|ip cam|babá eletronica|biometria|yoosee|icsee|360|intelbras)/ 
    },
    { 
      cat: 'Relógios & Acessórios', 
      keywords: /(relógio|relogio|smartwatch|pulseira|analógico|digital|cronômetro|boné|touca|óculos|oculos|carteira|colar|corrente|anel|brinco|mi band|t800 ultra|nfc|casio|g-shock)/ 
    },
    { 
      cat: 'Joias & Bijuterias', 
      keywords: /(joia|jóia|ouro|prata|diamante|brilhante|colar|brinco|anel|aliança|pulseira|pingente|tornozeleira|bijuteria|semijoia|folheado|rhodium|zircônia|cristal|swarovski)/ 
    },
    { 
      cat: 'Livros & Educação', 
      keywords: /(livro|ebook|kindle|apostila|dicionário|enciclopédia|didático|biografia|ficção|romance|terror|suspense|autoajuda|finanças|investimento|hq|mangá|estudo|curso)/ 
    },
    { 
      cat: 'Viagem & Malas', 
      keywords: /(mala|viagem|mochila de viagem|frasqueira|necessaire|cadeado de mala|tags de mala|organizador de mala|travesseiro de pescoço|adaptador de tomada|bolsa de bordo|rodinha)/ 
    }
  ];

  for (const item of categories) {
    if (item.keywords.test(n)) return item.cat;
  }
  return "Outros";
}

try {
  // 1. CARREGAR PRODUTOS EXISTENTES (Se o arquivo existir)
  let existingProducts = [];
  if (fs.existsSync(PRODUCTS_FILE)) {
    const fileContent = fs.readFileSync(PRODUCTS_FILE, "utf-8");
    // Extraímos apenas o JSON de dentro do arquivo .ts
    const jsonMatch = fileContent.match(/export const productsData: Product\[\] = (\[[\s\S]*\]);/);
    if (jsonMatch) {
      existingProducts = JSON.parse(jsonMatch[1]);
    }
  }

  // Criamos um Set com os IDs que já temos para evitar duplicados
  const seenIds = new Set(existingProducts.map(p => p.externalId));

  // 2. PROCESSAR NOVOS PRODUTOS DO TXT
  const rawData = fs.readFileSync(INPUT_FILE, "utf-8");
  const jsonData = JSON.parse(rawData);
  const shopeeProducts = jsonData.data.list;

  const newItems = [];

  shopeeProducts.forEach((item) => {
    const p = item.batch_item_for_item_card_full;
    if (!p) return;

    const extId = String(p.itemid);
    
    // SÓ ADICIONA SE NÃO EXISTIR NO ARQUIVO ANTERIOR
    if (!seenIds.has(extId)) {
      const imgBase = "https://cf.shopee.com.br/file/";
      const mainImg = imgBase + p.image;
      const galleryImgs = p.images ? p.images.map(img => imgBase + img) : [];

      const video = p.video_info_list?.[0];
      const videoUrl = video?.formats?.[0]?.url || video?.default_format?.url || "";
      const videoThumb = video?.thumb_url ? imgBase + video.thumb_url : "";

      const vouchers = item.promotion_vouchers?.map(v => v.voucher_code) || [];
      const ratingClean = p.item_rating?.rating_star ? Number(p.item_rating.rating_star.toFixed(1)) : 5.0;

      newItems.push({
        id: Math.floor(Math.random() * 10000000),
        externalId: extId,
        platform: "shopee",
        name: p.name,
        category: detectCategory(p.name),
        link: item.long_link || item.product_link, 
        price: formatPrice(p.price),
        oldPrice: p.price_before_discount ? formatPrice(p.price_before_discount) : undefined,
        discount: p.discount || "",
        img: mainImg,
        gallery: galleryImgs,
        videoUrl: videoUrl,
        videoThumb: videoThumb,
        vouchers: vouchers,
        sold: p.historical_sold_text || "Destaque",
        rating: ratingClean,
        isFlashSale: p.is_on_flash_sale || false,
        freeShipping: p.show_free_shipping || item.is_free_shipping || false,
        shopName: p.shop_name,
        description: `Oferta da loja ${p.shop_name} na Shopee.`
      });

      seenIds.add(extId); // Registra para não repetir se houver duplicado no próprio TXT
    }
  });

  // 3. JUNTAR ANTIGOS COM NOVOS
  const finalProducts = [...existingProducts, ...newItems];

  const typeDefinition = `export interface Product {
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
  videoUrl?: string;
  videoThumb?: string;
  vouchers?: string[];
  sold: string;
  rating: number;
  isFlashSale: boolean;
  freeShipping: boolean;
  shopName: string;
  description: string;
}\n\n`;

  const output = typeDefinition + `export const productsData: Product[] = ${JSON.stringify(finalProducts, null, 2)};`;
  
  fs.writeFileSync(PRODUCTS_FILE, output);
  console.log(`✅ Sucesso! Agora você tem ${finalProducts.length} produtos acumulados.`);
  console.log(`✨ Adicionados ${newItems.length} novos produtos.`);

} catch (error) {
  console.error("❌ Erro:", error.message);
}