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
import { DonorDonateComponent } from './components/donor-donate/donor-donate.component';
import { SidenavComponent } from './components/shared/sidenav/sidenav.component';

import { MatStepperModule } from '@angular/material/stepper';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { DonorSettingsComponent } from './components/donor-settings/donor-settings.component';
import { DonorServiceModule } from './services/donor/donor-service.module';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';

@NgModule({
  declarations: [
    AppComponent,
    ReceiverMapComponent,
    DonorDashboardComponent,
    DonorDonateComponent,
    SidenavComponent,
    DonorSettingsComponent,
    LoginComponent,
    RegisterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    GoogleMapsModule,
    AuthenticationModule,
    RegistrationModule,
    DonorServiceModule,
    MatStepperModule,
    MatInputModule,
    MatButtonModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
