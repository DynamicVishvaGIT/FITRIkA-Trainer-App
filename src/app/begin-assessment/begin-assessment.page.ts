import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

interface QuestionSchema {
  id: number;
  text: string;
  selectedAnswer: 'yes' | 'no' | null;
}

@Component({
  selector: 'app-begin-assessment',
  templateUrl: './begin-assessment.page.html',
  styleUrls: ['./begin-assessment.page.scss'],
  standalone: false,
})
export class BeginAssessmentPage implements OnInit {

  // Current sub-step page state tracking parameters
  currentStep: number = 0;
  totalSteps: number = 5; // 5 steps displaying 2 questions each to achieve a total of 10 questions
  questionsPerStep: number = 2;

  // Complete clean static database schema containing all 10 questions
  assessmentQuestions: QuestionSchema[] = [
    { id: 1, text: 'Has your doctor ever said that you have a heart condition OR high blood pressure?', selectedAnswer: null },
    { id: 2, text: 'Do you feel pain in your chest at rest, during daily activities, OR when you do physical activity?', selectedAnswer: null },
    { id: 3, text: 'Do you lose balance because of dizziness OR have you lost consciousness in the last 12 months?', selectedAnswer: null },
    { id: 4, text: 'Have you ever been diagnosed with a chronic medical condition (e.g., bone or joint issue) that could worsen with physical exercise?', selectedAnswer: null },
    { id: 5, text: 'Are you currently taking prescribed medication for your blood pressure or a heart condition?', selectedAnswer: null },
    { id: 6, text: 'Do you know from personal experience or a doctor\'s advice of any other reason why you should not undergo physical activity?', selectedAnswer: null },
    { id: 7, text: 'Has a medical professional ever advised you to only perform physical activity under strict clinical supervision?', selectedAnswer: null },
    { id: 8, text: 'Have you experienced any sudden, unexplained chest discomfort or shortness of breath within the past 6 months?', selectedAnswer: null },
    { id: 9, text: 'Do you experience persistent pain or swelling in your lower limbs or joint systems during standard walking exercises?', selectedAnswer: null },
    { id: 10, text: 'Do you possess any historical documentation indicating dynamic physiological irregularities that require custom training variants?', selectedAnswer: null }
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location
  ) { }

  ngOnInit(): void { }

  back(): void {
    if (this.currentStep > 0) {
      this.currentStep--;
    } else {
      this.location.back();
    }
  }

  /**
   * Filters out and returns the subset of questions allocated to the active view step partition.
   */
  getCurrentStepQuestions(): QuestionSchema[] {
    const startIndex = this.currentStep * this.questionsPerStep;
    return this.assessmentQuestions.slice(startIndex, startIndex + this.questionsPerStep);
  }

  /**
   * Assigns selection answer values cleanly into target reference objects.
   */
  selectAnswer(questionId: number, answer: 'yes' | 'no'): void {
    const question = this.assessmentQuestions.find(q => q.id === questionId);
    if (question) {
      question.selectedAnswer = answer;
    }
  }

  /**
   * Commits current progression state variables. Validates that selections have been made
   * before allowing navigation forward or back to the parent workspace forms pipeline.
   */
  saveAndNext(): void {
    const currentStepQuestions = this.getCurrentStepQuestions();
    const allAnswered = currentStepQuestions.every(q => q.selectedAnswer !== null);

    if (!allAnswered) {
      alert('Please answer all questions on the current step before proceeding.');
      return;
    }

    if (this.currentStep < this.totalSteps - 1) {
      this.currentStep++;
      // Scroll the viewport view to the top container space automatically
      const element = document.querySelector('.assessment-scroll-area');
      if (element) element.scrollTop = 0;
    } else {
      // Completed the 10-question sequence, navigate back to forms page context natively
      alert('Assessment data saved successfully!');
      this.router.navigate(['/forms']);
    }
  }
}