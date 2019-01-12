import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { map, switchMap } from 'rxjs/operators';
import { OrderDetail } from '../../models/order-detail';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss']
})
export class OrderDetailComponent implements OnInit {

  orderNo: string;
  customerName: string;
  customerAddress: string;
  customerPhone: string;
  totalNum: number = 0;
  totalPrice: number = 0;
  orderDetails: Array<OrderDetail> = [];
  constructor(protected route: ActivatedRoute, protected orderSrv: OrderService) {

  }//constructor

  ngOnInit() {
    this.route.queryParams
      .pipe(map(parm => parm['order']))
      .pipe(switchMap(id => this.orderSrv.getById(id)))
      .subscribe(res => {
        if (!res) return;
        this.orderNo = res.orderNo;
        this.totalNum = res.totalNum;
        this.totalPrice = res.totalPrice;
        this.customerName = res.customerName;
        this.customerAddress = res.customerAddress;
        this.customerPhone = res.customerPhone;
        this.orderDetails = res.orderDetails ? res.orderDetails : [];
        // console.log(1, res);
      });
  }//ngOnInit

}
