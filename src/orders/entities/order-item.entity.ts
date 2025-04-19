import { Decimal } from '@prisma/client/runtime/library';

export class OrderItem {
  pizza_id: string;
  pizza_name: string;
  unit_price: Decimal;
  quantity: number;
  total_price: Decimal;
}
