import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VeiculoManutencoes } from './veiculo-manutencoes';

describe('VeiculoManutencoes', () => {
  let component: VeiculoManutencoes;
  let fixture: ComponentFixture<VeiculoManutencoes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VeiculoManutencoes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VeiculoManutencoes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
