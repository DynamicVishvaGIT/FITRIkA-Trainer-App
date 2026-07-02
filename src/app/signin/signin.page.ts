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

  email: string = '';
  password: string = '';
  showPassword: boolean = false;
  acceptedTerms: boolean = false; // Added to monitor the Figma checkbox status

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

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  async signIn(): Promise<void> {
    if (this.email.trim() === '') {
      await this.showToast('Please enter Email or Mobile Number');
      return;
    }

    if (this.password.trim() === '') {
      await this.showToast('Please enter Password');
      return;
    }
    if (this.password.length < 10) {
      await this.showToast('Password must be at least 10 characters');
      return;
    }

    if (this.password.length < 6) {
      await this.showToast('Password must be at least 6 characters');
      return;
    }

    // New validation logic matching the interactive UI requirement
    if (!this.acceptedTerms) {
      await this.showToast('Please accept the Terms & Conditions to proceed');
      return;
    }

    await this.showToast('Login Successful');
    this.router.navigate(['/dashboard']);
  }

  async forgotPassword(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Forgot Password',
      message: 'Password reset functionality will be added later.',
      buttons: ['OK']
    });
    await alert.present();
  }

  async openTerms(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Terms & Conditions',
      message: 'Terms & Conditions page will be added later.',
      buttons: ['OK']
    });
    await alert.present();
  }

  goToRegistration(): void {
    this.router.navigate(['/registration']);
  }

  async showToast(message: string): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom',
      color: 'success'
    });
    await toast.present();
  }
}