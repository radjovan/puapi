import { Component } from '@angular/core';
import { FileService } from '../../services/file-service/file.service';
import { UserService } from '../../services/user-service/user.service';
import { User } from '../../models/user';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  firstName: string = "";
  lastName: string = "";
  user: User | null = null;
  constructor(private userService: UserService) { 
    this.user = this.userService.getCurrentUser().user;
  }

}
