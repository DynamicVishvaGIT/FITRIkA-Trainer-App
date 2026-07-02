import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage {

  mobile: string = '';

  constructor(
    private router: Router
  ) {}

  goToOtp() {

    if (
      this.mobile.trim().length == 10
    ) {

      alert('Please enter Email or Mobile Number');

      return;

    }

    this.router.navigate(['/otp-verification'], {
      queryParams: {
        mobile: this.mobile
      }
    });

  }

}