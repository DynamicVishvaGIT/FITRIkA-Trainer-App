import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonInput } from '@ionic/angular';

@Component({
  selector: 'app-otp-verification',
  templateUrl: './otp-verification.page.html',
  styleUrls: ['./otp-verification.page.scss'],
  standalone: false,
})
export class OtpVerificationPage implements OnInit, OnDestroy {

  otp: string[] = ['', '', '', ''];

  timer: string = '01:32';

  private seconds: number = 92;

  private interval: any;

  constructor(
    private router: Router
  ) {}

  ngOnInit() {
    this.startTimer();
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