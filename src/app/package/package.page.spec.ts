import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PackagePage } from './package.page';

describe('PackagePage', () => {
  let component: PackagePage;
  let fixture: ComponentFixture<PackagePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PackagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
