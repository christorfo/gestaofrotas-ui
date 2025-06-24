import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

// Importação de todos os modelos e serviços necessários
import { Veiculo } from '../../models/veiculo.model';
import { Motorista } from '../../models/motorista.model';
import { Agendamento } from '../../models/agendamento.model';
import { Ocorrencia } from '../../models/ocorrencia.model';

import { VeiculoService } from '../../services/veiculo';
import { MotoristaService } from '../../services/motorista';
import { AgendamentoService, AgendamentoFiltros } from '../../services/agendamento';
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
  private cdr = inject(ChangeDetectorRef); // Injetando o Change Detector
  private toastr = inject(ToastrService); // Injetando o Toastr Service

  // Propriedades para armazenar os dados das listas
  veiculos: Veiculo[] = [];
  motoristas: Motorista[] = [];
  agendamentos: Agendamento[] = [];
  ocorrencias: Ocorrencia[] = [];

  // Propriedades para controlar o estado de carregamento de cada tabela
  isLoadingVeiculos = false;
  isLoadingMotoristas = false;
  isLoadingAgendamentos = false;
  isLoadingOcorrencias = false;

  // Propriedade para o formulário de filtros de agendamento
  filtros: AgendamentoFiltros = {};

  // Propriedade para mensagens de erro
  errorMessage: string | null = null;

  ngOnInit(): void {
    this.carregarVeiculos();
    this.carregarMotoristas();
    this.carregarAgendamentos();
    this.carregarOcorrencias();
  }

  carregarVeiculos(): void {
    this.isLoadingVeiculos = true;
    this.veiculoService.getVeiculos().subscribe({
      next: (data) => {
        this.veiculos = data;
        this.isLoadingVeiculos = false;
        this.cdr.detectChanges(); // Força a atualização da tela
      },
      error: (err) => {
        this.errorMessage = 'Falha ao carregar a lista de veículos.';
        this.isLoadingVeiculos = false;
      }
    });
  }

  carregarMotoristas(): void {
    this.isLoadingMotoristas = true;
    this.motoristaService.getMotoristas().subscribe({
      next: (data) => {
        this.motoristas = data;
        this.isLoadingMotoristas = false;
        this.cdr.detectChanges(); // Força a atualização da tela
      },
      error: (err) => {
        this.errorMessage = 'Falha ao carregar a lista de motoristas.';
        this.isLoadingMotoristas = false;
      }
    });
  }

  carregarAgendamentos(): void {
    this.isLoadingAgendamentos = true;
    this.agendamentoService.getAgendamentos(this.filtros).subscribe({
      next: (data) => {
        this.agendamentos = data;
        this.isLoadingAgendamentos = false;
        this.cdr.detectChanges(); // Força a atualização da tela
      },
      error: (err) => {
        this.errorMessage = 'Falha ao carregar a lista de agendamentos.';
        this.isLoadingAgendamentos = false;
      }
    });
  }

  carregarOcorrencias(): void {
    this.isLoadingOcorrencias = true;
    this.ocorrenciaService.getOcorrencias().subscribe({
      next: (data) => {
        this.ocorrencias = data;
        this.isLoadingOcorrencias = false;
        this.cdr.detectChanges(); // Força a atualização da tela
      },
      error: (err) => {
        this.errorMessage = 'Falha ao carregar a lista de ocorrências.';
        this.isLoadingOcorrencias = false;
      }
    });
  }

  onFiltrar(): void {
    this.carregarAgendamentos();
  }

  onLimparFiltros(): void {
    this.filtros = {};
    this.carregarAgendamentos();
  }

  onLiberarVeiculo(id: number): void {
    if (confirm('Tem certeza que deseja liberar este veículo da manutenção?')) {
      this.veiculoService.liberarVeiculo(id).subscribe({
        next: (veiculoAtualizado) => {
          // 3. Notificação de SUCESSO
          this.toastr.success(`Veículo ${veiculoAtualizado.placa} liberado com sucesso!`);
          this.carregarVeiculos(); // Atualiza a lista
        },
        error: (err) => {
          // 4. Notificação de ERRO
          this.toastr.error(err.error?.message || 'Não foi possível liberar o veículo.', 'Erro');
        }
      });
    }
  }

  onResolverOcorrencia(id: number): void {
    if (confirm('Tem certeza que deseja marcar esta ocorrência como resolvida?')) {
      this.ocorrenciaService.resolverOcorrencia(id).subscribe({
        next: () => this.carregarOcorrencias(),
        error: (err) => this.errorMessage = `Erro ao resolver ocorrência: ${err.error?.message || 'Tente novamente.'}`
      });
    }
  }
}