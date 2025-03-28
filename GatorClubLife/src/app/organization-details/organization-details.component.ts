import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common'; // For *ngIf and *ngFor
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-organization-details',
  templateUrl: './organization-details.component.html',
  styleUrls: ['./organization-details.component.css'],
  standalone: true,
  imports: [CommonModule], // Import required modules
})
export class OrganizationDetailsComponent implements OnInit {
  organizationId: string | null = null;
  organization: any = {};
  announcements: any[] = [];
  events: any[] = [];
  officers: any[] = [];

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.organizationId = params['id'];
      if (this.organizationId) {
        this.http.get(`http://localhost:8080/organizations/${this.organizationId}`)
          .subscribe((data: any) => {
            this.organization = data;
          });
      }
    });
  }
}