import { Component, Input, OnInit } from '@angular/core';
import { VezbaService } from '../../services/vezba-service/vezba.service';
import { Pokusaj } from '../../models/pokusaj';
import { Vezba } from '../../models/vezba';

@Component({
  selector: 'app-pokusaji',
  templateUrl: './pokusaji.component.html',
  styleUrl: './pokusaji.component.css'
})
export class PokusajiComponent implements OnInit {
  @Input() exercise!: Vezba;
  attempts: Pokusaj[] = [];
  selectedAttempt: Pokusaj | null = null;

  constructor(private exerciseService: VezbaService) { }

  ngOnInit(): void {
    this.exerciseService.getVezbe().subscribe();
  }

  selectAttempt(attempt: Pokusaj): void {
    this.selectedAttempt = attempt;
  }
}
