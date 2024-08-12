import { Component, OnInit } from '@angular/core';
import { VezbaService } from '../../services/vezba-service/vezba.service';
import { Pokusaj } from '../../models/pokusaj';
import { UserService } from '../../services/user-service/user.service';
import { ZadatakService } from '../../services/zadatak-service/zadatak.service';
import { Vezba } from '../../models/vezba';
import { Predmet } from '../../models/predmet';
import { Zadatak } from '../../models/zadatak';
import { Odgovor } from '../../models/odgovor';

@Component({
  selector: 'app-pokusaji',
  templateUrl: './pokusaji.component.html',
  styleUrls: ['./pokusaji.component.css']
})
export class PokusajiComponent implements OnInit {

  pokusaji: Pokusaj[] = [];
  filteredPokusaji: Pokusaj[] = [];
  selectedPokusaj: Pokusaj | null = null;
  selectedSubject: number | null = null;
  predmeti: Predmet[] = []; // Lista predmeta za filter

  constructor(private vezbaService: VezbaService,
     private userService: UserService,
    private zadatakService: ZadatakService) { }

  ngOnInit(): void {
    this.loadPokusaji();
  }

  loadPokusaji(): void {
    const userId = this.userService.getCurrentUserId();
    this.vezbaService.getPokusajiByUserId(userId).subscribe(pokusaji => {
      pokusaji.sort((a, b) => b.id - a.id);
      pokusaji.forEach(element => {
        this.vezbaService.getVezba(element.idVezbe).subscribe((v: Vezba)=> {
          element.vezba = v;
          this.zadatakService.getPredmetiById(element.vezba.idPredmeta).subscribe((p: Predmet)=> {
            if(element.vezba)
            {
              element.vezba.predmet = p;
              if(this.predmeti.findIndex(x => x.id == p?.id) == -1)
                {
                    this.predmeti.push(p);   
                }
            }
          })
        });
      });
      this.pokusaji = pokusaji;
      this.filteredPokusaji = pokusaji;
    });
  }

  viewDetails(pokusajId: number): void {
    this.vezbaService.getPokusajZadatakByPokusajId(pokusajId).subscribe(pokusajiZadataka => {
      this.selectedPokusaj = { ...this.pokusaji.find(p => p.id === pokusajId), pokusajiZadataka } as Pokusaj;
      this.selectedPokusaj.pokusajiZadataka.forEach(pz => {
        this.zadatakService.dajZadatakPoId(pz.idVezbaZadatak).subscribe((z: Zadatak)=> {
          pz.zadatak = z;
          this.vezbaService.getPokusajZadatakOdgovoriByPokusajZadatakId(pz.id).subscribe(odgovori => {
            pz.pokusajiZadatakOdgovor = odgovori;
            pz.pokusajiZadatakOdgovor.forEach(element => {
              this.zadatakService.dajOdgovorPoId(element.idZadatakOdgovor).subscribe((o: Odgovor)=>{
                element.odgovor = o;
              });
            });
          });
        });     
      });
    });
  }

  filterPokusaji() {
    if (this.selectedSubject == 0) {
      this.filteredPokusaji = [...this.pokusaji]; // Prikaz svih vezbi ako je izabrano "Svi predmeti"
    } else {
      this.filteredPokusaji = this.pokusaji.filter(p => p.vezba?.idPredmeta == this.selectedSubject);
      this.filteredPokusaji.sort((a, b) => b.id - a.id);
    }
  }

  closeModal(): void {
    this.selectedPokusaj = null;
  }

  getNivo(nivo: number): string {
    switch (nivo) {
      case 1:
        return 'Osnovni';
      case 2:
        return 'Srednji';
      case 3:
        return 'Napredni';
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
}
