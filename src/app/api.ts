import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Common } from './common';
import { catchError, retry, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Api {
  baseUrl = '';

  device_type='android';

  constructor(public httpClient: HttpClient, public commonService: Common) { 
    this.baseUrl = this.commonService.getBaseURL();
  }

  request_otp(user:any) {
    return this.httpClient.post(this.baseUrl + 'request_otp', user)
    .pipe(
      retry(1),
      catchError(this.errorHandler)
    )
  }

  verify_otp(user:any) {
    return this.httpClient.post(this.baseUrl + 'verify_otp', user)
    .pipe(
      retry(1),
      catchError(this.errorHandler)
    )
  }

  errorHandler(error: any) {
    console.log(error);
    let message = 'Something went wrong. Please try again later.';
    // No Internet / Network Error
    if (error.status === 0) {
      // message = 'No internet connection. Please check your network and try again.';
      message = 'Connection could not be established, Please try again later.';
      // return EMPTY; 
    }
    // Server errors
    else if (error.status >= 500) {
      message = 'Our server is currently unavailable. Please try again in a few minutes.';
    }
    // Unauthorized
    else if (error.status === 401) {
      message = 'Your session has expired. Please log in again.';
    }
    // Forbidden
    else if (error.status === 403) {
      message = 'You are not authorized to access this resource.';
    }
    // Not Found
    else if (error.status === 404) {
      message = 'Requested information could not be found.';
    }
    else if (error.status === 412) {
      message = error.error.message;
    }
    // Validation or API message
    else if (error.error?.error) {
      message = error.error.error;
    }
    // Generic message
    else if (error.message) {
      message = error.message;
    }
    return throwError(() => message);
  }
}
