import { OrderDetail } from './order-detail';

export class Order {
    id: string;
    name: string;
    totalNum: number;
    totalPrice: number;
    orderNo: string;
    orderState: string;
    orderStateName: string;
    customerName: string;
    customerAddress: string;
    customerPhone: string;
    orderDetails: Array<OrderDetail>;
}
