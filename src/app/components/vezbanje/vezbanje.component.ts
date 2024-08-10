import { Component, OnInit, OnDestroy, Input, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VezbaService } from '../../services/vezba-service/vezba.service';
import { Vezba } from '../../models/vezba';
import { UserService } from '../../services/user-service/user.service';
import { ZadatakService } from '../../services/zadatak-service/zadatak.service';
import { FileService } from '../../services/file-service/file.service';
import { Zadatak } from '../../models/zadatak';
import { Odgovor } from '../../models/odgovor';
import { Hint } from '../../models/hint';
import { Definition } from '../../models/definition';
import { CommonModule } from '@angular/common';
import { Pokusaj } from '../../models/pokusaj';
import { MathJaxService } from '../../services/math-jax/math-jax.service';
import { FormsModule } from '@angular/forms';
import { Predmet } from '../../models/predmet';

@Component({
  selector: 'vezbanje',
  templateUrl: './vezbanje.component.html',
  styleUrls: ['./vezbanje.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class VezbanjeComponent implements OnInit, OnDestroy {

  vezba: Vezba | null = null;
  pokusaj: Pokusaj | null = null;
  userId: number = 0;
  currentZadatakIndex: number = 0;
  selectedOdgovor: Odgovor = {id:0,idZadatka:0,tekst:"",tacnost:0};
  showHint: boolean = false;
  showDefinition: boolean = false;
  timer: any;
  startTime: number = 0;
  elapsedTime: number = 0;
  zadatakStartTime: number = 0; // For per-question timing
  minutes: number = 0;
  seconds: number = 0;
  minutesDuration: number = 0;
  secondsDuration: number = 0;
  showResults: boolean = false;
  exerciseStarted: boolean = false;
  selectedNivo: number = 0;

  // Indeksi za zadatke po nivoima
  currentZadatakIndexOsnovni: number = 0;
  currentZadatakIndexSrednji: number = 0;
  currentZadatakIndexNapredni: number = 0;
  
  brojTacnihZaNivo: number = 0; // Broji tačne odgovore za trenutni nivo
  brojNetacnihZaNivo: number = 0; // Broji netačne odgovore za trenutni nivo

  @Input() mathString!: string;
  
  constructor(
    private route: ActivatedRoute,
    private vezbaService: VezbaService,
    private userService: UserService,
    private zadatakService: ZadatakService,
    private fileService: FileService,
    private router: Router,
    private el: ElementRef,
    private mathJaxService: MathJaxService) { }

  ngOnInit(): void {
    this.userId = this.userService.getCurrentUserId();
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.vezbaService.getVezba(id).subscribe((v: Vezba) => {
          this.loadZadaci(v);
          this.vezba = v;
          const trajanje = this.vezba?.trajanjeVezbe ? this.vezba?.trajanjeVezbe : 0;
          this.minutesDuration = Math.floor(trajanje / 60);
          this.secondsDuration = trajanje % 60;
        });
      }
    });
  }

  ngOnDestroy(): void {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  loadZadaci(v: Vezba): void {
    this.zadatakService.getZadaciByVezbaId(v.id).subscribe((z: Zadatak[]) => {
      z.forEach(zadatak => {
        this.zadatakService.dajOdgovorePoIdZadatka(zadatak.id).subscribe((o: Odgovor[]) => {
          zadatak.odgovori =  this.izmesajOdgovore(o);
        });

        this.zadatakService.dajHintPoIdZadatka(zadatak.id).subscribe((h: Hint) => {
          zadatak.hint = h;
        });

        this.zadatakService.dajDefinicijuPoIdZadatka(zadatak.id).subscribe((d: Definition) => {
          zadatak.definicija = d;
          if (d.slika) {
            zadatak.definicija.slika = this.fileService.getImageUrlByName(d.slika);
          }
        });

        if (zadatak.picture) {
          zadatak.path = this.fileService.getImageUrlByName(zadatak.path);
        }
      });
      this.zadatakService.getPredmetiById(this.vezba?.idPredmeta || 0).subscribe((p: Predmet) =>{
        v.predmet = p;
      })
      v.zadaci = z;
    });
  }

  startExercise(): void {
    this.exerciseStarted = true;
    this.startTime = Date.now();
    this.zadatakStartTime = Date.now();
    this.timer = setInterval(() => {
      this.elapsedTime = Math.floor((Date.now() - this.startTime) / 1000);
      this.minutes = Math.floor(this.elapsedTime / 60);
      this.seconds = this.elapsedTime % 60;
    }, 1000);
  }

  odgovoriNaZadatak(zadatak: Zadatak, odgovor: Odgovor): void {
    if (!this.selectedOdgovor) return;

    var prviOdgovor = false;
    const zadatakElapsedTime = Math.floor((Date.now() - this.zadatakStartTime) / 1000); // Calculate per-question elapsed time
    //this.zadatakStartTime = Date.now(); // Reset per-question timer

    this.selectedOdgovor = odgovor;
    this.showHint = false;
    this.showDefinition = false;

    if (!this.pokusaj) {
      this.pokusaj = {
        id: 0,
        idVezbe: this.vezba?.id || 0,
        brojTacnihOdgovora: 0,
        brojNetacnihOdgovora: 0,
        brojUradjenihZadataka: 0,
        brojNeuradjenihZadataka: 0,
        datumPokusaja: new Date().toISOString(),
        pokusajiZadataka: []
      };
    }

    const pokusajZadatak = this.pokusaj.pokusajiZadataka.find(pz => pz.idVezbaZadatak === zadatak.id) || {
      id: 0,
      idVezbaPokusaj: this.pokusaj.id,
      idVezbaZadatak: zadatak.id,
      uspesnoUradjen: 0,
      brojPokusaja: 0,
      redniBroj: zadatak.id,
      pokusajiZadatakOdgovor: []
    };

    if(pokusajZadatak.brojPokusaja == 0)
    {
      prviOdgovor = true;
    }

    pokusajZadatak.brojPokusaja++;
    pokusajZadatak.pokusajiZadatakOdgovor.push({
      id: 0,
      idVezbaPokusajZadatak: pokusajZadatak.id,
      idZadatakOdgovor: odgovor.id,
      redniBroj: pokusajZadatak.brojPokusaja,
      vreme: zadatakElapsedTime 
    });

    if (odgovor.tacnost == 1) {

      pokusajZadatak.uspesnoUradjen = 1;
      this.pokusaj.brojTacnihOdgovora++;
      this.brojTacnihZaNivo++;
      this.brojNetacnihZaNivo = 0;
      this.nextZadatak();

    } else if (odgovor.tacnost == 2) {

      this.pokusaj.brojNetacnihOdgovora++;
      this.showHint = true;
      this.brojTacnihZaNivo = 0;
      if(prviOdgovor)
      {
        this.brojNetacnihZaNivo++;
      }

    } else if (odgovor.tacnost == 3 || odgovor.tacnost == 4) {

      this.pokusaj.brojNetacnihOdgovora++;
      this.showDefinition = true;
      this.brojTacnihZaNivo = 0;
      if(prviOdgovor)
      {
        this.brojNetacnihZaNivo++;
      }
      
    } else {
      this.pokusaj.brojNetacnihOdgovora++;
    }

    if (!this.pokusaj.pokusajiZadataka.some(pz => pz.idVezbaZadatak === zadatak.id)) {
      this.pokusaj.pokusajiZadataka.push(pokusajZadatak);
    }

    this.pokusaj.brojUradjenihZadataka = this.pokusaj.pokusajiZadataka.filter(pz => pz.uspesnoUradjen === 1).length;
    //this.pokusaj.brojNeuradjenihZadataka = this.vezba?.zadaci.length ? this.vezba?.zadaci.length: 0 - this.pokusaj.brojUradjenihZadataka;
  }

  nextZadatak(): void {

    var kraj = false;
    let zadaciZaNivo = this.getZadaciZaTrenutniNivo();

    if (this.brojTacnihZaNivo >= 3) {
      this.podigniNivo();
      this.brojTacnihZaNivo = 0;
    } 
    else if (this.brojNetacnihZaNivo >= 3) {
      this.spustiNivo();
      this.brojNetacnihZaNivo = 0;
    }

    if (this.selectedNivo == 1) {
      if (this.currentZadatakIndexOsnovni < zadaciZaNivo.length - 1) {
        this.currentZadatakIndexOsnovni++;
        this.currentZadatakIndex = this.getZadatakIndexById(zadaciZaNivo[this.currentZadatakIndexOsnovni].id);
      } else {
        kraj = true;
        this.endExercise();
      }
    } else if (this.selectedNivo == 2) {
      if (this.currentZadatakIndexSrednji < zadaciZaNivo.length - 1) {
        this.currentZadatakIndexSrednji++;
        this.currentZadatakIndex = this.getZadatakIndexById(zadaciZaNivo[this.currentZadatakIndexSrednji].id);
      } else {
        kraj = true;
        this.endExercise();
      }
    } else if (this.selectedNivo == 3) {
      if (this.currentZadatakIndexNapredni < zadaciZaNivo.length - 1) {
        this.currentZadatakIndexNapredni++;
        this.currentZadatakIndex = this.getZadatakIndexById(zadaciZaNivo[this.currentZadatakIndexNapredni].id);
      } else {
        kraj = true;
        this.endExercise();
      }
    }
    if(!kraj)
    {
      this.zadatakStartTime = Date.now();
    }
    console.log(this.selectedNivo);
  }

  getZadaciZaTrenutniNivo(): Zadatak[] {
    if (this.selectedNivo == 1) {
      return this.vezba?.zadaci.filter(z => z.nivo == 1) || [];
    } else if (this.selectedNivo == 2) {
      return this.vezba?.zadaci.filter(z => z.nivo == 2) || [];
    } else {
      return this.vezba?.zadaci.filter(z => z.nivo == 3) || [];
    }
  }

  getZadatakIndexById(id: number): number {
    var index = this.vezba?.zadaci.findIndex(z => z.id == id);
    return index? index: -1;
  }

  endExercise(): void {
    clearInterval(this.timer);
    this.showResults = true;
    this.sacuvajPokusaj();
  }
  sacuvajPokusaj() {
    if(this.pokusaj)
    {
      this.pokusaj.idUcenika = this.userId;
      this.vezbaService.addVezbaPokusaj(this.pokusaj).subscribe((idP: number) =>{
        this.pokusaj?.pokusajiZadataka.forEach(pZadatka => {
          pZadatka.idVezbaPokusaj = idP;
          this.vezbaService.addVezbaPokusajZadatak(pZadatka).subscribe((id)=>{
            pZadatka.pokusajiZadatakOdgovor.forEach(o => {
              o.idVezbaPokusajZadatak = id;
              this.vezbaService.addVezbaPokusajZadatakOdgovor(o).subscribe((res: boolean)=>{
                if(!res)
                {
                  alert("Greska pri cuvanju pokusaja!");
                }
              });
            });
          });
        });
      });
    }
  }

  resetExercise(): void {
    this.exerciseStarted = false;
    this.showResults = false;
    this.currentZadatakIndex = 0;
    this.elapsedTime = 0;
    this.minutes = 0;
    this.seconds = 0;
    this.pokusaj = null;
  }
  goBack(): void{
    this.router.navigate(['/vezbanja']);
  }
  preskociZadatak(id: any): void{
    if(this.pokusaj)
    {
      this.pokusaj.brojUradjenihZadataka = this.pokusaj.pokusajiZadataka.filter(pz => pz.uspesnoUradjen === 1).length;
      this.pokusaj.brojNeuradjenihZadataka = this.vezba?.zadaci.length ? this.vezba?.zadaci.length: 0 - this.pokusaj.brojUradjenihZadataka;
    }
    else{
      this.pokusaj = {
        id: 0,
        idVezbe: this.vezba?.id || 0,
        brojTacnihOdgovora: 0,
        brojNetacnihOdgovora: 0,
        brojUradjenihZadataka: 0,
        brojNeuradjenihZadataka: 1,
        datumPokusaja: new Date().toISOString(),
        pokusajiZadataka: []
      };
    }
    if (this.vezba && this.currentZadatakIndex < this.vezba.zadaci.length - 1) {
      this.currentZadatakIndex++;
    } else {
      this.endExercise();
    }
  }

  izmesajOdgovore(odgovori: Odgovor[]){
    let currentIndex = odgovori.length, randomIndex;

    while (currentIndex != 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      [odgovori[currentIndex], odgovori[randomIndex]] = [odgovori[randomIndex], odgovori[currentIndex]];
    }

    return odgovori;
  }

  renderLatex(arg0: string) {
    this.mathString = arg0;
    this.mathJaxService.render(this.el.nativeElement).catch((error) => {
      console.error('Error rendering MathJax:', error);
    });
    return this.mathString;
  }

  podigniNivo(): void {
    if (this.selectedNivo < 3) {
      this.selectedNivo++;
    }
  }

  spustiNivo(): void {
    if (this.selectedNivo > 1) {
      this.selectedNivo--;
    }
  }
}
