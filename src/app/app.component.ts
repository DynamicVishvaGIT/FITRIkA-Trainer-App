import { Component, ViewChild } from '@angular/core';
import { IonTabs, Platform } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {

  public selectedIndex = 0;

  selectedPath = '';
  selected: boolean = false;

  public appPages = [
    {
      title: 'Dashboard',
      url: '/dashboard',
      icon: 'home-outline'
    },
  ];

  @ViewChild('myTabs', { static: false }) tabs!: IonTabs;

  selectedTab: string = '';
  activeTabName: string | undefined = '';
  tab_name: any;

  userstatus_data: any;
  userstatus: any;
  loginStatus: boolean = false;

  displayProfileData = {
    first_name: '',
    last_name: '',
    email: '',
    avatar: ''
  };

  currentUser: any;

  constructor(
    private platform: Platform,
    private router: Router
  ) {
    this.initializeHardwareBackButton();
  }

  private initializeHardwareBackButton(): void {

    this.platform.ready().then(() => {

      this.platform.backButton.subscribeWithPriority(
        10,
        (processNextHandler) => {

          /*
           * Let Ionic handle opened overlays first.
           * This is important for your Add Slot/Edit Slot
           * modal flows.
           */
          if (this.isOverlayOpen()) {
            processNextHandler();
            return;
          }

          const currentUrl = this.router.url.split('?')[0];

          console.log(
            '[Hardware Back] Current page:',
            currentUrl
          );

          /*
           * Pages with a fixed parent in your application.
           */
          const backRoutes: { [key: string]: string } = {

            // Profile flow
            '/slot': '/my-profile',
            '/package': '/my-profile',

            // Package flow
            '/edit-package': '/package',
            '/add-package': '/edit-package',

            // Slot flow
            '/edit-slot': '/slot',
            '/add-slot': '/slot',

            // Workout flow
            '/workout-details': '/workout-plans',
            '/workout-plan-detail': '/workout-details',
            '/add-workout': '/workout-details',
            '/add-day-plan': '/workout-plan-detail',

            // Diet flow
            '/diet-plan': '/dashboard',
            '/diet-plan-details': '/diet-plan',
            '/add-diet-plan': '/diet-plan',
            '/add-diet-plan-details': '/diet-plan-details',

            // Profile related pages
            '/profile': '/clients',
            '/workout-log': '/profile',
            '/diet-log': '/profile',
            '/tracking-metrics': '/profile',

            // Forms flow
            '/forms': '/dashboard',
            '/submit-form': '/forms',
            '/begin-assessment': '/forms',

            // Other pages
            '/clients': '/dashboard',
            '/prospects': '/dashboard',
            '/schedule': '/dashboard'
          };

          /*
           * If this page has an explicitly defined parent,
           * use that parent.
           */
          if (backRoutes[currentUrl]) {

            this.router.navigate([backRoutes[currentUrl]]);
            return;
          }

          /*
           * For pages that don't have a special parent,
           * use normal browser/router history.
           */
          if (this.canGoBack()) {
            window.history.back();
            return;
          }

          /*
           * At the root of the application.
           */
          this.exitApp();
        }
      );

    });

  }

  /**
   * Check if an Ionic overlay is currently open.
   */
  private isOverlayOpen(): boolean {

    return !!(
      document.querySelector('ion-modal') ||
      document.querySelector('ion-alert') ||
      document.querySelector('ion-action-sheet') ||
      document.querySelector('ion-popover') ||
      document.querySelector('ion-loading')
    );

  }

  /**
   * Check whether there is navigation history.
   */
  private canGoBack(): boolean {

    return window.history.length > 1;

  }

  /**
   * Exit Android application.
   */
  private exitApp(): void {

    const cordovaApp = (window as any)?.navigator?.app;

    if (cordovaApp?.exitApp) {

      cordovaApp.exitApp();

    } else {

      console.log(
        '[Hardware Back] No previous page. Exit app.'
      );

    }

  }


  getSelectedTab(): void {

    if (this.tabs) {

      this.selected = true;

      this.activeTabName =
        this.tabs.getSelected() || '';

      this.tab_name =
        this.activeTabName;

    }

  }

}



// import { Component } from '@angular/core';
// import {  ViewChild } from '@angular/core';
// import { IonTabs,  } from '@ionic/angular';
// @Component({
//   selector: 'app-root',
//   templateUrl: 'app.component.html',
//   styleUrls: ['app.component.scss'],
//   standalone: false,
// })
// export class AppComponent {
//  public selectedIndex = 0;
//   selectedPath = '';
//   selected:boolean = false;
//   public appPages = [
//     {
//       title: 'Dashboard',
//       url: '/home',
//       icon: 'home-outline'
//     },
//   ];
//   @ViewChild('myTabs',{ static: false }) tabs!: IonTabs;
//   selectedTab: string = '';
//   activeTabName: string | undefined = '';
//   tab_name: any;
//   userstatus_data: any;
//   userstatus: any;
//   loginStatus: boolean = false;
//   displayProfileData = {first_name: '', last_name: '', email: '', avatar: ''};
//   currentUser:any;
//   constructor() {}

//    getSelectedTab(): void {
//     if (this.tabs) {
//       this.selected = true;
//       this.activeTabName = this.tabs.getSelected() || '';
//       this.tab_name = this.activeTabName;
//     }
//   }

// }
