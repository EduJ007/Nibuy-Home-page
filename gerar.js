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
      keywords: /(vestido|blusa|saia|lingerie|biquíni|camisa|camiseta|calça|bermuda|cueca|short|jaqueta|moletom|sapato|tênis|tenis|sandália|bota|salto|maquiagem|batom|perfume|creme|skincare|shampoo|condicionador|cabelo|esmalte|base|corretivo|protetor solar|hidratante|sérum|secador|chapinha|babyliss|wepink|virgínia|nativa spa|body splash|corpo|estética|chinelo|havaianas|crocs|pijama|blazer|cardigã|terno|meia|unha postiça|cilio|rimel|gloss|delineador|algodão|desodorante|epilador|barbeador|lixa|queratina|tonico|bolsa|cropped|legging|macacão|body|regata|top|sutiã|mochilete|conjunto|máscara facial|escova secadora|depilador|pomada modeladora|leave-in|máscara capilar)/i
    },
    { 
      cat: 'Tecnologia & Eletrônicos', 
      keywords: /(iphone|celular|smartphone|android|xiaomi|samsung|motorola|tablet|ipad|kindle|notebook|laptop|ssd|ram|cpu|gpu|placa|teclado|mouse|monitor|roteador|wifi|hub|caixa de som|alexa|echo|projetor|smart tv|microfone|webcam|carregador|cabo|power bank|fone|headset|bluetooth|earphone|tipo-c|lightning|hdmi|pendrive|cartao de memoria|cooler|case|bateria externa|20000mah|caixinha|apple watch|macbook|gamer|pc|processador|fonte|gabinete|repetidor|carregador indução|suporte notebook|estabilizador|climatizador|drone|ring light|tripé|tripé cellular|placa mãe|placa mae|smartband|controle remoto|scanner)/i
    },
    { 
      cat: 'Casa & Decoração', 
      keywords: /(tapete|cortina|almofada|quadro|espelho|lençol|fronha|manta|cobertor|edredom|toalha|banho|rosto|difusor|essência|vaso|planta|estátua|organizador|cabide|porta retrato|panela|prato|talher|copo|taça|pote|fatiador|mop|varal|lixo|lixeira|utensílios|marmita|vasilha|cozinha|filtro|balança|parede|decoração|churrasco|tábua de corte|aço inoxidável|quadro decorativo|luminária|abajur|vela|led|fita led|puxador|prateleira|nichos|papel de parede|vinil|persiana|jogo de cama|jogo de jantar|escorredor|garrafa térmica|porta tempero|cabideiro|espremenor)/i
    },
    { 
      cat: 'Games & Hobby', 
      keywords: /(ps5|ps4|playstation|xbox|nintendo|switch|gamer|jogo|controle|joystick|pokémon|pokemon|funko|geek|action figure|lego|console|quebra-cabeça|rpg|baralho|board game|fliperama|retro|estatua|miniatura|animes|manga|deck|dualshock|gamepad|headset gamer|cadeira gamer|series x|series s|pc gamer|mousepad|teclado mecanico|volante|nfc|amiibo|yu-gi-oh|magic|cosplay|steam deck|vr|oculus|meta quest|rgb|skin)/i
    },
    { 
      cat: 'Bebês & Infantil', 
      keywords: /(bebê|bebe|infantil|baby|mamadeira|fralda|carrinho de bebê|berço|chocalho|babador|mordedor|brinquedo|boneca|lego|pelúcia|body bebê|escolar|slime|massinha|fantasia|educativo|kids|pampers|huggies|turma da mônica|ninho|cadeirinha|banheira|andador|móbile|pomada|lenço umedecido|almofada amamentação|quebra cabeça|naninha|tapete educativo|berço portátil|kit maternidade|sabonete infantil)/i
    },
    { 
      cat: 'Automotivo', 
      keywords: /(carro|automotivo|moto|veículo|pneu|calibrador|compressor|limpador|óleo|led carro|multimídia|som automotivo|capacete|luva moto|suporte celular carro|obd2|rastreador|xenon|polimento|cerâmica|pulverizador|espuma|snow foam|estética automotiva|central multimídia|palheta|capa|chaveiro|bateria|farol|seta|retrovisor|escapamento|lubrificante|macaco|retro camera|camera veicular|dash cam|película|engate|som bluetooth carro)/i
    },
    { 
      cat: 'Esporte & Lazer', 
      keywords: /(esporte|fitness|academia|bola|corrida|bike|bicicleta|suplemento|whey|creatina|halter|anilha|elástico|ioga|yoga|skate|patins|natação|camping|barraca|pesca|crossfit|termica|garrafa|treino|musculação|funcional|kettlebell|stanley|pre treino|patinete|caneleira|luva boxe|jump|corda|manguito|luva academia|termogênico|bcaa|camisa time|uniforme|squeeze|faixa elástica|tapete yoga)/i
    },
    { 
      cat: 'Pets', 
      keywords: /(pet|cachorro|gato|cão|ração|coleira|guia|aquário|shampoo pet|sanitário|arranhador|caminha pet|brinquedo pet|antipulgas|higiênico|adestramento|petshop|caixa de areia|bebedouro pet|comedouro|tapete higienico|petisco|gaiola|focinheira|caixa de transporte|roupinha pet|fonte pet|tapete gelado|roupa cachorro|casinha pet)/i
    },
    { 
      cat: 'Eletrodomésticos', 
      keywords: /(geladeira|fogão|micro-ondas|microondas|máquina de lavar|maquina de lavar|lava louças|aspirador|air fryer|fritadeira|liquidificador|batedeira|cafeteira|torradeira|ventilador|ar condicionado|climatizador|mixer|purificador|cooktop|adega|tanquinho|vaporeto|secadora|sugar|depurador|multiprocessador|omeleteira|sanduicheira|ferro de passar|panela elétrica|robot aspirador|robo aspirador|lavadora alta pressão)/i
    },
    { 
      cat: 'Móveis', 
      keywords: /(sofá|sofa|mesa|cadeira|guarda-roupa|armário|cama|colchão|estante|rack|painel|escrivaninha|penteadeira|comoda|poltrona|banqueta|puff|cabeceira|balcão|sapateira|criado mudo|mesa de centro|buffet|aparador|beliche|cama box|home office|gaveteiro|painel tv|mesa gamer)/i
    },
    { 
      cat: 'Papelaria & Escritório', 
      keywords: /(caderno|caneta|lápis|estojo|mochila|agenda|planner|grampeador|post-it|folha sulfite|calculadora|organizador de mesa|tesoura|cola|tinta|pincel|bloco de notas|impressora|cartucho|toner|corretivo|fita adesiva|etiqueta|perfurador|marca texto|apontador|quadro branco|fichário|marca página|lapiseira|carimbo)/i
    },
    { 
      cat: 'Ferramentas & Construção', 
      keywords: /(soquetes|catraca|ferramentas|chave|maleta|jogo de ferramentas|parafusadeira|furadeira|alicate|martelo|trena|nivel|serra|broca|fio|cabo|eletrico|antichamas|flexivel|2,5mm|vonder|makita|bosch|dewalt|lixadeira|tinta de parede|torneira|chuveiro|piso|revestimento|disjuntor|tomada|interruptor|vaso sanitario|pia|argamassa|rejunte|lâmpada|solda|estilete|parafuso|bucha|soldador|multimetro)/i
    },
    { 
      cat: 'Segurança & Monitoramento', 
      keywords: /(câmera|monitoramento|alarme|sensor|fechadura digital|interfone|vigilância|dvr|nvr|porteiro eletrônico|cadeado|cerca|infravermelho|ip cam|babá eletronica|biometria|yoosee|icsee|360|intelbras|hikvision|vigilancia|alarme residencial|olho mágico|campainha camera|video porteiro|sirene)/i
    },
    { 
      cat: 'Relógios & Acessórios', 
      keywords: /(relógio|relogio|smartwatch|pulseira|analógico|digital|cronômetro|boné|touca|óculos|oculos|carteira|colar|corrente|anel|brinco|mi band|t800 ultra|nfc|casio|g-shock|apple watch|óculos de sol|cinto|gravata|lenço|tiara|chaveiro|bag|pochete|case relógio)/i
    },
    { 
      cat: 'Joias & Bijuterias', 
      keywords: /(joia|jóia|ouro|prata|diamante|brilhante|colar|brinco|anel|aliança|pulseira|pingente|tornozeleira|bijuteria|semijoia|folheado|rhodium|zircônia|cristal|swarovski|925|banhado|escapulário|choker|piercing)/i
    },
    { 
      cat: 'Livros & Educação', 
      keywords: /(livro|ebook|kindle|apostila|dicionário|enciclopédia|didático|biografia|ficção|romance|terror|suspense|autoajuda|finanças|investimento|hq|mangá|estudo|curso|box livros|colorir|infanto juvenil|bíblia|bíblia sagrada)/i
    },
    { 
      cat: 'Viagem & Malas', 
      keywords: /(mala|viagem|mochila de viagem|frasqueira|necessaire|cadeado de mala|tags de mala|organizador de mala|travesseiro de pescoço|adaptador de tomada|bolsa de bordo|rodinha|bolsa térmica|mochila cargueira|capa de mala|porta passaporte)/i
    }
  ];

  for (const item of categories) {
    if (item.keywords.test(n)) return item.cat;
  }
  return "Outros";
}

