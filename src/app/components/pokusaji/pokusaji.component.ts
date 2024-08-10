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
  selectedPokusaj: Pokusaj | null = null;

  constructor(private vezbaService: VezbaService,
     private userService: UserService,
    private zadatakService: ZadatakService) { }

  ngOnInit(): void {
    this.loadPokusaji();
  }

  loadPokusaji(): void {
    const userId = this.userService.getCurrentUserId();
    this.vezbaService.getPokusajiByUserId(userId).subscribe(pokusaji => {
      this.pokusaji = pokusaji;
      this.pokusaji.sort((a, b) => b.id - a.id);
      this.pokusaji.forEach(element => {
        this.vezbaService.getVezba(element.idVezbe).subscribe((v: Vezba)=> {
          element.vezba = v;
          this.zadatakService.getPredmetiById(element.vezba.idPredmeta).subscribe((p: Predmet)=> {
            if(element.vezba)
            {
              element.vezba.predmet = p;
            }
          })
        });
      });
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

  closeModal(): void {
    this.selectedPokusaj = null;
  }

  getNivo(nivo: number): string {
    switch (nivo) {
      case 1:
        return 'osnovni-nivo';
      case 2:
        return 'srednji-nivo';
      case 3:
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
}
