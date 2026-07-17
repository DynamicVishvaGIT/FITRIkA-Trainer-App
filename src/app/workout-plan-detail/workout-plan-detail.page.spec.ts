import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WorkoutPlanDetailPage } from './workout-plan-detail.page';

describe('WorkoutPlanDetailPage', () => {
  let component: WorkoutPlanDetailPage;
  let fixture: ComponentFixture<WorkoutPlanDetailPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkoutPlanDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
