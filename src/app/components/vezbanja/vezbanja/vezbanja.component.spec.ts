import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VezbanjaComponent } from './vezbanja.component';

describe('VezbanjaComponent', () => {
  let component: VezbanjaComponent;
  let fixture: ComponentFixture<VezbanjaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VezbanjaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VezbanjaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
