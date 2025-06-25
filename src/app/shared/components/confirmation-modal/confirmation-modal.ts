import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { ConfirmationService, ConfirmationState } from '../../../services/confirmation';

@Component({
  selector: 'app-confirmation-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirmation-modal.html',
  styleUrls: ['./confirmation-modal.css']
})
export class ConfirmationModalComponent {
  confirmationService = inject(ConfirmationService);
  modalState$: Observable<ConfirmationState | null>;

  constructor() {
    this.modalState$ = this.confirmationService.state$;
  }
}