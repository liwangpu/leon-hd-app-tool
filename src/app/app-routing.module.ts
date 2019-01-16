import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppConfigService } from './app-config.service';

const routes: Routes = [
  {
    path: 'app-main'
    , loadChildren: './app-main/app-main.module#AppMainModule'
  }
  , {
    path: 'dmz-hd'
    , loadChildren: './dmz-hd/dmz-hd.module#DmzHdModule'
  }
  , {
    path: 'dmz-oms'
    , loadChildren: './dmz-oms/dmz-oms.module#DmzOmsModule'
  }
  , { path: '**', redirectTo: 'app-main/home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
