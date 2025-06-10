import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Ocorrencia, OcorrenciaRequest } from '../models/ocorrencia.model';

@Injectable({
  providedIn: 'root'
})
export class OcorrenciaService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/ocorrencias`;

  registrarOcorrencia(request: OcorrenciaRequest): Observable<Ocorrencia> {
    return this.http.post<Ocorrencia>(this.apiUrl, request);
  }

  getOcorrencias(): Observable<Ocorrencia[]> {
    return this.http.get<Ocorrencia[]>(this.apiUrl);
  }

  resolverOcorrencia(id: number): Observable<Ocorrencia> {
    // Enviamos um corpo vazio {} pois é uma ação POST sem dados extras
    return this.http.post<Ocorrencia>(`${this.apiUrl}/${id}/resolver`, {});
  }
}