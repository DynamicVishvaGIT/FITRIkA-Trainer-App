import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-add-field',
  templateUrl: './add-field.page.html',
  styleUrls: ['./add-field.page.scss'],
  standalone: false,
})
export class AddFieldPage {

  // Pass "Program Inclusion" from the parent component trigger to display it perfectly
  @Input() fieldTitle: string = 'Program Inclusion';
  itemName: string = '';

  constructor(private modalCtrl: ModalController) {}

  dismiss() {
    this.modalCtrl.dismiss();
  }

  submit() {
    if (!this.itemName.trim()) return;
    
    this.modalCtrl.dismiss({
      newItemName: this.itemName.trim()
    });
  }
}