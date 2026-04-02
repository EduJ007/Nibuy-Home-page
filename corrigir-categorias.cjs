const fs = require("fs");
const filePath = "./products.ts";

function detectarCategoria(nome) {
  const n = nome.toLowerCase();

  // 1. Moda & Beleza
  if (/(chinelo|sandália|tênis|sapato|bota|vestido|calça|bermuda|camisa|camiseta|blusa|short|saia|maquiagem|perfume|batom|rímel|creme|skincare|cabelo|shampoo|condicionador|barba|unha|esmalte|estética|moletom|jeans|lingerie|cueca|meia|palmilha|cinto|bolsa|mochila feminina|piercing|cosmético|máscara facial|protetor solar)/.test(n))
    return "Moda & Beleza";

  // 2. Tecnologia & Eletrônicos
  if (/(fone|bluetooth|tablet|monitor|drone|projetor|usb|teclado|mouse|notebook|laptop|pc|computador|carregador|cabo|power bank|caixa de som|alexa|echo dot|kindle|processador|placa de vídeo|memória ram|ssd|hd|roteador|wi-fi|hub|adaptador|repetidor|massageador|elétrico|digital|smart|tv|box|gamer|cooler|headset|webcam)/.test(n))
    return "Tecnologia & Eletrônicos";

  // 3. Móveis
  if (/(mesa|cadeira|sofá|estante|armário|cama|puf|escrivaninha|comoda|guarda-roupa|rack|painel|cabeceira|poltrona|banqueta|aparador|criado mudo|móvel)/.test(n))
    return "Móveis";

  // 4. Iluminação
  if (/(lâmpada|luminária|lustre|led|abajur|refletor|fita led|painel solar|spot|plafon|arandela|espeto jardim|claro|neon|lanterna)/.test(n))
    return "Iluminação";

  // 5. Papelaria & Escritório
  if (/(caneta|caderno|papel|escritório|agenda|estojo|tesoura|mochila escolar|calculadora|grampeador|fita|adesivo|post-it|lápis|borracha|corretivo|pasta|folha a4|impressora|tinta impressora)/.test(n))
    return "Papelaria & Escritório";

  // 6. Ferramentas & Construção
  if (/(furadeira|martelo|chave|serra|ferramenta|parafuso|trena|nível|alicates|lixadeira|parafusadeira|broca|tinta|pincel|escada|disjuntor|tomada|esmerilhadeira|maleta|amolador|afiação|lavadora|reparo|solda|chuveiro|resistência|cimento|argamassa|rejunte)/.test(n))
    return "Ferramentas & Construção";

  // 7. Segurança & Monitoramento
  if (/(câmera|monitoramento|alarme|sensor|fechadura digital|interfone|vigilância|dvr|nvr|porteiro eletrônico|cadeado|cerca)/.test(n))
    return "Segurança & Monitoramento";

  // 8. Relógios & Acessórios
  if (/(relógio|smartwatch|pulseira|smart watch|apple watch|mi band|relojoaria|boné|carteira|óculos de sol|óculos)/.test(n))
    return "Relógios & Acessórios";

  // 9. Joias & Bijuterias
  if (/(anel|colar|brinco|pulseira|joia|prata|ouro|bijuteria|semijoia|pingente|tornozeleira|corrente)/.test(n))
    return "Joias & Bijuterias";

  // 10. Livros & Educação
  if (/(livro|curso|educação|apostila|estudo|dicionário|revista|didático|biografia|romance|mangá|hq|quadrinhos)/.test(n))
    return "Livros & Educação";

  // 11. Viagem & Malas
  if (/(mala|viagem|mochila|passaporte|frasqueira|necessaire|mala de bordo|organizador de mala|cadeado viagem|etiqueta mala|bolsa de viagem)/.test(n))
    return "Viagem & Malas";

  // 12. Games & Hobby
  if (/(game|console|playstation|ps4|ps5|xbox|nintendo|switch|joycon|controle|joystick|headset gamer|card game|board game|tabuleiro|colecionável|action figure|funko|quebra-cabeça|rpg|baralho)/.test(n))
    return "Games & Hobby";

  // 13. Bebês & Infantil
  if (/(bebê|infantil|mamadeira|fralda|carrinho de bebê|berço|chocalho|babador|mordedor|brinquedo|boneca|carrinho|lego|pelúcia|body bebê|pagão|andador|cadeirinha|slime)/.test(n))
    return "Bebês & Infantil";

  // 14. Automotivo
  if (/(carro|automotivo|moto|veículo|pneu|calibrador|compressor|limpador|óleo|filtro|led carro|multimídia|som automotivo|capacete|luva moto|suporte celular|capa carro)/.test(n))
    return "Automotivo";

  // 15. Esporte & Lazer
  if (/(esporte|fitness|academia|bola|corrida|bike|bicicleta|suplemento|whey|creatina|halter|anilha|elástico|ioga|yoga|skate|patins|natação|óculos mergulho|garrafa térmica|squeeze|camping|barraca)/.test(n))
    return "Esporte & Lazer";

  // 16. Pets
  if (/(pet|cachorro|gato|cão|ração|coleira|guia|aquário|shampoo pet|sanitário|arranhador|caminha pet|brinquedo pet|antipulgas|higiênico)/.test(n))
    return "Pets";

  // 17. Eletrodomésticos
  if (/(geladeira|microondas|liquidificador|air fryer|aspirador|batedeira|cafeteira|máquina de lavar|tanquinho|secadora|fogão|cooktop|refrigerador|climatizador|ventilador|ferro de passar|mixer)/.test(n))
    return "Eletrodomésticos";

  // 18. Casa & Decoração (Fica por último para pegar o que sobrou de utilidades domésticas)
  if (/(tapete|cortina|almofada|quadro|espelho|lençol|percal|algodão|enxoval|fronha|manta|cobertor|edredom|toalha|banho|rosto|difusor|essência|vaso|planta|estátua|organizador|cabide|porta retrato|panela|prato|talher|copo|taça|pote|fatiador|ralador|escorredor|frigideira|mop|varal|lixo|lixeira|utensílios|marmita|vasilha|pvc|cozinha|torneira|filtro|balança|parede)/.test(n))
    return "Casa & Decoração";

  // Caso padrão
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