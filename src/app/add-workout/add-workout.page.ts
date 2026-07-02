import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-add-workout',
  templateUrl: './add-workout.page.html',
  styleUrls: ['./add-workout.page.scss'],
  standalone: false,
})
export class AddWorkoutPage implements OnInit {

  workoutName: string = '';
  description: string = '';
  
  // Default tags from Figma mock layout
  selectedTags: string[] = ['Fat loss', 'Beginner', '4 weeks', 'push, pull, leg'];

  constructor(
    private modalController: ModalController,
    private toastController: ToastController
  ) {}

  ngOnInit() {}

  dismiss() {
    this.modalController.dismiss();
  }

  addTag(event: any) {
    const selectedValue = event.target.value;
    if (selectedValue && !this.selectedTags.includes(selectedValue)) {
      this.selectedTags.push(selectedValue);
    }
    event.target.value = ''; // Reset drop-down tracking index value
  }

  removeTag(tagToRemove: string) {
    this.selectedTags = this.selectedTags.filter(tag => tag !== tagToRemove);
  }

  async submitAndProceed() {
    if (!this.workoutName.trim()) {
      const toast = await this.toastController.create({
        message: 'Please enter a workout name.',
        duration: 2000,
        color: 'warning',
        position: 'top'
      });
      await toast.present();
      return;
    }

    // Safely deliver the data bundle backwards out of the overlay view layout 
    this.modalController.dismiss({
      name: this.workoutName,
      description: this.description,
      tags: this.selectedTags
    });
  }
}
