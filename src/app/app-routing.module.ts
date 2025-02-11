import { NgModule, inject } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { HomeComponent } from './components/home/home.component';
import { ProfileComponent } from './components/profile/profile.component';
import { SettingsComponent } from './components/settings/settings.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { ZadaciComponent } from './components/zadaci/zadaci.component';
import { VezbeComponent } from './components/vezbe/vezbe.component';
import { MojeVezbeComponent } from './components/moje-vezbe/moje-vezbe.component';
import { AuthGuard } from './services/guards/auth.guard';
import { ProfesorGuard } from './services/guards/profesor.guard';
import { ZaduzenjaComponent } from './components/zaduzenja/zaduzenja.component';
import { MojiZadaciComponent } from './components/moji-zadaci/moji-zadaci.component';
import { VezbanjeComponent } from './components/vezbanje/vezbanje.component';
import { UcenikGuard } from './services/guards/ucenik.guard';
import { VezbanjaComponent } from './components/vezbanja/vezbanja/vezbanja.component';


const routes: Routes = [
  { path: 'login', component: LoginComponent},
  { path: 'home', component: HomeComponent, canActivate: [() => inject(AuthGuard).canActivate()]},
  { path: 'profile', component: ProfileComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'registration', component: RegistrationComponent, canActivate: [() => inject(AuthGuard).canActivate()]},
  { path: 'zaduzenja', component: ZaduzenjaComponent, canActivate: [() => inject(AuthGuard).canActivate()]},
  { path: 'zadaci', component: ZadaciComponent, canActivate: [() => inject(ProfesorGuard).canActivate()]},
  { path: 'vezbe', component: VezbeComponent, canActivate: [() => inject(ProfesorGuard).canActivate()]},
  { path: 'moje-vezbe', component: MojeVezbeComponent, canActivate: [() => inject(ProfesorGuard).canActivate()]},
  { path: 'moji-zadaci', component: MojiZadaciComponent, canActivate: [() => inject(ProfesorGuard).canActivate()]},
  { path: 'vezbanja', component: VezbanjaComponent, canActivate: [() => inject(UcenikGuard).canActivate()]},
  { path: 'vezbanje/:id', component: VezbanjeComponent, canActivate: [() => inject(UcenikGuard).canActivate()]},
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: "**", component: PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
