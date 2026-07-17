import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.page.html',
  styleUrls: ['./clients.page.scss'],
  standalone: false,
})
export class ClientsPage implements OnInit {

  activeTab: 'prospects' | 'clients' | 'ex-clients' = 'clients';
  searchQuery: string = '';
  
  allClients: Array<{
    name: string;
    phone: string;
    gender: string;
    email: string;
    avatar: string;
    type: 'prospects' | 'clients' | 'ex-clients';
  }> = [
    {
      name: 'Astha Dhaliwal',
      phone: '+91 9876543210',
      gender: 'Female',
      email: 'asthadhaliwal@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200',
      type: 'clients'
    },
    {
      name: 'Astha Mehta',
      phone: '+91 9876543210',
      gender: 'Female',
      email: 'asthamehta@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200',
      type: 'clients'
    },
    {
      name: 'Amritpal Singh',
      phone: '+91 9123456789',
      gender: 'Male',
      email: 'amrit.singh@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200',
      type: 'clients'
    },
    {
      name: 'Bhavna Sharma',
      phone: '+91 9988776655',
      gender: 'Female',
      email: 'bhavna.sharma@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200',
      type: 'prospects'
    },
    {
      name: 'Divya Teja',
      phone: '+91 9440123456',
      gender: 'Female',
      email: 'divya.teja@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=200',
      type: 'prospects'
    },
    {
      name: 'Rahul Verma',
      phone: '+91 9000112233',
      gender: 'Male',
      email: 'rahul.verma@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200',
      type: 'ex-clients'
    }
  ];
  
  filteredClients: any[] = [];

  // FIXED: Injected standard Router instead of NavController
  constructor(private router: Router) {}

  ngOnInit(): void {
    this.filterClients();
  }

  filterClients(): void {
    this.filteredClients = this.allClients.filter(client => {
      const matchesSearch = client.name.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchesTab = client.type === this.activeTab;
      return matchesSearch && matchesTab;
    });
  }

  setTab(tab: 'prospects' | 'clients' | 'ex-clients'): void {
    this.activeTab = tab;
    this.filterClients();
  }

  getCount(type: 'prospects' | 'clients' | 'ex-clients'): number {
    return this.allClients.filter(c => c.type === type).length;
  }

  // FIXED: Redirects to the Profile page using Router extras configuration
  viewClientProfile(client: any) {
    const extras: NavigationExtras = {
      state: { clientData: client }
    };
    
    this.router.navigate(['/profile'], extras);
  }
}