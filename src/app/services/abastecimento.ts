import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Abastecimento, AbastecimentoRequest } from '../models/abastecimento.model';

@Injectable({
  providedIn: 'root'
})
export class AbastecimentoService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/abastecimentos`;

  registrarAbastecimento(request: AbastecimentoRequest): Observable<Abastecimento> {
    return this.http.post<Abastecimento>(this.apiUrl, request);
  }
}