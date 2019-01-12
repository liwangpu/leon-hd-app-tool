import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { OrderDetail } from '../../models/order-detail';
import { OrderService } from '../../services/order.service';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-order-viewer',
  templateUrl: './order-viewer.component.html',
  styleUrls: ['./order-viewer.component.scss']
})
export class OrderViewerComponent implements OnInit {

  showFurnitureList = false;
  totalPrice: number = 0;
  orderDetails: Array<OrderDetail> = [];
  @ViewChild('a4Ct') a4Ct: ElementRef;
  constructor(protected route: ActivatedRoute, protected orderSrv: OrderService, protected renderer2: Renderer2) {

  }//constructor

  ngOnInit() {
    this.route.queryParams
      .pipe(map(parm => parm['order']))
      .pipe(switchMap(id => this.orderSrv.getById(id)))
      .subscribe(res => {
        if (!res) return;
        this.totalPrice = res.totalPrice;
        this.orderDetails = res.orderDetails ? res.orderDetails : [];
        // console.log(1, res);
      });
  }//ngOnInit

  toggleFurnitureList() {
    this.showFurnitureList = !this.showFurnitureList;
  }//toggleFurnitureList

  /*
   * 打印材料清单
   */
  printBOM() {
    if (!window || !window.print) return;
    this.showFurnitureList = true;
    let list1 = this.a4Ct.nativeElement.querySelectorAll('.sensitive');
    for (let it of list1)
      this.renderer2.addClass(it, 'actived');
    let list2 = this.a4Ct.nativeElement.querySelectorAll('.hidden-in-bom');
    for (let it of list2)
      this.renderer2.addClass(it, 'actived');
    window.print();
  }//printBOM 

  /*
   * 打印报价单 
   */
  printBILL() {
    if (!window || !window.print) return;
    this.showFurnitureList = true;
    let list1 = this.a4Ct.nativeElement.querySelectorAll('.sensitive');
    for (let it of list1)
      this.renderer2.removeClass(it, 'actived');
    let list2 = this.a4Ct.nativeElement.querySelectorAll('.hidden-in-bom');
    for (let it of list2)
      this.renderer2.removeClass(it, 'actived');
    window.print();
  }//printBILL

}
