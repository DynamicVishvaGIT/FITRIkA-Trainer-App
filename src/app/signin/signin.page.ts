import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { AlertController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.page.html',
  styleUrls: ['./signin.page.scss'],
  standalone: false,
})
export class SigninPage implements OnInit {

  mobileNumber: string = '';
  email: string = '';
  name: string = '';
  acceptedTerms: boolean = false;

  constructor(
    private router: Router,
    private location: Location,
    private alertController: AlertController,
    private toastController: ToastController
  ) { }

  ngOnInit(): void {}

  back(): void {
    this.location.back();
  }

  async nextStep(): Promise<void> {
    if (this.mobileNumber.trim() === '') {
      await this.showToast('Please enter Mobile Number');
      return;
    }

    if (this.email.trim() === '') {
      await this.showToast('Please enter Email Address');
      return;
    }

    if (this.name.trim() === '') {
      await this.showToast('Please enter Name');
      return;
    }

    if (!this.acceptedTerms) {
      await this.showToast('Please accept the Terms & Conditions to proceed');
      return;
    }

    await this.showToast('Login details verified successfully');
    this.router.navigate(['/dashboard']);
  }

  async openTerms(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Terms & Conditions',
      message: 'Terms & Conditions viewer will be added here.',
      buttons: ['OK']
    });
    await alert.present();
  }

  private async showToast(message: string): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom',
      color: 'success'
    });
    await toast.present();
  }
}