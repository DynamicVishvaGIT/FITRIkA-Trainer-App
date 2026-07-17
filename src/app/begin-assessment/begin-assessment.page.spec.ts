import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BeginAssessmentPage } from './begin-assessment.page';

describe('BeginAssessmentPage', () => {
  let component: BeginAssessmentPage;
  let fixture: ComponentFixture<BeginAssessmentPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(BeginAssessmentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
