import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppMainRoutingModule } from './app-main-routing.module';
import { HomeComponent } from './components/home/home.component';

@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    AppMainRoutingModule
  ]
})
export class AppMainModule { }
