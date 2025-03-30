import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MyEventsComponent } from './my-events.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

describe('MyEventsComponent', () => {
  let component: MyEventsComponent;
  let fixture: ComponentFixture<MyEventsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyEventsComponent, FormsModule, CommonModule],
    }).compileComponents();

    fixture = TestBed.createComponent(MyEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should filter events by category', () => {
    component.selectedCategory = 'Workshop';
    component.applyFilters();
    expect(component.filteredEvents.every(e => e.category === 'Workshop')).toBeTrue();
  });

  it('should search events by title', () => {
    component.searchTerm = 'Angular';
    component.applyFilters();
    expect(component.filteredEvents.some(e => e.title.includes('Angular'))).toBeTrue();
  });

  it('should toggle favorite', () => {
    const eventBefore = component.events.find(e => e.id === 1)?.isFavorite;
    component.toggleFavorite(1);
    const eventAfter = component.events.find(e => e.id === 1)?.isFavorite;
    expect(eventBefore).not.toEqual(eventAfter);
  });
});
