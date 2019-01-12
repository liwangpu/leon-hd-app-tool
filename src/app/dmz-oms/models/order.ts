import { OrderDetail } from './order-detail';

export class Order {
    id: string;
    name: string;
    icon: string;
    description: string;
    creator: string;
    modifier: string;
    createdTime: string;
    modifiedTime: string;
    creatorName: string;
    modifiedName: string;
    activeFlag: number;
    orderNo: string;
    orderDetails: Array<OrderDetail>;
}
