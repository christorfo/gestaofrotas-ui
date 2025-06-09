import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { VeiculoService } from '../../services/veiculo';
import { Veiculo } from '../../models/veiculo.model';

@Component({
  selector: 'app-vehicle-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './vehicle-form.html',
})
export class VehicleFormComponent {
  private veiculoService = inject(VeiculoService);
  private router = inject(Router);

  // Usamos Partial<Veiculo> porque o 'id' não existe na criação
  veiculo: Partial<Veiculo> = {
    placa: '',
    modelo: '',
    tipo: '',
    ano: new Date().getFullYear(),
    quilometragemAtual: 0,
    status: 'DISPONIVEL'
  };

  errorMessage: string | null = null;

  onSubmit(): void {
    this.veiculoService.createVeiculo(this.veiculo).subscribe({
      next: (veiculoCriado) => {
        console.log('Veículo criado com sucesso!', veiculoCriado);
        // Redireciona de volta para o dashboard após o sucesso
        this.router.navigate(['/admin/dashboard']);
      },
      error: (err) => {
        this.errorMessage = `Erro ao criar veículo: ${err.error?.message || 'Verifique os dados e tente novamente.'}`;
        console.error(err);
      }
    });
  }
}