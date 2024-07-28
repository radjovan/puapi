import { PokusajZadatakOdgovor } from "./pokusajZadatakOdgovor";

export interface PokusajZadatak {
    id: number;
    idVezbaPokusaj: number;
    idVezbaZadatak: number;
    uspesnoUradjen: number;
    brojPokusaja: number;
    redniBroj: number;

    pokusajiZadatakOdgovor: PokusajZadatakOdgovor[];
  }
  