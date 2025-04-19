import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EventPermitService } from '../services/event-permit.service';

@Component({
  selector: 'app-additional-forms',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './additional-forms.component.html',
  styleUrls: ['./additional-forms.component.css']
})
export class AdditionalFormsComponent {
  notes: string = '';
  processedFiles: any[] = [];

  constructor(
    private router: Router,
    private permitService: EventPermitService
  ) {}

  handleFileUpload(event: any) {
    const files = event.target.files;
    this.processedFiles = [];

    for (let file of files) {
      this.processedFiles.push({
        file_name: file.name,
        file_url: `/uploads/${file.name}` // Simulated placeholder
      });
    }
  }

  goBack() {
    this.router.navigate(['/dates']);
  }

  goToNextPage() {
    this.permitService.setDocuments(this.processedFiles);
    this.permitService.setAdditionalNotes(this.notes);
    this.router.navigate(['/review']);
  }
}
