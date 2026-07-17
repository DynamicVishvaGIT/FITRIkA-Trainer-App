import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditSlotPage } from './edit-slot.page';

describe('EditSlotPage', () => {
  let component: EditSlotPage;
  let fixture: ComponentFixture<EditSlotPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSlotPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
