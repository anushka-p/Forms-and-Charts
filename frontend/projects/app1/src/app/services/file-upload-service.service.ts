import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileUploadServiceService {

  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  uploadFile(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<any>(`${this.apiUrl}/drive/upload-file`, formData);
  }

  exportForm(id: number, token: string, startDate: any, endDate:any): Observable<string> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const options = { headers, responseType: 'text' as 'json' }; 

    return this.http.post(`${this.apiUrl}/admin/download-csv`, { id, startDate, endDate}, options).pipe(
      map((response: any) => response),
      catchError((error: any) => throwError(error))
    );
  }

}
