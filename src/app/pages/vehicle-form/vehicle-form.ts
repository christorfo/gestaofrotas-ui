import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { VeiculoService } from '../../services/veiculo';
import { Veiculo } from '../../models/veiculo.model';
import { NgxMaskDirective } from 'ngx-mask';

@Component({
  selector: 'app-vehicle-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, NgxMaskDirective],
  templateUrl: './vehicle-form.html',
})
export class VehicleFormComponent {
  private veiculoService = inject(VeiculoService);
  private router = inject(Router);
  private route = inject(ActivatedRoute); // Injeta a rota ativa para ler parâmetros
  
  veiculo: Partial<Veiculo> = {}; // Inicia como objeto vazio
  isEditMode = false;
  errorMessage: string | null = null;

  ngOnInit(): void {
    // Pega o 'id' dos parâmetros da URL
    const veiculoId = this.route.snapshot.paramMap.get('id');

    if (veiculoId) {
      // Se existe um ID, estamos em modo de edição
      this.isEditMode = true;
      const id = Number(veiculoId);
      this.veiculoService.getVeiculoById(id).subscribe({
        next: (data) => {
          this.veiculo = data; // Preenche o formulário com os dados do veículo
        },
        error: (err) => {
          this.errorMessage = 'Veículo não encontrado.';
          console.error(err);
        }
      });
    } else {
      // Se não existe um ID, estamos em modo de criação
      this.isEditMode = false;
      this.veiculo = { // Preenche com valores padrão para um novo veículo
        placa: '',
        modelo: '',
        tipo: '',
        ano: new Date().getFullYear(),
        quilometragemAtual: 0,
        status: 'DISPONIVEL'
      };
    }
  }

  onSubmit(): void {
    if (this.isEditMode && this.veiculo.id) {
      // Lógica de Atualização
      this.veiculoService.updateVeiculo(this.veiculo.id, this.veiculo as Veiculo).subscribe({
        next: () => this.router.navigate(['/admin/dashboard']),
        error: (err) => this.errorMessage = `Erro ao atualizar veículo: ${err.error?.message}`
      });
    } else {
      // Lógica de Criação
      this.veiculoService.createVeiculo(this.veiculo).subscribe({
        next: () => this.router.navigate(['/admin/dashboard']),
        error: (err) => this.errorMessage = `Erro ao criar veículo: ${err.error?.message}`
      });
    }
  }
}