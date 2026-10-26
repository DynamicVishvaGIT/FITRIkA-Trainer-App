import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Common } from './common';
import { catchError, retry, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Api {
  baseUrl = '';

  device_type = 'android';

  constructor(public httpClient: HttpClient, public commonService: Common) {
    this.baseUrl = this.commonService.getBaseURL();
  }

  // ---------- Auth ----------
  request_otp(user: any) {
    return this.httpClient.post(this.baseUrl + 'request_otp', user)
    .pipe(
      retry(1),
      catchError(this.errorHandler)
    )
  }

  verify_otp(user: any) {
    return this.httpClient.post(this.baseUrl + 'verify_otp', user)
    .pipe(
      retry(1),
      catchError(this.errorHandler)
    )
  }

  signup(user: any) {
    return this.httpClient.post(this.baseUrl + 'signup', user)
    .pipe(
      retry(1),
      catchError(this.errorHandler)
    )
  }

  // ---------- Workout Plans ----------
  // No retry on create calls, so a failed call can't create a plan twice
  add_workout_plan(user: any) {
    return this.httpClient.post(this.baseUrl + 'add_workout_plan', user)
    .pipe(
      catchError(this.errorHandler)
    )
  }

  workout_plan_list(user: any) {
    return this.httpClient.post(this.baseUrl + 'workout_plan_list', user)
    .pipe(
      retry(1),
      catchError(this.errorHandler)
    )
  }

  workout_plan_details(user: any) {
    return this.httpClient.post(this.baseUrl + 'workout_plan_details', user)
    .pipe(
      retry(1),
      catchError(this.errorHandler)
    )
  }

  update_workout_plan(user: any) {
    return this.httpClient.post(this.baseUrl + 'update_workout_plan', user)
    .pipe(
      retry(1),
      catchError(this.errorHandler)
    )
  }

  duplicate_workout_plan(user: any) {
    return this.httpClient.post(this.baseUrl + 'duplicate_workout_plan', user)
    .pipe(
      catchError(this.errorHandler)
    )
  }

  delete_workout_plan(data: any) {
    return this.httpClient.post(this.baseUrl + 'delete_workout_plan', data)
    .pipe(
      retry(1),
      catchError(this.errorHandler)
    )
  }

  // ---------- Day Plans ----------
  // JSON body (YouTube link or no video)
  add_day_plan(data: any) {
    return this.httpClient.post(this.baseUrl + 'add_day_plan', data)
    .pipe(
      catchError(this.errorHandler)
    )
  }

  // form-data body (video upload): no retry, so the file isn't uploaded twice
  add_day_plan_with_video(formData: FormData) {
    return this.httpClient.post(this.baseUrl + 'add_day_plan', formData)
    .pipe(
      catchError(this.errorHandler)
    )
  }

  // Rest day uses the same endpoint as add_day_plan
  add_rest_day(data: any) {
    return this.httpClient.post(this.baseUrl + 'add_day_plan', data)
    .pipe(
      catchError(this.errorHandler)
    )
  }

  day_plan_details(data: any) {
    return this.httpClient.post(this.baseUrl + 'day_plan_details', data)
    .pipe(
      retry(1),
      catchError(this.errorHandler)
    )
  }

  update_day_plan(data: any) {
    return this.httpClient.post(this.baseUrl + 'update_day_plan', data)
    .pipe(
      retry(1),
      catchError(this.errorHandler)
    )
  }

  delete_day_plan(data: any) {
    return this.httpClient.post(this.baseUrl + 'delete_day_plan', data)
    .pipe(
      retry(1),
      catchError(this.errorHandler)
    )
  }


add_diet_plan(data: any) {
  return this.httpClient.post(this.baseUrl + 'add_diet_plan', data)
  .pipe(catchError(this.errorHandler))
}

diet_plan_list(data: any) {
  return this.httpClient.post(this.baseUrl + 'diet_plan_list', data)
  .pipe(retry(1), catchError(this.errorHandler))
}

diet_plan_details(data: any) {
  return this.httpClient.post(this.baseUrl + 'diet_plan_details', data)
  .pipe(retry(1), catchError(this.errorHandler))
}

update_diet_plan(data: any) {
  return this.httpClient.post(this.baseUrl + 'update_diet_plan', data)
  .pipe(retry(1), catchError(this.errorHandler))
}

duplicate_diet_plan(data: any) {
  return this.httpClient.post(this.baseUrl + 'duplicate_diet_plan', data)
  .pipe(catchError(this.errorHandler))
}

week_details(data: any) {
  return this.httpClient.post(this.baseUrl + 'diet_week_details', data)
  .pipe(retry(1), catchError(this.errorHandler))
}

add_week(data: any) {
  return this.httpClient.post(this.baseUrl + 'add_diet_week', data)
  .pipe(catchError(this.errorHandler))
}

save_meal_foods(data: any) {
  return this.httpClient.post(this.baseUrl + 'update_diet_meal', data)
  .pipe(catchError(this.errorHandler))
}

add_meal(data: any) {
  return this.httpClient.post(this.baseUrl + 'add_diet_meal', data)
  .pipe(catchError(this.errorHandler))
}

delete_meal(data: any) {
  return this.httpClient.post(this.baseUrl + 'delete_diet_meal', data)
  .pipe(retry(1), catchError(this.errorHandler))
}

delete_week(data: any) {
  return this.httpClient.post(this.baseUrl + 'delete_diet_week', data)
  .pipe(retry(1), catchError(this.errorHandler))
}

delete_diet_plan(data: any) {
  return this.httpClient.post(this.baseUrl + 'delete_diet_plan', data)
  .pipe(retry(1), catchError(this.errorHandler))
}
food_list(data: any) {
  return this.httpClient.post(this.baseUrl + 'food_list', data)
  .pipe(retry(1), catchError(this.errorHandler))
}
exercise_list(data: any) {
  return this.httpClient.post(this.baseUrl + 'exercise_list', data)
  .pipe(retry(1), catchError(this.errorHandler))
}

 member_assessment_list(data: any = {}) {
    return this.httpClient.post(
      this.baseUrl + 'member_assessment_list', data
    ).pipe(retry(1), catchError(this.errorHandler));
  }

  member_assessment_form_details(data: { form_id: string | number }) {
    return this.httpClient.post(
      this.baseUrl + 'member_assessment_form_details', data
    ).pipe(retry(1), catchError(this.errorHandler));
  }

  submit_assessment_form(data: {
    form_id: string | number;
    answers: any;
  }) {
    return this.httpClient.post(
      this.baseUrl + 'submit_assessment_form', data
    ).pipe(catchError(this.errorHandler));
  }
  // ==================== PROSPECT APIs ====================
  // Create/update/delete calls have no retry, so a failed call can't run twice
  follow_up_step_list(data: any = {}) {
    return this.httpClient.post(this.baseUrl + 'follow_up_step_list', data).pipe(retry(1), catchError(this.errorHandler));
  }
  prospect_list(data: any) {
    return this.httpClient.post(this.baseUrl + 'prospect_list', data).pipe(retry(1), catchError(this.errorHandler));
  }
  prospect_details(data: any) {
    return this.httpClient.post(this.baseUrl + 'prospect_details', data).pipe(retry(1), catchError(this.errorHandler));
  }
  update_prospect_step(data: any) {
    return this.httpClient.post(this.baseUrl + 'update_prospect_step', data).pipe(catchError(this.errorHandler));
  }
  update_prospect(data: any) {
    return this.httpClient.post(this.baseUrl + 'update_prospect', data).pipe(catchError(this.errorHandler));
  }
  change_prospect_status(data: any) {
    return this.httpClient.post(this.baseUrl + 'change_prospect_status', data).pipe(catchError(this.errorHandler));
  }
  delete_prospect(data: any) {
    return this.httpClient.post(this.baseUrl + 'delete_prospect', data).pipe(catchError(this.errorHandler));
  }
  check_share_link(data: any) {
    return this.httpClient.post(this.baseUrl + 'check_share_link', data).pipe(retry(1), catchError(this.errorHandler));
  }
  add_prospect_by_link(data: any) {
    return this.httpClient.post(this.baseUrl + 'add_prospect_by_link', data).pipe(catchError(this.errorHandler));
  }  

  errorHandler(error: any) {
    console.log(error);
    let message = 'Something went wrong. Please try again later.';
    // No Internet / Network Error
    if (error.status === 0) {
      message = 'Connection could not be established, Please try again later.';
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