import { TestBed } from '@angular/core/testing';

import { Ocorrencia } from './ocorrencia';

describe('Ocorrencia', () => {
  let service: Ocorrencia;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Ocorrencia);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