try {
  let existingProducts = [];
  if (fs.existsSync(PRODUCTS_FILE)) {
    const fileContent = fs.readFileSync(PRODUCTS_FILE, "utf-8");
    const jsonMatch = fileContent.match(/export const productsData: Product\[\] = (\[[\s\S]*\]);/);
    if (jsonMatch) {
      existingProducts = JSON.parse(jsonMatch[1]);
    }
  }

  const seenIds = new Set(existingProducts.map(p => p.externalId));

  if (!fs.existsSync(INPUT_FILE)) {
    throw new Error(`Arquivo de entrada não encontrado em: ${INPUT_FILE}`);
  }

  let rawData = fs.readFileSync(INPUT_FILE, "utf-8");

  // 🛠️ NOVO EXTRATOR MULTI-LOTES (Regex Global)
  // Ele encontra de forma independente cada par de { ... } correspondente a um lote da API
  const loteMatches = rawData.match(/\{\s*"code"\s*:\s*0[\s\S]*?\n\s*\}\s*(?=\s*\{\s*"code"|$)/g) || rawData.match(/\{\s*"code"\s*:\s*0[\s\S]*?\n\s*\}/g);

  if (!loteMatches || loteMatches.length === 0) {
    throw new Error("Nenhum lote válido da API da Shopee foi encontrado no arquivo produtos.txt");
  }

  console.log(`📦 Encontrados ${loteMatches.length} lote(s) de produtos no arquivo txt.`);

  const newItems = [];
  let lotesComErro = 0;

  // Processa cada lote individualmente
  loteMatches.forEach((loteTexto, index) => {
    try {
      const jsonData = JSON.parse(loteTexto.trim());
      const shopeeProducts = jsonData?.data?.list || [];

      shopeeProducts.forEach((item) => {
        if (!item) return;
        const p = item.batch_item_for_item_card_full || item.batch_item_for_item_card;
        if (!p) return;

        const extId = String(p.itemid);
        if (!seenIds.has(extId)) {
          const imgBase = "https://cf.shopee.com.br/file/";
          const mainImg = imgBase + p.image;
          const galleryImgs = p.images ? p.images.map(img => imgBase + img) : [];

          const video = p.video_info_list?.[0];
          const videoUrl = video?.formats?.[0]?.url || video?.default_format?.url || "";
          const videoThumb = video?.thumb_url ? imgBase + video.thumb_url : "";

          const vouchers = item.promotion_vouchers?.map(v => v.voucher_code) || [];
          const ratingClean = p.item_rating?.rating_star ? Number(p.item_rating.rating_star.toFixed(1)) : 5.0;

          const linkAfiliado = item.long_link || item.product_link || item.invited_campaign_offer_card?.item_card_full_info?.short_link || "";

          const rawDiscount = p.discount || "";
          const uiDiscount = typeof rawDiscount === "number" ? `${rawDiscount}%` : (rawDiscount.includes("%") ? rawDiscount : (rawDiscount ? `${rawDiscount} OFF` : "Oferta"));

          newItems.push({
            id: Math.floor(Math.random() * 10000000),
            externalId: extId,
            platform: "shopee",
            name: p.name,
            category: detectCategory(p.name),
            link: linkAfiliado, 
            price: formatPrice(p.price),
            oldPrice: p.price_before_discount ? formatPrice(p.price_before_discount) : undefined,
            discount: uiDiscount,
            img: mainImg,
            gallery: galleryImgs,
            videoUrl: videoUrl,
            videoThumb: videoThumb,
            vouchers: vouchers,
            sold: p.historical_sold_text || "Destaque",
            rating: ratingClean,
            isFlashSale: p.is_on_flash_sale || false,
            freeShipping: p.show_free_shipping || item.is_free_shipping || false,
            shopName: p.shop_name || "Shopee Brasil",
            description: `Oferta imperdível da loja ${p.shop_name || "parceira"} na Shopee.`
          });

          seenIds.add(extId);
        }
      });
    } catch (e) {
      lotesComErro++;
      console.log(`⚠️ Erro ao processar o lote número ${index + 1}. Ele pode estar incompleto ou mal formatado.`);
    }
  });

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
  console.log(`✨ Adicionados ${newItems.length} novos produtos de todos os lotes combinados.`);
  if(lotesComErro > 0) console.log(`⚠️ Nota: ${lotesComErro} lote(s) falharam por formatação e foram pulados.`);

} catch (error) {
  console.error("❌ Erro Geral:", error.message);
}