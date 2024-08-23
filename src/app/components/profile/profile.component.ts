import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user-service/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserDTO } from '../../models/DTOs/userDTO';
import { Router } from '@angular/router';
import { User } from '../../models/user';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {

  editForm: FormGroup;
  currentUser: User;

  constructor(private userService: UserService,
     private formBuilder: FormBuilder,
     private router: Router)
  {
    this.currentUser = this.userService.getCurrentUser().user;

    this.editForm = this.formBuilder.group({
      firstName: [this.currentUser?.firstName, Validators.required],
      lastName: [this.currentUser?.lastName, Validators.required],
      username: [this.currentUser?.username, [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$')]],
      password: ['', Validators.required],
      newPassword: [''],//, Validators.required opciono je
      newPasswordAgain: [''],
    });
    this.editForm.get('password')?.setValue('');
  }

  ngOnInit(): void {

    this.editForm.get('password')?.setValue('');
  }

  editUser(){
    const user: UserDTO = this.editForm.value;

    user.id = this.userService.getCurrentUserId();

    this.userService.checkUsername(user.username).subscribe((res: boolean) =>
      {
        if(res || user.username == this.currentUser.username)
          {
            if(user.newPassword == user.newPasswordAgain)
            {
              user.password = user.newPassword ? user.newPassword : user.password;
              this.userService.editUser(user).subscribe(
                (response: boolean) => {
                  if(response){
                    alert('Korisnik: '+ user.username +' je uspešno izmenjen!');      
                    this.router.navigate(['/home']);
                  }
                  else{
                    alert('Problem sa izmenom korisnika: '+ user.username +'!');
                  }
                },
              );
            }
            else{
              alert('Nove lozinke se ne podudaraju!');
            }
          } 
          else{
            alert('Email: '+ user.username +' je zauzet!');
          }

      }
    );
  }
}
