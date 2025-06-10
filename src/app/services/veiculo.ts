import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Veiculo } from '../models/veiculo.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VeiculoService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/veiculos`;

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

  liberarVeiculo(id: number): Observable<Veiculo> {
    // Enviamos um corpo vazio {} pois é uma requisição POST de ação
    return this.http.post<Veiculo>(`${this.apiUrl}/${id}/liberar`, {});
  }
}