import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ReceiverMapComponent } from './components/receiver-map/receiver-map.component';

import { GoogleMapsModule } from '@angular/google-maps';
import { DonorDashboardComponent } from './components/donor-dashboard/donor-dashboard.component'
import { AuthenticationModule } from './services/authentication/authentication.module';
import { RegistrationModule } from './services/registration/registration.module';

@NgModule({
  declarations: [
    AppComponent,
    ReceiverMapComponent,
    DonorDashboardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    GoogleMapsModule,
    AuthenticationModule,
    RegistrationModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
