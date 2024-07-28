import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../enviroment';
import { Zaduzenje } from '../../models/zaduzenje';
import { Odeljenje } from '../../models/odeljenje';
import { Predmet } from '../../models/predmet';
import { User } from '../../models/user';
import { OdeljenjeDTO } from '../../models/DTOs/odeljenjeDTO';
import { PredmetDTO } from '../../models/DTOs/predmetDTO';
import { SkolaDTO } from '../../models/DTOs/skolaDTO';

@Injectable({
  providedIn: 'root'
})
export class ZaduzenjaService {

  private baseUrl = 'http://your-api-url/api/zaduzenja'; // Zameni sa pravim URL-om

  constructor(private http: HttpClient) { }

  getAllZaduzenja(): Observable<Zaduzenje[]> {
    return this.http.get<Zaduzenje[]>(environment.apiUrl + "zaduzenja.php?action=getZaduzenja");
  }

  addZaduzenje(zaduzenje: any): Observable<any> {
    return this.http.post<any>(environment.apiUrl + "zaduzenja.php", zaduzenje);
  }

  addOdeljenje(odeljenje: OdeljenjeDTO): Observable<boolean>{
    odeljenje.action = "dodajOdeljenje";
    odeljenje.naziv = odeljenje.razred + '/'+ odeljenje.brojOdeljenja;
    return this.http.post<boolean>(environment.apiUrl + "zaduzenja.php", odeljenje);
  }

  addPredmet(predmet: PredmetDTO): Observable<boolean>{
    predmet.action = "dodajPredmet";
    return this.http.post<boolean>(environment.apiUrl + "zaduzenja.php", predmet);
  }

  addOdeljenjeUcenik(idUcenika: number, idOdeljenja: number): Observable<Object>{
    return this.http.post<Object>(environment.apiUrl + "zaduzenja.php", { idUcenika: idUcenika, idOdeljenja: idOdeljenja, action: "dodajOdeljenjeUcenik" });
  }

  deleteZaduzenje(id: number): Observable<any> {
    return this.http.get<any>(environment.apiUrl + "zaduzenja.php?action=deleteZaduzenje&id=" + id);
  }

  getProfesori(): Observable<User[]> {
    return this.http.get<User[]>(environment.apiUrl + "zaduzenja.php?action=getProfesori");
  }

  getOdeljenja(): Observable<Odeljenje[]>{
    return this.http.get<Odeljenje[]>(environment.apiUrl + "zaduzenja.php?action=getOdeljenja");
  }

  getPredmeti(): Observable<Predmet[]>{
    return this.http.get<Predmet[]>(environment.apiUrl + "zaduzenja.php?action=getPredmet");
  }

  getUceniciByOdeljenjeId(ucenikId: number): Observable<User[]> {
    return this.http.get<User[]>(environment.apiUrl + "zaduzenja.php?action=getUceniciByOdeljenjeId&id="+ucenikId);
  }

  addSkola(skola: SkolaDTO) {
    skola.action = "dodajSkolu";
    return this.http.post<Object>(environment.apiUrl + "zaduzenja.php", skola);
  }

  getSkole(): Observable<SkolaDTO[]> {
    return this.http.get<SkolaDTO[]>(environment.apiUrl + "zaduzenja.php?action=getSkole");
  }
}
