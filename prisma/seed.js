const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

const CATEGORIES = [
    { name: "Eletrônicos", slug: "eletronicos" },
    { name: "Roupas", slug: "roupas" },
    { name: "Móveis", slug: "moveis" },
    { name: "Livros", slug: "livros" },
    { name: "Sapatos", slug: "sapatos" },
    { name: "Outros", slug: "outros" },
];

const DEMO_USERS = [
    {
        key: "maria",
        name: "Maria Silva",
        email: "maria.silva@email.com",
        location: "Vila Madalena, São Paulo, SP",
        bio: "Sou mãe da Beatriz e do Pedro. Quero um futuro mais sustentável para os meus netos, e acredito que temos que consumir com mais consciência. Reutilizar as coisas nos aproxima mais dessa meta. Hoje tenho praticado mais o desapego e focado mais em realizar trocas que fazem produtos usados circular.",
        avatarUrl: "/images/pranchas/prancha7.png#sprite=1",
        rating: 4.8,
    },
    {
        key: "joao",
        name: "João Souza",
        email: "joao.souza@email.com",
        location: "Mooca, São Paulo, SP",
        bio: "Interessado em achar peças com história e dar novo uso a itens que ainda têm valor.",
        avatarUrl: "/images/pranchas/prancha7.png#sprite=2",
        rating: 4.5,
    },
    {
        key: "luana",
        name: "Luana Maranhão",
        email: "luana.maranhao@email.com",
        location: "Pinheiros, São Paulo, SP",
        bio: "Leitora, fotógrafa amadora e adepta do consumo consciente. Gosto de circular livros e objetos que possam ganhar novas histórias.",
        avatarUrl: "/images/pranchas/prancha7.png#sprite=3",
        rating: 4.9,
    },
    {
        key: "paulo",
        name: "Paulo Silva",
        email: "paulo.silva@email.com",
        location: "Campinas, SP",
        bio: "Estudante de tecnologia em busca de trocas úteis e equipamentos bem conservados.",
        avatarUrl: "/images/pranchas/prancha7.png#sprite=4",
        rating: 4.6,
    },
    {
        key: "cristina",
        name: "Cristina Martins",
        email: "cristina.martins@email.com",
        location: "Santos, SP",
        bio: "Apaixonada por moda circular e por encontrar novos donos para peças que ainda têm muito uso pela frente.",
        avatarUrl: "/images/pranchas/prancha7.png#sprite=5",
        rating: 4.7,
    },
    {
        key: "daniel",
        name: "Daniel Matos",
        email: "daniel.matos@email.com",
        location: "São José dos Campos, SP",
        bio: "Garimpo móveis e objetos para casa. Prefiro recuperar, trocar e reutilizar antes de comprar algo novo.",
        avatarUrl: "/images/pranchas/prancha7.png#sprite=6",
        rating: 4.8,
    },
];

