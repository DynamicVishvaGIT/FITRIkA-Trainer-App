import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddDietLogPage } from './add-diet-log.page';

describe('AddDietLogPage', () => {
  let component: AddDietLogPage;
  let fixture: ComponentFixture<AddDietLogPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDietLogPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
