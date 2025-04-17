import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Classic Pizzas
  await prisma.pizza.create({
    data: {
      name: '玛格丽特披萨',
      price: 15,
      discount: 1,
      sales: 100,
      size: 12,
      tag: 'classic',
    },
  });

  await prisma.pizza.create({
    data: {
      name: '夏威夷披萨',
      price: 18,
      discount: 1,
      sales: 80,
      size: 12,
      tag: 'classic',
    },
  });

  // Discount Pizzas
  await prisma.pizza.create({
    data: {
      name: '素食主义者披萨',
      price: 20,
      discount: 0.8,
      sales: 45,
      size: 10,
      tag: 'discount',
    },
  });

  await prisma.pizza.create({
    data: {
      name: '香辣鸡肉披萨',
      price: 22,
      discount: 0.7,
      sales: 60,
      size: 14,
      tag: 'discount',
    },
  });

  // Set Menu Pizzas
  await prisma.pizza.create({
    data: {
      name: '海鲜至尊披萨',
      price: 25,
      discount: 0.9,
      sales: 30,
      size: 16,
      tag: 'set',
    },
  });

  await prisma.pizza.create({
    data: {
      name: '肉食狂欢披萨',
      price: 28,
      discount: 0.85,
      sales: 40,
      size: 16,
      tag: 'set',
    },
  });

  console.log('Seed data has been inserted');
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
