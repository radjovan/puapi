import { Odgovor } from "./odgovor";

export interface PokusajZadatakOdgovor {
    id: number;
    idVezbaPokusajZadatak: number;
    idZadatakOdgovor: number;
    redniBroj: number;
    vreme: number;

    odgovor?: Odgovor;
  }
  