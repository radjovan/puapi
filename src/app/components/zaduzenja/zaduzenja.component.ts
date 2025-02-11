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
  filteredPredmeti: any[] = [];
  filteredOdeljenja: Odeljenje[] = [];

  //PRIKAZ
  filteredZaduzenja: any[] = [];
  // Filter promenljive
  filterProfesor: string | null = null;
  filterPredmet: string | null = null;
  filterOdeljenje: string | null = null;
  filterRazred: string | null = null;
  razredi: number[] = [1, 2, 3, 4, 5, 6, 7, 8]; // Liste razreda koji su dostupni
  selectedSkola = false;

  newZaduzenje = {
    idProfesora: '',
    idPredmeta: '',
    idOdeljenja: '',
    action: "addZaduzenje",
    idSkole: 0
  };

  constructor(private zaduzenjaService: ZaduzenjaService, private router: Router) { }

  ngOnInit(): void {
    this.loadProfesori();
    this.loadPredmeti();
    this.loadOdeljenja();
    this.loadZaduzenja();
    this.loadSkole();
    this.applyFilter();
  }

  loadSkole(){
    this.zaduzenjaService.getSkole().subscribe(
      (response: any) => {
        this.skole = response;
      }
    );
  }

  loadZaduzenja() {
    this.zaduzenjaService.getAllZaduzenja().subscribe(data => {
      this.zaduzenja = data;
      this.zaduzenja.forEach(zaduzenje => {
        zaduzenje.odeljenje = this.odeljenja.find(x => x.id === zaduzenje.idOdeljenja);
        zaduzenje.predmet = this.predmeti.find(x => x.id === zaduzenje.idPredmeta);
        zaduzenje.profesor = this.profesori.find(x => x.id === zaduzenje.idProfesora);
      });
    });
  }

  loadProfesori() {
    this.zaduzenjaService.getProfesori().subscribe(data => {
      this.profesori = data;
    });
  }

  loadPredmeti() {
    this.zaduzenjaService.getPredmeti().subscribe(data => {
      this.predmeti = data;
    });
  }

  loadOdeljenja() {
    this.zaduzenjaService.getOdeljenja().subscribe(data => {
      this.odeljenja = data;
    });
  }

  addZaduzenje() {
    this.zaduzenjaService.addZaduzenje(this.newZaduzenje).subscribe(() => {
      alert("Dodato je novo zaduzenje!");
      this.loadZaduzenja();
    });
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
      (!this.filterProfesor || zaduzenje.idProfesora.toString() === this.filterProfesor) &&
      (!this.filterPredmet || zaduzenje.idPredmeta.toString() === this.filterPredmet) &&
      (!this.filterOdeljenje || this.odeljenja.find(odeljenje => odeljenje.id === zaduzenje.idOdeljenja)?.id.toString() === this.filterOdeljenje) &&
      (!this.filterRazred || this.odeljenja.find(odeljenje => odeljenje.id === zaduzenje.idOdeljenja)?.razred.toString() === this.filterRazred)
    );
  }

  getPredmetiByRazred(razred: string) {
    return this.predmeti.filter(predmet => predmet.razred.toString() === razred);
  }
}