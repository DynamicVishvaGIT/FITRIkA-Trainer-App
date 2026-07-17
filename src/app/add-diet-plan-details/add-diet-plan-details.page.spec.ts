import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddDietPlanDetailsPage } from './add-diet-plan-details.page';

describe('AddDietPlanDetailsPage', () => {
  let component: AddDietPlanDetailsPage;
  let fixture: ComponentFixture<AddDietPlanDetailsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDietPlanDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
