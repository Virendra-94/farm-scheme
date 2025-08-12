import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoldHistory } from './sold-history';

describe('SoldHistory', () => {
  let component: SoldHistory;
  let fixture: ComponentFixture<SoldHistory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SoldHistory]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SoldHistory);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
