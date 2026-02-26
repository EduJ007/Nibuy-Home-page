const fs = require("fs");
const filePath = "./products.ts";

function detectarCategoria(nome) {
  const n = nome.toLowerCase();

  // 1. Moda & Beleza
  if (/(chinelo|sandália|tênis|sapato|bota|vestido|calça|bermuda|camisa|camiseta|blusa|short|saia|maquiagem|perfume|batom|rímel|creme|skincare|cabelo|shampoo|condicionador|barba|unha|esmalte|estética|moletom|jeans|lingerie|cueca|meia|palmilha|cinto|bolsa|mochila feminina|óculos|brinco|colar|anel|joia|piercing)/.test(n))
    return "Moda & Beleza";

  // 2. Tecnologia & Eletrônicos
  if (/(fone|bluetooth|tablet|monitor|drone|projetor|usb|teclado|mouse|notebook|laptop|pc|computador|carregador|cabo|power bank|caixa de som|alexa|echo dot|kindle|processador|placa de vídeo|memória ram|ssd|hd|roteador|wi-fi|hub|adaptador|repetidor|massageador|elétrico|digital|smart|tv|box|gamer)/.test(n))
    return "Tecnologia & Eletrônicos";

  // 3. Casa & Decoração (O maior de todos)
  if (/(tapete|cortina|almofada|quadro|espelho|lençol|percal|algodão|enxoval|fronha|manta|cobertor|edredom|toalha|banho|rosto|difusor|essência|vaso|planta|estátua|organizador|cabide|porta retrato|panela|prato|talher|copo|taça|pote|fatiador|ralador|escorredor|frigideira|caçarola|fervedor|mop|varal|lixo|lixeira|utensílios|marmita|vasilha|pvc|americano|cozinha|torneira|filtro|lâmpada|led|lustre|abajur|luminária|balança|parede|adesivo|gancho|multiuso)/.test(n))
    return "Casa & Decoração";

  // 4. Games & Hobby
  if (/(game|console|playstation|ps4|ps5|xbox|nintendo|switch|joycon|controle|joystick|headset gamer|card game|board game|tabuleiro|colecionável|action figure|funko|quebra-cabeça|rpg|baralho)/.test(n))
    return "Games & Hobby";

  // 5. Bebês & Infantil
  if (/(bebê|infantil|mamadeira|fralda|carrinho de bebê|berço|chocalho|babador|mordedor|brinquedo|boneca|carrinho|lego|pelúcia|body bebê|pagão|andador|cadeirinha|slime|escolar)/.test(n))
    return "Bebês & Infantil";

  // 6. Automotivo
  if (/(carro|automotivo|moto|veículo|pneu|calibrador|compressor|limpador|óleo|filtro|led carro|multimídia|som automotivo|capacete|luva moto|suporte celular|capa carro|estacionamento|antena)/.test(n))
    return "Automotivo";

  // 7. Esporte & Lazer
  if (/(esporte|fitness|academia|bola|corrida|bike|bicicleta|suplemento|whey|creatina|halter|anilha|elástico|ioga|yoga|skate|patins|natação|óculos mergulho|garrafa térmica|squeeze|camping|barraca|top|termogênico)/.test(n))
    return "Esporte & Lazer";

  // 8. Pets
  if (/(pet|cachorro|gato|cão|ração|coleira|guia|aquário|shampoo pet|sanitário|arranhador|caminha pet|brinquedo pet|antipulgas|higiênico|pássaro|peixe)/.test(n))
    return "Pets";

  // 9. Ferramentas & Construção
  if (/(furadeira|martelo|chave|serra|ferramenta|parafuso|trena|nível|alicates|lixadeira|parafusadeira|broca|tinta|pincel|escada|disjuntor|tomada|esmerilhadeira|maleta|amolador|afiação|lavadora|reparo|solda)/.test(n))
    return "Ferramentas & Construção";

  // 10. Relógios & Acessórios
  if (/(relógio|smartwatch|pulseira|smart watch|apple watch|mi band|relojoaria|óculos de sol|boné|carteira)/.test(n))
    return "Relógios & Acessórios";

  // 11. Eletrodomésticos
  if (/(geladeira|microondas|liquidificador|air fryer|aspirador|batedeira|cafeteira|máquina de lavar|tanquinho|secadora|fogão|cooktop|refrigerador|climatizador|ventilador|ferro de passar|mixer)/.test(n))
    return "Eletrodomésticos";

  // Se nada acima funcionar, vai para Casa & Decoração por ser o mais comum no seu arquivo
  return "Casa & Decoração"; 
}

try {
  let content = fs.readFileSync(filePath, "utf8");

  // Regex para pegar cada objeto dentro do array productsData
  content = content.replace(/\{[\s\S]*?\}/g, (objetoTexto) => {
    const nomeMatch = objetoTexto.match(/"name":\s*"(.*?)"/);
    if (!nomeMatch) return objetoTexto;

    const nomeProduto = nomeMatch[1];
    const novaCategoria = detectarCategoria(nomeProduto);

    // Se já tiver a propriedade category, substitui. Se não, adiciona no final antes do }
    if (objetoTexto.includes('"category"')) {
      return objetoTexto.replace(/"category":\s*".*?"/, `"category": "${novaCategoria}"`);
    } else {
      // Remove o último '}' e coloca a categoria nova
      return objetoTexto.replace(/\s*\}\s*$/, `,\n    "category": "${novaCategoria}"\n  }`);
    }
  });

  fs.writeFileSync(filePath, content);
  console.log("🚀 EXPLODIU DE CATEGORIA! Tudo atualizado com sucesso.");
} catch (err) {
  console.error("❌ Deu erro aqui:", err.message);
}