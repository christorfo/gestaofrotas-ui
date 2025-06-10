import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Necessário para o formulário do modal
import { Agendamento } from '../../models/agendamento.model';
import { AgendamentoService } from '../../services/agendamento';
import { IniciarViagemRequest } from '../../dto/iniciar-viagem-request.model';
import { FinalizarViagemRequest } from '../../dto/finalizar-viagem-request.model';

@Component({
  selector: 'app-motorista-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule], // Adicionar FormsModule
  templateUrl: './motorista-dashboard.html',
  styleUrls: ['./motorista-dashboard.css']
})
export class MotoristaDashboardComponent implements OnInit {
  private agendamentoService = inject(AgendamentoService);

  agendamentos: Agendamento[] = [];
  errorMessage: string | null = null;

  // --- Propriedades para controlar o modal ---
  modalAberto = false;
  tipoAcao: 'iniciar' | 'finalizar' | null = null;
  agendamentoSelecionado: Agendamento | null = null;
  dadosAcao = { quilometragem: null as number | null, observacoes: '' };
  modalErrorMessage: string | null = null;

  ngOnInit(): void {
    this.carregarAgendamentos();
  }

  carregarAgendamentos(): void {
    this.agendamentoService.getMeusAgendamentos().subscribe({
      next: (data) => { this.agendamentos = data; },
      error: (err) => { this.errorMessage = 'Falha ao carregar seus agendamentos.'; }
    });
  }

  // Abre o modal e define o contexto (iniciar ou finalizar)
  abrirModal(agendamento: Agendamento, tipo: 'iniciar' | 'finalizar'): void {
    this.agendamentoSelecionado = agendamento;
    this.tipoAcao = tipo;
    this.modalAberto = true;
  }

  // Fecha o modal e reseta os estados
  fecharModal(): void {
    this.modalAberto = false;
    this.tipoAcao = null;
    this.agendamentoSelecionado = null;
    this.dadosAcao = { quilometragem: null, observacoes: '' };
    this.modalErrorMessage = null;
  }

  // Lida com o envio do formulário do modal
  confirmarAcao(): void {
    if (!this.agendamentoSelecionado || this.dadosAcao.quilometragem === null) {
      this.modalErrorMessage = "A quilometragem é obrigatória.";
      return;
    }
    this.modalErrorMessage = null;

    if (this.tipoAcao === 'iniciar') {
      const request: IniciarViagemRequest = {
        quilometragemSaida: this.dadosAcao.quilometragem,
        observacoesSaida: this.dadosAcao.observacoes
      };
      this.agendamentoService.iniciarViagem(this.agendamentoSelecionado.id, request).subscribe({
        next: () => {
          this.fecharModal();
          this.carregarAgendamentos(); // Recarrega a lista para mostrar o novo status
        },
        error: (err) => this.modalErrorMessage = err.error?.message || 'Ocorreu um erro.'
      });
    } else if (this.tipoAcao === 'finalizar') {
      const request: FinalizarViagemRequest = {
        quilometragemFinal: this.dadosAcao.quilometragem,
        observacoesRetorno: this.dadosAcao.observacoes
      };
      this.agendamentoService.finalizarViagem(this.agendamentoSelecionado.id, request).subscribe({
        next: () => {
          this.fecharModal();
          this.carregarAgendamentos(); // Recarrega a lista
        },
        error: (err) => this.modalErrorMessage = err.error?.message || 'Ocorreu um erro.'
      });
    }
  }
}