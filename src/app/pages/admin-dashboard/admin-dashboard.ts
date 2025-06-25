import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationService } from '../../services/confirmation';

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
  private confirmationService = inject(ConfirmationService);

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

  // Propriedades para as modais de ação
  isResolverModalAberto = false;
  ocorrenciaSelecionada: Ocorrencia | null = null;
  modalErrorMessage: string | null = null;

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

  onLiberarVeiculo(id: number, placa: string): void {
    const message = `Tem certeza que deseja liberar o veículo de placa ${placa} da manutenção?`;

    // Usa o serviço de confirmação em vez do 'confirm()' do navegador
    this.confirmationService.open(message, () => {
      // Esta função (callback) só é executada se o usuário clicar em "Confirmar" no modal
      this.veiculoService.liberarVeiculo(id).subscribe({
        next: (veiculoAtualizado) => {
          this.toastr.success(`Veículo ${veiculoAtualizado.placa} liberado com sucesso!`, 'Sucesso');
          this.carregarVeiculos();
        },
        error: (err) => {
          this.toastr.error(err.error?.message || 'Não foi possível liberar o veículo.', 'Erro');
        }
      });
    });
  }

  // 1. Abre o modal e guarda a ocorrência selecionada
  abrirModalResolver(ocorrencia: Ocorrencia): void {
    this.ocorrenciaSelecionada = ocorrencia;
    this.isResolverModalAberto = true;
  }

  // 2. Fecha o modal e limpa as variáveis
  fecharModalResolver(): void {
    this.isResolverModalAberto = false;
    this.ocorrenciaSelecionada = null;
    this.modalErrorMessage = null;
  }

  // 3. Lógica que antes estava no onResolverOcorrencia
  confirmarResolucaoOcorrencia(): void {
    if (!this.ocorrenciaSelecionada) return;

    this.ocorrenciaService.resolverOcorrencia(this.ocorrenciaSelecionada.id).subscribe({
      next: (ocorrenciaResolvida) => {
        this.toastr.success(`Ocorrência para o veículo ${ocorrenciaResolvida.veiculoPlaca} foi resolvida.`, 'Sucesso');
        this.fecharModalResolver();
        this.carregarOcorrencias(); // Atualiza a lista
      },
      error: (err) => {
        // Exibe o erro dentro do modal
        this.modalErrorMessage = err.error?.message || 'Não foi possível resolver a ocorrência.';
      }
    });
  }
}