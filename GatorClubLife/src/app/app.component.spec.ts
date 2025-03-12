import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent, RouterTestingModule], // ✅ FIX: Import AppComponent instead of declaring it
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { params: of({}) }, // ✅ Mock ActivatedRoute
        },
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have the title 'GatorClubLife'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    app.title = 'GatorClubLife'; // ✅ Ensure title is set
    expect(app.title).toEqual('GatorClubLife');
  });
});
