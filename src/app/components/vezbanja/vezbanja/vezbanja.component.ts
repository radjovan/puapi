import { Component, OnInit } from '@angular/core';
import { Vezba } from '../../../models/vezba';
import { VezbaService } from '../../../services/vezba-service/vezba.service';
import { UserService } from '../../../services/user-service/user.service';
import { Router } from '@angular/router';
import { ZadatakService } from '../../../services/zadatak-service/zadatak.service';
import { Predmet } from '../../../models/predmet';

@Component({
  selector: 'app-vezbanja',
  templateUrl: './vezbanja.component.html',
  styleUrl: './vezbanja.component.css'
})
export class VezbanjaComponent implements OnInit {
  vezbe: Vezba[] = []; // Lista svih vezbi
  filteredExercises: Vezba[] = []; // Filtrirane vezbe
  predmeti: Predmet[] = []; // Lista predmeta za filter
  userId = -1;
  idPredmeta = -1;  

  selectedSubject: number | null = null;
  constructor(private vezbaService: VezbaService,
    private router: Router,
    private userService: UserService,
    private zadatakService: ZadatakService) {
      this.userId = this.userService.getCurrentUserId();
    }

  ngOnInit(): void {
    this.vezbaService.getVezbeByUcenikId(this.userService.getCurrentUserId()).subscribe((data: Vezba[]) => {
      data.forEach(vezba => {
         this.zadatakService.getPredmetiById(vezba.idPredmeta).subscribe((predmet: Predmet) => vezba.predmet = predmet);
      });
      this.vezbe = data;
      this.filteredExercises = [...this.vezbe];
    });
  }

  filterExercises() {
    if (this.selectedSubject == 0) {
      this.filteredExercises = [...this.vezbe]; // Prikaz svih vezbi ako je izabrano "Svi predmeti"
    } else {
      this.filteredExercises = this.vezbe.filter(vezba => vezba.idPredmeta == this.selectedSubject);
    }
  }

  startExercise(vezba: Vezba) {
    this.router.navigate(['/vezbanje', vezba.id]); // Navigacija na stranicu za vežbu sa id-jem vezbe
  }
}
