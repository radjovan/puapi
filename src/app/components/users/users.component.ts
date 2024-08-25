import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user';
import { SkolaDTO } from '../../models/DTOs/skolaDTO';
import { Odeljenje } from '../../models/odeljenje';
import { ZaduzenjaService } from '../../services/zaduzenja-service/zaduzenja.service';
import { Router } from '@angular/router';
import { UserService } from '../../services/user-service/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserDTO } from '../../models/DTOs/userDTO';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit{

  filterTipKorisnika: string | null = null;
  filterSkola: string | null = null;
  filterRazred: string | null = null;
  filterOdeljenje: string | null = null;
  searchTerm: string | null = null;

  users: User[] = [];
  skole: SkolaDTO[] = [];
  razredi = [1,2,3,4,5,6,7,8,9,10,11,12];
  odeljenja: Odeljenje[] = [];

  filteredUsers: User[] = [];
  filteredOdeljenja: Odeljenje[] = [];

  editOpen: boolean = false;
  editForm: FormGroup;

  constructor(private zaduzenjaService: ZaduzenjaService,
     private router: Router,
    private userService: UserService,
    private formBuilder: FormBuilder) { 

      this.editForm = this.formBuilder.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        username: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$')]],
        password: ['', Validators.required]
      });
    }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(){
    this.zaduzenjaService.getSkole().subscribe(
      (response: any) => {
        this.skole = response;
            this.zaduzenjaService.getOdeljenja().subscribe(data => {
              this.odeljenja = data;
              this.odeljenja.forEach(element => {
                  var skola = this.skole.find(x => x.id == element.idSkole);
                  if(skola)
                  {
                    element.skola = skola;
                  }
                });

              this.userService.getAllUsers().subscribe((users: User[])=>{
                users.forEach(user => {
                    user.odeljenje = this.odeljenja.find(x => x.id == user.idOdeljenja);

                });
                  
                this.users = users;
                this.applyFilter();   
              }); 
                  
            });  
      }
    );
  }

  openEditUser(user: any){
    this.editOpen = true;
    this.editForm = this.formBuilder.group({
      firstName: [user.firstName, Validators.required],
      lastName: [user.lastName, Validators.required],
      username: [user.username, [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$')]],
      password: [user.password, Validators.required],
      id: [user.id]
    });
     
  }

  editUser(){
    const user: UserDTO = this.editForm.value;
    
    this.userService.checkUsername(user.username).subscribe((res: boolean) =>
      {
              this.userService.editUser(user).subscribe(
                (response: boolean) => {
                  if(response){
                    alert('Korisnik: '+ user.username +' je uspešno izmenjen!'); 
                    this.editForm.reset();
                    this.closeEdit();     
                    this.loadUsers();
                  }
                  else{
                    alert('Problem sa izmenom korisnika: '+ user.username +'!');
                  }
                },
              );
      });
  }


  closeEdit() {
    this.editOpen = false;
  }

  applyFilter() {
    this.filteredOdeljenja = this.odeljenja;
    if(this.filterSkola)
    {
      this.filteredOdeljenja = this.odeljenja.filter(x => x.idSkole.toString() == this.filterSkola);
    }

    this.filteredUsers = this.users.filter(user => {
      const matchesTip = !this.filterTipKorisnika || user.role.toString() == this.filterTipKorisnika;
      const matchesSkola = !this.filterSkola || (user.odeljenje && user.odeljenje.skola && user.odeljenje.skola.id.toString() == this.filterSkola);
      const matchesRazred = !this.filterRazred || (user.odeljenje && user.odeljenje.razred.toString() == this.filterRazred);
      const matchesOdeljenje = !this.filterOdeljenje || (user.odeljenje && user.odeljenje.id.toString() == this.filterOdeljenje);
      const matchesSearch = !this.searchTerm || (user.firstName + ' ' + user.lastName).toLowerCase().includes(this.searchTerm.toLowerCase()) || user.username.toLowerCase().includes(this.searchTerm.toLowerCase());

      return matchesTip && matchesSkola && matchesRazred && matchesOdeljenje && matchesSearch;
    });
  }
}