const ITEMS = [
    {
        key: "cadeira",
        sellerKey: "maria",
        title: "Cadeira de Madeira Estilo Søborg Anos 50",
        description:
            "Cadeira Estilo Søborg, inspirada no modelo original dinamarquês dos anos 1950. Toda de madeira maciça com acabamentos excelentes.\n\nAceito trocas por outros móveis também.\n\nDisponível para retirada na Vila Madalena - SP.",
        price: 490,
        type: "VENDA",
        condition: "USADO_BOM_ESTADO",
        status: "ATIVO",
        categorySlug: "moveis",
        location: "Vila Madalena, São Paulo, SP",
        images: ["/images/itens/cadeira.png"],
    },
    {
        key: "teclado",
        sellerKey: "maria",
        title: "Teclado gamer",
        description:
            "Teclado gamer usado, em bom estado de conservação e funcionando perfeitamente. Ideal para jogos e uso no dia a dia.",
        price: null,
        type: "DOACAO",
        condition: "USADO_BOM_ESTADO",
        status: "ATIVO",
        categorySlug: "eletronicos",
        location: "Vila Madalena, São Paulo, SP",
        images: ["/images/itens/teclado.jpg"],
    },
    {
        key: "camera-vintage",
        sellerKey: "maria",
        title: "Câmera vintage",
        description:
            "Câmera vintage usada, em bom estado de conservação e funcionando perfeitamente. Ideal para quem gosta de fotografia e procura um equipamento com estilo clássico.",
        price: 500,
        type: "VENDA",
        condition: "USADO_BOM_ESTADO",
        status: "ATIVO",
        categorySlug: "eletronicos",
        location: "Vila Madalena, São Paulo, SP",
        images: ["/images/itens/camera-vintage.jpg"],
    },
    {
        key: "iphone",
        legacyTitles: ["Iphone 17"],
        sellerKey: "maria",
        title: "iPhone 17",
        description:
            "iPhone 17 usado, em ótimo estado de conservação e funcionando perfeitamente. Ideal para uso no dia a dia, com bom desempenho para fotos, vídeos e aplicativos.",
        price: 3200,
        type: "VENDA",
        condition: "USADO_COMO_NOVO",
        status: "ATIVO",
        categorySlug: "eletronicos",
        location: "Vila Madalena, São Paulo, SP",
        images: ["/images/itens/iphone-17.jpg"],
    },
    {
        key: "jaqueta",
        sellerKey: "maria",
        title: "Jaqueta de couro",
        description:
            "Jaqueta de couro usada, tamanho 40, em bom estado de conservação. Uma peça versátil e atemporal, ideal para complementar diferentes looks.",
        price: null,
        type: "TROCA",
        condition: "USADO_BOM_ESTADO",
        status: "ATIVO",
        categorySlug: "roupas",
        location: "Vila Madalena, São Paulo, SP",
        images: ["/images/itens/jaqueta.jpg"],
    },
    {
        key: "tenis-adidas",
        sellerKey: "maria",
        title: "Tênis Adidas Pink",
        description:
            "Tênis Adidas Pink usado, em bom estado de conservação e confortável para o uso no dia a dia. Ideal para quem procura um modelo casual e estiloso.",
        price: 220,
        type: "VENDA",
        condition: "USADO_BOM_ESTADO",
        status: "ATIVO",
        categorySlug: "sapatos",
        location: "Vila Madalena, São Paulo, SP",
        images: ["/images/itens/tenis-adidas.png"],
    },
    {
        key: "colecao-livros",
        sellerKey: "luana",
        title: "Coleção de livros para novos leitores",
        description:
            "Seleção com cinco livros de literatura contemporânea em bom estado. As páginas estão completas e sem anotações. Doação do conjunto completo, com retirada combinada.",
        price: null,
        type: "DOACAO",
        condition: "USADO_BOM_ESTADO",
        status: "ATIVO",
        categorySlug: "livros",
        location: "Pinheiros, São Paulo, SP",
        images: ["/images/promo/livros.jpg"],
    },
    {
        key: "notebook",
        sellerKey: "paulo",
        title: "Notebook leve para estudo",
        description:
            "Notebook compacto, com carregador e bateria em bom estado. Procuro trocar por um tablet com caneta para leitura e anotações.",
        price: null,
        type: "TROCA",
        condition: "USADO_BOM_ESTADO",
        status: "ATIVO",
        categorySlug: "eletronicos",
        location: "Campinas, SP",
        images: ["/images/promo/notebook.jpg"],
    },
    {
        key: "sofa-verde",
        sellerKey: "daniel",
        title: "Sofá de veludo verde",
        description:
            "Sofá de dois lugares com estrutura firme e tecido bem conservado. Há uma pequena marca discreta no braço direito. Retirada por conta do comprador.",
        price: 1250,
        type: "VENDA",
        condition: "USADO_BOM_ESTADO",
        status: "ATIVO",
        categorySlug: "moveis",
        location: "São José dos Campos, SP",
        images: ["/images/promo/sofa.jpg"],
    },
    {
        key: "tenis-cano-alto",
        sellerKey: "cristina",
        title: "Tênis cano alto preto",
        description:
            "Tênis tamanho 38, usado poucas vezes e sem avarias. O item está reservado enquanto a retirada é combinada.",
        price: 180,
        type: "VENDA",
        condition: "USADO_COMO_NOVO",
        status: "RESERVADO",
        categorySlug: "sapatos",
        location: "Santos, SP",
        images: ["/images/promo/sapatos.jpg"],
    },
    {
        key: "camera-compacta",
        sellerKey: "luana",
        title: "Câmera compacta para viagem",
        description:
            "Câmera digital compacta com bolsa protetora e cartão de memória. Item já vendido e mantido no perfil para demonstrar o histórico da negociação.",
        price: 230,
        type: "VENDA",
        condition: "USADO_BOM_ESTADO",
        status: "CONCLUIDO",
        categorySlug: "eletronicos",
        location: "Pinheiros, São Paulo, SP",
        images: ["/images/promo/fotografia.jpg"],
    },
    {
        key: "p1-1",
        sellerKey: "paulo",
        title: "Fone bluetooth over-ear",
        description: "Fone over-ear bem conservado, com estrutura e almofadas em ótimo aspecto para ouvir música no dia a dia.",
        price: 180,
        type: "VENDA",
        condition: "USADO_COMO_NOVO",
        status: "ATIVO",
        categorySlug: "eletronicos",
        location: "Campinas, SP",
        images: ["/images/pranchas/prancha1.png#sprite=1"],
    },
    {
        key: "p1-2",
        sellerKey: "joao",
        title: "Smartphone preto 256 GB",
        description: "Smartphone preto usado e bem cuidado, pronto para continuar acompanhando a rotina de outra pessoa.",
        price: 1450,
        type: "VENDA",
        condition: "USADO_BOM_ESTADO",
        status: "ATIVO",
        categorySlug: "eletronicos",
        location: "Mooca, São Paulo, SP",
        images: ["/images/pranchas/prancha1.png#sprite=2"],
    },
    {
        key: "p1-3",
        sellerKey: "paulo",
        title: "Notebook 14\" para trabalho",
        description: "Notebook de 14 polegadas em bom estado, adequado para tarefas de trabalho e estudo. Disponível para troca.",
        price: null,
        type: "TROCA",
        condition: "USADO_BOM_ESTADO",
        status: "ATIVO",
        categorySlug: "eletronicos",
        location: "Campinas, SP",
        images: ["/images/pranchas/prancha1.png#sprite=3"],
    },
    {
        key: "p1-4",
        sellerKey: "joao",
        title: "Controle sem fio para videogame",
        description: "Controle sem fio usado, conservado e reservado enquanto os detalhes da retirada são combinados.",
        price: 160,
        type: "VENDA",
        condition: "USADO_BOM_ESTADO",
        status: "RESERVADO",
        categorySlug: "eletronicos",
        location: "Mooca, São Paulo, SP",
        images: ["/images/pranchas/prancha1.png#sprite=4"],
    },
    {
        key: "p1-5",
        sellerKey: "cristina",
        title: "Smartwatch esportivo",
        description: "Smartwatch esportivo com aparência de pouco uso, ideal para acompanhar atividades e a rotina diária.",
        price: 250,
        type: "VENDA",
        condition: "USADO_COMO_NOVO",
        status: "ATIVO",
        categorySlug: "eletronicos",
        location: "Santos, SP",
        images: ["/images/pranchas/prancha1.png#sprite=5"],
    },
    {
        key: "p1-6",
        sellerKey: "luana",
        title: "Caixa de som bluetooth",
        description: "Caixa de som bluetooth em bom estado, disponível para troca por outro item de interesse.",
        price: null,
        type: "TROCA",
        condition: "USADO_BOM_ESTADO",
        status: "ATIVO",
        categorySlug: "eletronicos",
        location: "Pinheiros, São Paulo, SP",
        images: ["/images/pranchas/prancha1.png#sprite=6"],
    },
    {
        key: "p2-1",
        sellerKey: "cristina",
        title: "Kit de moletons básicos",
        description: "Conjunto de moletons básicos em cores neutras, usados e bem conservados para os dias mais frescos.",
        price: 120,
        type: "VENDA",
        condition: "USADO_BOM_ESTADO",
        status: "ATIVO",
        categorySlug: "roupas",
        location: "Santos, SP",
        images: ["/images/pranchas/prancha2.png#sprite=1"],
    },
    {
        key: "p2-2",
        sellerKey: "luana",
        title: "Suéter de tricô creme",
        description: "Suéter de tricô na cor creme, macio e bem conservado. Doação para quem possa aproveitar a peça.",
        price: null,
        type: "DOACAO",
        condition: "USADO_BOM_ESTADO",
        status: "ATIVO",
        categorySlug: "roupas",
        location: "Pinheiros, São Paulo, SP",
        images: ["/images/pranchas/prancha2.png#sprite=2"],
    },
    {
        key: "p2-3",
        sellerKey: "cristina",
        title: "Jaqueta jeans azul",
        description: "Jaqueta jeans azul com sinais naturais de uso, ainda pronta para compor muitos looks. Disponível para troca.",
        price: null,
        type: "TROCA",
        condition: "USADO_ESTADO_REGULAR",
        status: "ATIVO",
        categorySlug: "roupas",
        location: "Santos, SP",
        images: ["/images/pranchas/prancha2.png#sprite=3"],
    },
    {
        key: "p2-4",
        sellerKey: "joao",
        title: "Kit de camisetas básicas",
        description: "Kit de camisetas básicas em cores fáceis de combinar, todas usadas e em bom estado.",
        price: 70,
        type: "VENDA",
        condition: "USADO_BOM_ESTADO",
        status: "ATIVO",
        categorySlug: "roupas",
        location: "Mooca, São Paulo, SP",
        images: ["/images/pranchas/prancha2.png#sprite=4"],
    },
    {
        key: "p2-5",
        sellerKey: "cristina",
        title: "Tênis branco casual",
        description: "Tênis branco casual com aparência de pouco uso, versátil para diferentes combinações do dia a dia.",
        price: 160,
        type: "VENDA",
        condition: "USADO_COMO_NOVO",
        status: "ATIVO",
        categorySlug: "sapatos",
        location: "Santos, SP",
        images: ["/images/pranchas/prancha2.png#sprite=5"],
    },
    {
        key: "p2-6",
        sellerKey: "paulo",
        title: "Mochila preta para notebook",
        description: "Mochila preta para notebook, com visual discreto e bom estado geral para uso cotidiano.",
        price: 130,
        type: "VENDA",
        condition: "USADO_BOM_ESTADO",
        status: "ATIVO",
        categorySlug: "outros",
        location: "Campinas, SP",
        images: ["/images/pranchas/prancha2.png#sprite=6"],
    },
    {
        key: "p3-1",
        sellerKey: "daniel",
        title: "Sofá bege de dois lugares",
        description: "Sofá bege de dois lugares, bem conservado e com formato compacto para salas menores.",
        price: 900,
        type: "VENDA",
        condition: "USADO_BOM_ESTADO",
        status: "ATIVO",
        categorySlug: "moveis",
        location: "São José dos Campos, SP",
        images: ["/images/pranchas/prancha3.png#sprite=1"],
    },
    {
        key: "p3-2",
        sellerKey: "daniel",
        title: "Mesa de jantar com quatro lugares",
        description: "Mesa de jantar com quatro lugares e marcas compatíveis com o uso, mantendo boa presença no ambiente.",
        price: 700,
        type: "VENDA",
        condition: "USADO_ESTADO_REGULAR",
        status: "ATIVO",
        categorySlug: "moveis",
        location: "São José dos Campos, SP",
        images: ["/images/pranchas/prancha3.png#sprite=2"],
    },
    {
        key: "p3-3",
        sellerKey: "joao",
        title: "Cadeira branca de apoio",
        description: "Cadeira branca de apoio em bom estado, oferecida para doação e retirada combinada.",
        price: null,
        type: "DOACAO",
        condition: "USADO_BOM_ESTADO",
        status: "ATIVO",
        categorySlug: "moveis",
        location: "Mooca, São Paulo, SP",
        images: ["/images/pranchas/prancha3.png#sprite=3"],
    },
    {
        key: "p3-4",
        sellerKey: "daniel",
        title: "Estante de madeira e metal",
        description: "Estante com estrutura de metal e prateleiras de madeira, conservada e disponível para troca.",
        price: null,
        type: "TROCA",
        condition: "USADO_BOM_ESTADO",
        status: "ATIVO",
        categorySlug: "moveis",
        location: "São José dos Campos, SP",
        images: ["/images/pranchas/prancha3.png#sprite=4"],
    },
    {
        key: "p3-5",
        sellerKey: "maria",
        title: "Cama box casal com colchão",
        description: "Cama box de casal com colchão, conjunto usado e bem conservado para retirada combinada.",
        price: 850,
        type: "VENDA",
        condition: "USADO_BOM_ESTADO",
        status: "ATIVO",
        categorySlug: "moveis",
        location: "Vila Madalena, São Paulo, SP",
        images: ["/images/pranchas/prancha3.png#sprite=5"],
    },
    {
        key: "p3-6",
        sellerKey: "maria",
        title: "Mesa lateral redonda",
        description: "Mesa lateral redonda com acabamento claro e aparência de pouco uso, ideal como apoio ao lado do sofá.",
        price: 150,
        type: "VENDA",
        condition: "USADO_COMO_NOVO",
        status: "ATIVO",
        categorySlug: "moveis",
        location: "Vila Madalena, São Paulo, SP",
        images: ["/images/pranchas/prancha3.png#sprite=6"],
    },
    {
        key: "p4-1",
        sellerKey: "luana",
        title: "Kit com 3 livros de não ficção",
        description: "Conjunto com três livros de não ficção em bom estado, vendido apenas como kit.",
        price: 90,
        type: "VENDA",
        condition: "USADO_BOM_ESTADO",
        status: "ATIVO",
        categorySlug: "livros",
        location: "Pinheiros, São Paulo, SP",
        images: ["/images/pranchas/prancha4.png#sprite=1"],
    },
    {
        key: "p4-2",
        sellerKey: "luana",
        title: "Livro 1984",
        description: "Exemplar de 1984 em bom estado. A troca já foi concluída e o anúncio permanece como histórico.",
        price: null,
        type: "TROCA",
        condition: "USADO_BOM_ESTADO",
        status: "CONCLUIDO",
        categorySlug: "livros",
        location: "Pinheiros, São Paulo, SP",
        images: ["/images/pranchas/prancha4.png#sprite=2"],
    },
    {
        key: "p4-3",
        sellerKey: "luana",
        title: "O Pequeno Príncipe",
        description: "Exemplar de O Pequeno Príncipe em bom estado, disponível para doação a um novo leitor.",
        price: null,
        type: "DOACAO",
        condition: "USADO_BOM_ESTADO",
        status: "ATIVO",
        categorySlug: "livros",
        location: "Pinheiros, São Paulo, SP",
        images: ["/images/pranchas/prancha4.png#sprite=3"],
    },
    {
        key: "p4-4",
        sellerKey: "cristina",
        title: "Tênis branco urbano",
        description: "Tênis branco de estilo urbano, com aparência de pouco uso e acabamento bem conservado.",
        price: 140,
        type: "VENDA",
        condition: "USADO_COMO_NOVO",
        status: "ATIVO",
        categorySlug: "sapatos",
        location: "Santos, SP",
        images: ["/images/pranchas/prancha4.png#sprite=4"],
    },
    {
        key: "p4-5",
        sellerKey: "joao",
        title: "Tênis preto de cano alto",
        description: "Tênis preto de cano alto em bom estado, disponível para troca por outro calçado.",
        price: null,
        type: "TROCA",
        condition: "USADO_BOM_ESTADO",
        status: "ATIVO",
        categorySlug: "sapatos",
        location: "Mooca, São Paulo, SP",
        images: ["/images/pranchas/prancha4.png#sprite=5"],
    },
    {
        key: "p4-6",
        sellerKey: "daniel",
        title: "Tênis casual marrom",
        description: "Tênis casual marrom com sinais visíveis de uso, mas ainda adequado para o cotidiano.",
        price: 170,
        type: "VENDA",
        condition: "USADO_ESTADO_REGULAR",
        status: "ATIVO",
        categorySlug: "sapatos",
        location: "São José dos Campos, SP",
        images: ["/images/pranchas/prancha4.png#sprite=6"],
    },
    {
        key: "p5-1",
        sellerKey: "joao",
        title: "Air fryer compacta",
        description: "Air fryer compacta em bom estado, prática para cozinhas com pouco espaço.",
        price: 230,
        type: "VENDA",
        condition: "USADO_BOM_ESTADO",
        status: "ATIVO",
        categorySlug: "outros",
        location: "Mooca, São Paulo, SP",
        images: ["/images/pranchas/prancha5.png#sprite=1"],
    },
    {
        key: "p5-2",
        sellerKey: "luana",
        title: "Batedeira planetária verde",
        description: "Batedeira planetária verde com aparência de pouco uso, pronta para ganhar espaço em outra cozinha.",
        price: 320,
        type: "VENDA",
        condition: "USADO_COMO_NOVO",
        status: "ATIVO",
        categorySlug: "outros",
        location: "Pinheiros, São Paulo, SP",
        images: ["/images/pranchas/prancha5.png#sprite=2"],
    },
    {
        key: "p5-3",
        sellerKey: "daniel",
        title: "Violão acústico",
        description: "Violão acústico em bom estado, reservado enquanto uma proposta de troca é avaliada.",
        price: null,
        type: "TROCA",
        condition: "USADO_BOM_ESTADO",
        status: "RESERVADO",
        categorySlug: "outros",
        location: "São José dos Campos, SP",
        images: ["/images/pranchas/prancha5.png#sprite=3"],
    },
    {
        key: "p5-4",
        sellerKey: "cristina",
        title: "Kit para yoga",
        description: "Kit novo para práticas de yoga. A doação já foi concluída e o anúncio permanece como histórico.",
        price: null,
        type: "DOACAO",
        condition: "NOVO",
        status: "CONCLUIDO",
        categorySlug: "outros",
        location: "Santos, SP",
        images: ["/images/pranchas/prancha5.png#sprite=4"],
    },
    {
        key: "p5-5",
        sellerKey: "paulo",
        title: "Caixa de transporte para pets",
        description: "Caixa de transporte para pets em bom estado, com estrutura conservada para deslocamentos seguros.",
        price: 180,
        type: "VENDA",
        condition: "USADO_BOM_ESTADO",
        status: "ATIVO",
        categorySlug: "outros",
        location: "Campinas, SP",
        images: ["/images/pranchas/prancha5.png#sprite=5"],
    },
    {
        key: "p5-6",
        sellerKey: "paulo",
        title: "Capacete para ciclismo",
        description: "Capacete novo para ciclismo, disponível para doação a quem possa utilizá-lo.",
        price: null,
        type: "DOACAO",
        condition: "NOVO",
        status: "ATIVO",
        categorySlug: "outros",
        location: "Campinas, SP",
        images: ["/images/pranchas/prancha5.png#sprite=6"],
    },
    {
        key: "p6-1",
        sellerKey: "joao",
        title: "Dom Casmurro",
        description: "Exemplar de Dom Casmurro em bom estado, pronto para seguir para a estante de outro leitor.",
        price: 35,
        type: "VENDA",
        condition: "USADO_BOM_ESTADO",
        status: "ATIVO",
        categorySlug: "livros",
        location: "Mooca, São Paulo, SP",
        images: ["/images/pranchas/prancha6.png#sprite=1"],
    },
    {
        key: "p6-2",
        sellerKey: "luana",
        title: "Memórias Póstumas de Brás Cubas",
        description: "Exemplar bem conservado de Memórias Póstumas de Brás Cubas, disponível para troca.",
        price: null,
        type: "TROCA",
        condition: "USADO_BOM_ESTADO",
        status: "ATIVO",
        categorySlug: "livros",
        location: "Pinheiros, São Paulo, SP",
        images: ["/images/pranchas/prancha6.png#sprite=2"],
    },
    {
        key: "p6-3",
        sellerKey: "maria",
        title: "O Cortiço",
        description: "Exemplar de O Cortiço com sinais de uso, completo e disponível para doação.",
        price: null,
        type: "DOACAO",
        condition: "USADO_ESTADO_REGULAR",
        status: "ATIVO",
        categorySlug: "livros",
        location: "Vila Madalena, São Paulo, SP",
        images: ["/images/pranchas/prancha6.png#sprite=3"],
    },
    {
        key: "p6-4",
        sellerKey: "cristina",
        title: "Vestido midi terracota",
        description: "Vestido midi em tom terracota, com aparência de pouco uso e caimento leve.",
        price: 95,
        type: "VENDA",
        condition: "USADO_COMO_NOVO",
        status: "ATIVO",
        categorySlug: "roupas",
        location: "Santos, SP",
        images: ["/images/pranchas/prancha6.png#sprite=4"],
    },
    {
        key: "p6-5",
        sellerKey: "paulo",
        title: "Camisa social azul-clara",
        description: "Camisa social azul-clara em bom estado, disponível para troca por outra peça.",
        price: null,
        type: "TROCA",
        condition: "USADO_BOM_ESTADO",
        status: "ATIVO",
        categorySlug: "roupas",
        location: "Campinas, SP",
        images: ["/images/pranchas/prancha6.png#sprite=5"],
    },
    {
        key: "p6-6",
        sellerKey: "maria",
        title: "Calça jeans reta azul",
        description: "Calça jeans reta azul em bom estado, uma peça básica para diferentes combinações.",
        price: 110,
        type: "VENDA",
        condition: "USADO_BOM_ESTADO",
        status: "ATIVO",
        categorySlug: "roupas",
        location: "Vila Madalena, São Paulo, SP",
        images: ["/images/pranchas/prancha6.png#sprite=6"],
    },
];

