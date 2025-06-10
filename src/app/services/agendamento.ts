import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Agendamento } from '../models/agendamento.model';
import { environment } from '../../environments/environment';
import { IniciarViagemRequest } from '../dto/iniciar-viagem-request.model';
import { FinalizarViagemRequest } from '../dto/finalizar-viagem-request.model';
import { AgendamentoRequest } from '../dto/agendamento-request.model';

@Injectable({
  providedIn: 'root'
})
export class AgendamentoService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/agendamentos`;
  private meusAgendamentosUrl = `${environment.apiUrl}/agendamentos/meus-agendamentos`;

  getAgendamentos(): Observable<Agendamento[]> {
    return this.http.get<Agendamento[]>(this.apiUrl);
  }

  getAgendamentoById(id: number): Observable<Agendamento> {
    return this.http.get<Agendamento>(`${this.apiUrl}/${id}`);
  }

  getMeusAgendamentos(): Observable<Agendamento[]> {
    return this.http.get<Agendamento[]>(this.meusAgendamentosUrl);
  }

  iniciarViagem(id: number, data: IniciarViagemRequest): Observable<Agendamento> {
    return this.http.post<Agendamento>(`${this.apiUrl}/${id}/iniciar`, data);
  }

  finalizarViagem(id: number, data: FinalizarViagemRequest): Observable<Agendamento> {
    return this.http.post<Agendamento>(`${this.apiUrl}/${id}/finalizar`, data);
  }

  createAgendamento(agendamentoData: AgendamentoRequest): Observable<Agendamento> {
    return this.http.post<Agendamento>(this.apiUrl, agendamentoData);
  }
}