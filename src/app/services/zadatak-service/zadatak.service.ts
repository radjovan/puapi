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

  url = environment.apiUrl + "Controllers/";

  constructor(private http: HttpClient, private userService: UserService) { }

  getPredmetiByProfesorId(idProfesora: number): Observable<Predmet[]>{
    return this.http.get<Predmet[]>(this.url + "zaduzenja.php?action=getPredmetZaduzenje&id="+idProfesora);
  }

  getPredmeti(): Observable<Predmet[]>{
    return this.http.get<Predmet[]>(this.url + "zaduzenja.php?action=getPredmet");
  }

  getPredmetiById(id: number): Observable<Predmet>{
    return this.http.get<Predmet>(this.url + "zaduzenja.php?action=getPredmetById&id=" + id);
  }

  addZadatak(zadatak: Zadatak): Observable<any>{
    zadatak.action = "dodajZadatak";
    return this.http.post<any>(this.url + "zadatak.php", zadatak);
  }

  updateZadatak(zadatak: Zadatak): Observable<any>{
    zadatak.action = "azurirajZadatak";
    return this.http.post<any>(this.url + "zadatak.php", zadatak);
  }

  addDefinition(tekst: any, taskId: number, slika: any) {
    return this.http.post<Object>(this.url + "zadatak.php",{tekst: tekst, idZadatka: taskId, slika: slika, action: "dodajDefiniciju"});
  }

  addZadatakPath(path: string, taskId: any) {
    return this.http.post<Object>(this.url + "zadatak.php",{path: path, idZadatka: taskId, action: "dodajPutanjuZadatka"});
  }

  addHint(tekst: any, taskId: number) {
    return this.http.post<Object>(this.url + "zadatak.php",{tekst: tekst, idZadatka: taskId, action: "dodajHint"});
  }

  addAnswers(tekst: any, taskId: number, level: number) {
    return this.http.post<Object>(this.url + "zadatak.php",{tacnost: level,tekst: tekst, idZadatka: taskId, action: "dodajOdgovor"});
  }

  getZadaciByPredmetId(idPredmeta: any): Observable<Zadatak[]>{
    return this.http.get<Zadatak[]>(this.url + "zadatak.php?action=dajZadatkePoIdPredmeta&idPredmeta="+idPredmeta);
  }

  getZadaciByCreatorId(idKreatora: any): any{
    return this.http.get<Zadatak[]>(this.url + "zadatak.php?action=dajZadatkePoIdKreatora&id="+idKreatora);
  }

  getZadaciByVezbaId(id: any): Observable<Zadatak[]>{
    return this.http.get<Zadatak[]>(this.url + "zadatak.php?action=dajZadatkePoIdVezbe&id="+id);
  }

  getZadatakImagePath(taskId: any): Observable<Slika> {
    return this.http.get<Slika>(this.url + "zadatak.php?action=dajSlikuPoIdZadatka&id="+taskId);
  }

  dajOdgovorePoIdZadatka(taskId: any): Observable<Odgovor[]> {
    return this.http.get<Odgovor[]>(this.url + "zadatak.php?action=dajOdgovorePoIdZadatka&id="+taskId);
  }

  dajHintPoIdZadatka(taskId: any): Observable<Hint> {
    return this.http.get<Hint>(this.url + "zadatak.php?action=dajHintPoIdZadatka&id="+taskId);
  }

  dajDefinicijuPoIdZadatka(taskId: any): Observable<Definition>{
    return this.http.get<Definition>(this.url + "zadatak.php?action=dajDefinicijuPoIdZadatka&id="+taskId);
  }

  dajZadatakPoId(taskId: any): Observable<Zadatak> {
    return this.http.get<Zadatak>(this.url + "zadatak.php?action=dajZadatakPoId&id="+taskId);
  }

  dajOdgovorPoId(taskId: any): Observable<Odgovor> {
    return this.http.get<Odgovor>(this.url + "zadatak.php?action=dajOdgovorPoId&id="+taskId);
  }

}
