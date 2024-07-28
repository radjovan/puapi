import { SkolaDTO } from "./DTOs/skolaDTO";
import { Predmet } from "./predmet";
import { User } from "./user";

export interface Odeljenje {
    razred: number;
    brojOdeljenja: number;
    id: number;
    naziv: string;
    idSkole: number;
    predmeti: Predmet[];
    ucenici: User[];
    skola: SkolaDTO;
  }

  