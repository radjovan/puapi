import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../enviroment';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  constructor(private http: HttpClient) {}

  sendMail(text: string, email: string): Observable<any> {
    return this.http.post(environment.apiUrl + "Controllers/sendMail.php", {action: "sendMail",text: text, emailTo: email});
  }
}
