import { TestBed } from '@angular/core/testing';

import { ViaCep } from './via-cep';

describe('ViaCep', () => {
  let service: ViaCep;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ViaCep);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
