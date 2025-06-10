import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Agendamento } from '../models/agendamento.model';
import { environment } from '../../environments/environment';
import { IniciarViagemRequest } from '../dto/iniciar-viagem-request.model';
import { FinalizarViagemRequest } from '../dto/finalizar-viagem-request.model';
import { AgendamentoRequest } from '../dto/agendamento-request.model';


export interface AgendamentoFiltros {
  dataInicio?: string;
  dataFim?: string;
  motoristaId?: number;
  status?: string;
}

@Injectable({
  providedIn: 'root'
})


export class AgendamentoService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/agendamentos`;
  private meusAgendamentosUrl = `${environment.apiUrl}/agendamentos/meus-agendamentos`;

  getAgendamentos(filtros?: AgendamentoFiltros): Observable<Agendamento[]> {
    let params = new HttpParams();
    if (filtros) {
      if (filtros.dataInicio) {
        params = params.append('dataInicio', filtros.dataInicio);
      }
      if (filtros.dataFim) {
        params = params.append('dataFim', filtros.dataFim);
      }
      if (filtros.motoristaId) {
        params = params.append('motoristaId', filtros.motoristaId);
      }
      if (filtros.status) {
        params = params.append('status', filtros.status);
      }
    }
    return this.http.get<Agendamento[]>(this.apiUrl, { params });
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