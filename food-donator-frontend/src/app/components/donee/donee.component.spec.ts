import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoneeComponent } from './donee.component';

describe('DoneeComponent', () => {
  let component: DoneeComponent;
  let fixture: ComponentFixture<DoneeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DoneeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoneeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
