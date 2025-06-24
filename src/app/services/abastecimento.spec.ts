import { TestBed } from '@angular/core/testing';

import { Abastecimento } from './abastecimento';

describe('Abastecimento', () => {
  let service: Abastecimento;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Abastecimento);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
