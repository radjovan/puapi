import { Tema } from "./tema";
import { User } from "./user";
import { Zadatak } from "./zadatak";

export interface Predmet {
    razred: number;
    naziv: string;
    id: number;
    ucenici?: User[];
    zadaci?: Zadatak[];
    teme?: Tema[];
  }
  