import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrganizationDetailsComponent } from './organization-details.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('OrganizationDetailsComponent', () => {
  let component: OrganizationDetailsComponent;
  let fixture: ComponentFixture<OrganizationDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrganizationDetailsComponent, HttpClientTestingModule],
      providers: [
        { provide: ActivatedRoute, useValue: { params: of({ id: 123 }) } }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OrganizationDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the organization details component', () => {
    expect(component).toBeTruthy();
  });
});
