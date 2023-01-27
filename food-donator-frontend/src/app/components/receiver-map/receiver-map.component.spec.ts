import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiverMapComponent } from './receiver-map.component';

describe('ReceiverMapComponent', () => {
  let component: ReceiverMapComponent;
  let fixture: ComponentFixture<ReceiverMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReceiverMapComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReceiverMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
