import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common'; // Importar Location
import { ActivatedRoute } from '@angular/router';
import { Agendamento } from '../../models/agendamento.model';
import { AgendamentoService } from '../../services/agendamento';

@Component({
  selector: 'app-agendamento-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './agendamento-details.html',
  styleUrls: ['./agendamento-details.css']
})
export class AgendamentoDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private agendamentoService = inject(AgendamentoService);
  private location = inject(Location); // Para o botão "Voltar"

  agendamento: Agendamento | null = null;
  errorMessage: string | null = null;

  ngOnInit(): void {
    // Pega o 'id' da URL
    const agendamentoId = this.route.snapshot.paramMap.get('id');

    if (agendamentoId) {
      this.agendamentoService.getAgendamentoById(Number(agendamentoId)).subscribe({
        next: (data) => {
          this.agendamento = data;
        },
        error: (err) => {
          this.errorMessage = `Erro ao carregar detalhes do agendamento: ${err.error?.message || 'Tente novamente.'}`;
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