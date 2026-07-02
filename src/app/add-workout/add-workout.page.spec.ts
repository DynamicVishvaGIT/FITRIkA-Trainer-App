import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddWorkoutPage } from './add-workout.page';

describe('AddWorkoutPage', () => {
  let component: AddWorkoutPage;
  let fixture: ComponentFixture<AddWorkoutPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AddWorkoutPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
