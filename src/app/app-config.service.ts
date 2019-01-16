import { Injectable, Injector, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { AppConfig } from './app-config';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AppConfigService {

  static _AppConfig: AppConfig;

  appConfig: AppConfig;

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private injector: Injector) { }

  loadAppConfig() {

    let browserMode = isPlatformBrowser(this.platformId);
    if (browserMode) {
      let http = this.injector.get(HttpClient);
      return http.get('/assets/app-config.json').pipe(tap((data: any) => {
        this.appConfig = data;
        AppConfigService._AppConfig = data;
      })).toPromise();
    }
    else {
      this.appConfig = new AppConfig();
      AppConfigService._AppConfig = this.appConfig;
      return Promise.resolve();
    }
  }//loadAppConfig

}
