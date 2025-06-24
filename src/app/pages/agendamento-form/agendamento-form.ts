import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AgendamentoService } from '../../services/agendamento';
import { VeiculoService } from '../../services/veiculo';
import { MotoristaService } from '../../services/motorista';
import { Veiculo } from '../../models/veiculo.model';
import { Motorista } from '../../models/motorista.model';
import { AgendamentoRequest } from '../../dto/agendamento-request.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-agendamento-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './agendamento-form.html',
  styleUrls: ['./agendamento-form.css']
})
export class AgendamentoFormComponent implements OnInit {
  // Injeção de serviços
  private agendamentoService = inject(AgendamentoService);
  private veiculoService = inject(VeiculoService);
  private motoristaService = inject(MotoristaService);
  private router = inject(Router);
  private toastr = inject(ToastrService);

  // Propriedades para os dropdowns
  veiculos: Veiculo[] = [];
  motoristas: Motorista[] = [];

  // Propriedade para o formulário
  agendamento: AgendamentoRequest = {
    veiculoId: 0,
    motoristaId: 0,
    dataHoraSaida: '',
    destino: '',
    justificativa: ''
  };

  ngOnInit(): void {
    this.carregarVeiculosEMotoristas();
  }

  carregarVeiculosEMotoristas(): void {
    // Busca veículos disponíveis
    this.veiculoService.getVeiculos().subscribe(data => {
      this.veiculos = data.filter(v => v.status === 'DISPONIVEL');
    });
    // Busca motoristas ativos
    this.motoristaService.getMotoristas().subscribe(data => {
      this.motoristas = data.filter(m => m.status === 'ATIVO');
    });
  }

  onSubmit(): void {
    this.agendamentoService.createAgendamento(this.agendamento).subscribe({
      next: () => {
        this.toastr.success('Agendamento criado com sucesso!');
        this.router.navigate(['/admin/dashboard']);
      },
      error: (err) => {
        const errorMessage = err.error?.message || 'Não foi possível salvar o agendamento.';
        this.toastr.error(errorMessage, 'Erro ao Agendar');
      }
    });
  }
}