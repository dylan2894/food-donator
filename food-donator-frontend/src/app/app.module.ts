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
import { LoginRegisterComponent } from './components/login-register/login-register.component';
import { UserModule } from './services/user/user.module';
import { DonorComponent } from './components/donor/donor.component';
import { DonationModule } from './services/donation/donation.module';
import DateUtil from './utils/DateUtil';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import PhoneNumUtil from './utils/PhoneNumUtil';
import MapUtil from './utils/MapUtil';
import PlacesAutocompleteUtil from './utils/PlacesAutocompleteUtil';
import { CardComponent } from './components/shared/card/card.component';
import { DoneeSettingsComponent } from './components/donee-settings/donee-settings.component';
import { DoneeComponent } from './components/donee/donee.component';
import { DonationsComponent } from './components/donations/donations.component';
import { ChipSelectorComponent } from './components/shared/chip-selector/chip-selector.component';
import { CollapsibleItemBodyComponent } from './components/shared/collapsible-item-body/collapsible-item-body.component';

@NgModule({
  declarations: [
    AppComponent,
    ReceiverMapComponent,
    DonorDashboardComponent,
    DonorDonateComponent,
    SidenavComponent,
    DonorSettingsComponent,
    LoginRegisterComponent,
    DonorComponent,
    CardComponent,
    DoneeSettingsComponent,
    DoneeComponent,
    DonationsComponent,
    ChipSelectorComponent,
    CollapsibleItemBodyComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    GoogleMapsModule,
    AuthenticationModule,
    RegistrationModule,
    UserModule,
    DonationModule,
    MatStepperModule,
    MatInputModule,
    MatButtonModule,
    BrowserAnimationsModule,
    NgxMaskDirective,
    NgxMaskPipe
  ],
  providers: [
    /**
     * Utils
     */
    DateUtil,
    PhoneNumUtil,
    MapUtil,
    PlacesAutocompleteUtil,
    /**
     * NGX Mask - used for formatting the phone number input fields
     */
    provideNgxMask()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
