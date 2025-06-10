import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Interface para a resposta da API do ViaCEP
export interface ViaCepResponse {
    cep: string;
    logradouro: string;
    complemento: string;
    bairro: string;
    localidade: string;
    uf: string;
    erro?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ViaCepService {
  private http = inject(HttpClient);
  // GARANTA QUE A URL COMECE COM https://
  private apiUrl = 'https://viacep.com.br/ws';

  consultarCep(cep: string): Observable<ViaCepResponse> {
    const cepNumerico = cep.replace(/\D/g, '');
    return this.http.get<ViaCepResponse>(`${this.apiUrl}/${cepNumerico}/json/`);
  }
}