import { Component, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user-service/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent{


  constructor(private userService: UserService, private router: Router) {
   }

  isLoggedIn(){
    return this.userService.isLoggedIn();
  }
  logout() {
    this.userService.logout();
    this.router.navigate(['/login']);
  }
  isAdmin(){
    return this.userService.isAdmin();
  }
  isUcenik(){
    return this.userService.isUcenik();
  }
  isProfesor(){
    return this.userService.isProfesor();
  }
}
