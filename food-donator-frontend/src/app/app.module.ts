import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ReceiverMapComponent } from './components/receiver-map/receiver-map.component';

import { GoogleMapsModule } from '@angular/google-maps';
import { DonorDashboardComponent } from './components/donor-dashboard/donor-dashboard.component'

@NgModule({
  declarations: [
    AppComponent,
    ReceiverMapComponent,
    DonorDashboardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    GoogleMapsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
