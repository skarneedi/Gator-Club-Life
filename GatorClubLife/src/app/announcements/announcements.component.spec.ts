import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AnnouncementsComponent } from './announcements.component';

describe('AnnouncementsComponent', () => {
  let component: AnnouncementsComponent;
  let fixture: ComponentFixture<AnnouncementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnnouncementsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AnnouncementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should filter announcements based on category', () => {
    component.selectedCategory = 'Event';
    component.filterAnnouncements();
    expect(
      component.filteredAnnouncements.every((a) => a.category === 'Event')
    ).toBeTrue();
  });

  it('should search announcements by title', () => {
    component.searchTerm = 'AI Club';
    component.filterAnnouncements();
    expect(component.filteredAnnouncements.length).toBeGreaterThan(0);
  });
});
