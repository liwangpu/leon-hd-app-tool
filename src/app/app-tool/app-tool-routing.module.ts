import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { QrcodeComponent } from './components/qrcode/qrcode.component';

const routes: Routes = [
  {
    path: 'qrcode',
    component: QrcodeComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppToolRoutingModule { }
