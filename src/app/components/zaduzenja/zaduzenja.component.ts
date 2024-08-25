import { Component, OnInit } from '@angular/core';
import { ZaduzenjaService } from '../../services/zaduzenja-service/zaduzenja.service';
import { User } from '../../models/user';
import { Predmet } from '../../models/predmet';
import { Odeljenje } from '../../models/odeljenje';
import { Zaduzenje } from '../../models/zaduzenje';
import { SkolaDTO } from '../../models/DTOs/skolaDTO';
import { Router } from '@angular/router';

@Component({
  selector: 'app-zaduzenja',
  templateUrl: './zaduzenja.component.html',
  styleUrl: './zaduzenja.component.css'
})
export class ZaduzenjaComponent implements OnInit {
  zaduzenja: Zaduzenje[] = [];
  profesori: User[] = [];
  predmeti: Predmet[] = [];
  odeljenja: Odeljenje[] = [];
  skole: SkolaDTO[] = [];
  filteredPredmeti: Predmet[] = [];
  filteredOdeljenja: Odeljenje[] = [];

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

  newZaduzenje = {
    idProfesora: '',
    idPredmeta: '',
    idOdeljenja: '',
    action: "addZaduzenje",
    idSkole: 0
  };

  showModal: boolean = false; // Dodato za modal kontrolu

  constructor(private zaduzenjaService: ZaduzenjaService, private router: Router) {
   }

  ngOnInit(): void {
    this.loadZaduzenja();
  }

  loadZaduzenja(){
    this.zaduzenjaService.getSkole().subscribe(
      (skole: any) => {
        this.skole = skole;
        this.zaduzenjaService.getProfesori().subscribe(profesori => {
          this.profesori = profesori;
          this.zaduzenjaService.getPredmeti().subscribe(predmeti => {
            this.predmeti = predmeti;
            this.zaduzenjaService.getOdeljenja().subscribe(odeljenja => {
              this.odeljenja = odeljenja;
              this.zaduzenjaService.getAllZaduzenja().subscribe(zaduzenja => {
                zaduzenja.forEach(zaduzenje => {
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
                this.zaduzenja = zaduzenja;
                this.applyFilter();
              });             
            });
          });
        });  
      }
    );
  }

  addZaduzenje() {
    this.zaduzenjaService.addZaduzenje(this.newZaduzenje).subscribe((res: any) => {
      if(res){
        alert("Dodato je novo zaduzenje!");
        this.newZaduzenje = {
        idProfesora: '',
        idPredmeta: '',
        idOdeljenja: '',
        action: "addZaduzenje",
        idSkole: 0
      };
      this.loadZaduzenja();
      }
    });
  }

  deleteZaduzenje(id: number) {
    this.zaduzenjaService.deleteZaduzenje(id).subscribe(() => {
      this.loadZaduzenja();
      this.router.navigate(['/zaduzenja']);
    });
  }

  filterPredmete(idOdeljenja: string) {
    var o = this.filteredOdeljenja.find(o => o.id.toString() == idOdeljenja);
    this.filteredPredmeti = this.predmeti.filter(predmet => predmet.razred == o?.razred);
  }

  filterOdeljenja(idSkole: number){
    this.filteredOdeljenja = this.odeljenja.filter(x => x.idSkole == idSkole);
    this.selectedSkola = true;
  }

  applyFilter() {
    this.filteredZaduzenja = this.zaduzenja.filter(zaduzenje =>
      (!this.filterSkola || this.odeljenja.find(odeljenje => odeljenje.id == zaduzenje.idOdeljenja)?.skola.id.toString() == this.filterSkola) &&
      (!this.filterProfesor || zaduzenje.idProfesora.toString() == this.filterProfesor) &&
      (!this.filterPredmet || zaduzenje.idPredmeta.toString() == this.filterPredmet) &&
      (!this.filterOdeljenje || this.odeljenja.find(odeljenje => odeljenje.id == zaduzenje.idOdeljenja)?.id.toString() == this.filterOdeljenje) &&
      (!this.filterRazred || this.odeljenja.find(odeljenje => odeljenje.id == zaduzenje.idOdeljenja)?.razred.toString() == this.filterRazred)
    );
  }

  getPredmetiByRazred(razred: string) {
    return this.predmeti.filter(predmet => predmet.razred.toString() == razred);
  }

   // Funkcija za otvaranje modala
   openModal() {
    this.showModal = true;
  }

  // Funkcija za zatvaranje modala
  closeModal() {
    this.showModal = false;
  }
}