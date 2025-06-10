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
  private apiUrl = 'https://viacep.com.br/ws';

  consultarCep(cep: string): Observable<ViaCepResponse> {
    // Remove caracteres não numéricos do CEP
    const cepNumerico = cep.replace(/\D/g, '');
    return this.http.get<ViaCepResponse>(`<span class="math-inline">\{this\.apiUrl\}/</span>{cepNumerico}/json/`);
  }
}