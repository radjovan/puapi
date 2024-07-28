import { Odeljenje } from "./odeljenje";
import { Pokusaj } from "./pokusaj";
import { Predmet } from "./predmet";
import { User } from "./user";
import { Zadatak } from "./zadatak";

export interface Vezba {
    id: number;
    razred?: number;
    idPredmeta: number;
    brojZadataka?: number;
    trajanjeVezbe: number;//u sekundama
    nazivPredmeta?: string;
    naziv?: string;
    zadaci: Zadatak[];
    predmet?: Predmet;
    ucenici?: User[];
    odeljenja?: Odeljenje[];
    pokusaji?: Pokusaj[];
  }
  