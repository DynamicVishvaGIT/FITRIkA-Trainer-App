import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.page.html',
  styleUrls: ['./registration.page.scss'],
  standalone: false,
})
export class RegistrationPage implements OnInit {

  email: string = '';

  name: string = '';

  password: string = '';

  showPassword: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location
  ) { }

  ngOnInit(): void {

    this.route.queryParams.subscribe(params => {

      if (params['email']) {
        this.email = params['email'];
      }

      if (params['mobile']) {
        this.email = params['mobile'];
      }

    });

  }

  back(): void {

    this.location.back();

  }

  togglePassword(): void {

    this.showPassword = !this.showPassword;

  }

  continue(): void {

    if (this.email.trim() === '') {

      alert('Email or Mobile Number is required');

      return;

    }

    if (this.name.trim() === '') {

      alert('Please enter your name');

      return;

    }

    if (this.password.trim() === '') {

      alert('Please enter your password');

      return;

    }

    if (this.password.length < 6) {

      alert('Password must be at least 6 characters');

      return;

    }

    this.router.navigate(
      ['/signin'],
      {
        queryParams: {
          email: this.email,
          name: this.name
        }
      }
    );

  }

}