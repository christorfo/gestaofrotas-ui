import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MotoristaDetails } from './motorista-details';

describe('MotoristaDetails', () => {
  let component: MotoristaDetails;
  let fixture: ComponentFixture<MotoristaDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MotoristaDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MotoristaDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
