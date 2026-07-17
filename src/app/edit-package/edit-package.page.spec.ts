import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditPackagePage } from './edit-package.page';

describe('EditPackagePage', () => {
  let component: EditPackagePage;
  let fixture: ComponentFixture<EditPackagePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPackagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
