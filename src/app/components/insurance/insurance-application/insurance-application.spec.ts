import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuranceApplication } from './insurance-application';

describe('InsuranceApplication', () => {
  let component: InsuranceApplication;
  let fixture: ComponentFixture<InsuranceApplication>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InsuranceApplication]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InsuranceApplication);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