async function upsertCategories() {
    const categories = {};

    for (const category of CATEGORIES) {
        const created = await prisma.category.upsert({
            where: { slug: category.slug },
            update: {},
            create: category,
        });

        categories[category.slug] = created;
    }

    return categories;
}

async function ensureNotifications(users, items) {
    const notifications = [
        {
            userKey: "maria",
            itemKey: "cadeira",
            message: "João Souza curtiu seu item Cadeira de Madeira Estilo Søborg Anos 50.",
        },
        {
            userKey: "maria",
            itemKey: "cadeira",
            message: "João Souza enviou uma mensagem sobre a Cadeira de Madeira Estilo Søborg Anos 50.",
        },
        {
            userKey: "maria",
            itemKey: "tenis-adidas",
            message: "Seu item Tênis Adidas Pink foi publicado com sucesso.",
        },
        {
            userKey: "luana",
            itemKey: "colecao-livros",
            message: "Sua coleção de livros já está visível na vitrine.",
        },
    ];

    for (const notification of notifications) {
        const userId = users[notification.userKey].id;
        const itemId = items[notification.itemKey].id;
        const existing = await prisma.notification.findFirst({
            where: { userId, itemId, message: notification.message },
        });

        if (!existing) {
            await prisma.notification.create({
                data: { userId, itemId, message: notification.message },
            });
        }
    }
}

