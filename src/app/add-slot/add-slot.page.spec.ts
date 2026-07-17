import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddSlotPage } from './add-slot.page';

describe('AddSlotPage', () => {
  let component: AddSlotPage;
  let fixture: ComponentFixture<AddSlotPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSlotPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
