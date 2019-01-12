import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { tap } from "rxjs/operators";
import { AppConfig } from './app-config';

@Injectable({
  providedIn: 'root'
})
export class AppConfigService {

  appConfig: AppConfig;
  constructor(protected httpClient: HttpClient) {
  }//constructor

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    if (this.appConfig)
      return of(this.appConfig);
    return this.httpClient.get<AppConfig>('/assets/app-config.json').pipe(tap((config: AppConfig) => {

      //服务器地址以/结尾,需要去掉,不然对services产生影响
      if (config.server && config.server.lastIndexOf('/') == config.server.length - 1) {
        config.server = config.server.slice(0, config.server.length - 1);
      }
      this.appConfig = config;
    }));
  }//resolve


}
