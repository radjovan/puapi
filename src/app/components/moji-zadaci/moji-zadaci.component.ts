import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { Zadatak } from '../../models/zadatak';
import { VezbaService } from '../../services/vezba-service/vezba.service';
import { UserService } from '../../services/user-service/user.service';
import { ZaduzenjaService } from '../../services/zaduzenja-service/zaduzenja.service';
import { ZadatakService } from '../../services/zadatak-service/zadatak.service';
import { Predmet } from '../../models/predmet';
import { FileService } from '../../services/file-service/file.service';
import { Hint } from '../../models/hint';
import { Definition } from '../../models/definition';
import { Odgovor } from '../../models/odgovor';
import { MathJaxService } from '../../services/math-jax/math-jax.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-moji-zadaci',
  templateUrl: './moji-zadaci.component.html',
  styleUrls: ['./moji-zadaci.component.css']
})
export class MojiZadaciComponent implements OnInit {
  zadaci: Zadatak[] = [];
  filteredZadaci: Zadatak[] = [];
  predmeti: Predmet[] = [{ id: -1, naziv: 'Svi predmeti', razred: 0 }]; // Dodavanje opcije "Svi predmeti"
  selectedRazred: number = 1;
  selectedPredmet: number = -1;
  showEditDialog: boolean = false;
  selectedTask: Zadatak | null = null;
  profId: number = 0;
  
  showImageModal: boolean = false;
  selectedImage: string = '';

  @Input() mathString!: string;

  constructor(
     private userService: UserService,
     private fileService: FileService,
     private zadatakService: ZadatakService,
     private el: ElementRef,
     private mathJaxService: MathJaxService,
    private router: Router) {
      this.selectedTask = this.zadaci[0];
    }
  ngOnInit() {  
    this.profId = this.userService.getCurrentUserId();
    this.loadTasks();
    this.loadPredmeti();
    this.filterTasks();
  }

  loadTasks() {
    this.zadatakService.getZadaciByCreatorId(this.profId).subscribe((res: Zadatak[]) => {  
      res.forEach(element => {
        var pred = this.predmeti.find(p => p.id == element.idPredmeta);
        element.predmet =  pred? pred: this.predmeti[0];
        if(element.picture == true){
          element.path = this.fileService.getImageUrlByName(element.path);
        }
        else{
          element.path = ""; 
        }
        this.zadatakService.dajHintPoIdZadatka(element.id).subscribe((res: Hint) => {
          element.hint = res;
        })
        this.zadatakService.dajDefinicijuPoIdZadatka(element.id).subscribe((res: Definition) => {
          element.definicija = res;
        })
        this.zadatakService.dajOdgovorePoIdZadatka(element.id).subscribe((res: Odgovor[]) => {
          element.odgovori = res;
        })
      });
      res.sort((a, b) => b.id - a.id);
      this.zadaci = res;
      this.filteredZadaci = res;
      this.mathJaxService.render(this.el.nativeElement);
    });
  }

  loadPredmeti() {
    this.zadatakService.getPredmetiByProfesorId(this.profId).subscribe((res: Predmet[]) => {
      this.predmeti.push(...res);
    });
  }

  loadPicture(fileName: string){
    return this.fileService.getImageUrlByName(fileName);
  }

  filterTasks() {
    if(this.selectedPredmet == -1){
      this.filteredZadaci = this.zadaci;
    }
    else{
      this.filteredZadaci = this.zadaci.filter(zadatak =>
        zadatak.idPredmeta == this.selectedPredmet);
    }
    this.mathJaxService.render(this.el.nativeElement);
  }

  openEditDialog(zadatak: Zadatak) {
    this.selectedTask = zadatak;
    this.showEditDialog = true;
    this.mathJaxService.render(this.el.nativeElement).catch((error) => {
      console.error('Error rendering MathJax:', error);
    });
  }

  closeEditDialog() {
    this.showEditDialog = false;
  }

  deleteZadatak(zadatak: any){
    this.zadatakService.deleteZadatak(zadatak.id).subscribe( (res: boolean) => {
    if(res)
      {
        alert('Zadatak: '+ zadatak.opis +' je obrisan!');
        this.loadTasks();
        this.filterTasks();
      }
    });
  }

  updateTask() {
    if(this.selectedTask)
    {
      this.zadatakService.updateZadatak(this.selectedTask).subscribe( (res: boolean) => {
        this.showEditDialog = false;
      }
      );
    }
  }

  renderLatex(arg0: any) {
    this.mathString = arg0;//izbrisan $$
    this.mathJaxService.render(this.el.nativeElement).catch((error) => {
      console.error('Error rendering MathJax:', error);
    });
    return this.mathString;
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
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

}
