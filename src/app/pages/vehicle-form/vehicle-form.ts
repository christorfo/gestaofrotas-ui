import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { VeiculoService } from '../../services/veiculo';
import { Veiculo } from '../../models/veiculo.model';
import { NgxMaskDirective } from 'ngx-mask';
import { ToastrService } from 'ngx-toastr';

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
  private toastr = inject(ToastrService);

  veiculo: Partial<Veiculo> = {}; // Inicia como objeto vazio
  isEditMode = false;

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
        ano: undefined,
        quilometragemAtual: undefined,
        status: 'DISPONIVEL'
      };
    }
  }

  onSubmit(): void {
    const operation = this.isEditMode
      ? this.veiculoService.updateVeiculo(this.veiculo.id!, this.veiculo as Veiculo)
      : this.veiculoService.createVeiculo(this.veiculo);

    operation.subscribe({
      next: () => {
        const message = this.isEditMode ? 'Veículo atualizado com sucesso!' : 'Veículo criado com sucesso!';
        this.toastr.success(message, 'Sucesso'); // 4. Usar toast de sucesso
        this.router.navigate(['/admin/dashboard']);
      },
      error: (err) => {
        // 5. Usar toast de erro
        this.toastr.error(err.error?.message || 'Não foi possível salvar. Verifique os dados.', 'Erro');
      }
    });
  }
}