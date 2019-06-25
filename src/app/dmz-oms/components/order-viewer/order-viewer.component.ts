import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { OrderDetail } from '../../models/order-detail';
import { OrderService } from '../../services/order.service';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap, tap } from 'rxjs/operators';
import { AppConfigService } from '../../../app-config.service';
import { saveAs } from 'file-saver/FileSaver';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-order-viewer',
  templateUrl: './order-viewer.component.html',
  styleUrls: ['./order-viewer.component.scss']
})
export class OrderViewerComponent implements OnInit {

  private _currentOrderId: string;
  enableExportExcel = true;
  showFurnitureList = false;
  totalPrice: number = 0;
  orderDetails: Array<OrderDetail> = [];
  @ViewChild('a4Ct') a4Ct: ElementRef;
  constructor(protected route: ActivatedRoute, protected orderSrv: OrderService, protected renderer2: Renderer2, protected appConfigSrv: AppConfigService, protected httpClient: HttpClient) {

  }//constructor

  ngOnInit() {
    this.route.queryParams
      .pipe(map(parm => parm['order']))
      .pipe(tap(oid => this._currentOrderId = oid))
      .pipe(switchMap(id => this.orderSrv.getById(id)))
      .subscribe(res => {
        if (!res) return;
        this.totalPrice = res.totalPrice;
        this.orderDetails = res.orderDetails ? res.orderDetails : [];
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

  exportExcel() {
    if (!this.enableExportExcel) return;
    this.enableExportExcel = false;
    let api = encodeURIComponent(this.appConfigSrv.appConfig.server);
    let excelUrl = `${this.appConfigSrv.appConfig.omsToolServer}/dmz/oms/norya/order2excel?orderId=${this._currentOrderId}&server=${api}`;
    this.httpClient.get(excelUrl, { responseType: 'blob' }).subscribe(fs => {
      saveAs(fs, 'Order Detail.xlsx');
      this.enableExportExcel = true;
    }, err => {
      console.error("导出表格出现异常:", err);
      this.enableExportExcel = true;
    });
  }//exportExcel

}
