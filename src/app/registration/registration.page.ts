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
  emailAddress: string = '';

  name: string = '';

  termsAccepted: boolean = false;
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

 
  continue(): void {

    if (this.email.trim() === '') {

      alert('Mobile Number is required');

      return;

    }

    if (!this.emailAddress || this.emailAddress.trim() === '') {
      alert('Email Address is required');
      return;
    }

    if (!this.name || this.name.trim() === '') {
      alert('Please enter your name');
      return;
    }

    if (!this.termsAccepted) {
      alert('Please accept the terms & conditions to proceed');
      return;
    }

    this.router.navigate(
      ['/dashboard'],
      {
        queryParams: {
          email: this.email,
          name: this.name
        }
      }
    );

  }

}