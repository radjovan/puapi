import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { ZadatakService } from '../../services/zadatak-service/zadatak.service';
import { Zadatak } from '../../models/zadatak';
import { VezbaDTO } from '../../models/DTOs/VezbaDTO';
import { VezbaService } from '../../services/vezba-service/vezba.service';
import { UserService } from '../../services/user-service/user.service';
import { Predmet } from '../../models/predmet';
import { Router } from '@angular/router';
import { Hint } from '../../models/hint';
import { Definition } from '../../models/definition';
import { Odgovor } from '../../models/odgovor';
import { FileService } from '../../services/file-service/file.service';
import { MathJaxService } from '../../services/math-jax/math-jax.service';
import { Tema } from '../../models/tema';

@Component({
  selector: 'app-vezbe',
  templateUrl: './vezbe.component.html',
  styleUrls: ['./vezbe.component.css']
})
export class VezbeComponent implements OnInit {
  vezbaForm: FormGroup;
  zadaci: FormControl[] = [];
  predmeti: Predmet[] = [];
  ucitaniZadaci: Zadatak[] = [];
  filteredZadaci: Zadatak[] = [];
  dodatiZadaci: number[] = [];

  selectedImage = "";
  showImageModal = false;
  showZadatakModal = false;
  selectedZadatak: Zadatak | null = null;
  currentUserId: number = 0;
  predmetId: string | null = null;

  onlyMyZadaci = false;

  teme: Tema[] = [];

  @Input() mathString!: string;
  
  constructor(private fb: FormBuilder,
    private zadaciService: ZadatakService,
    private vezbaService: VezbaService,
    private userService: UserService,
    private router: Router,
    private fileService: FileService,
    private el: ElementRef,
    private mathJaxService: MathJaxService) {
    this.vezbaForm = this.fb.group({
      idPredmeta: [0, Validators.required],
      naziv: ['', Validators.required],
      trajanjeVezbe: ['', Validators.required],
      selectedNivo: [0, Validators.required],
      idTeme: [0]
    });
  }

  ngOnInit(): void {
    this.currentUserId = this.userService.getCurrentUserId();
    this.zadaciService.getPredmetiByProfesorId(this.currentUserId).subscribe((res: Predmet[])=>{
      this.predmeti = res;
    });
    this.vezbaForm.get('idPredmeta')?.valueChanges.subscribe(value => {
      this.zadaciService.getZadaciByPredmetId(value).subscribe(
        (res: Zadatak[]) => {
          if(res){
            res.forEach(element => {
              var pred = this.predmeti.find(p => p.id == element.idPredmeta);
              element.predmet =  pred? pred: this.predmeti[0];
              if(element.picture){
                element.path = this.fileService.getImageUrlByName(element.path);
              }
              this.zadaciService.dajHintPoIdZadatka(element.id).subscribe((res: Hint) => {
                element.hint = res;
              })
              this.zadaciService.dajDefinicijuPoIdZadatka(element.id).subscribe((res: Definition) => {
                element.definicija = res;
              })
              this.zadaciService.dajOdgovorePoIdZadatka(element.id).subscribe((res: Odgovor[]) => {
                element.odgovori = res;
              })
            });
            this.ucitaniZadaci = this.filteredZadaci = res.sort((a, b) => a.nivo - b.nivo);
          }
        }
      );});

      this.vezbaForm.get('selectedNivo')?.valueChanges.subscribe(selectedNivo => {
        this.filterZadaci();
      });

      this.vezbaForm.get('idTeme')?.valueChanges.subscribe(value => {
        this.filterZadaci();
      });
  }

  filterZadaci(){
    var idTeme = this.vezbaForm.get('idTeme')?.value;
    var selectedNivo = this.vezbaForm.get('selectedNivo')?.value;

    if (selectedNivo == 0 && idTeme == 0) {
      this.filteredZadaci = this.ucitaniZadaci;
    } 
    else {
      if(selectedNivo != 0){
        this.filteredZadaci = this.ucitaniZadaci.filter(z => z.nivo == selectedNivo);
        if(idTeme != 0){
          this.filteredZadaci = this.filteredZadaci.filter(z => z.idTeme == idTeme);
        }
      }
      if(idTeme != 0){
        this.filteredZadaci = this.ucitaniZadaci.filter(z => z.idTeme == idTeme);
        if(selectedNivo != 0){
          this.filteredZadaci = this.filteredZadaci.filter(z => z.nivo == selectedNivo);
        }
      }
    }
    this.filteredZadaci.sort((a, b) => a.nivo - b.nivo);
  }

  toggleZadatak(id: number, event: any) {
    if (event.target.checked) {
      this.dodatiZadaci.push(id);
    } else {
      const index = this.dodatiZadaci.indexOf(id);
      if (index > -1) {
        this.dodatiZadaci.splice(index, 1);
      }
    }
  }

  openImageModal(zadatak: Zadatak) {
    this.selectedImage = zadatak.path;
    this.showImageModal = true;
  }

  closeImageModal() {
    this.showImageModal = false;
    //this.selectedImage = '';
  }

  openZadatakModal(zadatak: Zadatak) {
    this.selectedZadatak = zadatak;
    this.showZadatakModal = true;
  }

  closeZadatakModal() {
    this.showZadatakModal = false;
    this.selectedZadatak = null;
  }

  ukloniZadatak(index: number) {
    this.zadaci.splice(index, 1);
    this.vezbaForm.removeControl('zadatak' + index);
    // Update form control names for the remaining zadaci
    this.zadaci.forEach((control, idx) => {
      control.setValue(this.vezbaForm.get('zadatak' + idx)?.value || '');
      this.vezbaForm.removeControl('zadatak' + idx);
      this.vezbaForm.addControl('zadatak' + idx, control);
    });
  }

  addVezba() {
    if (this.vezbaForm.valid) {
      const vezbaData: VezbaDTO = this.vezbaForm.value;  
      vezbaData.idZadataka = this.dodatiZadaci; 
      vezbaData.brojZadataka = this.dodatiZadaci.length;
      vezbaData.idProfesora = this.userService.getCurrentUserId();
      vezbaData.razred = this.predmeti.find(x => x.id == vezbaData.idPredmeta)?.razred;
      this.vezbaService.addVezba(vezbaData).subscribe(
        (response: any) => {
          if(response){
            alert('Vežba je uspešno dodata!');
            this.router.navigate(['/moje-vezbe']);
          }
        }
      );
    }
  }

  getZadatakClass(nivo: any): string {
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

  renderLatex(arg0: any) {
    this.mathString = arg0;//izbrisan $$
    this.mathJaxService.render(this.el.nativeElement).catch((error) => {
      console.error('Error rendering MathJax:', error);
    });
    return this.mathString;
  }
  
  showMyZadaci(){
    this.onlyMyZadaci = !this.onlyMyZadaci;
  }

  setTema() {
    var predmet = this.predmeti?.filter(x=> x.id == this.vezbaForm.get('idPredmeta')?.value)[0];
    this.zadaciService.getTemeByPredmetId(predmet.id).subscribe((res: Tema[])=>{
      this.teme = res;
    });
  }

  onPredmetChange(event: Event) {
    this.setTema();
  }
}
