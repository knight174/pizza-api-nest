import { OrderItem } from './order-item.entity';

export class Order {
  totalPrice: number;
  name: string;
  phone: string;
  address: string;
  orderItems: OrderItem[];
}
