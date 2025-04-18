import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgClass, CommonModule } from '@angular/common'; // ✅ Add NgClass here

@Component({
  selector: 'app-events-form',
  standalone: true,
  imports: [CommonModule, NgClass], // ✅ Include NgClass
  templateUrl: './events-form.component.html',
  styleUrls: ['./events-form.component.css']
})
export class EventsFormComponent {
  categories = [
    'BANNERS',
    'CENTURY TOWER LIGHTING',
    'GENERAL',
    'RUN/WALK',
    'TABLING'
  ];

  selectedCategories: string[] = [];

  constructor(private router: Router) {}

  toggleCategory(category: string): void {
    const index = this.selectedCategories.indexOf(category);
    if (index > -1) {
      this.selectedCategories.splice(index, 1);
    } else {
      this.selectedCategories.push(category);
    }
  }

  isSelected(category: string): boolean {
    return this.selectedCategories.includes(category);
  }

  goToEventDates(): void {
    this.router.navigate(['/dates']);
  }
}
