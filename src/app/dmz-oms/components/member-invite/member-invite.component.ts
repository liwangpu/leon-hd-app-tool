import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatButton, MatAutocompleteSelectedEvent, MatSnackBar } from '@angular/material';
import { HttpHeaders } from '@angular/common/http';
import { UrbanService } from '../../services/urban.service';
import { Observable, of } from 'rxjs';
import { NationalUrban } from '../../models/national-urban';
import { map, tap, debounceTime, switchMap, catchError } from 'rxjs/operators';
import { AccountService } from '../../services/account.service';
import { FileAssetService } from '../../services/file-asset.service';
import { MemberService } from '../../services/member.service';

@Component({
  selector: 'app-member-invite',
  templateUrl: './member-invite.component.html',
  styleUrls: ['./member-invite.component.scss']
})
export class MemberInviteComponent implements OnInit {

  submiting = false;
  inviterId: string;
  inviterAvatar: string = '/assets/images/cool-boy.jpg';
  inviterName: string = '管理员';
  bsUrl: string;
  provinceControl = new FormControl();
  cityControl = new FormControl();
  proviceOptions: Observable<Array<NationalUrban>>;
  cityOptions: Array<NationalUrban> = [];
  allProvince: Array<NationalUrban> = [];
  refCities: Array<NationalUrban> = [];
  detailForm: FormGroup;
  @ViewChild('submitCt') submitCt: MatButton;
  @ViewChild('fileInputCt') fileInputCt: ElementRef;
  constructor(protected formBuilder: FormBuilder, protected route: ActivatedRoute, protected urbanSrv: UrbanService, protected accountSrv: AccountService, protected fileSrv: FileAssetService, protected memberSrv: MemberService, protected snackBar: MatSnackBar) {
    this.detailForm = this.formBuilder.group({
      inviter: ['', [Validators.required]],
      name: ['', [Validators.required]],
      mail: ['', [Validators.required, Validators.email]],
      company: [''],
      remark: ['', [Validators.maxLength(200)]],
      phone: ['', [Validators.required]],
      province: ['', [Validators.required]],
      city: ['', [Validators.required]],
      businessCard: ['', [Validators.required]]
    });
  }//constructor

  ngOnInit() {

    // //初始化数据,仅用测试
    // this.detailForm.patchValue({
    //   inviter: '9RC61V7NR9K569',
    //   name: '小明',
    //   mail: 'liwang.pu@gmail.com',
    //   phone: '15721457986',
    //   company: '淘宝'
    // });

    this.urbanSrv.getProvinces().pipe(map(res => res && res.data && res.data.length > 0 ? res.data : [])).pipe(tap(opts => this.allProvince = opts)).subscribe(provinces => {
      this.proviceOptions = of(provinces);
      //设置选中/改变值响应
      this.provinceControl.valueChanges.pipe(debounceTime(500))
        .pipe(map(x => (typeof x) === 'string' ? x : (x ? x.name : '')))
        .pipe(map(name => {
          let arr = name ? this.allProvince.filter(x => x.name.indexOf(name) > -1) : this.allProvince;
          return [name, arr];
        }))
        .subscribe(fus => {
          this.proviceOptions = of(fus[1]);
          let name = fus[0];
          //选中项后
          if (name == '' || !this.allProvince.some(x => x.name == name)) {
            this.changeUrban();
          }//if
        });//subscribe
    });//subscribe

    this.cityControl.valueChanges.pipe(debounceTime(500))
      .pipe(map(x => (typeof x) === 'string' ? x : (x ? x.name : '')))
      .pipe(map(name => {
        let arr = name ? this.refCities.filter(x => x.name.indexOf(name) > -1) : this.refCities;
        return [name, arr];
      })).subscribe(fus => {
        this.cityOptions = fus[1];
        let name = fus[0];
        //选中项后
        if (name == '' || !this.refCities.some(x => x.name == name)) {
          this.changeUrban();
        }//if
      });//subscribe

    //获取邀请人信息
    this.route.queryParams.pipe(map(parm => parm['u']))
      .subscribe(inviter => {
        if (!inviter) return;
        this.accountSrv.getById(inviter).subscribe(acc => {
          this.inviterId = acc.id;
          this.detailForm.patchValue({ inviter: inviter });
          this.inviterName = acc.name ? acc.name : this.inviterName;
          this.inviterAvatar = acc.icon ? acc.icon : this.inviterAvatar;
        });//subscribe
      });//subscribe

  }//ngOnInit

