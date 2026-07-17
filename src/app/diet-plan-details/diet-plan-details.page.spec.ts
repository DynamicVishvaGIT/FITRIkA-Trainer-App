import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DietPlanDetailsPage } from './diet-plan-details.page';

describe('DietPlanDetailsPage', () => {
  let component: DietPlanDetailsPage;
  let fixture: ComponentFixture<DietPlanDetailsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DietPlanDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
