import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DonorSettingsComponent } from './donor-settings.component';

describe('DonorSettingsComponent', () => {
  let component: DonorSettingsComponent;
  let fixture: ComponentFixture<DonorSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DonorSettingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DonorSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
