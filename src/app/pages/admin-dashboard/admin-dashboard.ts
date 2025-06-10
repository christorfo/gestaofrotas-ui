import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { Veiculo } from '../../models/veiculo.model';
import { VeiculoService } from '../../services/veiculo';

import { Motorista } from '../../models/motorista.model';
import { MotoristaService } from '../../services/motorista';

import { Agendamento } from '../../models/agendamento.model';
import { AgendamentoService, AgendamentoFiltros } from '../../services/agendamento';

import { Ocorrencia } from '../../models/ocorrencia.model';
import { OcorrenciaService } from '../../services/ocorrencia';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css']
})
export class AdminDashboardComponent implements OnInit {
  private veiculoService = inject(VeiculoService);
  private motoristaService = inject(MotoristaService);
  private agendamentoService = inject(AgendamentoService);
  private ocorrenciaService = inject(OcorrenciaService);

  veiculos: Veiculo[] = []; // Array para armazenar a lista de veículos
  motoristas: Motorista[] = []; // Array para armazenar a lista de motoristas
  agendamentos: Agendamento[] = []; // Array para armazenar a lista de agendamentos
  ocorrencias: Ocorrencia[] = []; // Array para ocorrências
  filtros: AgendamentoFiltros = {}; // Array para armazenar o valor dos filtros

  errorMessage: string | null = null;

  // ngOnInit é um "gancho de ciclo de vida" que é executado quando o componente é inicializado.
  ngOnInit(): void {
    this.carregarVeiculos();
    this.carregarMotoristas();
    this.carregarAgendamentos();
    this.carregarOcorrencias();
  }

  carregarVeiculos(): void {
    this.veiculoService.getVeiculos().subscribe({
      next: (data) => { this.veiculos = data; },
      error: (err) => { this.errorMessage = 'Falha ao carregar a lista de veículos.'; }
    });
  }

  carregarMotoristas(): void {
    this.motoristaService.getMotoristas().subscribe({
      next: (data) => { this.motoristas = data; },
      error: (err) => { this.errorMessage = 'Falha ao carregar a lista de motoristas.'; }
    });
  }

  carregarAgendamentos(): void {
    // Limpa os filtros que estiverem vazios ou nulos
    const filtrosAtivos: AgendamentoFiltros = {};
    if (this.filtros.dataInicio) filtrosAtivos.dataInicio = this.filtros.dataInicio;
    if (this.filtros.dataFim) filtrosAtivos.dataFim = this.filtros.dataFim;
    if (this.filtros.motoristaId) filtrosAtivos.motoristaId = this.filtros.motoristaId;
    if (this.filtros.status) filtrosAtivos.status = this.filtros.status;

    this.agendamentoService.getAgendamentos(filtrosAtivos).subscribe({
      next: (data) => { this.agendamentos = data; },
      error: (err) => { this.errorMessage = 'Falha ao carregar a lista de agendamentos.'; }
    });
  }

  onLiberarVeiculo(id: number): void {
    if (confirm('Tem certeza que deseja liberar este veículo da manutenção?')) {
      this.veiculoService.liberarVeiculo(id).subscribe({
        next: () => {
          // Recarrega a lista para mostrar o status atualizado
          this.carregarVeiculos();
        },
        error: (err) => {
          // Atualiza a mensagem de erro geral da página
          this.errorMessage = `Erro ao liberar veículo: ${err.error?.message || 'Tente novamente.'}`;
        }
      });
    }
  }

  carregarOcorrencias(): void {
    this.ocorrenciaService.getOcorrencias().subscribe({
      next: (data) => { this.ocorrencias = data; },
      error: (err) => { this.errorMessage += ' Falha ao carregar ocorrências.'; }
    });
  }

  onResolverOcorrencia(id: number): void {
    if (confirm('Tem certeza que deseja marcar esta ocorrência como resolvida?')) {
      this.ocorrenciaService.resolverOcorrencia(id).subscribe({
        next: () => {
          // Recarrega a lista para mostrar o novo status
          this.carregarOcorrencias();
        },
        error: (err) => {
          this.errorMessage = `Erro ao resolver ocorrência: ${err.error?.message || 'Tente novamente.'}`;
        }
      });
    }
  }

  onFiltrar(): void {
    this.carregarAgendamentos();
  }

  // Novo método chamado pelo botão "Limpar"
  onLimparFiltros(): void {
    this.filtros = {}; // Reseta o objeto de filtros
    this.carregarAgendamentos(); // Recarrega a lista completa
  }
}