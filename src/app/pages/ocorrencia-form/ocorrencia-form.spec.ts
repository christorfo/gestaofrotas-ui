import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OcorrenciaForm } from './ocorrencia-form';

describe('OcorrenciaForm', () => {
  let component: OcorrenciaForm;
  let fixture: ComponentFixture<OcorrenciaForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OcorrenciaForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OcorrenciaForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
