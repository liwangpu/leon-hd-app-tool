import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { map, skipWhile, switchMap } from 'rxjs/operators';
import { AccountService } from '../../services/account.service';

@Component({
  selector: 'app-invite-card',
  templateUrl: './invite-card.component.html',
  styleUrls: ['./invite-card.component.scss']
})
export class InviteCardComponent implements OnInit {

  _inviteUrl: string;
  inviterCompanyName: string = "会员";
  inviterCompanyIcon: string;
  inviterName: string;
  loginForm: FormGroup;
  constructor(protected formBuilder: FormBuilder, protected route: ActivatedRoute, protected accountSrv: AccountService) {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }//constructor

  ngOnInit() {
    this.route.queryParams.pipe(map(params => params['u']))
      .pipe(skipWhile(uid => !uid))
      .pipe(switchMap(uid => this.accountSrv.getById(uid)))
      .subscribe(acc => {
        console.log(1, acc);
        this.inviterName = acc.name;
        this.inviterCompanyName = acc.organizationName;
        this.inviterCompanyIcon = acc.organizationIcon ? acc.organizationIcon : "/assets/images/morejee.png";
        // "/assets/images/morejee.png"
        this.setInviteUrl(acc.id);
      });

  }//ngOnInit

  readyToMake() {

  }//readyToMake

  setInviteUrl(userId: string) {
    if (location )
    {
      this._inviteUrl = `${location.protocol}//${location.host}/dmz-oms/member-invite?u=${userId}`;
    }
  }//setInviteUrl

}
