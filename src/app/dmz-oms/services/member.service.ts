import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConfigService } from '../../app-config.service';

@Injectable()
export class MemberService {

  constructor(protected httpClient: HttpClient, protected appConfigSrv: AppConfigService) {

  }//constructor

  memberRegistry(data: any) {
    return this.httpClient.post(`${this.appConfigSrv.appConfig.server}/MemberRegistry`, data, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) });
  }//registry
}
