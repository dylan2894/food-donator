import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoneeSettingsComponent } from './donee-settings.component';

describe('DoneeSettingsComponent', () => {
  let component: DoneeSettingsComponent;
  let fixture: ComponentFixture<DoneeSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DoneeSettingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoneeSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
