import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaceSellRequest } from './place-sell-request';

describe('PlaceSellRequest', () => {
  let component: PlaceSellRequest;
  let fixture: ComponentFixture<PlaceSellRequest>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlaceSellRequest]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlaceSellRequest);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
