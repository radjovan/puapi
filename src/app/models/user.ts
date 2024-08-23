import { Odeljenje } from "./odeljenje";
import { Pokusaj } from "./pokusaj";

export interface User {
    username: string;
    password: string;
    role: number;
    id: number;
    firstName: string;
    lastName: string;
    idOdeljenja?: number;
    pokusaji?: Pokusaj[];
    odeljenje?: Odeljenje;
  }
  