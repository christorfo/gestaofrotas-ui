import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Veiculo } from '../../models/veiculo.model';
import { VeiculoService } from '../../services/veiculo';
import { OcorrenciaRequest } from '../../models/ocorrencia.model';
import { OcorrenciaService } from '../../services/ocorrencia';
import { ToastrService } from 'ngx-toastr'; // 1. Importar o ToastrService

@Component({
  selector: 'app-ocorrencia-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './ocorrencia-form.html',
  styleUrls: ['./ocorrencia-form.css']
})
export class OcorrenciaFormComponent implements OnInit {
  private veiculoService = inject(VeiculoService);
  private ocorrenciaService = inject(OcorrenciaService);
  private router = inject(Router);
  private toastr = inject(ToastrService); // 2. Injetar o ToastrService

  veiculos: Veiculo[] = [];
  ocorrencia: OcorrenciaRequest = {
    veiculoId: 0,
    descricao: ''
  };

  // A propriedade 'errorMessage' foi removida.
  // errorMessage: string | null = null;

  ngOnInit(): void {
    this.carregarVeiculos();
  }

  carregarVeiculos(): void {
    this.veiculoService.getVeiculos().subscribe({
      next: (data) => {
        this.veiculos = data;
      },
      error: (err) => {
        // Usa o toast para notificar o erro ao carregar veículos
        this.toastr.error('Não foi possível carregar a lista de veículos.', 'Erro de Conexão');
      }
    });
  }

  onSubmit(): void {
    this.ocorrenciaService.registrarOcorrencia(this.ocorrencia).subscribe({
      next: () => {
        // 3. Notificação de SUCESSO
        this.toastr.success('Ocorrência registrada com sucesso!');
        this.router.navigate(['/motorista/dashboard']);
      },
      error: (err) => {
        // 4. Notificação de ERRO
        const errorMessage = err.error?.message || 'Verifique os dados e tente novamente.';
        this.toastr.error(errorMessage, 'Erro ao Registrar');
      }
    });
  }
}