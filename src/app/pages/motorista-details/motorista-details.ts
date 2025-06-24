import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule, Location, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Motorista } from '../../models/motorista.model';
import { MotoristaService } from '../../services/motorista';
import { FormatCpfPipe } from '../../pipes/format-cpf-pipe';
import { FormatTelefonePipe } from '../../pipes/format-telefone-pipe';

@Component({
  selector: 'app-motorista-details',
  standalone: true,
  imports: [CommonModule, DatePipe, FormatCpfPipe, FormatTelefonePipe], 
  templateUrl: './motorista-details.html',
  styleUrls: ['./motorista-details.css']
})
export class MotoristaDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private motoristaService = inject(MotoristaService);
  location = inject(Location);

  motorista: Motorista | null = null;
  errorMessage: string | null = null;
  isLoading = true;

  ngOnInit(): void {
    const motoristaId = this.route.snapshot.paramMap.get('id');
    if (motoristaId) {
      this.motoristaService.getMotoristaById(Number(motoristaId)).subscribe({
        next: (data) => {
          this.motorista = data;
          this.isLoading = false;
        },
        error: (err) => {
          this.errorMessage = 'Motorista não encontrado.';
          this.isLoading = false;
        }
      });
    } else {
      this.isLoading = false;
      this.errorMessage = 'ID do motorista não fornecido na URL.';
    }
  }

  getStatusClass(status: string): string {
    return status === 'ATIVO' ? 'status-ativo' : 'status-inativo';
  }
}