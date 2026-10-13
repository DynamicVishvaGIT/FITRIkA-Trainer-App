import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Common } from '../common';
import { Api } from '../api';
import { User } from '../user';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage {

  private _unsubscribeAll: Subject<any>;

  login_data: any={username:''};
  mobile: string = '';

  constructor(private router: Router, private commonService: Common, private apiService: Api, private userService: User, private platform: Platform) { 
    this._unsubscribeAll = new Subject();
  }

  onLogin() {
    let epattern = /[A-Za-z0-9._%+-]{1,}@[a-zA-Z]{3,}([.]{1}[a-zA-Z]{2,}|[.]{1}[a-zA-Z]{2,}[.]{1}[a-zA-Z]{2,})/;
    if (!epattern.test(this.login_data.username)) {
      this.commonService.showToastMessage('Please enter email in correct format.', 'toast-error', 'top', 2000);
      return;
    }
    this.commonService.presentLoading();
    this.login_data['fcm_token'] = this.commonService.fcm_token;
    this.login_data['user_type'] = 'trainer';
    // this.login_data['device_type'] = this.commonService.device_type;
    console.log(this.login_data);
    this.apiService.request_otp(this.login_data)
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe((response:any) => {
      console.log(response);
      this.commonService.showToastMessage(response.message, 'toast-success','', 2000);
      this.commonService.dismissLoading();
      this.login_data = { username: '', password: '' };
      this.router.navigate(['/otp-verification'], {
        queryParams: {
          mobile: this.login_data.username
        }
      });
    },
    respError => {console.log(respError);
      this.commonService.dismissLoading();
      this.commonService.showToastMessage(respError, 'toast-error','', 4000);
    })
  }

  // goToOtp() {

  // const mobile = this.mobile.trim();

  // if (!/^\d{10}$/.test(mobile)) {
  //   alert('Please enter a valid  Mobile Number');
  //   return;
  // }

  // this.router.navigate(['/otp-verification'], {
  //   queryParams: {
  //     mobile: mobile
  //   }
  // });

  // }
}