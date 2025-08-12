import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimInsurance } from './claim-insurance';

describe('ClaimInsurance', () => {
  let component: ClaimInsurance;
  let fixture: ComponentFixture<ClaimInsurance>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClaimInsurance]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClaimInsurance);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
