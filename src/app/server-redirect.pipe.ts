import { Pipe, PipeTransform } from '@angular/core';
import { AppConfigService } from './app-config.service';

@Pipe({
  name: 'serverRedirect'
})
export class ServerRedirectPipe implements PipeTransform {

  constructor(protected appConfigSrv: AppConfigService) {
  }//constructor
  
  transform(value: any, args?: any): any {
    if (value && args) {
      let fname = value.substring(0, value.lastIndexOf('.'));
      let extension = value.substring(value.lastIndexOf('.'), (value as string).length);
      return `${this.appConfigSrv.appConfig.server}/${fname}_${args}${extension}`;
    }
    return `${this.appConfigSrv.appConfig.server}/${value}`;
  }

}
