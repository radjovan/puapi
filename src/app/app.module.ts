import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ProfileComponent } from './components/profile/profile.component';
import { SettingsComponent } from './components/settings/settings.component';
import { HomeComponent } from './components/home/home.component';
import { MojeVezbeComponent } from './components/moje-vezbe/moje-vezbe.component';
import { ZadaciComponent } from './components/zadaci/zadaci.component';
import { VezbanjeComponent } from './components/vezbanje/vezbanje.component';
import { ZaduzenjaComponent } from './components/zaduzenja/zaduzenja.component';
import { MojiZadaciComponent } from './components/moji-zadaci/moji-zadaci.component';
import { CommonModule } from '@angular/common';
import { VezbanjaComponent } from './components/vezbanja/vezbanja/vezbanja.component';
import { MathJaxParagraphComponent } from './components/math-jax-paragraph/math-jax-paragraph.component';
import { VezbeComponent } from './components/vezbe/vezbe.component';
import { RegistrationComponent } from './components/registration/registration.component';




@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    NavbarComponent,
    ProfileComponent,
    SettingsComponent,
    HomeComponent,
    MojeVezbeComponent,
    ZadaciComponent,
    ZaduzenjaComponent,
    MojiZadaciComponent,
    VezbanjaComponent,
    VezbeComponent,
    RegistrationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    CommonModule,
    MathJaxParagraphComponent
],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
