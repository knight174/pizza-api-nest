/*
  Warnings:

  - A unique constraint covering the columns `[pizzaId,userId]` on the table `carts` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "carts_pizzaId_userId_idx";

-- CreateIndex
CREATE UNIQUE INDEX "carts_pizzaId_userId_key" ON "carts"("pizzaId", "userId");
