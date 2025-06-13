import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';

// Importação de todos os modelos e serviços necessários
import { Veiculo } from '../../models/veiculo.model';
import { Motorista } from '../../models/motorista.model';
import { Agendamento } from '../../models/agendamento.model';
import { Ocorrencia } from '../../models/ocorrencia.model';

// Corrigindo os caminhos dos imports para incluir o sufixo do arquivo
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

  // Propriedades para armazenar os dados das listas
  veiculos: Veiculo[] = [];
  motoristas: Motorista[] = [];
  agendamentos: Agendamento[] = [];
  ocorrencias: Ocorrencia[] = [];

  // Usaremos uma única variável para o carregamento inicial da página
  isLoading = false;

  // Propriedade para o formulário de filtros de agendamento
  filtros: AgendamentoFiltros = {};

  // Propriedade para mensagens de erro
  errorMessage: string | null = null;

  ngOnInit(): void {
    this.carregarDadosIniciais();
  }

  carregarDadosIniciais(): void {
    this.isLoading = true;
    this.errorMessage = null;

    // forkJoin executa todas as chamadas em paralelo e só emite o resultado quando TODAS terminarem
    forkJoin({
      veiculos: this.veiculoService.getVeiculos(),
      motoristas: this.motoristaService.getMotoristas(),
      agendamentos: this.agendamentoService.getAgendamentos(), // Carrega agendamentos sem filtro inicialmente
      ocorrencias: this.ocorrenciaService.getOcorrencias()
    }).subscribe({
      next: (resultados) => {
        // Atribui todos os resultados de uma só vez, garantindo consistência
        this.veiculos = resultados.veiculos;
        this.motoristas = resultados.motoristas;
        this.agendamentos = resultados.agendamentos;
        this.ocorrencias = resultados.ocorrencias;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Falha ao carregar os dados do dashboard. Por favor, tente recarregar a página.';
        this.isLoading = false;
      }
    });
  }

  // O método de filtrar agora só precisa recarregar a lista de agendamentos
  onFiltrar(): void {
    // Para feedback visual, podemos ter um loading específico para a tabela de agendamentos
    this.agendamentoService.getAgendamentos(this.filtros).subscribe({
      next: (data) => {
        this.agendamentos = data;
      },
      error: (err) => {
        this.errorMessage = 'Falha ao aplicar o filtro de agendamentos.';
      }
    });
  }

  onLimparFiltros(): void {
    this.filtros = {};
    this.onFiltrar(); // Chama o método de filtrar para recarregar a lista completa
  }

  onLiberarVeiculo(id: number): void {
    if (confirm('Tem certeza que deseja liberar este veículo da manutenção?')) {
      this.veiculoService.liberarVeiculo(id).subscribe({
        next: () => this.carregarDadosIniciais(), // Recarrega tudo para garantir consistência
        error: (err) => this.errorMessage = `Erro ao liberar veículo: ${err.error?.message || 'Tente novamente.'}`
      });
    }
  }

  onResolverOcorrencia(id: number): void {
    if (confirm('Tem certeza que deseja marcar esta ocorrência como resolvida?')) {
      this.ocorrenciaService.resolverOcorrencia(id).subscribe({
        next: () => this.carregarDadosIniciais(), // Recarrega tudo para garantir consistência
        error: (err) => this.errorMessage = `Erro ao resolver ocorrência: ${err.error?.message || 'Tente novamente.'}`
      });
    }
  }
}