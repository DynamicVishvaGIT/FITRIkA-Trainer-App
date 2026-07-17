import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-add-field',
  templateUrl: './add-field.page.html',
  styleUrls: ['./add-field.page.scss'],
  standalone: false,
})
export class AddFieldPage {

  @Input() fieldTitle: string = 'Option';
  itemName: string = '';

  constructor(private modalCtrl: ModalController) {}

  dismiss() {
    this.modalCtrl.dismiss();
  }

  submit() {
    this.modalCtrl.dismiss({
      newItemName: this.itemName
    });
  }
}