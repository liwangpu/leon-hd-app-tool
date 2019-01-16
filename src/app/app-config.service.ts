import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from './app-config';

@Injectable({
  providedIn: 'root'
})
export class AppConfigService {

  static _AppConfig: AppConfig;

  appConfig: AppConfig;

  constructor(private injector: Injector) { }

  loadAppConfig() {
    let http = this.injector.get(HttpClient);

    return http.get('/assets/app-config.json')
      .toPromise()
      .then((data: any) => {
        this.appConfig = data;
        AppConfigService._AppConfig = data;
      });
  }//loadAppConfig

}
