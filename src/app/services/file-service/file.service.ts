import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../enviroment';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private http: HttpClient) {}

  uploadFile(file: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);

    return this.http.post(environment.apiUrl + "upload.php", formData);
  }

  getFile(filePath: string): Observable<Blob> {
    const options = { responseType: 'blob' as 'json' };
    return this.http.get<Blob>(environment.apiUrl + "upload.php?filePath="+filePath, options);
  }

  getImageUrlByName(filename: any): string{
    return "http://localhost/programiranoUcenjeAPI/uploads/" + filename;
  }
}
