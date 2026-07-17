import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

interface PipelineStep {
  id: number;
  isCompleted: boolean;
}

@Component({
  selector: 'app-prospects',
  templateUrl: './prospects.page.html',
  styleUrls: ['./prospects.page.scss'],
  standalone: false,
})
export class ProspectsPage implements OnInit {

  pipelineSteps: PipelineStep[] = [
    { id: 1, isCompleted: true },
    { id: 2, isCompleted: false },
    { id: 3, isCompleted: false },
    { id: 4, isCompleted: false }
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location
  ) { }

  ngOnInit(): void { }

  back(): void {
    this.location.back();
  }

  toggleStepState(stepId: number): void {
    const selectedStep = this.pipelineSteps.find(step => step.id === stepId);
    
    if (!selectedStep) return;

    selectedStep.isCompleted = !selectedStep.isCompleted;

    const elementId = `step-card-${stepId}`;
    const cardDOMElement = document.getElementById(elementId);
    
    if (cardDOMElement) {
      if (selectedStep.isCompleted) {
        cardDOMElement.classList.add('state-completed');
      } else {
        cardDOMElement.classList.remove('state-removed', 'state-completed');
      }
    }
  }
}