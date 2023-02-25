import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DonorDashboardComponent } from './components/donor-dashboard/donor-dashboard.component';
import { DonorDonateComponent } from './components/donor-donate/donor-donate.component';
import { DonorSettingsComponent } from './components/donor-settings/donor-settings.component';
import { LoginRegisterComponent } from './components/login-register/login-register.component';
import { ReceiverMapComponent } from './components/receiver-map/receiver-map.component';
import { DonorGuard } from './shared/guard/donor.guard';
import { DoneeGuard } from './shared/guard/donee.guard';

const routes: Routes = [
  { path: 'dashboard', component: DonorDashboardComponent, canActivate: [DonorGuard] },
  { path: 'map', component: ReceiverMapComponent, canActivate: [DoneeGuard] },
  { path: 'donate', component: DonorDonateComponent, canActivate: [DonorGuard] },
  { path: 'settings', component: DonorSettingsComponent, canActivate: [DonorGuard] },
  { path: 'login', component: LoginRegisterComponent },
  { path: '**', component: LoginRegisterComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
