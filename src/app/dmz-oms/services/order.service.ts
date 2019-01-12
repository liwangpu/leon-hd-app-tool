import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from '../../app-config.service';
import { Order } from '../models/order';
import { of } from 'rxjs';

@Injectable()
export class OrderService {

  constructor(protected httpClient: HttpClient, protected appConfigSrv: AppConfigService) {

  }//constructor

  getById(id: string) {
    if (!id)
      return of(null);
    return this.httpClient.get<Order>(`${this.appConfigSrv.appConfig.server}/orders/${id}`)
  }//getById

}