  proviceDisplayFn(province?: NationalUrban): string | undefined {
    return province ? province.name : undefined;
  }//proviceDisplayFn

  cityDisplayFn(city?: NationalUrban): string | undefined {
    return city ? city.name : undefined;
  }//cityDisplayFn

  onProvinceSelect(evt: MatAutocompleteSelectedEvent) {
    let province = evt.option.value;
    this.urbanSrv.getById(province.id).pipe(map(res => res && res.children ? res.children : []))
      .subscribe(arr => {
        this.refCities = arr;
        this.cityOptions = arr;
        let currentCity = this.cityControl.value;
        //city不属于该province
        if (currentCity && !arr.some(x => x.id == currentCity.id)) {
          this.cityControl.patchValue({});
        }//if
        this.detailForm.markAsDirty();
        this.changeUrban();
      });//subscribe
  }//onProvinceSelect

  onCitySelect(evt: MatAutocompleteSelectedEvent) {
    this.detailForm.markAsDirty();
    this.changeUrban();
  }//onCitySelect

  reset() {
    this.provinceControl.reset();
    this.cityControl.reset();
    this.clearFile();
    this.detailForm.reset();
    this.detailForm.patchValue({ inviter: this.inviterId });
  }//reset

  submit() {
    this.submiting = true;
    this.submitCt.disabled = true;

    let fusData = this.getBSCardFormData();

    let uploadBSCard$ = this.fileSrv.uploadAttachment(fusData.formData, fusData.header);

    uploadBSCard$
      .pipe(switchMap(x => {
        let data = this.detailForm.value;
        data['businessCard'] = x['id'];
        return this.memberSrv.memberRegistry(data);
      }))
      .pipe(map(() => "提交成功")).pipe(catchError((err) => {
        console.log(err);
        return of('提交失败,请稍后再试');
      }))
      .subscribe(msg => {
        this.submiting = false;
        this.submitCt.disabled = false;
        this.snackBar.open(msg, '', {
          duration: 2000,
        });
      });//subscribe);
  }//submit

  onFileChange(event: any) {
    let reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      reader.readAsDataURL(file);
      reader.onload = (e: any) => {
        this.bsUrl = e.target.result;
        //填入一个虚拟的值,让表单验证通过
        this.detailForm.patchValue({ businessCard: 'true' });
      };
    }
    else {
      this.detailForm.patchValue({ businessCard: null });
    }
  }//onFileChange

  clearFile() {
    this.bsUrl = undefined;
    this.detailForm.patchValue({ businessCard: null });
    this.fileInputCt.nativeElement.value = '';
  }//clearFile

  selectBSCard() {
    this.clearFile();
    this.fileInputCt.nativeElement.click();
  }//selectICon

  getBSCardFormData(): { formData: FormData, header: HttpHeaders } {
    let fileBrowser = this.fileInputCt.nativeElement;
    if (fileBrowser.files && fileBrowser.files[0]) {
      let formData = new FormData();
      let file = fileBrowser.files[0];
      let idx = file.name.lastIndexOf('.');
      let fileExt = file.name.substring(idx, file.name.length);
      let header = new HttpHeaders({
        "fileExt": fileExt
      });
      formData.append("file", file);
      return { formData: formData, header: header };
    }
    return { formData: null, header: null };
  }//getIconFormData

  changeUrban() {
    let province = this.provinceControl.value;
    let city = this.cityControl.value;
    let ubran = {
      province: province && province.id ? province.id : '',
      city: city && city.id ? city.id : '',
      county: ''
    };
    this.detailForm.patchValue(ubran);
  }//changeUrban

}
