import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DonorDashboardComponent } from './components/donor-dashboard/donor-dashboard.component';
import { DonorDonateComponent } from './components/donor-donate/donor-donate.component';
import { DonorSettingsComponent } from './components/donor-settings/donor-settings.component';
import { LoginRegisterComponent } from './components/login-register/login-register.component';
import { ReceiverMapComponent } from './components/receiver-map/receiver-map.component';
import { AuthguardGuard } from './shared/authguard.guard';

const routes: Routes = [
  { path: 'dashboard', component: DonorDashboardComponent, canActivate: [AuthguardGuard] }, //TODO protect these routes with a DonorGuard
  { path: 'map', component: ReceiverMapComponent, canActivate: [AuthguardGuard] },
  { path: 'donate', component: DonorDonateComponent, canActivate: [AuthguardGuard] },
  { path: 'settings', component: DonorSettingsComponent, canActivate: [AuthguardGuard] },
  { path: 'login', component: LoginRegisterComponent },
  { path: '**', component: LoginRegisterComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
