import { TestBed } from '@angular/core/testing';

import { Manutencao } from './manutencao';

describe('Manutencao', () => {
  let service: Manutencao;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Manutencao);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
