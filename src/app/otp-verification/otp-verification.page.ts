import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { IonInput, Platform } from '@ionic/angular';
import { filter, Subject, takeUntil } from 'rxjs';
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
  // Add the phone number property here
  phoneNumber: string = '';

  private seconds: number = 92;

  private interval: any;

  constructor(
    private router: Router, private commonService: Common, private apiService: Api, private userService: User, private platform: Platform
  ) {
    this._unsubscribeAll = new Subject();
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state && navigation.extras.state['phoneNumber']) {
      this.phoneNumber = navigation.extras.state['phoneNumber'];
    } else {
      this.phoneNumber = '+91 7029900582'; // Fallback if no state found
    }
  }

  ngOnInit() {
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd) // Ensure the event is of type NavigationEnd
      ).subscribe((event: NavigationEnd) => {
        if (event.url.startsWith('/otp-verification')) { // Check if user navigated back to a specific URL
          this.startTimer();
        }
    });
  }

  verify_otp(){
    const enteredOTP = this.otp.join('');
    if(!enteredOTP){
      this.commonService.showToastMessage('OTP is required.','toast-error','',2000);
      return;
    }
    if(this.otp.length<6){
      this.commonService.showToastMessage('Please enter a valid OTP.','toast-error','',2000);
      return;
    }
    this.commonService.presentLoading();
    let verifyOtp: any={username:'', otp:''};
    verifyOtp.username = this.phoneNumber;
    verifyOtp.code = this.otp.join('');
    verifyOtp.user_type = 'trainer';
    verifyOtp.device_type = 'mobile';
    console.log(verifyOtp);
    this.apiService.verify_otp(verifyOtp)
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe((response:any) => {
      console.log(response);
      if(response.status){
        const currentUser = {
          ...response.user,
          token: response.token
        };
        this.userService.setCurrentUser(currentUser);
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        this.commonService.showToastMessage(response.message, 'toast-success','', 2000);
        this.commonService.dismissLoading();
        this.router.navigateByUrl('registration');
      }
      else if(!response.status){
        this.commonService.showToastMessage(response.message, 'toast-info','', 4000);
        this.commonService.dismissLoading();
        // this.router.navigate(['/login']);
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

        this.timer =
          `${this.pad(minutes)}:${this.pad(seconds)}`;

      }

    }, 1000);

  }

  pad(value: number): string {

    return value < 10
      ? '0' + value
      : value.toString();

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