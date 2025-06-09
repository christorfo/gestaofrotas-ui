import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Veiculo } from '../models/veiculo.model';

@Injectable({
  providedIn: 'root'
})
export class VeiculoService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/veiculos';

  getVeiculos(): Observable<Veiculo[]> {
    return this.http.get<Veiculo[]>(this.apiUrl);
  }
  
  getVeiculoById(id: number): Observable<Veiculo> {
    return this.http.get<Veiculo>(`${this.apiUrl}/${id}`);
  }

  createVeiculo(veiculoData: Partial<Veiculo>): Observable<Veiculo> {
    return this.http.post<Veiculo>(this.apiUrl, veiculoData);
  }

  updateVeiculo(id: number, veiculoData: Veiculo): Observable<Veiculo> {
    return this.http.put<Veiculo>(`${this.apiUrl}/${id}`, veiculoData);
  }
}