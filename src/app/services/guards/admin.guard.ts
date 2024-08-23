import { CanActivate, CanActivateFn, Router } from '@angular/router';
import { UserService } from '../user-service/user.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private authService: UserService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.isLoggedIn()) {
      if(this.authService.isAdmin())
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