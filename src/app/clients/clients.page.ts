
import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { Location } from '@angular/common';

interface Client {
  name: string;
  phone: string;
  gender: string;
  email: string;
  avatar: string;
  startDate: string;
  endDate: string;
  duration: string;
  amount: number;
  type: 'prospects' | 'clients' | 'ex-clients';
}

@Component({
  selector: 'app-clients',
  templateUrl: './clients.page.html',
  styleUrls: ['./clients.page.scss'],
  standalone: false,
})
export class ClientsPage implements OnInit {

  searchQuery: string = '';

  allClients: Client[] = [

    {
      name: 'Astha Dhaliwal',
      phone: '+91 9876543210',
      gender: 'Female',
      email: 'asthadhaliwal@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200',
      startDate: '26/5/2025',
      endDate: '26/6/2025',
      duration: '1 Month',
      amount: 15000,
      type: 'clients'
    },

    {
      name: 'Seema Maheshwari',
      phone: '+91 9876543210',
      gender: 'Female',
      email: 'seemamaheshwari@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200',
      startDate: '26/5/2025',
      endDate: '26/6/2025',
      duration: '1 Month',
      amount: 15000,
      type: 'clients'
    },

    {
      name: 'Tarun Neerendra Gour',
      phone: '+91 9123456789',
      gender: 'Male',
      email: 'tarun.gour@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200',
      startDate: '26/5/2025',
      endDate: '26/6/2025',
      duration: '1 Month',
      amount: 15000,
      type: 'clients'
    },

    {
      name: 'Jillian Michaels',
      phone: '+91 9988776655',
      gender: 'Female',
      email: 'jillian.michaels@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200',
      startDate: '26/5/2025',
      endDate: '26/6/2025',
      duration: '1 Month',
      amount: 15000,
      type: 'clients'
    }

  ];

  filteredClients: Client[] = [];

  constructor(
    private router: Router,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.filterClients();
  }

  // FILTER CLIENTS
  filterClients(): void {

    this.filteredClients = this.allClients.filter(client =>
      client.name.toLowerCase().includes(this.searchQuery.toLowerCase())
    );

  }

  // BACK BUTTON
  goBack(): void {
    this.location.back();
  }

  // OPEN CLIENT PROFILE
  viewClientProfile(client: Client): void {

    const extras: NavigationExtras = {
      state: {
        clientData: client
      }
    };

    this.router.navigate(['/profile'], extras);

  }

}
