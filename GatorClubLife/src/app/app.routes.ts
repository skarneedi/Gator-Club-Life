import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { authGuard } from './auth.guard';
import { EventsComponent } from './events/events.component';
import { OrganizationsComponent } from './organizations/organizations.component';
import { OrganizationDetailsComponent } from './organization-details/organization-details.component';
import { PermitsComponent } from './permits/permits.component';
import { MySubmissionsComponent } from './my-submissions/my-submissions.component';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { MyEventsComponent } from './my-events/my-events.component';
import { EventsFormComponent } from './events-form/events-form.component'; // Import the existing form component
import { EventDatesComponent } from './event-dates/event-dates.component'; // Import the new component

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // Default route
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'home', component: HomeComponent, canActivate: [authGuard] },
  { path: 'about', component: AboutComponent, canActivate: [authGuard] },
  { path: 'contact', component: ContactComponent, canActivate: [authGuard] },
  { path: 'events', component: EventsComponent, canActivate: [authGuard] },
  { path: 'profile', component: MyProfileComponent, canActivate: [authGuard] },
  { path: 'my-events', component: MyEventsComponent },
  {
    path: 'organizations',
    component: OrganizationsComponent,
    canActivate: [authGuard],
  },
  {
    path: 'organizations/:id',
    component: OrganizationDetailsComponent,
    canActivate: [authGuard],
  },
  { path: 'permits', component: PermitsComponent, canActivate: [authGuard] },
  { path: 'my-submissions', component: MySubmissionsComponent, canActivate: [authGuard] },
  { path: 'my-profile', component: MyProfileComponent, canActivate: [authGuard] },
  // Route for permit forms
  { path: 'forms/:permitType', component: EventsFormComponent, canActivate: [authGuard] }, // Dynamic route for form pages
  { path: 'dates', component: EventDatesComponent, canActivate: [authGuard] }, // New route for event dates page
];