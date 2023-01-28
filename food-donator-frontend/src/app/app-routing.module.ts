import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DonorDashboardComponent } from './components/donor-dashboard/donor-dashboard.component';
import { ReceiverMapComponent } from './components/receiver-map/receiver-map.component';

const routes: Routes = [
  { path: 'donor-dashboard', component: DonorDashboardComponent },
  { path: '**', component: ReceiverMapComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
