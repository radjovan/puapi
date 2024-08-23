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
    idProfesora?: number;
    trajanjeVezbe: number;//u sekundama
    nazivPredmeta?: string;
    action?: string;
    naziv?: string;
    profesor?: User;
    zadaci: Zadatak[];
    predmet?: Predmet;
    ucenici?: User[];
    odeljenja?: Odeljenje[];
    pokusaji?: Pokusaj[];
  }
  