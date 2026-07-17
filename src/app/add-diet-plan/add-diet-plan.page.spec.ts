import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddDietPlanPage } from './add-diet-plan.page';

describe('AddDietPlanPage', () => {
  let component: AddDietPlanPage;
  let fixture: ComponentFixture<AddDietPlanPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDietPlanPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
