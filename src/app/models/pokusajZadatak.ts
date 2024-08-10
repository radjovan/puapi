import { PokusajZadatakOdgovor } from "./pokusajZadatakOdgovor";
import { Zadatak } from "./zadatak";

export interface PokusajZadatak {
    id: number;
    idVezbaPokusaj: number;
    idVezbaZadatak: number;
    uspesnoUradjen: number;
    brojPokusaja: number;
    redniBroj: number;

    pokusajiZadatakOdgovor: PokusajZadatakOdgovor[];
    zadatak?: Zadatak;
  }
  