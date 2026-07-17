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

  const mobile = this.mobile.trim();

  if (!/^\d{10}$/.test(mobile)) {
    alert('Please enter a valid  Mobile Number');
    return;
  }

  this.router.navigate(['/otp-verification'], {
    queryParams: {
      mobile: mobile
    }
  });

  }
}