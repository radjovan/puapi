import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../enviroment';
import { User } from '../../models/user';
import { Odeljenje } from '../../models/odeljenje';
import { OdeljenjeDTO } from '../../models/DTOs/odeljenjeDTO';
import { UserDTO } from '../../models/DTOs/userDTO';
import { PredmetDTO } from '../../models/DTOs/predmetDTO';

@Injectable({
  providedIn: 'root'
})
export class UserService {  
  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<any> {
    return this.http.post<Object>(environment.apiUrl + "user.php", { username: username, password: password, action: "loginUser" });
  }

  registerUser(user: UserDTO): Observable<number> {
    user.action = "addUser";
    return this.http.post<number>(environment.apiUrl + "user.php", user);
  }

  logout() {
    localStorage.removeItem('currentUser');
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('currentUser') !== null;
  }

  getCurrentUser(): any {
    var currentUser = localStorage.getItem('currentUser');
    if(currentUser !== null)
    {
      return JSON.parse(currentUser);
    }
    return null;
  }

  getCurrentUserId(): any {
    var currentUser = localStorage.getItem('currentUser');
    if(currentUser !== null)
    {
      var json =  JSON.parse(currentUser);
      return json.user.id;
    }
    return null;
  }

  isAdmin(): any {
    var currentUser = localStorage.getItem('currentUser');
    if(currentUser !== null)
    {
      var res =  JSON.parse(currentUser);

      return res.user.role === 0; //ADMIN
    }
    return false;
  }

  isProfesor(): any {
    var currentUser = localStorage.getItem('currentUser');
    if(currentUser !== null)
    {
      var res =  JSON.parse(currentUser);

      return res.user.role === 2; //PROFESOR
    }
    return false;
  }

  isUcenik(): any {
    var currentUser = localStorage.getItem('currentUser');
    if(currentUser !== null)
    {
      var res =  JSON.parse(currentUser);

      return res.user.role == 3; //UCENIK
    }
    return false;
  }

  getUcenici(): Observable<Object>{
    return this.http.get<Object>(environment.apiUrl + "user.php?action=getUsersByRole&roleId=3");
  }

  checkUsername(username: string): Observable<boolean> {
    return this.http.get<boolean>(environment.apiUrl + "user.php?action=checkUsername&un="+username);
  }
}
