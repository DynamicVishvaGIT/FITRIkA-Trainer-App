import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WorkoutPlansPage } from './workout-plans.page';

describe('WorkoutPlansPage', () => {
  let component: WorkoutPlansPage;
  let fixture: ComponentFixture<WorkoutPlansPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkoutPlansPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
