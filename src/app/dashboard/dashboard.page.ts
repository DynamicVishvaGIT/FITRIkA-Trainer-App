import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: false,
})
export class DashboardPage implements OnInit {

  constructor(
    private router: Router,
    private toastController: ToastController
  ) { }

  ngOnInit(): void {
    // Analytics tracking initialization goes here if needed.
  }

  async viewMoreSchedule(): Promise<void> {
    const toast = await this.toastController.create({
      message: 'Loading Full Schedule...',
      duration: 1500,
      position: 'bottom',
      color: 'dark'
    });
    await toast.present();
    // Path implementation redirect:
    // this.router.navigate(['/schedule-list']);
  }

  navigateTo(segment: string): void {
    switch(segment) {
      case 'schedule':
        this.router.navigate(['/schedule']);
        break;
      case 'workout':
        this.router.navigate(['/workout-plans']);
        break;
      case 'diet':
        this.router.navigate(['/diet-plans']);
        break;
      case 'forms':
        this.router.navigate(['/user-forms']);
        break;
      default:
        console.warn('Unknown Route Segment Request Context');
    }
  }
}