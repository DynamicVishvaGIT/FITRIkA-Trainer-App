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

  user = {
    name: 'James',
    greeting: 'Good Morning',
    image: 'assets/images/dp.png'
  };

  motivation = "The only bad workout is the one that didn't happen.";

  schedules = [
    {
      id: 1,
      time: '4:30 PM',
      client: 'Nitesh Patel',
      type: 'DB(I) Upper Body',
      active: true
    },
    {
      id: 2,
      time: '5:30 PM',
      client: 'Seema A',
      type: 'Video(I) Cardio',
      active: false
    },
    {
      id: 3,
      time: '7:00 PM',
      client: 'Malcom D',
      type: 'Call(I) Gym Visit',
      active: false
    }
  ];

  metrics = {
    prospects: 12,
    clients: 10,
    activeClients: 4,
    revenue: 55000
  };

  constructor(
    private router: Router,
    private toastController: ToastController
  ) {}

  ngOnInit(): void {}

  async openMenu() {
    const toast = await this.toastController.create({
      message: 'Opening Drawer Menu Options...',
      duration: 1000,
      position: 'bottom',
      color: 'dark'
    });
    await toast.present();
  }

  goProfile() {
    this.router.navigate(['/my-profile']);
  }

  async viewMoreSchedule() {
    this.router.navigate(['/schedule']);
  }

  async openSchedule(item: any) {
    this.router.navigate(['/schedule'], {
      queryParams: { itemId: item.id }
    });
  }

  navigateTo(segment: string) {
    switch (segment) {
      case 'schedule':
        this.router.navigate(['/schedule']);
        break;
      case 'workout':
        this.router.navigate(['/workout-plans']);
        break;
      case 'diet':
        this.router.navigate(['/diet-plan']);
        break;
      case 'forms':
        this.router.navigate(['/forms']);
        break;
      default:
        console.warn('Path route index target missing.');
    }
  }

  openProspects() { this.router.navigate(['/prospects']); }
  openClients()   { this.router.navigate(['/clients']); }
  openRevenue()   { this.router.navigate(['/revenue']); }

  goHome()     { this.router.navigate(['/dashboard']); }
  goSchedule() { this.router.navigate(['/schedule']); }
  goWorkout()  { this.router.navigate(['/workout-plans']); }
  goDiet()     { this.router.navigate(['/diet-plan']); }
}