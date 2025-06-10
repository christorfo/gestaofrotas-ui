import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { MotoristaService } from '../../services/motorista';
import { Motorista } from '../../models/motorista.model';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

@Component({
  selector: 'app-motorista-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, NgxMaskDirective],
  templateUrl: './motorista-form.html',
  styleUrls: ['./motorista-form.css']
})
export class MotoristaFormComponent implements OnInit {
  private motoristaService = inject(MotoristaService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  motorista: Partial<Motorista> = {};
  isEditMode = false;
  errorMessage: string | null = null;
  
  // Campo separado para a nova senha para não exibir o hash no formulário
  novaSenha = '';

  ngOnInit(): void {
    const motoristaId = this.route.snapshot.paramMap.get('id');
    if (motoristaId) {
      this.isEditMode = true;
      this.motoristaService.getMotoristaById(Number(motoristaId)).subscribe(data => {
        this.motorista = data;
        // Convertendo a data para o formato YYYY-MM-DD para o input type="date"
        if (data.cnhValidade) {
            this.motorista.cnhValidade = data.cnhValidade.split('T')[0];
        }
      });
    } else {
      this.isEditMode = false;
      this.motorista = { // Valores padrão para novo motorista
        nomeCompleto: '',
        email: '',
        cpf: '',
        cnhNumero: '',
        cnhValidade: '',
        telefone: '',
        cep: '',
        status: 'ATIVO'
      };
    }
  }

  onSubmit(): void {
    // Se uma nova senha foi digitada, adiciona ao objeto a ser enviado
    if (this.novaSenha) {
      this.motorista.senha = this.novaSenha;
    } else {
        // Garante que a senha não seja enviada como nula ou vazia se não for alterada
        delete this.motorista.senha;
    }

    const operation = this.isEditMode
      ? this.motoristaService.updateMotorista(this.motorista.id!, this.motorista)
      : this.motoristaService.createMotorista(this.motorista);

    operation.subscribe({
      next: () => this.router.navigate(['/admin/dashboard']),
      error: (err) => {
        this.errorMessage = `Erro ao salvar motorista: ${err.error || 'Verifique os dados.'}`;
        // Limpa a senha do modelo para não mantê-la em memória
        delete this.motorista.senha;
      }
    });
  }
}