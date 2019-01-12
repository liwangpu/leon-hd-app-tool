import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DmzHdRoutingModule } from './dmz-hd-routing.module';
import { ShareComponent } from './components/share/share.component';
import { ShareService } from './services/share.service';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [ShareComponent],
  imports: [
    CommonModule,
    FormsModule,
    DmzHdRoutingModule
  ],
  providers: [
    ShareService
  ]
})
export class DmzHdModule { }
