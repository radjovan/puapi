import { Component, OnInit } from '@angular/core';
import { VezbaService } from '../../services/vezba-service/vezba.service';
import { UserService } from '../../services/user-service/user.service';
import { ZadatakService } from '../../services/zadatak-service/zadatak.service';
import { ZaduzenjaService } from '../../services/zaduzenja-service/zaduzenja.service';
import { Odeljenje } from '../../models/odeljenje';
import { Vezba } from '../../models/vezba';
import { User } from '../../models/user';
import { SkolaDTO } from '../../models/DTOs/skolaDTO';
import { Predmet } from '../../models/predmet';
import { Zadatak } from '../../models/zadatak';
import { Pokusaj } from '../../models/pokusaj';
import { Odgovor } from '../../models/odgovor';

@Component({
  selector: 'app-statistike',
  templateUrl: './statistike.component.html',
  styleUrls: ['./statistike.component.css']
})
export class StatistikeComponent implements OnInit {
  vezbe: Vezba[] = [];
  odeljenja: Odeljenje[] = [];
  filterOdeljenja: Odeljenje[] = [];
  ucenici: User[] = [];
  skole: SkolaDTO[] = [];
  predmeti: Predmet[] = [];
  selectedVezba: Vezba | null = null;
  selectedOdeljenjeId: number = 0;
  selectedUcenikId: number = 0;
  ucenikPretraga: string = '';
  selectedPokusaj: Pokusaj | null = null;
  filteredPokusaji: Pokusaj[] = [];
  filteredUcenici: User[] = [];
  showAttempts: boolean = false;
  showFilterUcenici: boolean = false;
  selectedSubject: number = 0;
  filteredVezbe: Vezba[] = [];
  filteredOdeljenja: Odeljenje[] = [];
  filteredPojedinacniUcenici: User[] = [];
  previewUcenikId: number = 0;

  constructor(
    private vezbaService: VezbaService,
    private userService: UserService,
    private zaduzenjeService: ZaduzenjaService,
    private zadaciService: ZadatakService
  ) {}

  ngOnInit() {
    this.ucitajVezbe();
    this.ucitajOdeljenja();
    this.ucitajUcenike();
    this.ucitajPredmete();
  }

  ucitajVezbe() {
    this.vezbaService.getVezbeByProfesorId(this.userService.getCurrentUserId()).subscribe((vezbe: Vezba[]) => {
      vezbe.forEach(vezba => {
        this.vezbaService.getOdeljenjaByVezbaId(vezba.id).subscribe((res: Odeljenje[]) => {
          this.zaduzenjeService.getSkole().subscribe(
            (response: any) => {
              this.skole = response;
              res.forEach(o => {
                o.skola = this.skole.find(x => x.id === o.idSkole) ?? { naziv: "", id: 0, grad: "", action: "" };
              });
              vezba.odeljenja = res;
            }
          );
        });
        this.vezbaService.getUceniciByVezbaId(vezba.id).subscribe((res: User[]) => vezba.ucenici = res);
        this.zadaciService.getPredmetiById(vezba.idPredmeta).subscribe((p: Predmet) => vezba.predmet = p);
        this.zadaciService.getZadaciByPredmetId(vezba.idPredmeta).subscribe((z: Zadatak[]) => {
          if (vezba.predmet) {
            vezba.predmet.zadaci = z;
          }
        });
        this.zadaciService.getZadaciByVezbaId(vezba.id).subscribe((res: Zadatak[]) => vezba.zadaci = res);
        this.vezbaService.getPokusajiByVezbaId(vezba.id).subscribe((pokusaji: Pokusaj[]) => {
          pokusaji.forEach(pokusaj => {
            this.userService.getUserById(pokusaj.idUcenika || -1).subscribe((u: any) => pokusaj.ucenik = u);
            this.vezbaService.getPokusajZadatakByPokusajId(pokusaj.id).subscribe(pokusajiZadataka => {
              pokusaj.pokusajiZadataka = pokusajiZadataka;
              pokusaj.pokusajiZadataka.forEach(pz => {
                this.zadaciService.dajZadatakPoId(pz.idVezbaZadatak).subscribe((z: Zadatak) => {
                  pz.zadatak = z;
                  this.vezbaService.getPokusajZadatakOdgovoriByPokusajZadatakId(pz.id).subscribe(odgovori => {
                    pz.pokusajiZadatakOdgovor = odgovori;
                    pz.pokusajiZadatakOdgovor.forEach(element => {
                      this.zadaciService.dajOdgovorPoId(element.idZadatakOdgovor).subscribe((o: Odgovor) => element.odgovor = o);
                    });
                  });
                });
              });
            });
          });
          vezba.pokusaji = pokusaji;
        });
      });
      vezbe.sort((a, b) => b.id - a.id);
      this.vezbe = vezbe;
      this.filteredVezbe = vezbe;
    });
  }

