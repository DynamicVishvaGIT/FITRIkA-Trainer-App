import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddWorkoutLogPage } from './add-workout-log.page';

describe('AddWorkoutLogPage', () => {
  let component: AddWorkoutLogPage;
  let fixture: ComponentFixture<AddWorkoutLogPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AddWorkoutLogPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
