import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-package',
  templateUrl: './add-package.page.html',
  styleUrls: ['./add-package.page.scss'],
  standalone:false,
})
export class AddPackagePage implements OnInit {

  contextCategory: string = 'Program';
  newItemName: string = '';
  
  // Routing tracking memory allocations
  retainedFormState: any = null;
  retainedNewMode: boolean = false;
  masterPackagesList: any[] = [];

  constructor(private router: Router) {}

  ngOnInit(): void {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.contextCategory = navigation.extras.state['context'] || 'Program';
      this.retainedFormState = navigation.extras.state['retainedFormState'];
      this.retainedNewMode = navigation.extras.state['retainedNewMode'] || false;
      this.masterPackagesList = navigation.extras.state['masterPackages'] || [];
    }
  }

  submitAndReturn(): void {
    if (!this.newItemName.trim()) return;

    // Direct redirection handoff back to the setup forms layout passing state data
    this.router.navigate(['/edit-package'], {
      state: { 
        retainedFormState: this.retainedFormState,
        retainedNewMode: this.retainedNewMode,
        masterPackages: this.masterPackagesList,
        appendValue: this.newItemName,
        contextCategory: this.contextCategory
      }
    });
  }

  dismissActionSheet(): void {
    this.router.navigate(['/edit-package'], {
      state: { 
        retainedFormState: this.retainedFormState,
        retainedNewMode: this.retainedNewMode,
        masterPackages: this.masterPackagesList
      }
    });
  }
}
