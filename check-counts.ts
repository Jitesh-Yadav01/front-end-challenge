import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkData() {
  const userCount = await prisma.user.count();
  const productCount = await prisma.product.count();
  const orderCount = await prisma.order.count();
  
  console.log({
    users: userCount,
    products: productCount,
    orders: orderCount
  });
}

checkData()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
