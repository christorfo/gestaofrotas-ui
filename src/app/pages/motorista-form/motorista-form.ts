import { Component, OnInit, inject, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxMaskDirective } from 'ngx-mask';

import { MotoristaService } from '../../services/motorista';
import { Motorista } from '../../models/motorista.model';
import { ViaCepService } from '../../services/via-cep';


@Component({
  selector: 'app-motorista-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, NgxMaskDirective],
  templateUrl: './motorista-form.html',
  styleUrls: ['./motorista-form.css']
})
export class MotoristaFormComponent implements OnInit {
  private motoristaService = inject(MotoristaService);
  private viaCepService = inject(ViaCepService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private zone = inject(NgZone);
  private toastr = inject(ToastrService);

  motorista: Partial<Motorista> = {};
  isEditMode = false;
  novaSenha = '';
  today = '';

  ngOnInit(): void {
    // Lógica para validação de data
    const dataAtual = new Date();
    const ano = dataAtual.getFullYear();
    const mes = (dataAtual.getMonth() + 1).toString().padStart(2, '0');
    const dia = dataAtual.getDate().toString().padStart(2, '0');
    this.today = `${ano}-${mes}-${dia}`;

    const motoristaId = this.route.snapshot.paramMap.get('id');
    if (motoristaId) {
      // MODO DE EDIÇÃO
      this.isEditMode = true;
      this.motoristaService.getMotoristaById(Number(motoristaId)).subscribe(data => {
        // Formata a data de validade para o input
        if (data.cnhValidade) {
          data.cnhValidade = data.cnhValidade.split('T')[0];
        }
        this.motorista = data;

        // --- CORREÇÃO APLICADA AQUI ---
        // Se o motorista carregado tiver um CEP, chama a função de busca de endereço
        if (this.motorista.cep) {
          this.onCepBlur();
        }
      });
    } else {
      // MODO DE CRIAÇÃO
      this.isEditMode = false;
      this.motorista = { semNumero: false, status: 'ATIVO' };
    }
  }

  onCepBlur(): void {
    const cep = this.motorista.cep;
    if (cep && cep.length >= 8) {
      this.viaCepService.consultarCep(cep).subscribe({
        next: (data) => {
          this.zone.run(() => {
            if (data.erro) {
              this.toastr.error('CEP não encontrado.', 'Erro de CEP');
              this.limparCamposEndereco();
            } else {
              this.motorista = {
                ...this.motorista,
                logradouro: data.logradouro,
                bairro: data.bairro,
                localidade: data.localidade,
                uf: data.uf
              };
            }
          });
        },
        error: () => {
          this.zone.run(() => {
            this.toastr.error('Erro ao consultar o serviço de CEP.', 'Erro de Serviço');
            this.limparCamposEndereco();
          });
        }
      });
    }
  }

  limparCamposEndereco(): void {
    this.motorista.logradouro = '';
    this.motorista.bairro = '';
    this.motorista.localidade = '';
    this.motorista.uf = '';
  }

  onSemNumeroChange(): void {
    if (this.motorista.semNumero) {
      this.motorista.numero = 'S/N';
    } else {
      this.motorista.numero = '';
    }
  }

  onSubmit(): void {
    // ... validações de frontend (nome, data) ...
    // ...
    const payload: Partial<Motorista> = { ...this.motorista };

    // Monta a string de endereço completo antes de enviar
    payload.endereco = `${payload.logradouro || ''}, ${payload.numero || ''} - ${payload.bairro || ''}, ${payload.localidade || ''}/${payload.uf || ''}`;

    // Remove campos que são apenas para a UI
    delete payload.logradouro;
    delete payload.bairro;
    delete payload.localidade;
    delete payload.uf;
    delete payload.numero;
    delete payload.semNumero;

    if (this.novaSenha) {
      payload.senha = this.novaSenha;
    } else {
      delete payload.senha;
    }

    const operation = this.isEditMode
      ? this.motoristaService.updateMotorista(payload.id!, payload)
      : this.motoristaService.createMotorista(payload);

    operation.subscribe({
      next: () => {
        const message = this.isEditMode ? 'Motorista atualizado com sucesso!' : 'Motorista criado com sucesso!';
        this.toastr.success(message, 'Sucesso');
        this.router.navigate(['/admin/dashboard']);
      },
      error: (err) => {
        this.toastr.error(err.error?.message || 'Não foi possível salvar. Verifique os dados.', 'Erro ao Salvar');
      }
    });
  }
}