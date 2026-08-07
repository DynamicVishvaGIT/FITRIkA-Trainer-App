import { Component } from '@angular/core';
import {  Router } from '@angular/router';

interface MetricItem {
  name: string;
  selected: boolean;
  values: number[];
}

interface MetricCategory {
  title: string;
  items: MetricItem[];
}

@Component({
  selector: 'app-tracking-metrics',
  templateUrl: './tracking-metrics.page.html',
  styleUrls: ['./tracking-metrics.page.scss'],
  standalone:false,
})
export class TrackingMetricsPage {
  selectedTab: 'basic' | 'advanced' = 'basic';
  months: string[] = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

  // Complete Basic tab metrics categories & fields
  basicCategories: MetricCategory[] = [
    {
      title: 'Body Composition',
      items: [
        { name: 'body fat', selected: false, values: [15, 18, 22, 25, 30, 28, 35, 40, 42, 45, 50, 52] },
        { name: 'Water', selected: false, values: [20, 25, 30, 35, 40, 35, 45, 50, 52, 55, 65, 68] }
      ]
    },
    {
      title: 'Muscular',
      items: [
        { name: 'bench Press', selected: false, values: [40, 45, 50, 60, 65, 70, 75, 80, 85, 90, 95, 98] },
        { name: 'Water', selected: false, values: [20, 25, 30, 35, 40, 35, 45, 50, 52, 55, 65, 68] }
      ]
    },
    {
      title: 'Endurance',
      items: [
        { name: 'Traindmill', selected: false, values: [30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85] },
        { name: 'Water', selected: false, values: [20, 25, 30, 35, 40, 35, 45, 50, 52, 55, 65, 68] }
      ]
    },
    {
      title: 'Muscular Endurance',
      items: [
        { name: 'bench Press', selected: false, values: [40, 45, 50, 60, 65, 70, 75, 80, 85, 90, 95, 98] },
        { name: 'Water', selected: false, values: [20, 25, 30, 35, 40, 35, 45, 50, 52, 55, 65, 68] }
      ]
    },
    {
      title: 'Flexibility',
      items: [
        { name: 'Traindmill', selected: false, values: [10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65] },
        { name: 'Water', selected: false, values: [20, 25, 30, 35, 40, 35, 45, 50, 52, 55, 65, 68] }
      ]
    }
  ];

  constructor(
   
    private router: Router,
  
  ) {}

  // Complete Advanced tab metrics categories & fields sharing the exact same fields as Basic
  advancedCategories: MetricCategory[] = [
    {
      title: 'Body Composition',
      items: [
        { name: 'body fat', selected: false, values: [15, 18, 22, 25, 30, 28, 35, 40, 42, 45, 50, 52] },
        { name: 'Water', selected: false, values: [20, 25, 30, 35, 40, 35, 45, 50, 52, 55, 65, 68] }
      ]
    },
    {
      title: 'Muscular',
      items: [
        { name: 'bench Press', selected: false, values: [40, 45, 50, 60, 65, 70, 75, 80, 85, 90, 95, 98] },
        { name: 'Water', selected: false, values: [20, 25, 30, 35, 40, 35, 45, 50, 52, 55, 65, 68] }
      ]
    },
    {
      title: 'Endurance',
      items: [
        { name: 'Traindmill', selected: false, values: [30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85] },
        { name: 'Water', selected: false, values: [20, 25, 30, 35, 40, 35, 45, 50, 52, 55, 65, 68] }
      ]
    },
    {
      title: 'Muscular Endurance',
      items: [
        { name: 'bench Press', selected: false, values: [40, 45, 50, 60, 65, 70, 75, 80, 85, 90, 95, 98] },
        { name: 'Water', selected: false, values: [20, 25, 30, 35, 40, 35, 45, 50, 52, 55, 65, 68] }
      ]
    },
    {
      title: 'Flexibility',
      items: [
        { name: 'Traindmill', selected: false, values: [10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65] },
        { name: 'Water', selected: false, values: [20, 25, 30, 35, 40, 35, 45, 50, 52, 55, 65, 68] }
      ]
    }
  ];

