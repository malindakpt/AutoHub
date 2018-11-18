import { Routes } from '@angular/router';
import { ErrorComponent } from './components/error/error.component';
import { AddVehicleComponent } from './components/add-vehicle/add-vehicle.component';
import { VehicleProfileComponent } from './components-sub/vehicle-profile/vehicle-profile.component';
import { NewsListComponent } from './components/news-list/news-list.component';
import { AddNewsComponent } from './components/add-news/add-news.component';
import { LoginComponent } from './components/login/login.component';
import {AuthGuardService} from './services/auth.guard.service';
import {SecureComponent} from './components/secure/secure.component';
import {SearchListComponent} from './components/search-list/search-list.component';
import {SettingsComponent} from './components/settings/settings.component';

export const appRoutes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'error', component: ErrorComponent, canActivate: [AuthGuardService] },
    {
      path: 'secure', component: SecureComponent, canActivate: [AuthGuardService], children: [
        { path: '', redirectTo: 'profile/1', pathMatch: 'full' },
        { path: 'news/:ref', component: NewsListComponent },
        { path: 'add-news', component: AddNewsComponent },
        { path: 'profile/:ref', component: VehicleProfileComponent },
        { path: 'add', component: AddVehicleComponent },
        { path: 'search', component: SearchListComponent },
        { path: 'settings', component: SettingsComponent },
      ]
    },
  { path: '**', redirectTo: '/error', pathMatch: 'full' },
];
