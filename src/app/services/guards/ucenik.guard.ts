import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserService } from '../user-service/user.service';

@Injectable({
  providedIn: 'root'
})
export class UcenikGuard implements CanActivate {

  constructor(private authService: UserService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.isLoggedIn()) {
      if(this.authService.isUcenik())
        {
          return true;
        }
      return false;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
