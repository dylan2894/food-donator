import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReceiverMapComponent } from './components/receiver-map/receiver-map.component';

const routes: Routes = [
  { path: '**', component: ReceiverMapComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
