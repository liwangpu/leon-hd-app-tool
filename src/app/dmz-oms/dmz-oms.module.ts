import { NgModule, APP_INITIALIZER } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DmzOmsRoutingModule } from './dmz-oms-routing.module';
import { MatFormFieldModule, MatInputModule, MatButtonModule, MatBottomSheetModule, MatAutocompleteModule, MatIconModule, MatProgressBarModule, MatSnackBarModule } from '@angular/material';
import { MemberInviteComponent } from './components/member-invite/member-invite.component';
import { FileAssetService } from './services/file-asset.service';
import { MemberService } from './services/member.service';
import { ReactiveFormsModule } from '@angular/forms';
import { UrbanService } from './services/urban.service';
import { AccountService } from './services/account.service';
import { OrderViewerComponent } from './components/order-viewer/order-viewer.component';
import { OrderService } from './services/order.service';
import { ServerRedirectPipe } from '../server-redirect.pipe';
import { OrderDetailComponent } from './components/order-detail/order-detail.component';


@NgModule({
  declarations: [MemberInviteComponent, OrderViewerComponent, ServerRedirectPipe, OrderDetailComponent],
  imports: [
    CommonModule,
    DmzOmsRoutingModule,
    ReactiveFormsModule,
    DmzOmsRoutingModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatBottomSheetModule,
    MatProgressBarModule,
    MatSnackBarModule,
    MatAutocompleteModule
  ],
  providers: [
    FileAssetService,
    MemberService,
    UrbanService,
    AccountService,
    OrderService
  ]
})
export class DmzOmsModule { }
