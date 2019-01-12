import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConfigService } from '../../app-config.service';
import { observable } from 'rxjs';

@Injectable()
export class ShareService {

  constructor(protected httpClient: HttpClient, protected appConfigSrv: AppConfigService) {

  }//constructor

  viewShare(id: string, pwd?: string) {
    let data = {
      id: id,
      password: pwd
    };
    return this.httpClient.post(`${this.appConfigSrv.appConfig.server}/MediaShare/ViewShare`, data, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), observe: 'response' });
  }//getById
}
