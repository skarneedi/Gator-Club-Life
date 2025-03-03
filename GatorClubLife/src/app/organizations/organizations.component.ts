// organizations.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-organizations',
  templateUrl: './organizations.component.html',
  styleUrls: ['./organizations.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class OrganizationsComponent {
  searchTerm = '';
  selectedCategory: string | null = null; // Tracks the currently selected category

  // Sort categories alphabetically
  categories = [
    'Academic/Research',
    'Academic/Research-Nursing',
    'Agricultural and Life Sciences',
    'Construction, and Planning',
    'Education',
  ].sort(); // Sort the array alphabetically

  organizations = [
    { name: '360BHM', description: 'The purpose of the 360BHM...', viewPage: '#', category: 'Academic/Research' },
    { name: '3D Printing Club', description: 'The 3D Printing Club is...', viewPage: '#', category: 'Education' },
    { name: 'A Private Inn', description: 'A Private Inn is affiliated...', viewPage: '#', category: 'Agricultural and Life Sciences' },
    { name: 'A Reason to Give', description: 'Our goal is to help serve...', viewPage: '#', category: 'Construction, and Planning' },
  ];

  // Method to select a category
  selectCategory(category: string) {
    this.selectedCategory = this.selectedCategory === category ? null : category;
  }

  // Get filtered organizations based on search term and selected category
  get filteredOrganizations() {
    return this.organizations.filter(org => {
      const matchesSearch = org.name.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesCategory = this.selectedCategory ? org.category === this.selectedCategory : true;
      return matchesSearch && matchesCategory;
    });
  }
}