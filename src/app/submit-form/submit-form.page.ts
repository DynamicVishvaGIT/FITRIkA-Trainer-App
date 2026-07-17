import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

interface ParqQuestion {
  id: number;
  questionText: string;
  userAnswer: boolean | null;
}

@Component({
  selector: 'app-submit-form',
  templateUrl: './submit-form.page.html',
  styleUrls: ['./submit-form.page.scss'],
  standalone: false,
})
export class SubmitFormPage implements OnInit {

  currentSectionType: string = 'general';
  stepIndicatorText: string = 'Step 1 of 5';
  activeQuestionsList: ParqQuestion[] = [];

  // 1. Data Source: 7 General Questions
  generalQuestions: ParqQuestion[] = [
    { id: 1, questionText: 'Has your doctor ever said that you have a heart condition OR high blood pressure?', userAnswer: null },
    { id: 2, questionText: 'Do you feel pain in your chest at rest, during daily activities, OR when you do physical activity?', userAnswer: null },
    { id: 3, questionText: 'Do you lose balance because of dizziness OR have you lost consciousness in the last 12 months?', userAnswer: null },
    { id: 4, questionText: 'Do you have a bone or joint problem that could be made worse by a change in your physical activity?', userAnswer: null },
    { id: 5, questionText: 'Is your doctor currently prescribing drugs for your blood pressure or heart condition?', userAnswer: null },
    { id: 6, questionText: 'Do you know of any other reason why you should not do physical activity?', userAnswer: null },
    { id: 7, questionText: 'Have you recently undergone surgical operations that restrict intense movement?', userAnswer: null },
    { id: 8, questionText: 'Have you recently undergone surgical operations that restrict intense movement?', userAnswer: null },
    { id: 9, questionText: 'Have you recently undergone surgical operations that restrict intense movement?', userAnswer: null },
    { id: 10, questionText: 'Have you recently undergone surgical operations that restrict intense movement?', userAnswer: null }
   
  ];

  // 2. Data Source: Medical Follow-Up Questions
  medicalQuestions: ParqQuestion[] = [
    { id: 1, questionText: 'Do you have a history of chronic respiratory conditions or metabolic diseases that require regular therapy?', userAnswer: null },
    { id: 2, questionText: 'Are you currently taking any regular medical treatment unmentioned in general health screening?', userAnswer: null },
    { id: 3, questionText: 'Has a medical practitioner restricted you from participating in lifting or high-intensity intervals?', userAnswer: null },
    { id: 4, questionText: 'Has a medical practitioner restricted you from participating in lifting or high-intensity intervals?', userAnswer: null },
    { id: 5, questionText: 'Has a medical practitioner restricted you from participating in lifting or high-intensity intervals?', userAnswer: null },
    { id: 6, questionText: 'Has a medical practitioner restricted you from participating in lifting or high-intensity intervals?', userAnswer: null },
    { id: 7, questionText: 'Has a medical practitioner restricted you from participating in lifting or high-intensity intervals?', userAnswer: null },
    { id: 8, questionText: 'Has a medical practitioner restricted you from participating in lifting or high-intensity intervals?', userAnswer: null },
    { id: 9, questionText: 'Has a medical practitioner restricted you from participating in lifting or high-intensity intervals?', userAnswer: null },
    { id: 10, questionText: 'Has a medical practitioner restricted you from participating in lifting or high-intensity intervals?', userAnswer: null }
  ];

  // 3. Data Source: Your Declaration Metrics
  declarationQuestions: ParqQuestion[] = [
    { id: 1, questionText: 'I confirm that all the information provided regarding my health status is accurate and correct to my best knowledge.', userAnswer: null },
    { id: 2, questionText: 'I understand that embarking on an exercise regimen contains natural minor injury risks, and I accept liability controls.', userAnswer: null },
     { id: 3, questionText: 'I understand that embarking on an exercise regimen contains natural minor injury risks, and I accept liability controls.', userAnswer: null },
      { id: 4, questionText: 'I understand that embarking on an exercise regimen contains natural minor injury risks, and I accept liability controls.', userAnswer: null },
       { id: 5, questionText: 'I understand that embarking on an exercise regimen contains natural minor injury risks, and I accept liability controls.', userAnswer: null },
        { id: 6, questionText: 'I understand that embarking on an exercise regimen contains natural minor injury risks, and I accept liability controls.', userAnswer: null },
         { id: 7, questionText: 'I understand that embarking on an exercise regimen contains natural minor injury risks, and I accept liability controls.', userAnswer: null }
  ];

  constructor(
    private router: Router, 
    private route: ActivatedRoute,
    private location: Location,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    // Read parameters passed from the forms menu screen
    this.route.queryParams.subscribe(params => {
      const type = params['type'];
      if (type) {
        this.currentSectionType = type;
      }
      this.setupActiveViewStructure();
    });
  }

  setupActiveViewStructure(): void {
    if (this.currentSectionType === 'medical') {
      this.stepIndicatorText = 'Step 2 of 5';
      this.activeQuestionsList = this.medicalQuestions;
    } else if (this.currentSectionType === 'declaration') {
      this.stepIndicatorText = 'Step 3 of 5';
      this.activeQuestionsList = this.declarationQuestions;
    } else {
      this.stepIndicatorText = 'Step 1 of 5';
      this.activeQuestionsList = this.generalQuestions;
    }
    this.cdr.detectChanges();
  }

  back(): void {
    this.location.back();
  }

  answerQuestion(index: number, answer: boolean): void {
    this.activeQuestionsList[index].userAnswer = answer;

    // 2. Synchronize back to the source arrays so choices are preserved
  if (this.currentSectionType === 'medical') {
    this.medicalQuestions[index].userAnswer = answer;
  } else if (this.currentSectionType === 'declaration') {
    this.declarationQuestions[index].userAnswer = answer;
  } else {
    this.generalQuestions[index].userAnswer = answer;
  }

  }

  submitAssessmentAnswers(): void {
    const totalAnswered = this.activeQuestionsList.filter(q => q.userAnswer !== null).length;

    if (totalAnswered < this.activeQuestionsList.length) {
      alert(`Please answer all verification nodes before continuing. (${totalAnswered}/${this.activeQuestionsList.length} completed)`);
      return;
    }

    alert(`Success: Data for ${this.currentSectionType} section saved!`);
    this.router.navigate(['/forms']);
  }
}