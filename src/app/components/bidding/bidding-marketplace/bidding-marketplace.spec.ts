import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BiddingMarketplace } from './bidding-marketplace';

describe('BiddingMarketplace', () => {
  let component: BiddingMarketplace;
  let fixture: ComponentFixture<BiddingMarketplace>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BiddingMarketplace]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BiddingMarketplace);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
