import { Component, OnInit } from '@angular/core';
import { ZaduzenjaService } from '../../services/zaduzenja-service/zaduzenja.service';
import { User } from '../../models/user';
import { Predmet } from '../../models/predmet';
import { Odeljenje } from '../../models/odeljenje';
import { Zaduzenje } from '../../models/zaduzenje';
import { SkolaDTO } from '../../models/DTOs/skolaDTO';
import { Router } from '@angular/router';
import { UserService } from '../../services/user-service/user.service';

@Component({
  selector: 'app-moja-zaduzenja',
  templateUrl: './moja-zaduzenja.component.html',
  styleUrl: './moja-zaduzenja.component.css'
})
export class MojaZaduzenjaComponent implements OnInit {
  zaduzenja: Zaduzenje[] = [];
  profesori: User[] = [];
  predmeti: Predmet[] = [];
  odeljenja: Odeljenje[] = [];
  skole: SkolaDTO[] = [];
  filteredPredmeti: any[] = [];
  filteredOdeljenja: Odeljenje[] = [];
  selectedOdeljenje: Odeljenje | null = null;
  selectedUcenici: User[] = [];

  //PRIKAZ
  filteredZaduzenja: any[] = [];
  // Filter promenljive
  filterProfesor: string | null = null;
  filterPredmet: string | null = null;
  filterOdeljenje: string | null = null;
  filterRazred: string | null = null;
  filterSkola: string | null = null;
  razredi: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]; // Liste razreda koji su dostupni
  selectedSkola = false;

  constructor(private userService: UserService, private zaduzenjaService: ZaduzenjaService, private router: Router) { 

    this.filterProfesor = this.userService.getCurrentUserId();
  }

  ngOnInit(): void {
    this.loadZaduzenja();
  }

  loadZaduzenja() {
    this.zaduzenjaService.getPredmeti().subscribe(data => {
      this.predmeti = data;

      this.zaduzenjaService.getOdeljenja().subscribe(data => {
        this.odeljenja = data;
        
        this.zaduzenjaService.getSkole().subscribe(
          (response: any) => {
            this.skole = response;
        this.zaduzenjaService.getZaduzenjaByProfesorId(this.filterProfesor).subscribe(data => {
          data.forEach(zaduzenje => {
            zaduzenje.odeljenje = this.odeljenja.find(x => x.id === zaduzenje.idOdeljenja);
            zaduzenje.predmet = this.predmeti.find(x => x.id === zaduzenje.idPredmeta);
            zaduzenje.profesor = this.profesori.find(x => x.id === zaduzenje.idProfesora);
            if(zaduzenje.odeljenje)
            {
              if(this.skole.findIndex(x => x.id == zaduzenje.odeljenje?.idSkole) != -1)
              {
                var fSkola = this.skole.find(x => x.id == zaduzenje.odeljenje?.idSkole);
                if(fSkola)
                {
                  zaduzenje.odeljenje.skola = fSkola;
                }
              }      
            }
          });
          this.zaduzenja = data;
          this.applyFilter();
        });
      });    
    }); 
  }
);  
  }

  deleteZaduzenje(id: number) {
    this.zaduzenjaService.deleteZaduzenje(id).subscribe(() => {
      this.loadZaduzenja();
      this.router.navigate(['/zaduzenja']);
    });
  }

  filterPredmete(idOdeljenja: string) {
    var o = this.filteredOdeljenja.find(o => o.id.toString() === idOdeljenja);
    this.filteredPredmeti = this.predmeti.filter(predmet => predmet.razred === o?.razred);
  }

  filterOdeljenja(idSkole: any){
    console.log(idSkole);
    this.filteredOdeljenja = this.odeljenja.filter(x => x.idSkole == idSkole);
    this.selectedSkola = true;
  }

  applyFilter() {
    this.filteredZaduzenja = this.zaduzenja.filter(zaduzenje =>
      (!this.filterSkola || this.odeljenja.find(odeljenje => odeljenje.id === zaduzenje.idOdeljenja)?.skola.id.toString() == this.filterSkola) &&
      (!this.filterPredmet || zaduzenje.idPredmeta.toString() == this.filterPredmet) &&
      (!this.filterOdeljenje || this.odeljenja.find(odeljenje => odeljenje.id === zaduzenje.idOdeljenja)?.id.toString() == this.filterOdeljenje) &&
      (!this.filterRazred || this.odeljenja.find(odeljenje => odeljenje.id === zaduzenje.idOdeljenja)?.razred.toString() == this.filterRazred)
    );
  }

  getPredmetiByRazred(razred: string) {
    return this.predmeti.filter(predmet => predmet.razred.toString() === razred);
  }

  showOdeljenje(odeljenje: any){
    this.userService.getUceniciByOdeljenjeId(odeljenje.id).subscribe((res: User[])=>{
      console.log(odeljenje);
      console.log(res);
      this.selectedUcenici = res;
      this.selectedOdeljenje = odeljenje;
    })
  }

  closeModal() {
    this.selectedOdeljenje = null; // Resetuje selektovano odeljenje na null da sakrije modal
    this.selectedUcenici = []; // Resetuje listu učenika
  }
  
}