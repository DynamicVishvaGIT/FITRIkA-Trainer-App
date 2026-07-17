import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

interface ProfileDataset {
  name: string;
  email: string;
  avatar: string;
  experience: string;
  rating: number;
  mobile: string;
  location: string;
  birthdate: string;
  gender: string;
  specialties: string[];
  certificates: string[];
  tags: string[];
  about: string;
}

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.page.html',
  styleUrls: ['./my-profile.page.scss'],
  standalone: false
})
export class MyProfilePage implements OnInit {
  
  public isEditing: boolean = false;

  public profileData: ProfileDataset = {
    name: 'Hany Rambod',
    email: 'hanyrambod07@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop',
    experience: '5Years',
    rating: 4.5,
    mobile: '9876543210',
    location: 'Andheri (E)',
    birthdate: '29/02/2024',
    gender: 'Male',
    specialties: [
      'lose weight and get tonned',
      'Gain flexibility',
      'Build Muscles and boost stamina',
      'Post-physical therapy recovery.',
      'Improving mobility',
      'diet & lifestyle changes'
    ],
    certificates: [
      'https://images.unsplash.com/photo-1589330694653-ded6df03f754?q=80&w=150&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1589330694653-ded6df03f754?q=80&w=150&auto=format&fit=crop'
    ],
    tags: ['Strength', 'Circuits', 'Cardio', 'Nutrition'],
    about: 'Hany believes that by unlocking the body and the mind trough regular strength practice everything else in life becomes...'
  };

  public availableTags: string[] = [
    'Fat loss', 
    'Beginner', 
    '4 weeks', 
    'Push, pull, leg', 
    'HIIT', 
    'Yoga', 
    'Crossfit'
  ];

  constructor(private navCtrl: NavController) {}

  ngOnInit(): void {}

  public toggleProfileMode(): void {
    this.isEditing = !this.isEditing;
  }

  // --- SPECIALTY CAPSULED LOGIC PIPELINE ---
  public appendNewSpecialtyValue(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const cleanValue = inputElement.value.trim();
    
    if (cleanValue && !this.profileData.specialties.includes(cleanValue)) {
      this.profileData.specialties.push(cleanValue);
      inputElement.value = ''; 
    }
  }
  // Add near your properties at the top
public isGenderDropdownOpen: boolean = false;

// Add alongside your other methods
public toggleGenderDropdown(): void {
  this.isGenderDropdownOpen = !this.isGenderDropdownOpen;
}

public selectGenderValue(chosenGender: string): void {
  this.profileData.gender = chosenGender;
  this.isGenderDropdownOpen = false;
}

  public deleteSpecialty(specToDelete: string): void {
    this.profileData.specialties = this.profileData.specialties.filter(spec => spec !== specToDelete);
  }

  // --- TAGS CAPSULED LOGIC PIPELINE ---
  public appendNewTagValue(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const cleanValue = inputElement.value.trim();
    
    if (cleanValue && !this.profileData.tags.includes(cleanValue)) {
      this.profileData.tags.push(cleanValue);
      inputElement.value = ''; 
    }
  }

  public selectTag(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedValue = selectElement.value;
    if (selectedValue && !this.profileData.tags.includes(selectedValue)) {
      this.profileData.tags.push(selectedValue);
    }
    selectElement.value = ''; 
  }

  public deleteTag(tagToDelete: string): void {
    this.profileData.tags = this.profileData.tags.filter(tag => tag !== tagToDelete);
  }

  public triggerUpload(): void {
    alert('Access sequence to device camera library pipeline initiated.');
  }

  public trackByIndex(index: number, item: any): number {
    return index;
  }
  navigateToSlots() {
    this.navCtrl.navigateForward('/slot', {
      state: {
        profile: {
          name: this.profileData.name,
          avatar: this.profileData.avatar,
          mobile: this.profileData.mobile,
          gender: this.profileData.gender,
          email: this.profileData.email
        }
      }
    });
  }
  goBack() {
    this.navCtrl.navigateBack('/dashboard');
  }

  navigateToPackages() {
    this.navCtrl.navigateForward('/package');
  }
}