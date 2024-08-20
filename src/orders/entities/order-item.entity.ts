import { Decimal } from '@prisma/client/runtime/library';

export class OrderItem {
  pizzaId: string;
  pizzaName: string;
  unitPrice: Decimal;
  quantity: number;
  totalPrice: Decimal;
}
