import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../enviroment';
import { HttpClient } from '@angular/common/http';
import { Zadatak } from '../../models/zadatak';
import { Vezba } from '../../models/vezba';
import { VezbaDTO } from '../../models/DTOs/VezbaDTO';
import { UserService } from '../user-service/user.service';
import { Odeljenje } from '../../models/odeljenje';
import { User } from '../../models/user';
import { Pokusaj } from '../../models/pokusaj';
import { PokusajZadatak } from '../../models/pokusajZadatak';
import { PokusajZadatakOdgovor } from '../../models/pokusajZadatakOdgovor';

@Injectable({
  providedIn: 'root'
})
export class VezbaService {

  constructor(private http: HttpClient, private userService: UserService) { }

  getVezbe(): Observable<Vezba[]>{
    return this.http.get<Vezba[]>(environment.apiUrl + "vezba.php?action=getVezbe");
  }

  getVezba(id: any): Observable<Vezba>{
    return this.http.get<Vezba>(environment.apiUrl + "vezba.php?action=getVezba&id=" + id);
  }

  getVezbeByProfesorId(id: number): Observable<Vezba[]> {
    return this.http.get<Vezba[]>(environment.apiUrl + "vezba.php?action=getVezbeByProfesorId&id="+id);
  }

  getVezbeByUcenikId(id: any): Observable<Vezba[]> {
    return this.http.get<Vezba[]>(environment.apiUrl + "vezba.php?action=getVezbeByUcenikId&id="+id);
  }

  addVezba(vezbaData: VezbaDTO): Observable<boolean> {
    vezbaData.action = "dodajVezbu";
    return this.http.post<boolean>(environment.apiUrl + "vezba.php", vezbaData);
  }

  addVezbaOdeljenje(idOdeljenja: number, idVezbe: number) {
    return this.http.post<boolean>(environment.apiUrl + "vezba.php", {action: "dodajVezbaOdeljenje", idVezbe: idVezbe, idOdeljenja:idOdeljenja});
  }

  addVezbaUcenik(idUcenika: number, idVezbe: number) {
    return this.http.post<boolean>(environment.apiUrl + "vezba.php", {action: "dodajVezbaUcenik", idVezbe: idVezbe, idUcenika:idUcenika});
  }

  getOdeljenjaByVezbaId(id: number): Observable<Odeljenje[]> {
    return this.http.get<Odeljenje[]>(environment.apiUrl + "vezba.php?action=getOdeljenjaByVezbaId&id=" + id);
  }

  getUceniciByVezbaId(id: number): Observable<User[]> {
    return this.http.get<User[]>(environment.apiUrl + "vezba.php?action=getUceniciByVezbaId&id=" + id);
  }

  getZadaciByVezbaId(id: number): Observable<Zadatak[]>{
    return this.http.get<Zadatak[]>(environment.apiUrl + "vezba.php?action=getUceniciByVezbaId&id=" + id);
  }

  removeZadatakFromVezba(vezbaId: number, zadatakId: number): Observable<boolean> {
    return this.http.get<boolean>(environment.apiUrl + "vezba.php?action=getUceniciByVezbaId&id=");
  }

  addZadatakToVezba(vezbaId: number, zadatakId: any): Observable<boolean> {
    return this.http.post<boolean>(environment.apiUrl + "vezba.php", {action: "dodajVezbaZadatak", idVezbe: vezbaId, idZadatka: zadatakId});
  }
  
  updateVezba(selectedVezba: Vezba): Observable<boolean> {
    return this.http.get<boolean>(environment.apiUrl + "vezba.php?action=getUceniciByVezbaId&id=");
  }

  //POKUSAJI
  addVezbaPokusaj(p: any):Observable<number> {
    p.action = "dodajVezbaPokusaj";
    return this.http.post<number>(environment.apiUrl + "vezba.php", p);
  }

  addVezbaPokusajZadatak(p: any): Observable<number> {
    p.action = "dodajVezbaPokusajZadatak";
    return this.http.post<number>(environment.apiUrl + "vezba.php", p);
  }

  addVezbaPokusajZadatakOdgovor(p: any): Observable<boolean> {
    p.action = "dodajVezbaPokusajZadatakOdgovor";
    return this.http.post<boolean>(environment.apiUrl + "vezba.php", p);
  }
}
