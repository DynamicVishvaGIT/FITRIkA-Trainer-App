import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DietLogPage } from './diet-log.page';

describe('DietLogPage', () => {
  let component: DietLogPage;
  let fixture: ComponentFixture<DietLogPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DietLogPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
