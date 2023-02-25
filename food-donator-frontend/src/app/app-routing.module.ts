import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginRegisterComponent } from './components/login-register/login-register.component';
import { ReceiverMapComponent } from './components/receiver-map/receiver-map.component';
import { DonorGuard } from './shared/guard/donor.guard';
import { DoneeGuard } from './shared/guard/donee.guard';
import { DonorComponent } from './components/donor/donor.component';

const routes: Routes = [
  { path: 'map', component: ReceiverMapComponent, canActivate: [DoneeGuard] },
  { path: 'dashboard', component: DonorComponent, canActivate: [DonorGuard] },
  { path: 'donate', component: DonorComponent, canActivate: [DonorGuard] },
  { path: 'settings', component: DonorComponent, canActivate: [DonorGuard] },
  { path: 'login', component: LoginRegisterComponent },
  { path: '**', component: LoginRegisterComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
