import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const pizza1 = await prisma.pizza.create({
    data: {
      name: 'Pizza 1',
      price: 10,
      discount: 0.6,
      sales: 10,
      size: 8,
      tag: 'discount',
    },
  });

  const pizza2 = await prisma.pizza.create({
    data: {
      name: 'Pizza 2',
      price: 18,
      discount: 0.8,
      sales: 12,
      size: 16,
      tag: 'set',
    },
  });

  const pizza3 = await prisma.pizza.create({
    data: {
      name: 'Pizza 3',
      price: 21,
      discount: 0.7,
      sales: 20,
      size: 10,
      tag: 'classic',
    },
  });

  console.log({ pizza1, pizza2, pizza3 });
}

// execute the main function
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // close Prisma Client at the end
    await prisma.$disconnect();
  });
