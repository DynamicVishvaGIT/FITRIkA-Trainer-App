import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SubmitFormPage } from './submit-form.page';

describe('SubmitFormPage', () => {
  let component: SubmitFormPage;
  let fixture: ComponentFixture<SubmitFormPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmitFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
