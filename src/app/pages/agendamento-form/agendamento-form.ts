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
import { HttpErrorResponse } from '@angular/common/http';

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

  // Propriedade para controlar a mensagem de erro no formulário
  formError: string | null = null;

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
    // Limpa erros anteriores antes de uma nova submissão
    this.formError = null;

    this.agendamentoService.createAgendamento(this.agendamento).subscribe({
      next: () => {
        this.toastr.success('Agendamento criado com sucesso!');
        this.router.navigate(['/admin/dashboard']);
      },
      error: (err: HttpErrorResponse) => {
        // A resposta de erro do servidor é texto simples, o que causa um erro de análise no Angular
        // quando ele espera um JSON. A lógica abaixo tenta extrair a mensagem de texto.
        if (err.status === 400 && err.error && typeof err.error === 'string') {
          // Caso 1: O corpo do erro é a string de texto (cenário ideal).
          this.formError = err.error;
        } else if (err.status === 400) {
          // Caso 2: Ocorreu um erro de análise. Mostramos uma mensagem amigável e genérica
          // para esse tipo de conflito, em vez do erro técnico.
          this.formError = 'O veículo ou motorista não está disponível ou já existe um agendamento neste horário.';

          // É útil para o desenvolvedor ver o erro real no console para depuração.
          console.error('Erro de agendamento recebido do servidor:', err);
        } else {
          // Para todos os outros erros (ex: erro de servidor 500), usamos o toastr.
          this.toastr.error('Ocorreu um erro inesperado. Tente novamente mais tarde.', 'Erro');
        }
      }
    });
  }
}
