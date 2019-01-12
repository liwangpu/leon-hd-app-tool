import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from '../../app-config.service';
import { Account } from '../models/account';

@Injectable()
export class AccountService {

  constructor(protected httpClient: HttpClient, protected appConfigSrv: AppConfigService) {

  }//constructor

  getById(id?: string) {
    return this.httpClient.get<Account>(`${this.appConfigSrv.appConfig.server}/Account/${id}`)
  }//getById
}
