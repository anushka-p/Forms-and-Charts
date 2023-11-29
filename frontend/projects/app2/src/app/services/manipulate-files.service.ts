import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ManipulateFilesService {

  constructor(private http:HttpClient) { }
  private apiUrl = 'http://localhost:3000/test/available-files';

  getAvailableFiles(): Observable<any>{
   return this.http.get<any>(this.apiUrl)
  }
}
