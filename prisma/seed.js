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
        location: "São Paulo, SP",
        bio: "Sou mãe da Beatriz e do Pedro. Quero um futuro mais sustentável para os meus netos, e acredito que temos que consumir com mais consciência. Reutilizar as coisas nos aproxima mais dessa meta. Hoje tenho praticado mais o desapego e focado mais em realizar trocas que fazem produtos usados circular.",
        avatarUrl: "/images/perfil/maria-silva.png",
        rating: 4.8,
    },
    {
        key: "joao",
        name: "João Souza",
        email: "joao.souza@email.com",
        location: "São Paulo, SP",
        bio: "Interessado em achar peças com história e dar novo uso a itens que ainda têm valor.",
        avatarUrl: "/images/perfil/avatar-padrao.png",
        rating: 4.5,
    },
    {
        key: "luana",
        name: "Luana Maranhão",
        email: "luana.maranhao@email.com",
        location: "Recife, PE",
        bio: "Leitora, fotógrafa amadora e adepta do consumo consciente. Gosto de circular livros e objetos que possam ganhar novas histórias.",
        avatarUrl: "/images/avatars/luana-maranhao.jpg",
        rating: 4.9,
    },
    {
        key: "paulo",
        name: "Paulo Silva",
        email: "paulo.silva@email.com",
        location: "Campinas, SP",
        bio: "Estudante de tecnologia em busca de trocas úteis e equipamentos bem conservados.",
        avatarUrl: "/images/avatars/paulo-silva.jpg",
        rating: 4.6,
    },
    {
        key: "cristina",
        name: "Cristina Martins",
        email: "cristina.martins@email.com",
        location: "Niterói, RJ",
        bio: "Apaixonada por moda circular e por encontrar novos donos para peças que ainda têm muito uso pela frente.",
        avatarUrl: "/images/avatars/cristina-martins.jpg",
        rating: 4.7,
    },
    {
        key: "daniel",
        name: "Daniel Matos",
        email: "daniel.matos@email.com",
        location: "Belo Horizonte, MG",
        bio: "Garimpo móveis e objetos para casa. Prefiro recuperar, trocar e reutilizar antes de comprar algo novo.",
        avatarUrl: "/images/avatars/daniel-matos.jpg",
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
        location: "Vila Madalena, SP",
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
        location: "São Paulo, SP",
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
        location: "São Paulo, SP",
        images: ["/images/itens/camera-vintage.jpg"],
    },
    {
        key: "iphone",
        sellerKey: "maria",
        title: "iPhone 17",
        description:
            "iPhone 17 usado, em ótimo estado de conservação e funcionando perfeitamente. Ideal para uso no dia a dia, com bom desempenho para fotos, vídeos e aplicativos.",
        price: 3200,
        type: "VENDA",
        condition: "USADO_COMO_NOVO",
        status: "ATIVO",
        categorySlug: "eletronicos",
        location: "São Paulo, SP",
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
        location: "São Paulo, SP",
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
        location: "São Paulo, SP",
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
        location: "Recife, PE",
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
        location: "Belo Horizonte, MG",
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
        location: "Niterói, RJ",
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
        location: "Recife, PE",
        images: ["/images/promo/fotografia.jpg"],
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
            update: {},
            create: { ...data, passwordHash },
        });
    }

    console.log("Seed: garantindo itens demonstrativos...");
    const items = {};

    for (const itemData of ITEMS) {
        const { key, sellerKey, categorySlug, images, ...data } = itemData;
        const sellerId = users[sellerKey].id;
        const existing = await prisma.item.findFirst({
            where: { title: data.title, sellerId },
        });

        if (existing) {
            items[key] = existing;
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
