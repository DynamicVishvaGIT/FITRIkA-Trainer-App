import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';

export interface FitnessPackage {
  id: string;
  name: string;
  price: number;
  isExpanded: boolean;
  validity: string;
  sessions: number;
  duration: string;
  programFor: string[];
  trainingStyle: string;
  level: string;
  inclusions: string[];
  expectedResults: string[];
}

@Component({
  selector: 'app-package',
  templateUrl: './package.page.html',
  styleUrls: ['./package.page.scss'],
  standalone: false,
})
export class PackagePage implements OnInit {

  selectedPackageId: string = 'p2'; // Defaults selected package as in screenshot 1

  packages: FitnessPackage[] = [
    {
      id: 'p1',
      name: 'Personal Training',
      price: 18000,
      isExpanded: false,
      validity: '1 Month',
      sessions: 12,
      duration: '60 minutes',
      programFor: ['General Fitness'],
      trainingStyle: 'Gym',
      level: 'Beginners',
      inclusions: [
        'Personal training sessions',
        'Custom workout program'
      ],
      expectedResults: ['Gain 2-3 kg muscle']
    },
    {
      id: 'p2',
      name: 'Expert coaching...',
      price: 25000,
      isExpanded: true, // Default open matching SS 1
      validity: '3 Months',
      sessions: 36,
      duration: '60 minutes',
      programFor: ['Weight Loss'],
      trainingStyle: 'Gym / Home',
      level: 'Intermediate',
      inclusions: [
        'Weight Loss',
        '60 minutes, 36 sessions',
        '12 Weeks, 3 months',
        '1-on-1 Personal Training',
        'Gym / Home'
      ],
      expectedResults: ['Lose 4—6 kg fat']
    },
    {
      id: 'p3',
      name: 'Accountability coach...',
      price: 35000,
      isExpanded: true,
      validity: '3 Months',
      sessions: 36,
      duration: '60 minutes',
      programFor: ['Weight Loss'],
      trainingStyle: 'Gym / Home',
      level: 'Advanced',
      inclusions: [
        'Weight Loss',
        '60 minutes, 36 sessions',
        '12 Weeks, 3 months',
        '1-on-1 Personal Training',
        'Gym / Home'
      ],
      expectedResults: ['Improve strength']
    }
  ];

  constructor(private router: Router,private navCtrl: NavController) {}

  ngOnInit() {
    // Listens for updated data payloads returning from customization pages
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state && navigation.extras.state['updatedPackages']) {
      this.packages = navigation.extras.state['updatedPackages'];
    }
  }

  selectPackage(id: string) {
    this.selectedPackageId = id;
  }

  // Handles expanding and collapsing correctly
  toggleExpand(event: Event, pkg: FitnessPackage) {
    event.stopPropagation(); // Prevents auto-selecting card when only toggle is clicked
    pkg.isExpanded = !pkg.isExpanded;
  }

  navigateToEditPackage(event: Event, packageId: string) {
    event.stopPropagation(); // Stops card from collapsing when click hits edit icon
    this.router.navigate(['/edit-package'], {
      state: {
        packageId: packageId,
        masterPackages: this.packages
      }
    });
  }

  navigateToAddPackage() {
    this.router.navigate(['/edit-package'], {
      state: {
        packageId: 'NEW',
        masterPackages: this.packages
      }
    });
  }
  goBack() {
    this.navCtrl.navigateBack('/my-profile');
  }

  confirmSelection() {
    const activePkg = this.packages.find(p => p.id === this.selectedPackageId);
    console.log('Confirmed Active Selection: ', activePkg);
  }
}