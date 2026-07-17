import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WorkoutLogPage } from './workout-log.page';

describe('WorkoutLogPage', () => {
  let component: WorkoutLogPage;
  let fixture: ComponentFixture<WorkoutLogPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkoutLogPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