  showBottomSheet: boolean = false;
  isDropdownOpen: boolean = false;
  showSuccessMessage: boolean = false;
  
  newMetric = {
    name: '',
    categoryTitle: '',
    initialScore: null as number | null
  };

  get activeCategories(): MetricCategory[] {
    return this.selectedTab === 'basic' ? this.basicCategories : this.advancedCategories;
  }

  get activeVariables(): MetricItem[] {
    const list: MetricItem[] = [];
    const allCats = [...this.basicCategories, ...this.advancedCategories];
    allCats.forEach(cat => {
      cat.items.forEach(item => {
        if (item.selected && !list.includes(item)) {
          list.push(item);
        }
      });
    });
    return list;
  }

  goBack(): void {
    this.router.navigate(['/profile']);
  }

  toggleVariable(item: MetricItem): void {
    item.selected = !item.selected;
  }

  removeSingleVariable(item: MetricItem): void {
    item.selected = false;
  }

  clearActiveVariables(): void {
    const allCats = [...this.basicCategories, ...this.advancedCategories];
    allCats.forEach(cat => {
      cat.items.forEach(item => {
        item.selected = false;
      });
    });
  }

  getGridY(val: number): number {
    return 170 - (val / 100) * 160;
  }

  getXPos(index: number): number {
    const start = 35;
    const end = 310;
    return start + (index / (this.months.length - 1)) * (end - start);
  }

  get chartPath(): string {
    const active = this.activeVariables;
    if (active.length === 0) return '';

    const baseValues = active[0].values;
    const avgValues = baseValues.map((_, mIndex) => {
      let sum = 0;
      active.forEach(item => {
        sum += item.values[mIndex];
      });
      return sum / active.length;
    });

    return avgValues.reduce((acc, val, idx) => {
      const x = this.getXPos(idx);
      const y = this.getGridY(val);
      return idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
    }, '');
  }

  openBottomSheet(category?: MetricCategory): void {
    this.newMetric = {
      name: '',
      categoryTitle: category ? category.title : this.activeCategories[0].title,
      initialScore: null
    };
    this.isDropdownOpen = false;
    this.showBottomSheet = true;
  }

  closeBottomSheet(): void {
    this.showBottomSheet = false;
    this.isDropdownOpen = false;
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  selectCategory(title: string): void {
    this.newMetric.categoryTitle = title;
    this.isDropdownOpen = false;
  }

  saveNewMetric(): void {
    if (!this.newMetric.name || !this.newMetric.name.trim()) return;

    const targetCategoryTitle = this.newMetric.categoryTitle || this.activeCategories[0].title;
    
    let targetCat = this.basicCategories.find(c => c.title === targetCategoryTitle);
    if (!targetCat) {
      targetCat = this.advancedCategories.find(c => c.title === targetCategoryTitle);
    }

    const initialVal = this.newMetric.initialScore !== null ? Number(this.newMetric.initialScore) : 50;
    const generatedValues = Array(12).fill(initialVal).map((v, i) => Math.min(100, Math.max(0, v + (i * 2))));

    const newItem: MetricItem = {
      name: this.newMetric.name.trim(),
      selected: true,
      values: generatedValues
    };

    if (targetCat) {
      targetCat.items.push(newItem);
    } else {
      this.activeCategories[0].items.push(newItem);
    }

    this.closeBottomSheet();
  }

  submitMetrics(): void {
    const payload = {
      selectedMetrics: this.activeVariables,
      timestamp: new Date().toISOString()
    };
    console.log('Successfully Submitted Metrics Payload:', payload);
    
    this.showSuccessMessage = true;
    setTimeout(() => {
      this.showSuccessMessage = false;
    }, 3000);
  }
}