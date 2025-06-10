import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { Veiculo } from '../../models/veiculo.model';
import { VeiculoService } from '../../services/veiculo';

import { Motorista } from '../../models/motorista.model';
import { MotoristaService } from '../../services/motorista';

import { Agendamento } from '../../models/agendamento.model';
import { AgendamentoService } from '../../services/agendamento';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css']
})
export class AdminDashboardComponent implements OnInit {
  private veiculoService = inject(VeiculoService);
  private motoristaService = inject(MotoristaService);
  private agendamentoService = inject(AgendamentoService);

  veiculos: Veiculo[] = []; // Array para armazenar a lista de veículos
  motoristas: Motorista[] = []; // Array para armazenar a lista de motoristas
  agendamentos: Agendamento[] = []; // Array para armazenar a lista de agendamentos

  errorMessage: string | null = null;

  // ngOnInit é um "gancho de ciclo de vida" que é executado quando o componente é inicializado.
  ngOnInit(): void {
    this.carregarVeiculos();
    this.carregarMotoristas();
    this.carregarAgendamentos();
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
    this.agendamentoService.getAgendamentos().subscribe({
      next: (data) => {
        this.agendamentos = data;
      },
      error: (err) => {
        // Concatenar mensagens de erro para não sobrescrever
        this.errorMessage += ' Falha ao carregar a lista de agendamentos.';
      }
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
}