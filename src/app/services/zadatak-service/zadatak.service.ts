import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Predmet } from '../../models/predmet';
import { Zadatak } from '../../models/zadatak';
import { environment } from '../../../enviroment';
import { UserService } from '../user-service/user.service';
import { VezbaDTO } from '../../models/DTOs/VezbaDTO';
import { Slika } from '../../models/slika';
import { Definition } from '../../models/definition';
import { Hint } from '../../models/hint';
import { Odgovor } from '../../models/odgovor';

@Injectable({
  providedIn: 'root'
})
export class ZadatakService {

  constructor(private http: HttpClient, private userService: UserService) { }

  getPredmetiByProfesorId(idProfesora: number): Observable<Predmet[]>{
    return this.http.get<Predmet[]>(environment.apiUrl + "zaduzenja.php?action=getPredmetZaduzenje&id="+idProfesora);
  }

  getPredmeti(): Observable<Predmet[]>{
    return this.http.get<Predmet[]>(environment.apiUrl + "zaduzenja.php?action=getPredmet");
  }

  getPredmetiById(id: number): Observable<Predmet>{
    return this.http.get<Predmet>(environment.apiUrl + "zaduzenja.php?action=getPredmetById&id=" + id);
  }

  addZadatak(zadatak: Zadatak): Observable<any>{
    zadatak.action = "dodajZadatak";
    return this.http.post<any>(environment.apiUrl + "zadatak.php", zadatak);
  }

  updateZadatak(zadatak: Zadatak): Observable<any>{
    zadatak.action = "azurirajZadatak";
    return this.http.post<any>(environment.apiUrl + "zadatak.php", zadatak);
  }

  addDefinition(tekst: any, taskId: number, slika: any) {
    return this.http.post<Object>(environment.apiUrl + "zadatak.php",{tekst: tekst, idZadatka: taskId, slika: slika, action: "dodajDefiniciju"});
  }

  addZadatakPath(path: string, taskId: any) {
    return this.http.post<Object>(environment.apiUrl + "zadatak.php",{path: path, idZadatka: taskId, action: "dodajPutanjuZadatka"});
  }

  addHint(tekst: any, taskId: number) {
    return this.http.post<Object>(environment.apiUrl + "zadatak.php",{tekst: tekst, idZadatka: taskId, action: "dodajHint"});
  }

  addAnswers(tekst: any, taskId: number, level: number) {
    return this.http.post<Object>(environment.apiUrl + "zadatak.php",{tacnost: level,tekst: tekst, idZadatka: taskId, action: "dodajOdgovor"});
  }

  getZadaciByPredmetId(idPredmeta: any): Observable<Zadatak[]>{
    return this.http.get<Zadatak[]>(environment.apiUrl + "zadatak.php?action=dajZadatkePoIdPredmeta&idPredmeta="+idPredmeta);
  }

  getZadaciByCreatorId(idKreatora: any): any{
    return this.http.get<Zadatak[]>(environment.apiUrl + "zadatak.php?action=dajZadatkePoIdKreatora&id="+idKreatora);
  }

  getZadaciByVezbaId(id: any): Observable<Zadatak[]>{
    return this.http.get<Zadatak[]>(environment.apiUrl + "zadatak.php?action=dajZadatkePoIdVezbe&id="+id);
  }

  getZadatakImagePath(taskId: any): Observable<Slika> {
    return this.http.get<Slika>(environment.apiUrl + "zadatak.php?action=dajSlikuPoIdZadatka&id="+taskId);
  }

  dajOdgovorePoIdZadatka(taskId: any): Observable<Odgovor[]> {
    return this.http.get<Odgovor[]>(environment.apiUrl + "zadatak.php?action=dajOdgovorePoIdZadatka&id="+taskId);
  }

  dajHintPoIdZadatka(taskId: any): Observable<Hint> {
    return this.http.get<Hint>(environment.apiUrl + "zadatak.php?action=dajHintPoIdZadatka&id="+taskId);
  }

  dajDefinicijuPoIdZadatka(taskId: any): Observable<Definition>{
    return this.http.get<Definition>(environment.apiUrl + "zadatak.php?action=dajDefinicijuPoIdZadatka&id="+taskId);
  }
}
