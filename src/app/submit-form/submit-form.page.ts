import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { Common } from '../common';
import { Api } from '../api';

interface AssessmentQuestion {
  id: string | number;
  questionText: string;
  userAnswer: boolean | null;
}

@Component({
  selector: 'app-submit-form',
  templateUrl: './submit-form.page.html',
  styleUrls: ['./submit-form.page.scss'],
  standalone: false
})
export class SubmitFormPage implements OnInit, OnDestroy {

  private _unsubscribeAll: Subject<any>;

  formId: string | number | null = null;
  questions: AssessmentQuestion[] = [];
  isLoading = false;
  isSubmitting = false;
  errorMessage = '';

  constructor(
    private apiService: Api,
    private commonService: Common,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ) {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    this.formId = this.route.snapshot.queryParamMap.get('form_id');
    console.log('Form id:', this.formId);
  }

  ionViewWillEnter(): void {
    if (this.formId) {
      this.loadQuestions();
    } else {
      this.errorMessage = 'Assessment form ID is missing.';
    }
  }

  ngOnDestroy() {
    this._unsubscribeAll.next(true);
    this._unsubscribeAll.complete();
  }

  // ---------- member_assessment_form_details ----------
  loadQuestions(): void {
    if (this.formId == null) { return; }

    let detailsData: any = {};
    detailsData.form_id = this.formId;
    console.log(detailsData);

    this.isLoading = true;
    this.errorMessage = '';

    this.apiService.member_assessment_form_details(detailsData)
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe((response: any) => {
      console.log(response);

      // check the real key in the response: questions / form_questions ...
      const data = response?.data ?? response?.result ?? response;
      const list: any[] = Array.isArray(data)
        ? data
        : data?.questions ??
          data?.form_questions ??
          data?.assessment_questions ??
          data?.details ??
          data?.form_details?.questions ??
          [];

      this.questions = list
        .map((item: any, index: number) => ({
          id: item.question_id ?? item.form_question_id ?? item.id ?? index + 1,
          questionText: item.question_text ?? item.question ?? item.title ?? item.name ?? '',
          userAnswer: null
        }))
        .filter((q: AssessmentQuestion) => !!q.questionText);

      if (!this.questions.length) {
        this.errorMessage = 'No questions found for this assessment.';
      }

      this.isLoading = false;
    },
    respError => {
      console.log(respError);
      this.isLoading = false;
      this.errorMessage = typeof respError === 'string'
        ? respError
        : 'Unable to load assessment questions.';
    });
  }

  answerQuestion(index: number, answer: boolean): void {
    this.questions[index].userAnswer = answer;
  }

  calculateProgressPercentage(): number {
    if (!this.questions.length) { return 0; }
    const answered = this.questions.filter(q => q.userAnswer !== null).length;
    return (answered / this.questions.length) * 100;
  }

  // ---------- submit_assessment_form ----------
  submitAssessmentAnswers(): void {
    if (this.formId == null || !this.questions.length || this.isSubmitting) { return; }

    const answered = this.questions.filter(q => q.userAnswer !== null).length;
    if (answered < this.questions.length) {
      this.commonService.showToastMessage(
        `Please answer all questions. ${answered}/${this.questions.length} completed.`,
        'toast-error', '', 2500
      );
      return;
    }

    let submitData: any = {};
    submitData.form_id = this.formId;
    // Check this shape against {{assessment_answers}} in Postman (see note below)
    submitData.answers = this.questions.map(q => ({
      question_id: q.id,
      answer: q.userAnswer
    }));
    console.log(submitData);

    this.isSubmitting = true;
    this.commonService.presentLoading();
    this.apiService.submit_assessment_form(submitData)
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe((response: any) => {
      console.log(response);
      this.isSubmitting = false;
      this.commonService.dismissLoading();
      this.commonService.showToastMessage(response?.message || 'Assessment submitted successfully.', 'toast-success', '', 2000);
      this.router.navigate(['/forms']);
    },
    respError => {
      console.log(respError);
      this.isSubmitting = false;
      this.commonService.dismissLoading();
      this.commonService.showToastMessage(respError, 'toast-error', '', 4000);
    });
  }

  back(): void {
    this.location.back();
  }
}