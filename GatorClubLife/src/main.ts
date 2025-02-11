import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { HomeComponent } from './app/home/home.component';
import { provideRouter, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', component: HomeComponent },
];


bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
