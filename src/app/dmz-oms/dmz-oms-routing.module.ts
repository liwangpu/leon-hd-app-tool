import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MemberInviteComponent } from './components/member-invite/member-invite.component';
import { OrderViewerComponent } from './components/order-viewer/order-viewer.component';
import { OrderDetailComponent } from './components/order-detail/order-detail.component';

const routes: Routes = [
  {
    path: 'member-invite'
    , component: MemberInviteComponent
  }
  , {
    path: 'order-viewer'
    , component: OrderViewerComponent
  }
  , {
    path: 'order-detail'
    , component: OrderDetailComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DmzOmsRoutingModule { }
