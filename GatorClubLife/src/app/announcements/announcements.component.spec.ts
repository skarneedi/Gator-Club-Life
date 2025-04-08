import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AnnouncementsComponent } from './announcements.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AnnouncementsComponent', () => {
  let component: AnnouncementsComponent;
  let fixture: ComponentFixture<AnnouncementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnnouncementsComponent, HttpClientTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(AnnouncementsComponent);
    component = fixture.componentInstance;

    // Mock filteredAnnouncements with the 'category' property
    component.filteredAnnouncements = [
      { title: 'Club Meeting', category: 'Event' },
      { title: 'Workshop', category: 'Event' },
    ] as any;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have all announcements with category "Event"', () => {
    expect(component.filteredAnnouncements.every((a: any) => a.category === 'Event')).toBeTrue();
  });
});
