import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: false,
})
export class ProfilePage implements OnInit {

 profileData = {
    name: 'Astha Dhaliwal',
    phone: '+91 9876543210',
    email: 'asthadhaliwal@gmail.com',
    avatar: 'assets/images/astha.png'
  };

  workoutLogs = [
    { title: 'Upper Body Strength', duration: '55 min', status: 'Upcoming', date: 'Feb 19' },
    { title: 'HIIT Cardio Blast', duration: '30 min', status: 'Upcoming', date: 'Feb 17' }
  ];

  contributionMap1: number[] = [
    0,2,3,1,0,0,2,1,0,3,2,1,0,0,0,1,2,3,0,1,0,2,3,1,0,0,2,1,0,3,2,1,0,0,0,1,2,3,0,1
  ];
  
  contributionMap2: number[] = [
    1,0,2,3,0,1,2,0,0,1,3,2,1,0,2,3,0,1,0,0,1,0,2,3,0,1,2,0,0,1,3,2,1,0,2,3,0,1,0,0
  ];

  trackingMetrics = [
    { name: 'Strength Score', score: 75, color: '#ef4444' },
    { name: 'Muscular Strength', score: 70, color: '#10b981' },
    { name: 'Cardiovascular Endurance', score: 75, color: '#3b82f6' },
    { name: 'Body Composition', score: 70, color: '#a3e635' },
    { name: 'Flexibility', score: 75, color: '#ec4899' }
  ];

  assignedWorkout = {
    programName: 'Beginner weight loss program',
    dateRange: '12/02/2025 - 12/05/2025',
    completed: 60,
    total: 90
  };

  assignedDiet = {
    programName: 'Calorie control program..',
    dateRange: '12/02/2025 - 12/05/2025',
    completed: 20,
    total: 100
  };

  assignedPackage = {
    programName: 'Muscle Gain Pro',
    dateRange: '12/02/2025 - 12/05/2025',
    completed: 60,
    total: 90
  };

  assessmentForms = [
    { id: 'f1', name: 'Form 1' },
    { id: 'f2', name: 'Form 2' },
    { id: 'f3', name: 'Form 3' },
    { id: 'f4', name: 'Form 4' }
  ];

  filesDocuments = [
    { id: 'd1', name: 'Document 2', icon: 'document-text', iconColor: '#3b82f6' },
    { id: 'd2', name: 'Document 2', icon: 'document-text', iconColor: '#a855f7' }
  ];

  constructor(
    private router: Router,
    private toastController: ToastController
  ) {
    // Captures dynamic state parameters from the client page selection
    const currentNav = this.router.getCurrentNavigation();
    if (currentNav?.extras?.state?.['clientData']) {
      const client = currentNav.extras.state['clientData'];
      this.profileData.name = client.name;
      this.profileData.phone = client.phone;
      this.profileData.email = client.email;
      this.profileData.avatar = client.avatar;
    }
  }

  ngOnInit(
    
  ) {

    
  }

  goBack() {
    this.router.navigate(['/clients']);
  }

  // Navigates to Workout Log page with context payload
  goToWorkoutLog(contextData?: any) {
    this.router.navigate(['/workout-log'], {
      state: { data: contextData, user: this.profileData.name }
    });
  }

  // Navigates to Diet Log page with context payload
  goToDietLog(contextData?: any) {
    this.router.navigate(['/diet-log'], {
      state: { data: contextData, user: this.profileData.name }
    });
  }

  async viewAll(segment: string) {
    const toast = await this.toastController.create({
      message: `Opening complete ${segment} telemetry records...`,
      duration: 1000,
      position: 'bottom'
    });
    await toast.present();
  }

  async openDocument(doc: any) {
    const toast = await this.toastController.create({
      message: `Downloading reference document asset node: ${doc.name}`,
      duration: 1200,
      position: 'bottom',
      color: 'success'
    });
    await toast.present();
  }

//   // Bottom Navigation Footer Router Pagers
//   goHome() { this.router.navigate(['/dashboard']); }
//   goSchedule() { this.router.navigate(['/schedule']); }
//   goWorkout() { this.router.navigate(['/workout-plans']); }
//   goDiet() { this.router.navigate(['/diet-plans']); }
//   goProfile() { this.router.navigate(['/profile']); }
// 
}