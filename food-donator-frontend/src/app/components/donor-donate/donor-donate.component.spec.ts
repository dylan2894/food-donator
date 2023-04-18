import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DonorDonateComponent } from './donor-donate.component';

describe('DonorDonateComponent', () => {
  let component: DonorDonateComponent;
  let fixture: ComponentFixture<DonorDonateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DonorDonateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DonorDonateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
