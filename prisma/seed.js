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

async function main() {
    console.log("Seed: criando categorias...");

    const categories = {};

    for (const category of CATEGORIES) {
        const created = await prisma.category.upsert({
            where: { slug: category.slug },
            update: {},
            create: category,
        });

        categories[category.slug] = created;
    }

    console.log("Seed: criando usuários...");

    const senhaPadrao = await bcrypt.hash("reuse123", 10);

    const maria = await prisma.user.upsert({
        where: { email: "maria.silva@email.com" },
        update: {},
        create: {
            name: "Maria Silva",
            email: "maria.silva@email.com",
            passwordHash: senhaPadrao,
            location: "São Paulo, SP",
            bio: "Sou mãe da Beatriz e do Pedro. Quero um futuro mais sustentável para os meus netos, e acredito que temos que consumir com mais consciência. Reutilizar as coisas nos aproxima mais dessa meta. Hoje tenho praticado mais o desapego e focado mais em realizar trocas que fazem produtos usados circular.",
            avatarUrl: "/images/perfil/maria-silva.png",
            rating: 4.8,
        },
    });

    const joao = await prisma.user.upsert({
        where: { email: "joao.souza@email.com" },
        update: {},
        create: {
            name: "João Souza",
            email: "joao.souza@email.com",
            passwordHash: senhaPadrao,
            location: "São Paulo, SP",
            bio: "Interessado em achar peças com história e dar novo uso a itens que ainda têm valor.",
            avatarUrl: "/images/perfil/avatar.png",
            rating: 4.5,
        },
    });

    console.log("Seed: criando itens...");

    const itemsData = [
        {
            title: "Cadeira de Madeira Estilo Søborg Anos 50",
            description:
                "Cadeira Estilo Søborg, inspirada no modelo original dinamarquês dos anos 1950. Toda de madeira maciça com acabamentos excelentes.\n\nAceito trocas por outros móveis também.\n\nDisponível para retirada na Vila Madalena - SP.",
            price: 490,
            type: "VENDA",
            condition: "USADO_BOM_ESTADO",
            categorySlug: "moveis",
            location: "Vila Madalena, SP",
            images: [
                "/images/itens/cadeira.png",
                "/images/itens/cadeira-2.png",
                "/images/itens/cadeira-3.jpg",
            ],
        },
        {
            title: "Teclado gamer",
            description:
                "Teclado gamer usado, em bom estado de conservação e funcionando perfeitamente. Ideal para jogos e uso no dia a dia.",
            price: null,
            type: "DOACAO",
            condition: "USADO_BOM_ESTADO",
            categorySlug: "eletronicos",
            location: "São Paulo, SP",
            images: [
                "/images/itens/teclado.jpg",
                "/images/itens/teclado-2.jpg",
            ],
        },
        {
            title: "Câmera vintage",
            description:
                "Câmera vintage usada, em bom estado de conservação e funcionando perfeitamente. Ideal para quem gosta de fotografia e procura um equipamento com estilo clássico.",
            price: 500,
            type: "VENDA",
            condition: "USADO_BOM_ESTADO",
            categorySlug: "eletronicos",
            location: "São Paulo, SP",
            images: [
                "/images/itens/camera-vintage.jpg",
                "/images/itens/camera-vintage-2.jpg",
            ],
        },
        {
            title: "Iphone 17",
            description:
                "iPhone 17 usado, em ótimo estado de conservação e funcionando perfeitamente. Ideal para uso no dia a dia, com bom desempenho para fotos, vídeos e aplicativos.",
            price: 3200,
            type: "VENDA",
            condition: "USADO_COMO_NOVO",
            categorySlug: "eletronicos",
            location: "São Paulo, SP",
            images: [
                "/images/itens/iphone-17.jpg",
                "/images/itens/iphone-17-2.jpg",
                "/images/itens/iphone-17-3.jpg",
            ],
        },
        {
            title: "Jaqueta de couro",
            description:
                "Jaqueta de couro usada, tamanho 40, em bom estado de conservação. Uma peça versátil e atemporal, ideal para complementar diferentes looks.",
            price: null,
            type: "TROCA",
            condition: "USADO_BOM_ESTADO",
            categorySlug: "roupas",
            location: "São Paulo, SP",
            images: ["/images/itens/jaqueta.jpg"],
        },
        {
            title: "Tênis Adidas Pink",
            description:
                "Tênis Adidas Pink usado, em bom estado de conservação e confortável para o uso no dia a dia. Ideal para quem procura um modelo casual e estiloso.",
            price: 220,
            type: "VENDA",
            condition: "USADO_BOM_ESTADO",
            categorySlug: "sapatos",
            location: "São Paulo, SP",
            images: ["/images/itens/tenis-adidas.png"],
        },
    ];

    const createdItems = [];

    for (const data of itemsData) {
        const existing = await prisma.item.findFirst({
            where: { title: data.title, sellerId: maria.id },
        });

        if (existing) {
            createdItems.push(existing);
            continue;
        }

        const item = await prisma.item.create({
            data: {
                title: data.title,
                description: data.description,
                price: data.price,
                type: data.type,
                condition: data.condition,
                location: data.location,
                sellerId: maria.id,
                categoryId: categories[data.categorySlug].id,
                images: {
                    create: data.images.map((url, index) => ({
                        url,
                        position: index,
                    })),
                },
            },
        });

        createdItems.push(item);
    }

    console.log("Seed: criando notificações...");

    await prisma.notification.deleteMany({ where: { userId: maria.id } });

    await prisma.notification.createMany({
        data: [
            {
                userId: maria.id,
                message: "João Souza curtiu seu item Cadeira de Madeira Estilo Søborg Anos 50.",
                itemId: createdItems[0].id,
            },
            {
                userId: maria.id,
                message: "João Souza enviou uma mensagem sobre a Cadeira de Madeira Estilo Søborg Anos 50.",
                itemId: createdItems[0].id,
            },
            {
                userId: maria.id,
                message: "Seu item Tênis Adidas Pink foi publicado com sucesso.",
                itemId: createdItems[5].id,
            },
        ],
    });

    console.log("Seed: criando conversa de exemplo...");

    const conversation = await prisma.conversation.upsert({
        where: {
            itemId_buyerId: {
                itemId: createdItems[0].id,
                buyerId: joao.id,
            },
        },
        update: {},
        create: {
            itemId: createdItems[0].id,
            buyerId: joao.id,
            sellerId: maria.id,
        },
    });

    const existingMessages = await prisma.message.count({
        where: { conversationId: conversation.id },
    });

    if (existingMessages === 0) {
        await prisma.message.createMany({
            data: [
                {
                    conversationId: conversation.id,
                    senderId: joao.id,
                    content: "Oi, Maria! A cadeira ainda está disponível?",
                },
                {
                    conversationId: conversation.id,
                    senderId: maria.id,
                    content: "Oi, João! Está sim, ainda em ótimo estado :)",
                },
                {
                    conversationId: conversation.id,
                    senderId: joao.id,
                    content: "Perfeito, posso retirar na Vila Madalena no sábado?",
                },
            ],
        });
    }

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
