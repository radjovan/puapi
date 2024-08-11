import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-moji-zadaci',
  templateUrl: './moji-zadaci.component.html',
  styleUrls: ['./moji-zadaci.component.css']
})
export class MojiZadaciComponent implements OnInit {
  zadaci: Zadatak[] = [];
  filteredZadaci: Zadatak[] = [];
  razredi: number[] = [1,2,3,4,5,6,7,8];
  predmeti: Predmet[] = [{ id: -1, naziv: 'Svi predmeti', razred: 0 }]; // Dodavanje opcije "Svi predmeti"
  selectedRazred: number = 1;
  selectedPredmet: number = -1;
  showEditDialog: boolean = false;
  selectedTask: Zadatak | null = null;
  
  showImageModal: boolean = false;
  selectedImage: string = '';

  constructor(private vezbaService: VezbaService,
     private userService: UserService,
     private zaduzenjeService: ZaduzenjaService,
     private fileService: FileService,
    private zadatakService: ZadatakService) {
      this.selectedTask = this.zadaci[0];
    }
  ngOnInit() {
    const profId = this.userService.getCurrentUserId();
    this.loadTasks(profId);
    this.loadPredmeti(profId);
    this.filterTasks();
  }

  loadTasks(profId: number) {
    this.zadatakService.getZadaciByCreatorId(profId).subscribe((res: Zadatak[]) => {  
      res.forEach(element => {
        var pred = this.predmeti.find(p => p.id == element.idPredmeta);
        element.predmet =  pred? pred: this.predmeti[0];
        if(element.picture){
          element.path = this.fileService.getImageUrlByName(element.path);
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
    });
  }

  loadPredmeti(profId: number) {
    this.zadatakService.getPredmetiByProfesorId(profId).subscribe((res: Predmet[]) => {
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

  }

  openEditDialog(zadatak: Zadatak) {
    this.selectedTask = zadatak;
    this.showEditDialog = true;
  }

  closeEditDialog() {
    this.showEditDialog = false;
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

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      // Upload the file and get the URL
      // Update the selectedTask.slika.url with the new URL
    }
  }

  // Metoda za otvaranje modalnog prozora slike
  openImageModal(zadatak: Zadatak) {
    this.selectedImage = zadatak.path;
    this.showImageModal = true;
  }

  // Metoda za zatvaranje modalnog prozora slike
  closeImageModal() {
    this.showImageModal = false;
    //this.selectedImage = '';
  }
}
