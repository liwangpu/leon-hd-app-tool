import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from '../../app-config.service';
import { NationalUrban } from '../models/national-urban';

@Injectable()
export class UrbanService {

  constructor(protected httpClient: HttpClient, protected appConfigSrv: AppConfigService) {

  }//constructor

  getProvinces(name?: string) {
    return this.httpClient.get<{ data: Array<NationalUrban> }>(`${this.appConfigSrv.appConfig.server}/NationalUrban?page=0&pageSize=999&search=${name ? name : ''}&nationalUrbanTypes=province`);
  }//getProvinces

  getById(id?: string) {
    return this.httpClient.get<NationalUrban>(`${this.appConfigSrv.appConfig.server}/NationalUrban/${id}`)
  }//getById

}
