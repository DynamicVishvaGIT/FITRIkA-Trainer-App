import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-forms',
  templateUrl: './forms.page.html',
  styleUrls: ['./forms.page.scss'],
  standalone: false
})
export class FormsPage {
  selectedSection: string = '';

  constructor(
    private router: Router,
    private location: Location
  ) {}

  back(): void {
    this.location.back();
  }

  chooseSection(section: string): void {
    this.selectedSection = section;
  }

  continue(): void {
    if (!this.selectedSection) {
      alert('Please select an assessment section first.');
      return;
    }

    this.router.navigate(['/submit-form'], {
      queryParams: {
        type: this.selectedSection
      }
    });
  }
}