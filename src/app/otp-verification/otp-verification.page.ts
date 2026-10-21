import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonInput, Platform } from '@ionic/angular';
import { Subject, takeUntil } from 'rxjs';
import { Common } from '../common';
import { Api } from '../api';
import { User } from '../user';

@Component({
  selector: 'app-otp-verification',
  templateUrl: './otp-verification.page.html',
  styleUrls: ['./otp-verification.page.scss'],
  standalone: false,
})
export class OtpVerificationPage implements OnInit, OnDestroy {

  private _unsubscribeAll: Subject<any>;

  otp: string[] = ['', '', '', ''];

  timer: string = '01:32';
  phoneNumber: string = '';
  username: string = '';

  private seconds: number = 92;

  private interval: any;

  constructor(
    private router: Router, private commonService: Common, private apiService: Api, private userService: User, private platform: Platform, private route: ActivatedRoute
  ) {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit() {
    this.username = this.route.snapshot.queryParamMap.get('username') || '';
    console.log('Username:', this.username);
    this.startTimer();
  }

  verify_otp(){
    const enteredOTP = this.otp.join('');
    if(!enteredOTP){
      this.commonService.showToastMessage('OTP is required.','toast-error','',2000);
      return;
    }
    if(enteredOTP.length<4){
      this.commonService.showToastMessage('Please enter a valid OTP.','toast-error','',2000);
      return;
    }
    if(!this.username){
      this.commonService.showToastMessage('Username missing. Please login again.','toast-error','',2000);
      return;
    }
    this.commonService.presentLoading();
    let verifyOtp: any={username:''};
    verifyOtp.username = this.username;
    verifyOtp.code = enteredOTP;
    verifyOtp.user_type = 'trainer';
    verifyOtp.device_type = 'mobile';
    verifyOtp.fcm_token = this.commonService.fcm_token || '';
    console.log(verifyOtp);
    this.apiService.verify_otp(verifyOtp)
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe((response:any) => {
      console.log(response);
      this.commonService.dismissLoading();

      // Success = server returned a token
      if(response && response.tokens){
        const currentUser = {
          token: response.tokens,
          user: response.user
        };
        this.userService.setCurrentUser(currentUser);
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        this.commonService.showToastMessage(response.message, 'toast-success','', 2000);

        // FIX: decide the next screen using first_login
        const isFirstLogin = response.first_login === true || response.first_login === 'true';

        if (isFirstLogin) {
          // first_login = true  -> registration screen
          this.router.navigateByUrl('/registration', { replaceUrl: true });
        } else {
          // first_login = false -> dashboard screen
          this.router.navigateByUrl('/dashboard', { replaceUrl: true });
        }
      }
      else {
        this.commonService.showToastMessage(response?.message || 'Verification failed', 'toast-info','', 4000);
      }
    },
    respError => {console.log(respError);
      this.commonService.dismissLoading();
      this.commonService.showToastMessage(respError, 'toast-error','', 4000);
    })
  }

  ngOnDestroy() {
    clearInterval(this.interval);
  }

  startTimer() {
    this.interval = setInterval(() => {
      if (this.seconds > 0) {
        this.seconds--;
        const minutes = Math.floor(this.seconds / 60);
        const seconds = this.seconds % 60;
        this.timer = `${this.pad(minutes)}:${this.pad(seconds)}`;
      }
    }, 1000);
  }

  pad(value: number): string {
    return value < 10 ? '0' + value : value.toString();
  }

  moveNext(event: any, next?: IonInput) {
    const value = event.target.value;
    if (value.length === 1 && next) {
      next.setFocus();
    }
  }

  pressKey(value: string) {
    for (let i = 0; i < this.otp.length; i++) {
      if (this.otp[i] === '') {
        this.otp[i] = value;
        return;
      }
    }
  }

  deleteKey() {
    for (let i = this.otp.length - 1; i >= 0; i--) {
      if (this.otp[i] !== '') {
        this.otp[i] = '';
        return;
      }
    }
  }

  verifyOtp() {
    const code = this.otp.join('');
    if (code.length !== 4) {
      alert('Please enter OTP');
      return;
    }
    this.router.navigate(['/registration']);
  }

}