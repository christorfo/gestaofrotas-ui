import { Component, OnInit, inject, NgZone } from '@angular/core'; // 1. Importar NgZone
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { MotoristaService } from '../../services/motorista';
import { Motorista } from '../../models/motorista.model';
import { ViaCepService } from '../../services/via-cep';
import { NgxMaskDirective } from 'ngx-mask';

@Component({
  selector: 'app-motorista-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, NgxMaskDirective],
  templateUrl: './motorista-form.html',
  styleUrls: ['./motorista-form.css']
})
export class MotoristaFormComponent implements OnInit {
  // Injeções de dependência
  private motoristaService = inject(MotoristaService);
  private viaCepService = inject(ViaCepService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private zone = inject(NgZone); // 2. Injetar o NgZone

  // Propriedades do componente
  motorista: Partial<Motorista> = {};
  isEditMode = false;
  errorMessage: string | null = null;
  novaSenha = '';
  today: string = ''; // 3. Propriedade para a data mínima

  ngOnInit(): void {
    // 4. Define a data de hoje no formato YYYY-MM-DD para o atributo 'min' do input
    this.today = new Date().toISOString().split('T')[0];

    const motoristaId = this.route.snapshot.paramMap.get('id');
    if (motoristaId) {
      this.isEditMode = true;
      this.motoristaService.getMotoristaById(Number(motoristaId)).subscribe(data => {
        // Formata a data de validade para o input
        if (data.cnhValidade) {
          data.cnhValidade = data.cnhValidade.split('T')[0];
        }
        this.motorista = data;
      });
    } else {
      this.isEditMode = false;
      this.motorista = {
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

onCepBlur(): void {
    // Ponto de verificação 1: A função foi chamada?
    console.log('---[DEBUG]--- Passo 1: onCepBlur foi chamado.');

    const cep = this.motorista.cep;
    
    // Ponto de verificação 2: Qual é o valor do CEP que estamos usando?
    console.log(`---[DEBUG]--- Passo 2: CEP capturado do formulário: "${cep}"`);

    // Usaremos uma condição de guarda mais simples para garantir que não seja o problema
    if (cep && cep.length >= 8) {
      
      // Ponto de verificação 3: Estamos prestes a chamar o serviço?
      console.log('---[DEBUG]--- Passo 3: Condição válida. Chamando o ViaCepService...');

      this.viaCepService.consultarCep(cep).subscribe({
        next: (data) => {
          // Ponto de verificação 4 (SUCESSO): Recebemos uma resposta da API?
          console.log('---[DEBUG]--- Passo 4 (SUCESSO): Dados recebidos do ViaCEP:', data);
          
          this.zone.run(() => {
            if (!data.erro) {
              this.motorista = {
                ...this.motorista,
                logradouro: data.logradouro,
                bairro: data.bairro,
                localidade: data.localidade,
                uf: data.uf
              };
              this.errorMessage = null;
            } else {
              this.errorMessage = 'CEP não encontrado.';
              this.limparCamposEndereco();
            }
          });
        },
        error: (err) => {
          // Ponto de verificação 4 (ERRO): A chamada da API falhou?
          console.error('---[DEBUG]--- Passo 4 (ERRO): A chamada para a API ViaCEP falhou.', err);
          
          this.zone.run(() => {
            this.errorMessage = 'Erro ao consultar o CEP. Verifique o console para mais detalhes.';
            this.limparCamposEndereco();
          });
        }
      });
    } else {
      // Ponto de verificação 3 (FALHA): A condição não foi atendida.
      console.log('---[DEBUG]--- Passo 3 (FALHA): CEP inválido ou curto demais. Serviço não foi chamado.');
    }
  }

  limparCamposEndereco(): void {
    this.motorista = {
      ...this.motorista,
      logradouro: '',
      bairro: '',
      localidade: '',
      uf: ''
    };
  }

  onSubmit(): void {
    // Lógica de submit continua a mesma
    if (this.novaSenha) {
      this.motorista.senha = this.novaSenha;
    } else {
      delete this.motorista.senha;
    }
    const payload: Partial<Motorista> = { ...this.motorista };
    delete payload.logradouro;
    delete payload.bairro;
    delete payload.localidade;
    delete payload.uf;

    const operation = this.isEditMode
      ? this.motoristaService.updateMotorista(this.motorista.id!, payload)
      : this.motoristaService.createMotorista(payload);

    operation.subscribe({
      next: () => this.router.navigate(['/admin/dashboard']),
      error: (err) => {
        this.errorMessage = `Erro ao salvar: ${err.error?.message || 'Verifique os dados e tente novamente.'}`;
        delete this.motorista.senha;
      }
    });
  }
}