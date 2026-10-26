import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { Common } from '../common';
import { Api } from '../api';

interface AssessmentForm {
  id: string | number;
  name: string;
  description: string;
}

@Component({
  selector: 'app-forms',
  templateUrl: './forms.page.html',
  styleUrls: ['./forms.page.scss'],
  standalone: false
})
export class FormsPage implements OnInit, OnDestroy {

  private _unsubscribeAll: Subject<any>;

  assessmentForms: AssessmentForm[] = [];
  selectedFormId: string | number | null = null;
  isLoading = false;
  errorMessage = '';

  constructor(
    private apiService: Api,
    private commonService: Common,
    private router: Router,
    private location: Location
  ) {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void { }

  // Reloads every time the page is shown
  ionViewWillEnter(): void {
    this.loadForms();
  }

  ngOnDestroy() {
    this._unsubscribeAll.next(true);
    this._unsubscribeAll.complete();
  }

  // ---------- member_assessment_list ----------
  loadForms(): void {
    let listData: any = {};   // Postman body is {}
    console.log(listData);

    this.isLoading = true;
    this.errorMessage = '';

    this.apiService.member_assessment_list(listData)
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe((response: any) => {
      console.log(response);

      // check the real key in the response: data / forms / assessment_forms ...
      const data = response?.data ?? response?.result ?? response;
      const list: any[] = Array.isArray(data)
        ? data
        : data?.forms ??
          data?.assessment_forms ??
          data?.assessments ??
          data?.list ??
          data?.records ??
          [];

      this.assessmentForms = list
        .map((item: any) => ({
          id: item.form_id ?? item.assessment_form_id ?? item.id,
          name: item.form_name ?? item.assessment_name ?? item.name ?? item.title ?? 'Assessment',
          description: item.description ?? item.form_description ?? 'Complete this assessment'
        }))
        .filter((form: AssessmentForm) => form.id != null);

      if (!this.assessmentForms.length) {
        this.errorMessage = 'No assessment forms found.';
      }

      this.isLoading = false;
    },
    respError => {
      console.log(respError);
      this.isLoading = false;
      this.errorMessage = typeof respError === 'string'
        ? respError
        : 'Unable to load assessment forms. Please try again.';
    });
  }

  chooseSection(form: AssessmentForm): void {
    this.selectedFormId = form.id;
  }

  continue(): void {
    if (this.selectedFormId == null) {
      this.commonService.showToastMessage('Please select an assessment form first.', 'toast-error', '', 2000);
      return;
    }

    this.router.navigate(['/submit-form'], {
      queryParams: { form_id: this.selectedFormId }
    });
  }

  back(): void {
    this.location.back();
  }
}