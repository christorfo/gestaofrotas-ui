import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface ConfirmationState {
  message: string;
  onConfirm: () => void;
}

@Injectable({
  providedIn: 'root'
})
export class ConfirmationService {
  private subject = new Subject<ConfirmationState | null>();

  public state$ = this.subject.asObservable();

  public open(message: string, onConfirm: () => void): void {
    this.subject.next({ message, onConfirm });
  }

  public cancel(): void {
    this.subject.next(null);
  }

  public confirm(state: ConfirmationState | null): void {
    if (state) {
      state.onConfirm(); 
      this.subject.next(null);
    }
  }
}