import { Component, OnInit } from '@angular/core';
import { VezbaService } from '../../services/vezba-service/vezba.service';
import { UserService } from '../../services/user-service/user.service';
import { Vezba } from '../../models/vezba';
import { User } from '../../models/user';
import { Odeljenje } from '../../models/odeljenje';
import { ZaduzenjaService } from '../../services/zaduzenja-service/zaduzenja.service';
import { Zadatak } from '../../models/zadatak';
import { ZadatakService } from '../../services/zadatak-service/zadatak.service';
import { Predmet } from '../../models/predmet';
import { SkolaDTO } from '../../models/DTOs/skolaDTO';

@Component({
  selector: 'app-moje-vezbe',
  templateUrl: './moje-vezbe.component.html',
  styleUrls: ['./moje-vezbe.component.css']
})
export class MojeVezbeComponent implements OnInit {
  vezbe: Vezba[] = [];
  odeljenja: Odeljenje[] = [];
  filterOdeljenja: Odeljenje[] = [];
  ucenici: User[] = [];
  skole: SkolaDTO[] = [];
  selectedVezba: Vezba = {naziv: "", trajanjeVezbe: 0, id: 0, idPredmeta: 0, brojZadataka: 0, zadaci: []};
  selectedVezbaId: number | null = null;
  selectedOdeljenjeId: number | null = null;
  selectedUcenikId: number | null = null;
  ucenikPretraga: string = '';
  showIzmenaForm: boolean = false;
  showOdeljenjeForm: boolean = false;
  showUcenikForm: boolean = false;
  showZadatkeForm: boolean = false;
  noviZadatakId: number | null = null;
  selectedSkolaId: number | null = null;
  UcenikSelectedSkolaId: number | null = null;
  UcenikSelectedOdeljenjeId: number | null = null;

  constructor(private vezbaService: VezbaService,
     private userService: UserService,
     private zaduzenjeService: ZaduzenjaService,
    private zadaciService: ZadatakService) {}

  ngOnInit() {
    this.ucitajVezbe();
    this.ucitajOdeljenja();
    this.ucitajUcenike();
  }

  ucitajVezbe() {
    this.vezbaService.getVezbeByProfesorId(this.userService.getCurrentUserId()).subscribe((vezbe: Vezba[]) => {
      vezbe.forEach(vezba => {
        this.vezbaService.getOdeljenjaByVezbaId(vezba.id).subscribe((res: Odeljenje[]) =>{
        
          this.zaduzenjeService.getSkole().subscribe(
            (skole: SkolaDTO[]) => {
              res.forEach(o => {
                o.skola = skole.find(x => x.id === o.idSkole) ?? { naziv: "", id: 0, grad: "", action: "" };
              });
    
              vezba.odeljenja = res;
            });
        });
        this.vezbaService.getUceniciByVezbaId(vezba.id).subscribe((res: User[]) =>{vezba.ucenici = res;});
        this.zadaciService.getPredmetiById(vezba.idPredmeta).subscribe((p: Predmet) => {vezba.predmet = p;});
        this.zadaciService.getZadaciByPredmetId(vezba.idPredmeta).subscribe((z: Zadatak[]) => {
          if(vezba.predmet)
          {
            vezba.predmet.zadaci = z;
          }
        });
        this.zadaciService.getZadaciByVezbaId(vezba.id).subscribe((res: Zadatak[]) => {vezba.zadaci = res;});
      });
      this.vezbe = vezbe;
      this.vezbe.sort((a, b) => b.id - a.id);
    });
  }

  ucitajOdeljenja() {
    this.zaduzenjeService.getOdeljenjaByProfesorId(this.userService.getCurrentUserId()).subscribe((odeljenja: Odeljenje[]) => {
      this.odeljenja = odeljenja;
      this.zaduzenjeService.getSkole().subscribe(
        (skole: SkolaDTO[]) => {
          this.odeljenja.forEach(o => { 
            this.zaduzenjeService.getUceniciByOdeljenjeId(o.id).subscribe((ucenici: User[])=>{
              o.ucenici = ucenici;
              var sk = skole.find(x => x.id === o.idSkole);
            if(sk)
            {
              o.skola = sk;

              if(this.skole.findIndex(x => x.id == o.skola.id) == -1)
              {
                this.skole.push(sk);
              }
            }
            });  

          });

        }
      );
    });
  }