  ucitajOdeljenja() {
    this.zaduzenjeService.getOdeljenja().subscribe((odeljenja: Odeljenje[]) => {
      this.odeljenja = odeljenja;
      this.zaduzenjeService.getSkole().subscribe((response: any) => {
        this.skole = response;
        this.odeljenja.forEach(o => {
          o.skola = this.skole.find(x => x.id === o.idSkole) ?? { naziv: "", id: 0, grad: "", action: "" };
        });
      });
    });
  }

  ucitajUcenike() {

  }

  ucitajPredmete() {
    this.zadaciService.getPredmetiByProfesorId(this.userService.getCurrentUserId()).subscribe((res: Predmet[]) => {
      this.predmeti = res;
    });
  }

  filtriraniUcenici() {
    return this.ucenici.filter(ucenik =>
      (ucenik.firstName + ' ' + ucenik.lastName).toLowerCase().includes(this.ucenikPretraga.toLowerCase())
    );
  }

  selectAttempt(t: Pokusaj) {
    this.selectedPokusaj = t;
  }

  filterAttempts() {
    if (this.selectedOdeljenjeId) {
      this.zaduzenjeService.getUceniciByOdeljenjeId(this.selectedOdeljenjeId).subscribe((ucenici: User[]) => {
        ucenici.forEach(u => {
          if(this.selectedVezba?.pokusaji?.findIndex(x => x.idUcenika == u.id) != -1)
          {
            u.odeljenje = this.filteredOdeljenja.find(x => x.id == this.selectedOdeljenjeId);
            this.filteredUcenici.push(u);
          }
        });
      });
    }
  }

  filterAttemptsUcenik() {
    if (this.selectedUcenikId) {
      this.userService.getUserById(this.selectedUcenikId).subscribe((ucenik: any) => {
        this.zaduzenjeService.getOdeljenjeByUserId(ucenik.id).subscribe((odeljenje: Odeljenje)=>{
          ucenik.odeljenje = odeljenje;
          var skola = this.skole.find(x => x.id == odeljenje.idSkole);
          if(skola)
          {
            odeljenje.skola = skola;
          }
        });
        this.filteredUcenici = [ucenik];
      });
    }
  }

  selectExercise(t: Vezba) {
    this.showAttempts = true;
    this.selectedVezba = t;
    this.showFilterUcenici = true;
    this.vezbaService.getOdeljenjaByVezbaId(t.id).subscribe((res: Odeljenje[])=>{
      res.forEach(element => {
        var skola = this.skole.find(x => x.id == element.idSkole);
        if(skola)
        {
          element.skola = skola;
        }
      });
      this.filteredOdeljenja = res;
    });
    this.vezbaService.getUceniciByVezbaId(t.id).subscribe((res: User[])=>{
      this.filteredPojedinacniUcenici = res;
    });
    this.filterAttempts(); // Refresh attempts based on selected exercise
  }

  selectUcenik(ucenik: User){
    this.previewUcenikId = ucenik.id;
    this.filteredPokusaji = this.selectedVezba?.pokusaji?.filter(x => x.idUcenika == ucenik.id) || [];
  }

  filterExercises() {
    if (this.selectedSubject == 0)
    {
      this.filteredVezbe = this.vezbe;
    }
    else{
      this.filteredVezbe = this.vezbe.filter(x => x.idPredmeta == this.selectedSubject);  
    }
  }

  goBack() {
    this.showAttempts = false;
    this.showFilterUcenici = false;
    this.selectedVezba = null;
    this.selectedOdeljenjeId = 0;
    this.selectedPokusaj = null;
  }

  etNivo(nivo: any): string {
    switch (nivo) {
      case "1":
        return 'osnovni-nivo';
      case "2":
        return 'srednji-nivo';
      case "3":
        return 'napredni-nivo';
      default:
        return '';
    }
  }

  getTacnost(tacnost: number|undefined) {
    switch (tacnost) {
      case 1:
        return 'Tačan odgovor';
      case 2:
        return 'Približan odgovor';
      case 3:
      case 4:
        return 'Netačan odgovor';
      default:
        return '';
    }
  }

  getOdgovorClass(tacnost: any): string {
    switch (tacnost) {
      case 1:
        return 'tacan';
      case 2:
        return 'delimicno';
      case 3:
      case 4:
        return 'netacan';
      default:
        return '';
    }
  }

  allExcercises(){
    this.selectedVezba = null;
  }
}
