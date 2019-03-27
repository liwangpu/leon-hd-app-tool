import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { ShareService } from '../../services/share.service';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap, tap } from 'rxjs/operators';
import { AppConfigService } from '../../../app-config.service';
import { DomSanitizer, SafeResourceUrl, } from '@angular/platform-browser';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-share',
  templateUrl: './share.component.html',
  styleUrls: ['./share.component.scss']
})
export class ShareComponent implements OnInit {

  shareId: string;
  needPwd = false;
  password: string;
  errpassword = false;
  errpasswordTimeInt: any;
  showDialog = false;
  panoramaUrl: SafeResourceUrl;
  constructor(@Inject(PLATFORM_ID) platformId: Object, protected route: ActivatedRoute, protected shareSrv: ShareService, protected configSrv: AppConfigService, protected sanitizer: DomSanitizer) {

    if (isPlatformBrowser(platformId)) {
      this.route.queryParams
        .pipe(map(parm => parm['id']))
        .pipe(tap(id => this.shareId = id))
        .pipe(switchMap(id => this.shareSrv.viewShare(id))).subscribe(res => {
          this.viewPanorama(res.body['fileAssetUrl']);
        }, err => {
          if (err.status == 403) {
            this.needPwd = true;
          }
          else {
            //资源不存在或者过期
            this.needPwd = false;
          }
          this.showDialog = true;
        });
    }//if
  }//constructor

  ngOnInit() {

  }//ngOnInit

  view() {
    if (!this.password) return;
    this.shareSrv.viewShare(this.shareId, this.password).subscribe(res => {
      this.viewPanorama(res.body['fileAssetUrl']);
    }, err => {
      this.showErrorPwd();
    });
  }//view

  showErrorPwd() {
    this.errpassword = true;
    if (this.errpasswordTimeInt)
      clearTimeout(this.errpasswordTimeInt);
    this.errpasswordTimeInt = setTimeout(() => {
      this.errpassword = false;
    }, 3000);
  }//showErrorPwd

  viewPanorama(furl) {
    this.showDialog = false;
    this.panoramaUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`/assets/extensions/panorama/panorama.html?url=${this.configSrv.appConfig.server}${furl}`);
  }//viewPanorama

}
