import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { Common } from '../common';
import { Api } from '../api';
import { User } from '../user';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.page.html',
  styleUrls: ['./registration.page.scss'],
  standalone: false,
})
export class RegistrationPage implements OnInit, OnDestroy {

  private _unsubscribeAll: Subject<any>;

  mobile: string = '';
  emailAddress: string = '';
  name: string = '';
  termsAccepted: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private commonService: Common,
    private apiService: Api,
    private userService: User
  ) {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    // Prefill from the user saved after OTP verification
    const currentUser = this.getStoredUser();
    this.mobile = currentUser?.mobile_number || '';
    this.emailAddress = currentUser?.email || '';
    this.name = currentUser?.full_name || '';

    this.route.queryParams
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe(params => {
      if (params['email']) {
        this.emailAddress = params['email'];
      }

      if (params['mobile']) {
        this.mobile = params['mobile'];
      }
    });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  private getStoredUser(): any {
    return this.userService.getCurrentUser() || JSON.parse(localStorage.getItem('currentUser') || 'null');
  }

  back(): void {
    this.location.back();
  }

  onSignup(): void {
    const mobile = (this.mobile || '').trim();
    const email = (this.emailAddress || '').trim();
    const name = (this.name || '').trim();
    if (!mobile) {
      this.commonService.showToastMessage('Mobile Number is required.','toast-error','',2000);
      return;
    }
    if (!email) {
      this.commonService.showToastMessage('Email Address is required.','toast-error','',2000);
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      this.commonService.showToastMessage('Please enter a valid Email Address.','toast-error','',2000);
      return;
    }
    if (!name) {
      this.commonService.showToastMessage('Please enter your name.','toast-error','',2000);
      return;
    }
    if (!this.termsAccepted) {
      this.commonService.showToastMessage('Please accept the terms & conditions to proceed.','toast-error','',2000);
      return;
    }
    this.commonService.presentLoading();
    let signup: any = {};
    signup.full_name = name;
    signup.email = email;
    signup.mobile_number = mobile;
    signup.accepted_terms = this.termsAccepted;
    this.apiService.signup(signup)
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe((response:any) => {
      console.log(response);
      this.commonService.dismissLoading();
      // signup response carries no status flag, a 2xx is success
      if(response?.status === false){
        this.commonService.showToastMessage(response.message, 'toast-info','', 4000);
        return;
      }
      const currentUser = {
        ...this.getStoredUser(),
        ...response.user,
        full_name: name,
        user_type: response.user_type,
        first_login: response.first_login
      };
      this.userService.setCurrentUser(currentUser);
      this.commonService.showToastMessage(response.message, 'toast-success','', 2000);
      this.router.navigateByUrl('dashboard');
    },
    respError => {console.log(respError);
      this.commonService.dismissLoading();
      this.commonService.showToastMessage(respError, 'toast-error','', 4000);
    })
  }

}
