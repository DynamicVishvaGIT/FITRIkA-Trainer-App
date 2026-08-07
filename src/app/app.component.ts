import { Component } from '@angular/core';
import {  ViewChild } from '@angular/core';
import { IonTabs,  } from '@ionic/angular';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
 public selectedIndex = 0;
  selectedPath = '';
  selected:boolean = false;
  public appPages = [
    {
      title: 'Dashboard',
      url: '/home',
      icon: 'home-outline'
    },
  ];
  @ViewChild('myTabs',{ static: false }) tabs!: IonTabs;
  selectedTab: string = '';
  activeTabName: string | undefined = '';
  tab_name: any;
  userstatus_data: any;
  userstatus: any;
  loginStatus: boolean = false;
  displayProfileData = {first_name: '', last_name: '', email: '', avatar: ''};
  currentUser:any;
  constructor() {}

   getSelectedTab(): void {
    if (this.tabs) {
      this.selected = true;
      this.activeTabName = this.tabs.getSelected() || '';
      this.tab_name = this.activeTabName;
    }
  }

}
