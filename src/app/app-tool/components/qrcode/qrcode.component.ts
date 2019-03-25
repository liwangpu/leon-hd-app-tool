import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-qrcode',
  templateUrl: './qrcode.component.html',
  styleUrls: ['./qrcode.component.scss']
})
export class QrcodeComponent implements OnInit {

  private _size = 64;
  private extensionUrl = '/assets/extensions/qrcode/qrcode.html';
  containerStyle = { width: '64px', height: '64px' };
  set size(val: number) {
    this._size = val > 0 ? val : 64;
    this.containerStyle = {
      width: `${this._size}px`,
      height: `${this._size}px`
    };
  }
  get size(): number {
    return this._size;
  }
  set content(val: string) {
    if (val) {
      let text = encodeURIComponent(val);
      let src = `${this.extensionUrl}?size=${this.size}&text=${text}`;
      this.qrcodeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(src);
    }
  }
  qrcodeUrl: SafeResourceUrl;
  constructor(private acr: ActivatedRoute, protected sanitizer: DomSanitizer) {
    this.acr.queryParams.subscribe(query => {
      this.size = query['size'];
      this.content = query['content'];
    });
  }//constructor

  ngOnInit() {
  }

}
