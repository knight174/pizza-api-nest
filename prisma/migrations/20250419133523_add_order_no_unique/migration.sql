/*
  Warnings:

  - A unique constraint covering the columns `[order_no]` on the table `orders` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "orders_order_no_key" ON "orders"("order_no");
