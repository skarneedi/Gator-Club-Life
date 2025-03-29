// app.routes.ts
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
import { MySubmissionsComponent } from './my-submissions/my-submissions.component'; // Import the new component

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'home', component: HomeComponent, canActivate: [authGuard] },
  { path: 'about', component: AboutComponent, canActivate: [authGuard] },
  { path: 'contact', component: ContactComponent, canActivate: [authGuard] },
  { path: 'events', component: EventsComponent, canActivate: [authGuard] },
  {
    path: 'organizations',
    component: OrganizationsComponent,
    canActivate: [authGuard],
  },
  {
    path: 'organizations/:id', // Dynamic route for organization details
    component: OrganizationDetailsComponent, // Use the new component
    canActivate: [authGuard],
  },
  { path: 'permits', component: PermitsComponent, canActivate: [authGuard] },
  {
    path: 'my-submissions',
    component: MySubmissionsComponent, // Add the new component here
    canActivate: [authGuard],
  },
];