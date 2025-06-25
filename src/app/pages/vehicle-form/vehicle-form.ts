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

  // Estas propriedades serão do tipo 'string | null' para serem compatíveis com a máscara.
  formAno: string | null = null;
  formQuilometragem: string | null = null;

  isEditMode = false;

  ngOnInit(): void {
    const veiculoId = this.route.snapshot.paramMap.get('id');

    if (veiculoId) {
      // MODO DE EDIÇÃO
      this.isEditMode = true;
      this.veiculoService.getVeiculoById(Number(veiculoId)).subscribe({
        next: (data) => {
          this.veiculo = data;
          // Preenche as propriedades do formulário convertendo os números para string
          this.formAno = data.ano ? data.ano.toString() : null;
          this.formQuilometragem = data.quilometragemAtual ? data.quilometragemAtual.toString() : null;
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
        placa: '',
        modelo: '',
        tipo: '',
        status: 'DISPONIVEL'
      };
      this.formAno = null;
      this.formQuilometragem = null;
    }
  }

  onSubmit(): void {
    // Cria um payload para enviar para a API
    const payload: Partial<Veiculo> = {
      ...this.veiculo,
      // Converte os valores do formulário (string) de volta para número
      ano: Number(this.formAno),
      // Remove os pontos da máscara (ex: "15.500" vira 15500) antes de converter
      quilometragemAtual: Number(String(this.formQuilometragem || '0').replace(/\./g, ''))
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
        this.toastr.error(err.error?.message || 'Não foi possível salvar. Verifique os dados.', 'Erro ao Salvar');
      }
    });
  }
}