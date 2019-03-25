import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppToolRoutingModule } from './app-tool-routing.module';
import { QrcodeComponent } from './components/qrcode/qrcode.component';

@NgModule({
  declarations: [QrcodeComponent],
  imports: [
    CommonModule,
    AppToolRoutingModule
  ]
})
export class AppToolModule { }
