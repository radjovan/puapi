export interface VezbaDTO {
    id: number;
    razred?: number;
    idPredmeta: number;
    brojZadataka: number;
    idProfesora: number;
    trajanjeVezbe: number;//u sekundama
    idZadataka: number[];
    action: string;
    naziv: string;
  }
  