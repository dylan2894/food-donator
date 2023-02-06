import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DonorDashboardComponent } from './components/donor-dashboard/donor-dashboard.component';
import { DonorDonateComponent } from './components/donor-donate/donor-donate.component';
import { DonorSettingsComponent } from './components/donor-settings/donor-settings.component';
import { ReceiverMapComponent } from './components/receiver-map/receiver-map.component';

const routes: Routes = [
  { path: 'dashboard', component: DonorDashboardComponent },
  { path: 'map', component: ReceiverMapComponent },
  { path: 'donate', component: DonorDonateComponent },
  { path: 'settings', component: DonorSettingsComponent },
  { path: '**', component: ReceiverMapComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
