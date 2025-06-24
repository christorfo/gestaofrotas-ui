import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgxMaskDirective } from 'ngx-mask';

import { Agendamento } from '../../models/agendamento.model';
import { AgendamentoService } from '../../services/agendamento';
import { IniciarViagemRequest } from '../../dto/iniciar-viagem-request.model';
import { FinalizarViagemRequest } from '../../dto/finalizar-viagem-request.model';

@Component({
  selector: 'app-motorista-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, NgxMaskDirective],
  templateUrl: './motorista-dashboard.html',
  styleUrls: ['./motorista-dashboard.css']
})
export class MotoristaDashboardComponent implements OnInit {
  private agendamentoService = inject(AgendamentoService);
  private toastr = inject(ToastrService);

  agendamentos: Agendamento[] = [];
  isLoading = true;

  // --- Propriedades para controlar o modal ---
  modalAberto = false;
  tipoAcao: 'iniciar' | 'finalizar' | null = null;
  agendamentoSelecionado: Agendamento | null = null;
  dadosAcao = { quilometragem: null as number | null, observacoes: '' };

  ngOnInit(): void {
    this.carregarAgendamentos();
  }

  carregarAgendamentos(): void {
    this.isLoading = true;
    this.agendamentoService.getMeusAgendamentos().subscribe({
      next: (data) => {
        this.agendamentos = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.toastr.error('Falha ao carregar seus agendamentos.', 'Erro');
        this.isLoading = false;
      }
    });
  }

  // Abre o modal e define o contexto (iniciar ou finalizar)
  abrirModal(agendamento: Agendamento, tipo: 'iniciar' | 'finalizar'): void {
    this.agendamentoSelecionado = agendamento;
    this.tipoAcao = tipo;
    // Sugere a quilometragem atual do veículo ao iniciar a viagem
    if (tipo === 'iniciar') {
      this.dadosAcao.quilometragem = agendamento.veiculo.quilometragemAtual;
    }
    this.modalAberto = true;
  }

  // Fecha o modal e reseta os estados
  fecharModal(): void {
    this.modalAberto = false;
    this.tipoAcao = null;
    this.agendamentoSelecionado = null;
    this.dadosAcao = { quilometragem: null, observacoes: '' };
  }

  // Lida com o envio do formulário do modal
  confirmarAcao(): void {
    if (!this.agendamentoSelecionado || this.dadosAcao.quilometragem === null) {
      this.toastr.error("A quilometragem é obrigatória.", 'Erro de Validação');
      return;
    }

    if (this.tipoAcao === 'iniciar') {
      // Validação no Frontend
      if (this.dadosAcao.quilometragem < this.agendamentoSelecionado.veiculo.quilometragemAtual) {
        this.toastr.error('A quilometragem de saída não pode ser menor que a atual do veículo.', 'Erro de Validação');
        return;
      }
      const request: IniciarViagemRequest = {
        quilometragemSaida: this.dadosAcao.quilometragem,
        observacoesSaida: this.dadosAcao.observacoes
      };
      this.agendamentoService.iniciarViagem(this.agendamentoSelecionado.id, request).subscribe({
        next: () => {
          this.toastr.success('Viagem iniciada com sucesso!');
          this.fecharModal();
          this.carregarAgendamentos();
        },
        error: (err) => this.toastr.error(err.error?.message || 'Ocorreu um erro ao iniciar a viagem.', 'Erro')
      });

    } else if (this.tipoAcao === 'finalizar') {
      // Validação no Frontend
      if (this.dadosAcao.quilometragem <= (this.agendamentoSelecionado.quilometragemSaida ?? 0)) {
        this.toastr.error('A quilometragem final deve ser maior que a de saída.', 'Erro de Validação');
        return;
      }
      const request: FinalizarViagemRequest = {
        quilometragemFinal: this.dadosAcao.quilometragem,
        observacoesRetorno: this.dadosAcao.observacoes
      };
      this.agendamentoService.finalizarViagem(this.agendamentoSelecionado.id, request).subscribe({
        next: () => {
          this.toastr.success('Viagem finalizada com sucesso!');
          this.fecharModal();
          this.carregarAgendamentos();
        },
        error: (err) => this.toastr.error(err.error?.message || 'Ocorreu um erro ao finalizar a viagem.', 'Erro')
      });
    }
  }
}