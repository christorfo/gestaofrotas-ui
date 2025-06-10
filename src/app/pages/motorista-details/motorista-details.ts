import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Motorista } from '../../models/motorista.model';
import { MotoristaService } from '../../services/motorista';

@Component({
  selector: 'app-motorista-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './motorista-details.html',
  styleUrls: ['./motorista-details.css']
})
export class MotoristaDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private motoristaService = inject(MotoristaService);
  location = inject(Location);

  motorista: Motorista | null = null;
  errorMessage: string | null = null;

  ngOnInit(): void {
    const motoristaId = this.route.snapshot.paramMap.get('id');
    if (motoristaId) {
      this.motoristaService.getMotoristaById(Number(motoristaId)).subscribe({
        next: (data) => this.motorista = data,
        error: (err) => this.errorMessage = 'Motorista não encontrado.'
      });
    }
  }
}