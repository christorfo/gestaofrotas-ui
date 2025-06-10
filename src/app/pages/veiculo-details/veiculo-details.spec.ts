import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VeiculoDetails } from './veiculo-details';

describe('VeiculoDetails', () => {
  let component: VeiculoDetails;
  let fixture: ComponentFixture<VeiculoDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VeiculoDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VeiculoDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
