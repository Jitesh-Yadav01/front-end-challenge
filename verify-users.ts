import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkUsers() {
  const users = await prisma.user.findMany({
    where: {
      email: {
        in: ['manager@slooze.xyz', 'store@slooze.xyz']
      }
    },
    select: { email: true, role: true, password: true }
  });
  console.log('Verified Users:', JSON.stringify(users, null, 2));
}

checkUsers()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
