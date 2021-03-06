import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'app-main'
    , loadChildren: './app-main/app-main.module#AppMainModule'
  }
  , {
    path: 'app-tool'
    , loadChildren: './app-tool/app-tool.module#AppToolModule'
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
