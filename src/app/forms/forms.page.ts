import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-forms',
  templateUrl: './forms.page.html',
  styleUrls: ['./forms.page.scss'],
  standalone: false,
})
export class FormsPage implements OnInit {

  // Tracker for the chosen configuration item row
  selectedSection: string = '';

  constructor(
    private router: Router,
    private location: Location
  ) { }

  ngOnInit(): void { }

  back(): void {
    this.location.back();
  }

  /**
   * Tracks item clicks on content panels
   */
  chooseSection(section: string): void {
    this.selectedSection = section;
  }

  /**
   * Evaluates section status and pushes view transition forward
   */
  continue(): void {
    if (!this.selectedSection || this.selectedSection.trim() === '') {
      alert('Please choose a form section configuration row first to proceed');
      return;
    }

    // Navigate to submit-form and pass the active section type parameter
  this.router.navigate(['/submit-form'], { 
    queryParams: { type: this.selectedSection } 
  });
}
}