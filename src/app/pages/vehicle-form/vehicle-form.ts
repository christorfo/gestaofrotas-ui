import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxMaskDirective } from 'ngx-mask';

import { VeiculoService } from '../../services/veiculo';
import { Veiculo } from '../../models/veiculo.model';

@Component({
  selector: 'app-vehicle-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, NgxMaskDirective],
  templateUrl: './vehicle-form.html',
})
export class VehicleFormComponent implements OnInit {
  private veiculoService = inject(VeiculoService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private toastr = inject(ToastrService);

  // O nosso modelo de dados principal.
  veiculo: Partial<Veiculo> = {};

  // --- PROPRIEDADES INTERMEDIÁRIAS PARA O FORMULÁRIO ---
  // Estas propriedades serão do tipo 'string' para serem compatíveis com a máscara.
  formAno: string = '';
  formQuilometragem: string = '';

  isEditMode = false;

  ngOnInit(): void {
    const veiculoId = this.route.snapshot.paramMap.get('id');
    if (veiculoId) {
      // MODO DE EDIÇÃO
      this.isEditMode = true;
      this.veiculoService.getVeiculoById(Number(veiculoId)).subscribe({
        next: (data) => {
          this.veiculo = data;
          // Preenche as propriedades do formulário convertendo para string
          this.formAno = data.ano ? data.ano.toString() : '';
          this.formQuilometragem = data.quilometragemAtual ? data.quilometragemAtual.toString() : '';
        },
        error: (err) => {
          this.toastr.error('Veículo não encontrado.', 'Erro');
          this.router.navigate(['/admin/dashboard']);
        }
      });
    } else {
      // MODO DE CRIAÇÃO
      this.isEditMode = false;
      this.veiculo = {
        status: 'DISPONIVEL'
      };
    }
  }

  onSubmit(): void {
    // Antes de salvar, convertemos os valores do formulário (string) de volta para número
    // e os colocamos no nosso objeto de dados principal.
    const payload: Partial<Veiculo> = {
      ...this.veiculo,
      ano: Number(this.formAno),
      // Remove os pontos da máscara antes de converter
      quilometragemAtual: Number(this.formQuilometragem.replace(/\./g, ''))
    };

    const operation = this.isEditMode
      ? this.veiculoService.updateVeiculo(this.veiculo.id!, payload as Veiculo)
      : this.veiculoService.createVeiculo(payload);

    operation.subscribe({
      next: () => {
        const message = this.isEditMode ? 'Veículo atualizado com sucesso!' : 'Veículo criado com sucesso!';
        this.toastr.success(message, 'Sucesso');
        this.router.navigate(['/admin/dashboard']);
      },
      error: (err) => {
        this.toastr.error(err.error?.message || 'Não foi possível salvar.', 'Erro ao Salvar');
      }
    });
  }
}