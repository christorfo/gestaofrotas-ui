import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Agendamento } from '../models/agendamento.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AgendamentoService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/agendamentos`;

  getAgendamentos(): Observable<Agendamento[]> {
    return this.http.get<Agendamento[]>(this.apiUrl);
  }
}