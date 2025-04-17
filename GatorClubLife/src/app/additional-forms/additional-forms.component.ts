import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-additional-forms',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './additional-forms.component.html',
  styleUrls: ['./additional-forms.component.css']
})
export class AdditionalFormsComponent {
  constructor(private router: Router) {}

  goBack() {
    this.router.navigate(['/dates']); 
  }

  goToNextPage() {
    this.router.navigate(['/review']); 
  }
}