  ucitajUcenike() {
    this.userService.getUcenici().subscribe((res: any) => {
      this.ucenici = res;
    });
  }

  filtriraniUcenici() {
    return this.odeljenja.find(x => x.id == this.UcenikSelectedOdeljenjeId)?.ucenici;
  }

  filtriranaOdeljenja() {
    return this.odeljenja.filter(x => x.idSkole == this.UcenikSelectedSkolaId);
  }
  dodeliVezbuOdeljenju() {
    if (this.selectedVezbaId && this.selectedOdeljenjeId) {
      this.vezbaService.addVezbaOdeljenje(this.selectedOdeljenjeId, this.selectedVezbaId).subscribe((success: boolean) => {
        if (success) {
          alert('Vežba uspešno dodeljena odeljenju');
          this.ucitajVezbe();
         // this.zatvoriForme();
          this.selectedOdeljenjeId = null;
          this.selectedVezbaId = null;
          this.selectedSkolaId = null
        }
      });
    }
  }

  dodeliVezbuUceniku() {
    if (this.selectedVezbaId && this.selectedUcenikId) {
      this.vezbaService.addVezbaUcenik(this.selectedUcenikId, this.selectedVezbaId).subscribe((success: boolean) => {
        if (success) {
          alert('Vežba uspešno dodeljena učeniku');
          this.ucitajVezbe();
          this.selectedUcenikId = null;
          this.selectedVezbaId = null;
          this.UcenikSelectedOdeljenjeId = null;
          this.UcenikSelectedSkolaId = null;
          //this.zatvoriForme();
        }
      });
    }
  }

  prikaziIzmenaForm(vezbaId: number) {
    this.selectedVezbaId = vezbaId;
    var vezba = this.vezbe.find(x => x.id == vezbaId);
    if(vezba)
    {
      this.selectedVezba = vezba;
    }
    this.showIzmenaForm = true;
    this.showUcenikForm = false;
    this.showOdeljenjeForm = false;
    this.showZadatkeForm = false;
  }

  izmeniVezbu(selectedVezbaId: any) {
    if (this.selectedVezba) {  
      this.vezbaService.updateVezba(this.selectedVezba).subscribe((success: boolean) => {
        if (success) {
          alert('Vežba uspešno izmenjena');
          this.ucitajVezbe();
          //this.zatvoriForme();
        }
      });
    }
  }

  prikaziUcenikForm(vezbaId: number) {
    this.selectedVezbaId = vezbaId;
    this.showUcenikForm = true;
    this.showOdeljenjeForm = false;
    this.showIzmenaForm = false;
    this.showZadatkeForm = false;
  }

  prikaziOdeljenjeForm(vezbaId: number) {
    this.selectedVezbaId = vezbaId;
    this.showOdeljenjeForm = true;
    this.showUcenikForm = false;
    this.showIzmenaForm = false;
    this.showZadatkeForm = false;
  }

  prikaziZadatkeForm(vezbaId: number) {
    this.selectedVezbaId = vezbaId;
    this.showZadatkeForm = true;
    this.showUcenikForm = false;
    this.showOdeljenjeForm = false;
    this.showIzmenaForm = false;
  }

  dodajZadatak(vezbaId: number) {
      this.vezbaService.addZadatakToVezba(vezbaId, this.noviZadatakId).subscribe((success: boolean) => {
        if (success) {
          alert('Zadatak uspešno dodat');
          this.ucitajVezbe();
        }
      });
  }

  ukloniZadatak(vezbaId: number, zadatakId: number) {
    this.vezbaService.removeZadatakFromVezba(vezbaId, zadatakId).subscribe((success: boolean) => {
      if (success) {
        alert('Zadatak uspešno uklonjen');
        this.ucitajVezbe();
      }
    });
  }

  zatvoriForme() {
    this.showIzmenaForm = false;
    this.showOdeljenjeForm = false;
    this.showUcenikForm = false;
    this.showZadatkeForm = false;
    this.ucitajVezbe();
  }

  filter(){
    this.filterOdeljenja = this.odeljenja?.filter(x => x.idSkole == this.selectedSkolaId);
    this.UcenikSelectedOdeljenjeId = null;
  }
}
