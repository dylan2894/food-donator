import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginRegisterComponent } from './components/login-register/login-register.component';
import { ReceiverMapComponent } from './components/receiver-map/receiver-map.component';
import { DonorGuard } from './shared/guard/donor.guard';
import { DoneeGuard } from './shared/guard/donee.guard';
import { DonorComponent } from './components/donor/donor.component';
import { DoneeSettingsComponent } from './components/donee-settings/donee-settings.component';
import { DoneeComponent } from './components/donee/donee.component';
import { DonationsComponent } from './components/donations/donations.component';

const routes: Routes = [
  { path: 'map', component: DoneeComponent, canActivate: [DoneeGuard] },
  { path: 'donee-settings', component: DoneeComponent, canActivate: [DoneeGuard] },
  { path: 'donee-donations', component: DoneeComponent, canActivate: [DoneeGuard] },
  { path: 'donor-donations', component: DonorComponent, canActivate: [DonorGuard] },
  { path: 'dashboard', component: DonorComponent, canActivate: [DonorGuard] },
  { path: 'donate', component: DonorComponent, canActivate: [DonorGuard] },
  { path: 'donor-settings', component: DonorComponent, canActivate: [DonorGuard] },
  { path: 'login', component: LoginRegisterComponent },
  { path: '**', component: LoginRegisterComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
