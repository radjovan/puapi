import { Odeljenje } from "./odeljenje";
import { Pokusaj } from "./pokusaj";

export interface User {
    username: string;
    password: string;
    role: number;
    id: number;
    firstName: string;
    lastName: string;
    pokusaji?: Pokusaj[];
    odeljenje?: Odeljenje;
  }
  