import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Agendamento } from '../../models/agendamento.model';
import { AgendamentoService } from '../../services/agendamento';
import { IniciarViagemRequest } from '../../dto/iniciar-viagem-request.model';
import { FinalizarViagemRequest } from '../../dto/finalizar-viagem-request.model';

@Component({
  selector: 'app-motorista-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './motorista-dashboard.html',
  styleUrls: ['./motorista-dashboard.css']
})
export class MotoristaDashboardComponent implements OnInit {
  private agendamentoService = inject(AgendamentoService);

  agendamentos: Agendamento[] = [];
  errorMessage: string | null = null;

  // Propriedades para controlar o modal
  modalAberto = false;
  tipoAcao: 'iniciar' | 'finalizar' | null = null;
  // Agora vamos guardar o agendamento inteiro, não apenas o ID
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

  // Abre o modal para iniciar ou finalizar, guardando o agendamento completo
  abrirModal(agendamento: Agendamento, tipo: 'iniciar' | 'finalizar'): void {
    this.agendamentoSelecionado = agendamento;
    this.tipoAcao = tipo;
    this.modalAberto = true;
  }

  fecharModal(): void {
    this.modalAberto = false;
    this.tipoAcao = null;
    this.agendamentoSelecionado = null;
    this.dadosAcao = { quilometragem: null, observacoes: '' };
    this.modalErrorMessage = null;
  }

  // Lógica de confirmação com validação no frontend
  confirmarAcao(): void {
    if (!this.agendamentoSelecionado || this.dadosAcao.quilometragem === null) {
      this.modalErrorMessage = "A quilometragem é obrigatória.";
      return;
    }
    this.modalErrorMessage = null;

    if (this.tipoAcao === 'iniciar') {
      // VALIDAÇÃO NO FRONTEND
      if (this.dadosAcao.quilometragem < this.agendamentoSelecionado.veiculo.quilometragemAtual) {
        this.modalErrorMessage = 'A quilometragem de saída não pode ser menor que a atual do veículo.';
        return; // Interrompe a ação
      }
      const request: IniciarViagemRequest = {
        quilometragemSaida: this.dadosAcao.quilometragem,
        observacoesSaida: this.dadosAcao.observacoes
      };
      this.agendamentoService.iniciarViagem(this.agendamentoSelecionado.id, request).subscribe({
        next: () => { this.fecharModal(); this.carregarAgendamentos(); },
        error: (err) => this.modalErrorMessage = err.error?.message || 'Ocorreu um erro.'
      });
    } else if (this.tipoAcao === 'finalizar') {
      // VALIDAÇÃO NO FRONTEND
      if (this.dadosAcao.quilometragem <= (this.agendamentoSelecionado.quilometragemSaida ?? 0)) {
        this.modalErrorMessage = 'A quilometragem final deve ser maior que a de saída.';
        return; // Interrompe a ação
      }
      const request: FinalizarViagemRequest = {
        quilometragemFinal: this.dadosAcao.quilometragem,
        observacoesRetorno: this.dadosAcao.observacoes
      };
      this.agendamentoService.finalizarViagem(this.agendamentoSelecionado.id, request).subscribe({
        next: () => { this.fecharModal(); this.carregarAgendamentos(); },
        error: (err) => this.modalErrorMessage = err.error?.message || 'Ocorreu um erro.'
      });
    }
  }
}