async function ensureConversation({ item, buyer, seller, messages }) {
    const conversation = await prisma.conversation.upsert({
        where: {
            itemId_buyerId: {
                itemId: item.id,
                buyerId: buyer.id,
            },
        },
        update: {},
        create: {
            itemId: item.id,
            buyerId: buyer.id,
            sellerId: seller.id,
        },
    });

    for (const message of messages) {
        const sender = message.sender === "buyer" ? buyer : seller;
        const existing = await prisma.message.findFirst({
            where: {
                conversationId: conversation.id,
                senderId: sender.id,
                content: message.content,
            },
        });

        if (!existing) {
            await prisma.message.create({
                data: {
                    conversationId: conversation.id,
                    senderId: sender.id,
                    content: message.content,
                },
            });
        }
    }
}

async function main() {
    const categoriesOnly = process.argv.includes("--categories-only");
    const seedPassword = process.env.SEED_PASSWORD;

    if (!categoriesOnly && (!seedPassword || seedPassword.length < 8)) {
        throw new Error("Defina SEED_PASSWORD com pelo menos 8 caracteres antes de executar o seed.");
    }

    console.log("Seed: garantindo categorias...");
    const categories = await upsertCategories();

    if (categoriesOnly) {
        console.log("Seed de categorias concluído com sucesso.");
        return;
    }

    console.log("Seed: garantindo usuários demonstrativos...");
    const passwordHash = await bcrypt.hash(seedPassword, 10);
    const users = {};

    for (const user of DEMO_USERS) {
        const { key, ...data } = user;
        users[key] = await prisma.user.upsert({
            where: { email: data.email },
            update: data,
            create: { ...data, passwordHash },
        });
    }

    console.log("Seed: garantindo itens demonstrativos...");
    const items = {};

    for (const itemData of ITEMS) {
        const {
            key,
            sellerKey,
            categorySlug,
            images,
            legacyTitles = [],
            ...data
        } = itemData;
        const sellerId = users[sellerKey].id;
        const existing = await prisma.item.findFirst({
            where: {
                sellerId,
                title: { in: [data.title, ...legacyTitles] },
            },
        });

        if (existing) {
            items[key] = await prisma.item.update({
                where: { id: existing.id },
                data: {
                    ...data,
                    sellerId,
                    categoryId: categories[categorySlug].id,
                    images: {
                        deleteMany: {},
                        create: images.map((url, position) => ({ url, position })),
                    },
                },
            });
            continue;
        }

        items[key] = await prisma.item.create({
            data: {
                ...data,
                sellerId,
                categoryId: categories[categorySlug].id,
                images: {
                    create: images.map((url, position) => ({ url, position })),
                },
            },
        });
    }

    console.log("Seed: garantindo notificações demonstrativas...");
    await ensureNotifications(users, items);

    console.log("Seed: garantindo conversas demonstrativas...");
    await ensureConversation({
        item: items.cadeira,
        buyer: users.joao,
        seller: users.maria,
        messages: [
            { sender: "buyer", content: "Oi, Maria! A cadeira ainda está disponível?" },
            { sender: "seller", content: "Oi, João! Está sim, ainda em ótimo estado :)" },
            { sender: "buyer", content: "Perfeito, posso retirar na Vila Madalena no sábado?" },
        ],
    });

    await ensureConversation({
        item: items["camera-vintage"],
        buyer: users.cristina,
        seller: users.maria,
        messages: [
            { sender: "buyer", content: "Olá! A câmera acompanha alça e estojo?" },
            { sender: "seller", content: "Acompanha a alça original. Posso incluir um estojo simples também." },
        ],
    });

    console.log("Seed concluído com sucesso.");
}

main()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
