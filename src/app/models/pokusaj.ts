import { PokusajZadatak } from "./pokusajZadatak";
import { User } from "./user";
import { Vezba } from "./vezba";

export interface Pokusaj {
    id: number;
    idVezbe: number;
    brojTacnihOdgovora: number;
    brojNetacnihOdgovora: number;
    brojUradjenihZadataka: number;
    brojNeuradjenihZadataka: number;
    datumPokusaja: string;
    idUcenika?: number;

    pokusajiZadataka: PokusajZadatak[];
    vezba?: Vezba;
    ucenik?: User;
  }
  