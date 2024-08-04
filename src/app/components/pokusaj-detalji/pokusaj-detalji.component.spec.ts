import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokusajDetaljiComponent } from './pokusaj-detalji.component';

describe('PokusajDetaljiComponent', () => {
  let component: PokusajDetaljiComponent;
  let fixture: ComponentFixture<PokusajDetaljiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PokusajDetaljiComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PokusajDetaljiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
