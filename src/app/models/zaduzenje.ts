import { Odeljenje } from "./odeljenje";
import { Predmet } from "./predmet";
import { User } from "./user";

export interface Zaduzenje {
    id: number;
    idProfesora: number;
    idPredmeta: number;
    idOdeljenja: number;
    odeljenje?: Odeljenje;
    predmet?: Predmet;
    profesor?: User;
  }