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
  logoPath = "";
  title: string = "";
  user: User | null = null;
  constructor(private userService: UserService, private fileService: FileService) { 
    this.logoPath = this.fileService.getImageUrlByName("PU_Logo.png")
    this.user = this.userService.getCurrentUser().user;
    if(this.user?.role == 0)
    {
        this.title = "Admin: ";
    }
    else if(this.user?.role == 2){
      this.title = "Profesor: ";
    }
    else{
      this.title = "Učenik: ";
    }
  }

}
