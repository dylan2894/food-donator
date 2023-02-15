import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DonorDashboardComponent } from './components/donor-dashboard/donor-dashboard.component';
import { DonorDonateComponent } from './components/donor-donate/donor-donate.component';
import { DonorSettingsComponent } from './components/donor-settings/donor-settings.component';
import { LoginComponent } from './components/login/login.component';
import { ReceiverMapComponent } from './components/receiver-map/receiver-map.component';
import { RegisterComponent } from './components/register/register.component';
import { AuthguardGuard } from './shared/authguard.guard';

const routes: Routes = [
  { path: 'dashboard', component: DonorDashboardComponent, canActivate: [AuthguardGuard] },
  { path: 'map', component: ReceiverMapComponent, canActivate: [AuthguardGuard] },
  { path: 'donate', component: DonorDonateComponent, canActivate: [AuthguardGuard] },
  { path: 'settings', component: DonorSettingsComponent, canActivate: [AuthguardGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '**', component: LoginComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
