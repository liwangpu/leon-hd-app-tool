import { Component, OnInit, Input } from '@angular/core';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-qrcode',
  templateUrl: './qrcode.component.html',
  styleUrls: ['./qrcode.component.scss']
})
export class QrcodeComponent implements OnInit {

  private _size = 64;
  private extensionUrl = '/assets/extensions/qrcode/qrcode.html';
  containerStyle = { width: '64px', height: '64px' };
  @Input() set size(val: number) {
    this._size = val > 0 ? val : 64;
    this.containerStyle = {
      width: `${this._size}px`,
      height: `${this._size}px`
    };
  }
  get size(): number {
    return this._size;
  }
  @Input() set content(val: string) {
    if (val) {
      let text = encodeURIComponent(val);
      let src = `${this.extensionUrl}?size=${this.size}&text=${text}`;
      this.qrcodeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(src);
    }
  }
  qrcodeUrl: SafeResourceUrl;
  constructor(protected sanitizer: DomSanitizer) { }

  ngOnInit() {
    // if (this.content) {
    //   let text = encodeURIComponent(this.content);
    //   console.log(1, text);
    // }
  }//ngOnInit

}
