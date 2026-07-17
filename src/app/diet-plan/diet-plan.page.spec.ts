import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DietPlanPage } from './diet-plan.page';

describe('DietPlanPage', () => {
  let component: DietPlanPage;
  let fixture: ComponentFixture<DietPlanPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DietPlanPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
