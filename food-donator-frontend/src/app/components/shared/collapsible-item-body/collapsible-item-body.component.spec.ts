import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollapsibleItemBodyComponent } from './collapsible-item-body.component';

describe('CollapsibleItemComponent', () => {
  let component: CollapsibleItemBodyComponent;
  let fixture: ComponentFixture<CollapsibleItemBodyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CollapsibleItemBodyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CollapsibleItemBodyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
