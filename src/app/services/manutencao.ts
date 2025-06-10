import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Manutencao, ManutencaoRequest } from '../models/manutencao.model';

@Injectable({
  providedIn: 'root'
})
export class ManutencaoService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/manutencoes`;

  registrarManutencao(request: ManutencaoRequest): Observable<Manutencao> {
    return this.http.post<Manutencao>(this.apiUrl, request);
  }

  getManutencoesPorVeiculo(veiculoId: number): Observable<Manutencao[]> {
    return this.http.get<Manutencao[]>(`${this.apiUrl}/veiculo/${veiculoId}`);
  }
}