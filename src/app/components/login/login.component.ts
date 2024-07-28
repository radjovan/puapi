import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { Router } from '@angular/router';
import { UserService } from '../../services/user-service/user.service';
import { FileService } from '../../services/file-service/file.service';

@Component({
  standalone: true,
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  imports: [ReactiveFormsModule]
})
export class LoginComponent implements OnInit{

  loginForm: FormGroup;
  logoPath = "";

  constructor(
    private formBuilder: FormBuilder,
    private authService: UserService,
    private router: Router,
    private fileService: FileService
  ) {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }
  ngOnInit(): void {
    this.logoPath = this.fileService.getImageUrlByName("PU_Logo.png")
  }
  onSubmit() {
    if (this.loginForm.valid) {
      
      const { username, password } = this.loginForm.value;

      this.authService.login(username, password).subscribe(
        (user: any) => {
            if(user.id != null)
              {
                localStorage.setItem('currentUser', JSON.stringify({ user }));
                this.router.navigate(['/home']);
              }
              else{
                alert('Neispravni Login Podaci!');
              }
          },
        );
    }
  }
}
