import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbastecimentoForm } from './abastecimento-form';

describe('AbastecimentoForm', () => {
  let component: AbastecimentoForm;
  let fixture: ComponentFixture<AbastecimentoForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AbastecimentoForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AbastecimentoForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
