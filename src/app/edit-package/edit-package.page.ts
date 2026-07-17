import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController, ModalController } from '@ionic/angular';
import { FitnessPackage } from '../package/package.page';
import { AddFieldPage } from '../add-field/add-field.page';

@Component({
  selector: 'app-edit-package',
  templateUrl: './edit-package.page.html',
  styleUrls: ['./edit-package.page.scss'],
  standalone: false,
})
export class EditPackagePage implements OnInit {

  isEditMode: boolean = false;
  pkgId: string = 'NEW';
  masterPackages: FitnessPackage[] = [];

  // Working package model - completely reset to empty base settings
  pkg: FitnessPackage = {
    id: '',
    name: '',
    price: 0,              // Starts at 0, no default option highlighted
    isExpanded: false,
    validity: '',          // Empty string: no chip highlighted
    sessions: 0,           // Starts at 0, no chip highlighted
    duration: '',          // Empty string: no chip highlighted
    programFor: [],        // No pre-selected targets
    trainingStyle: '',     // Empty string: no style chip highlighted
    level: '',             // Empty string: no experience chip highlighted
    inclusions: [],        // No items checked by default
    expectedResults: []    // No items checked by default
  };

  // Chips configuration lists
  pricingOptions: number[] = [12000, 18000, 25000, 35000, 72000];
  validityOptions: string[] = ['1 Month', '3 Months', '6 Months'];
  sessionOptions: number[] = [12, 36, 72];
  durationOptions: string[] = ['45 minutes', '60 minutes', '90 minutes'];
  
  programForOptions: string[] = ['Weight Loss', 'Muscle Gain', 'General Fitness', 'Cardio'];
  trainingStyleOptions: string[] = ['Outdoor', 'Gym', 'Home', 'Hybrid'];
  levelOptions: string[] = ['Beginners', 'Intermediate', 'Advanced', 'Athletes'];
  
  inclusionsOptions: string[] = [
    'Personal training sessions',
    'Custom workout program',
    'Habit coaching',
    'Weekly progress tracking',
    'Supplement guidance',
    'Injury prevention exercises'
  ];
  
  expectedResultsOptions: string[] = [
    'Improve strength',
    'Lose 4—6 kg fat',
    'Improve stamina',
    'Gain 2—3 kg muscle'
  ];

  constructor(
    private router: Router,
    private navCtrl: NavController,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.pkgId = navigation.extras.state['packageId'] || 'NEW';
      this.masterPackages = navigation.extras.state['masterPackages'] || [];
      
      if (this.pkgId !== 'NEW') {
        this.isEditMode = true;
        const target = this.masterPackages.find(p => p.id === this.pkgId);
        if (target) {
          // If editing an existing package, clone the user's choices
          this.pkg = JSON.parse(JSON.stringify(target));
        }
      } else {
        // FIXED: Explicitly resetting to completely clean empty fields when making a new package
        this.isEditMode = false;
        this.resetToEmptyForm();
      }
    } else {
      this.resetToEmptyForm();
    }
  }

  // Helper utility to strictly guarantee everything remains unselected initially
  resetToEmptyForm() {
    this.pkg = {
      id: 'p_' + Date.now(),
      name: '',
      price: 0,
      isExpanded: false,
      validity: '',
      sessions: 0,
      duration: '',
      programFor: [],
      trainingStyle: '',
      level: '',
      inclusions: [],
      expectedResults: []
    };
  }

  // Selection Action Handlers
  selectPrice(val: number) { this.pkg.price = val; }
  selectValidity(val: string) { this.pkg.validity = val; }
  selectSessions(val: number) { this.pkg.sessions = val; }
  selectDuration(val: string) { this.pkg.duration = val; }
  selectTrainingStyle(val: string) { this.pkg.trainingStyle = val; }
  selectLevel(val: string) { this.pkg.level = val; }

  // Array Selection Handlers
  hasProgramFor(val: string): boolean { return this.pkg.programFor.includes(val); }
  toggleProgramFor(val: string) {
    if (this.hasProgramFor(val)) {
      this.pkg.programFor = this.pkg.programFor.filter(x => x !== val);
    } else {
      this.pkg.programFor.push(val);
    }
  }

  hasInclusion(val: string): boolean { return this.pkg.inclusions.includes(val); }
  toggleInclusion(val: string) {
    if (this.hasInclusion(val)) {
      this.pkg.inclusions = this.pkg.inclusions.filter(x => x !== val);
    } else {
      this.pkg.inclusions.push(val);
    }
  }

  hasExpectedResult(val: string): boolean { return this.pkg.expectedResults.includes(val); }
  toggleExpectedResult(val: string) {
    if (this.hasExpectedResult(val)) {
      this.pkg.expectedResults = this.pkg.expectedResults.filter(x => x !== val);
    } else {
      this.pkg.expectedResults.push(val);
    }
  }

  async openAddCustomModal(title: string, targetField: string) {
    const modal = await this.modalCtrl.create({
      component: AddFieldPage,
      cssClass: 'oval-bottom-modal',
      initialBreakpoint: 0.45,
      breakpoints: [0, 0.45],
      handle: false,
      componentProps: { fieldTitle: title }
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();
    if (data && data.newItemName) {
      const name = data.newItemName.trim();
      if (name.length > 0) {
        if (targetField === 'programFor') {
          this.programForOptions.push(name);
          this.pkg.programFor.push(name);
        } else if (targetField === 'trainingStyle') {
          this.trainingStyleOptions.push(name);
          this.pkg.trainingStyle = name;
        } else if (targetField === 'level') {
          this.levelOptions.push(name);
          this.pkg.level = name;
        } else if (targetField === 'inclusion') {
          this.inclusionsOptions.push(name);
          this.pkg.inclusions.push(name);
        } else if (targetField === 'result') {
          this.expectedResultsOptions.push(name);
          this.pkg.expectedResults.push(name);
        }
      }
    }
  }

  savePackage() {
    if (!this.pkg.name.trim()) {
      alert('Please enter a package name');
      return;
    }

    if (this.isEditMode) {
      const index = this.masterPackages.findIndex(p => p.id === this.pkg.id);
      if (index !== -1) {
        this.masterPackages[index] = this.pkg;
      }
    } else {
      this.masterPackages.push(this.pkg);
    }

    this.router.navigate(['/package'], {
      state: { updatedPackages: this.masterPackages }
    });
  }

  goBack() {
    this.navCtrl.navigateBack('/package');
  }
}