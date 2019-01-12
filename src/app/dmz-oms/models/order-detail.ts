export class OrderDetail {
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
    productSpecId: string;
    num: number;
    unitPrice: number;
    totalPrice: number;
    remark: string;
    orderDetailStateId: number;
    productName: string;
    productUnit: string;
    productDescription: string;
    productSpecName: string;
    attachmentIds: string;
    attachments: Array<{ id: string, name: string, url: string }>;
}

