import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddDayPlanPage } from './add-day-plan.page';

describe('AddDayPlanPage', () => {
  let component: AddDayPlanPage;
  let fixture: ComponentFixture<AddDayPlanPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDayPlanPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
