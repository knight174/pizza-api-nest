import { OrderItem } from './order-item.entity';

export class Order {
  total_price: number;
  name: string;
  phone: string;
  address: string;
  order_items: OrderItem[];
}
