// app.routes.ts
import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { authGuard } from './auth.guard';
import { EventsComponent } from './events/events.component'; // Import EventsComponent
import { OrganizationsComponent } from './organizations/organizations.component'; // Import OrganizationsComponent

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // Default route redirects to login
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent }, // Add the /register route
  { path: 'home', component: HomeComponent, canActivate: [authGuard] },
  { path: 'about', component: AboutComponent, canActivate: [authGuard] },
  { path: 'contact', component: ContactComponent, canActivate: [authGuard] },
  { path: 'events', component: EventsComponent, canActivate: [authGuard] }, // Route for EventsComponent
  { path: 'organizations', component: OrganizationsComponent, canActivate: [authGuard] }, // Route for OrganizationsComponent
];