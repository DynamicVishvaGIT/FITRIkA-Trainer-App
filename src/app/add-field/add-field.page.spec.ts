import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddFieldPage } from './add-field.page';

describe('AddFieldPage', () => {
  let component: AddFieldPage;
  let fixture: ComponentFixture<AddFieldPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AddFieldPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
