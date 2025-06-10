import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Motorista } from '../models/motorista.model';

@Injectable({
  providedIn: 'root'
})
export class MotoristaService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/motoristas';

  getMotoristas(): Observable<Motorista[]> {
    return this.http.get<Motorista[]>(this.apiUrl);
  }

  getMotoristaById(id: number): Observable<Motorista> {
    return this.http.get<Motorista>(`${this.apiUrl}/${id}`);
  }

  createMotorista(motoristaData: Partial<Motorista>): Observable<Motorista> {
    return this.http.post<Motorista>(this.apiUrl, motoristaData);
  }

  updateMotorista(id: number, motoristaData: Partial<Motorista>): Observable<Motorista> {
    return this.http.put<Motorista>(`${this.apiUrl}/${id}`, motoristaData);
  }
}