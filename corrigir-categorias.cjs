const fs = require("fs");
const filePath = "./products.ts";

function detectarCategoria(nome) {
  const n = nome.toLowerCase();

  // --- 1. TECNOLOGIA & ELETRÔNICOS (Alta prioridade) ---
  if (/(fone|bluetooth|headset|earphone|tablet|ipad|monitor|drone|projetor|usb|teclado|mouse|notebook|laptop|computador|pc|carregador|cabo|power bank|caixa de som|alexa|echo|kindle|memória ram|ssd|hd|roteador|wi-fi|hub|adaptador|repetidor|digital|smart|tv|box|cooler|webcam|microfone|pendrive|cpu|gpu)/.test(n))
    return "Tecnologia & Eletrônicos";

  // --- 2. GAMES & HOBBY ---
  if (/(game|console|playstation|ps4|ps5|xbox|nintendo|switch|joycon|controle|joystick|gamer|card game|board game|tabuleiro|colecionável|action figure|funko|quebra-cabeça|rpg|baralho)/.test(n))
    return "Games & Hobby";

  // --- 3. SEGURANÇA & MONITORAMENTO ---
  if (/(câmera|monitoramento|alarme|sensor|fechadura digital|interfone|vigilância|dvr|nvr|porteiro eletrônico|cadeado|cerca)/.test(n))
    return "Segurança & Monitoramento";

  // --- 4. RELÓGIOS & ACESSÓRIOS ---
  if (/(relógio|smartwatch|pulseira|smart watch|apple watch|mi band|relojoaria)/.test(n))
    return "Relógios & Acessórios";

  // --- 5. AUTOMOTIVO ---
  if (/(carro|automotivo|moto|veículo|pneu|calibrador|compressor|limpador|óleo|led carro|multimídia|som automotivo|capacete|luva moto|suporte celular carro|estacionamento)/.test(n))
    return "Automotivo";

  // --- 6. BEBÊS & INFANTIL ---
  if (/(bebê|infantil|baby|mamadeira|fralda|carrinho de bebê|berço|chocalho|babador|mordedor|brinquedo|boneca|lego|pelúcia|body bebê|andador|cadeirinha|maternidade)/.test(n))
    return "Bebês & Infantil";

  // --- 7. MODA & BELEZA ---
  if (/(chinelo|sandália|tênis|sapato|bota|vestido|calça|bermuda|camisa|camiseta|blusa|short|saia|moletom|jeans|lingerie|cueca|meia|biquíni|maquiagem|perfume|batom|rímel|skincare|shampoo|condicionador|esmalte|unha|piercing|bolsa|mochila|carteira|óculos|cinto|estética|babyliss|chapinha)/.test(n))
    return "Moda & Beleza";

  // --- 8. PETS ---
  if (/(pet|cachorro|gato|cão|ração|coleira|guia|aquário|shampoo pet|sanitário|arranhador|caminha pet|brinquedo pet|antipulgas|higiênico)/.test(n))
    return "Pets";

  // --- 9. ESPORTE & LAZER ---
  if (/(esporte|fitness|academia|bola|corrida|bike|bicicleta|suplemento|whey|creatina|halter|anilha|elástico|ioga|yoga|skate|patins|natação|mergulho|garrafa térmica|squeeze|camping|barraca|pesca)/.test(n))
    return "Esporte & Lazer";

  // --- 10. ELETRODOMÉSTICOS ---
  if (/(geladeira|microondas|liquidificador|air fryer|aspirador|batedeira|cafeteira|máquina de lavar|secadora|fogão|cooktop|refrigerador|ventilador|ar condicionado|ferro de passar|mixer)/.test(n))
    return "Eletrodomésticos";

  // --- 11. MÓVEIS ---
  if (/(mesa|cadeira|sofá|estante|armário|cama|puf|escrivaninha|comoda|guarda-roupa|rack|painel|cabeceira|poltrona|banqueta|aparador|criado mudo|móvel)/.test(n))
    return "Móveis";

  // --- 12. PAPELARIA & ESCRITÓRIO ---
  if (/(caneta|caderno|papel|escritório|agenda|estojo|tesoura|calculadora|grampeador|fita|adesivo|post-it|lápis|borracha|pasta|impressora|tinta)/.test(n))
    return "Papelaria & Escritório";

  // --- 13. FERRAMENTAS & CONSTRUÇÃO ---
  if (/(furadeira|martelo|chave|serra|ferramenta|parafuso|trena|nível|alicates|lixadeira|parafusadeira|broca|pincel|escada|chuveiro|reparo|solda|torneira)/.test(n))
    return "Ferramentas & Construção";

  // --- 14. ILUMINAÇÃO ---
  if (/(lâmpada|luminária|lustre|led|abajur|refletor|fita led|painel solar|spot|plafon|arandela|lanterna)/.test(n))
    return "Iluminação";

  // --- 15. JOIAS & BIJUTERIAS ---
  if (/(anel|colar|brinco|joia|prata|ouro|bijuteria|semijoia|pingente|tornozeleira|corrente|gargantilha)/.test(n))
    return "Joias & Bijuterias";

  // --- 16. LIVROS & EDUCAÇÃO ---
  if (/(livro|curso|educação|apostila|estudo|dicionário|revista|didático|mangá|hq)/.test(n))
    return "Livros & Educação";

  // --- 17. VIAGEM & MALAS ---
  if (/(mala|viagem|passaporte|frasqueira|necessaire|mala de bordo|organizador de mala|etiqueta mala|bolsa de viagem)/.test(n))
    return "Viagem & Malas";

  // --- 18. CASA & DECORAÇÃO (Última opção - Geral) ---
  if (/(tapete|cortina|almofada|quadro|espelho|lençol|enxoval|fronha|manta|cobertor|edredom|toalha|banho|rosto|difusor|essência|vaso|planta|estátua|organizador|cabide|panela|prato|talher|copo|taça|pote|fatiador|mop|varal|lixo|lixeira|utensílios|marmita|vasilha|cozinha|filtro|balança|parede)/.test(n))
    return "Casa & Decoração";

  return "Casa & Decoração"; 
}

// Lógica de atualização do arquivo (mantida igual)
try {
  let content = fs.readFileSync(filePath, "utf8");
  content = content.replace(/\{[\s\S]*?\}/g, (objetoTexto) => {
    const nomeMatch = objetoTexto.match(/"name":\s*"(.*?)"/);
    if (!nomeMatch) return objetoTexto;

    const nomeProduto = nomeMatch[1];
    const novaCategoria = detectarCategoria(nomeProduto);

    if (objetoTexto.includes('"category"')) {
      return objetoTexto.replace(/"category":\s*".*?"/, `"category": "${novaCategoria}"`);
    } else {
      return objetoTexto.replace(/\s*\}\s*$/, `,\n    "category": "${novaCategoria}"\n  }`);
    }
  });

  fs.writeFileSync(filePath, content);
  console.log("🚀 EXPLODIU DE CATEGORIA! 18 categorias mapeadas com sucesso.");
} catch (err) {
  console.error("❌ Erro ao atualizar arquivo:", err.message);
}