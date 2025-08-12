import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuranceCalculator } from './insurance-calculator';

describe('InsuranceCalculator', () => {
  let component: InsuranceCalculator;
  let fixture: ComponentFixture<InsuranceCalculator>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InsuranceCalculator]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InsuranceCalculator);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
