import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConfigService } from '../../app-config.service';

@Injectable()
export class FileAssetService {

  constructor(protected httpClient: HttpClient, protected appConfigSrv: AppConfigService) {

  }//constructor

  uploadAttachment(formData: FormData, header: HttpHeaders) {
    return this.httpClient.post(`${this.appConfigSrv.appConfig.server}/files/UploadAttachment`, formData, { headers: header });;
  }//uploadAttachment
}
