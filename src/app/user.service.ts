import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:3000/api/employees';

  constructor(private http: HttpClient) {}

  getEmployees(page: number, limit: number): Observable<any> {
    const url = `${this.apiUrl}?page=${page}&limit=${limit}`;
    return this.http.get(url);
  }
  updateImages(userId: string, images: { pancard: string, aadharcard: string }): Observable<any> {
    const url = `http://localhost:3000/api/users/${userId}/images`;
    return this.http.put(url, images);
  }
}
