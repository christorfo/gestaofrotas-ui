import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, Location, DatePipe } from '@angular/common'; 
import { ActivatedRoute } from '@angular/router';
import { Agendamento } from '../../models/agendamento.model';
import { AgendamentoService } from '../../services/agendamento';

@Component({
  selector: 'app-agendamento-details',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './agendamento-details.html',
  styleUrls: ['./agendamento-details.css']
})
export class AgendamentoDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private agendamentoService = inject(AgendamentoService);
  private location = inject(Location);

  agendamento: Agendamento | null = null;
  errorMessage: string | null = null;
  isLoading = true;

  ngOnInit(): void {
    // Pega o 'id' da URL
    const agendamentoId = this.route.snapshot.paramMap.get('id');

    if (agendamentoId) {
      this.agendamentoService.getAgendamentoById(Number(agendamentoId)).subscribe({
        next: (data) => {
          this.agendamento = data;
          this.isLoading = false;
        },
        error: (err) => {
          this.errorMessage = `Erro ao carregar detalhes do agendamento: ${err.error?.message || 'Tente novamente.'}`;
          this.isLoading = false;
          console.error(err);
        }
      });
    }
  }

  // Função para o botão "Voltar"
  voltar(): void {
    this.location.back();
  }
}