import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgendamentoDetails } from './agendamento-details';

describe('AgendamentoDetails', () => {
  let component: AgendamentoDetails;
  let fixture: ComponentFixture<AgendamentoDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgendamentoDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgendamentoDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
