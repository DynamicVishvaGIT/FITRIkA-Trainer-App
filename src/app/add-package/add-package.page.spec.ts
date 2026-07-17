import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddPackagePage } from './add-package.page';

describe('AddPackagePage', () => {
  let component: AddPackagePage;
  let fixture: ComponentFixture<AddPackagePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPackagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
