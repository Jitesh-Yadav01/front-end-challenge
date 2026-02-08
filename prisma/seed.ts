import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  await prisma.user.createMany({
    data: [
      {
        email: 'manager@slooze.xyz',
        name: 'Jitesh Yadav',
        role: 'manager',
        password: 'password',
      },
      {
        email: 'store@slooze.xyz',
        name: 'Jitesh Yadav',
        role: 'store_keeper',
        password: 'password',
      },
    ],
  });

 
  const productsData = [
    { name: 'Premium Coffee Beans', category: 'Beverages', price: 45.0, quantity: 120, status: 'In Stock' },
    { name: 'Organic Green Tea', category: 'Beverages', price: 22.5, quantity: 50, status: 'Low Stock' },
    { name: 'Raw Honey - 500g', category: 'Pantry', price: 18.0, quantity: 0, status: 'Out of Stock' },
    { name: 'Almond Milk', category: 'Dairy Alt', price: 5.0, quantity: 200, status: 'In Stock' },
    { name: 'Whole Wheat Flour', category: 'Pantry', price: 8.5, quantity: 45, status: 'Low Stock' },
    { name: 'Dark Chocolate', category: 'Snacks', price: 12.0, quantity: 80, status: 'In Stock' },
    { name: 'Olive Oil', category: 'Pantry', price: 25.0, quantity: 30, status: 'Low Stock' },
    { name: 'Basmati Rice', category: 'Grains', price: 30.0, quantity: 150, status: 'In Stock' },
  ];

  for (const p of productsData) {
    await prisma.product.create({ data: p });
  }

  const allProducts = await prisma.product.findMany();

  const months = 6;
  const now = new Date();
  
  for (let i = 0; i < 50; i++) { 
    const randomDaysAgo = Math.floor(Math.random() * (months * 30));
    const date = new Date(now.getTime() - randomDaysAgo * 24 * 60 * 60 * 1000);
    
    const numItems = Math.floor(Math.random() * 3) + 1;
    const orderItemsData = [];
    let total = 0;

    for (let j = 0; j < numItems; j++) {
        const product = allProducts[Math.floor(Math.random() * allProducts.length)];
        const qty = Math.floor(Math.random() * 3) + 1;
        const price = product.price;   
        total += price * qty;
        orderItemsData.push({
            productId: product.id,
            quantity: qty,
            price: price
        });
    }

    await prisma.order.create({
        data: {
            createdAt: date,
            total: total,
            status: 'completed',
            items: {
                create: orderItemsData
            }
        }
    });
  }

  console.log('Seeding finished.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
