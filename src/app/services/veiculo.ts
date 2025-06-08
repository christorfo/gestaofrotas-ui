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

  /**
   * Busca a lista de todos os veículos na API.
   * O AuthInterceptor adicionará o token JWT automaticamente.
   */
  getVeiculos(): Observable<Veiculo[]> {
    return this.http.get<Veiculo[]>(this.apiUrl);
  }
}