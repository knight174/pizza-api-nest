/*
  Warnings:

  - Made the column `userId` on table `carts` required. This step will fail if there are existing NULL values in that column.
  - Made the column `pizzaId` on table `carts` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "carts" DROP CONSTRAINT "carts_pizzaId_fkey";

-- DropForeignKey
ALTER TABLE "carts" DROP CONSTRAINT "carts_userId_fkey";

-- 首先删除所有 pizzaId 为 NULL 的购物车记录
DELETE FROM "carts" WHERE "pizzaId" IS NULL;

-- AlterTable
ALTER TABLE "carts" ALTER COLUMN "userId" SET NOT NULL,
ALTER COLUMN "pizzaId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "carts" ADD CONSTRAINT "carts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "carts" ADD CONSTRAINT "carts_pizzaId_fkey" FOREIGN KEY ("pizzaId") REFERENCES "pizzas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
