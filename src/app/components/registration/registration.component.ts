import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user-service/user.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Odeljenje } from '../../models/odeljenje';
import { CommonModule } from '@angular/common';
import { Predmet } from '../../models/predmet';
import { ZaduzenjaService } from '../../services/zaduzenja-service/zaduzenja.service';
import { UserDTO } from '../../models/DTOs/userDTO';
import { OdeljenjeDTO } from '../../models/DTOs/odeljenjeDTO';
import { PredmetDTO } from '../../models/DTOs/predmetDTO';
import { Router } from '@angular/router';
import * as Papa from 'papaparse';
import { SkolaDTO } from '../../models/DTOs/skolaDTO';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
 
  registrationForm: FormGroup;
  OdeljenjeForm: FormGroup;
  PredmetForm: FormGroup;
  csvRegistrationForm: FormGroup;
  SkolaForm: FormGroup;

  odeljenja: Odeljenje[] | undefined;
  predmeti: Predmet[] | undefined;
  skole: SkolaDTO[] | undefined;
  filterOdeljenja: Odeljenje[] | undefined;
  activeForm: string = 'registration';

  csvData: any;

  constructor(private userService: UserService,
     private formBuilder: FormBuilder,
     private zaduzenjaService: ZaduzenjaService,
    private router: Router) {
    this.registrationForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required],
      role: [0, Validators.required],
      odeljenje: [''],
      predmet: [''],
      skola: [0, Validators.required]
    });

    this.OdeljenjeForm = this.formBuilder.group({
      brojOdeljenja: [0, Validators.required],
      razred: [0, Validators.required],
      idSkole:[0, Validators.required]
    });

    this.PredmetForm = this.formBuilder.group({
      naziv: ['', Validators.required],
      razred: [0, Validators.required],
    });

    this.csvRegistrationForm = this.formBuilder.group({
    });

    this.SkolaForm = this.formBuilder.group({
      naziv: ['', Validators.required],
      grad: ['', Validators.required],
    });
  }
  ngOnInit(): void {
    
    this.loadOdeljenja();
    
    this.loadPredmeti();

    this.loadSkole();

    this.onRoleChange();
  }

  loadOdeljenja(){
    this.zaduzenjaService.getOdeljenja().subscribe(
      (response: any) => {
        this.odeljenja = response;
      }
    );
  }

  loadPredmeti(){
    this.zaduzenjaService.getPredmeti().subscribe(
      (response: any) => {
        this.predmeti = response;
      }
    );
  }

  loadSkole(){
    this.zaduzenjaService.getSkole().subscribe(
      (response: any) => {
        this.skole = response;
      }
    );
  }

  showForm(formName: string) {
    this.activeForm = formName;
  }
  
  getSelectedOdeljenjeId(): number | null {
    return this.registrationForm.get('odeljenje')?.value || null;
  }

  onRoleChange(): void {
    this.registrationForm.get('roleId')?.valueChanges.subscribe(roleId => {
      const odeljenje = this.registrationForm.get('odeljenje');
      const predmet = this.registrationForm.get('predmet');
      console.log(this.registrationForm.getRawValue())
      if (roleId === 3) {
        odeljenje?.setValidators([Validators.required]);
       } else if (roleId === '2') {
        predmet?.setValidators([Validators.required]);
        odeljenje?.clearValidators();
      } else {
        odeljenje?.clearValidators();
        predmet?.clearValidators();
      }
      odeljenje?.updateValueAndValidity();
      predmet?.updateValueAndValidity();
    });
  }

  register(){
    const user: UserDTO = this.registrationForm.value;
    this.userService.checkUsername(user.username).subscribe((res: boolean) =>
      {
        if(res)
          {
            this.userService.registerUser(user).subscribe(
              (userId: any) => {
                if(user.role == 3)
                {
                  var odeljenjeId = this.registrationForm.get('odeljenje')?.value;
                  this.zaduzenjaService.addOdeljenjeUcenik(userId, odeljenjeId).subscribe(
                    (response: any) =>{
                      if(!response)
                        {
                          alert('Problem sa dodavanjem odeljenja za korisnika '+ user.username +' !');
                        }
                    }
                  );
                }
                
                alert('Korisnik: '+ user.username +' je uspešno dodat!');
        
                this.router.navigate(['/registration']);
              },
            );
          } 
          else{
            alert('Korisničko ime: '+ user.username +' je zauzeto!');
          }

      }
    );
  }

  addOdeljenje(){
    const odeljenje: OdeljenjeDTO = this.OdeljenjeForm.value;
    this.zaduzenjaService.addOdeljenje(odeljenje).subscribe(
      (response: any) => {
         if(response)
         {
          alert('Odeljenje je uspešno dodato!');
          this.loadOdeljenja();
         }
        },
      );
  }

  addPredmet(){
    const predmet: PredmetDTO = this.PredmetForm.value;
    this.zaduzenjaService.addPredmet(predmet).subscribe(
      (response: any) => {
        if(response)
        {
          alert('Predmet je uspešno dodat!');
          this.loadPredmeti();
        }
        },
      );
  }

  addSkola(){
    const skola: SkolaDTO = this.SkolaForm.value;
    this.zaduzenjaService.addSkola(skola).subscribe(
      (response: any) => {
         if(response)
         {
          alert('Škola je uspešno dodata!');
          this.loadSkole();
         }
        },
      );
  }

  processCSV() {
    for (const row of this.csvData) {
      const newUser: UserDTO = {
        firstName: row['Ime'],
        lastName: row['Prezime'],
        username: row['Username'],
        password: '123',
        role: row['Role'],
        id: 0,
        action: 'addUser',
        idSkole: row['idSkole']
      };
      this.userService.checkUsername(newUser.username).subscribe((res: boolean) => {
        if(res)
        {
          this.userService.registerUser(newUser).subscribe(   
            (userId: any) => {
              if (newUser.role == 3) {
                var odeljenje = this.odeljenja?.find(x => x.brojOdeljenja == row['Odeljenje'] && x.razred == row['Razred'] && x.idSkole == row['idSkole']);
                if(odeljenje)
                {      
                  this.zaduzenjaService.addOdeljenjeUcenik(userId, odeljenje.id).subscribe();
                }
              }
            }
          );
        }
        else{
          alert('Korisničko ime: '+ newUser.username +' je zauzeto!');
        }
    });
    }  
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (result: any) => {
          this.csvData = result.data;
        }
      });
    }
  }

  filter(){
    this.filterOdeljenja = this.odeljenja?.filter(x => x.idSkole == this.registrationForm.get('skola')?.value);
  }
}

