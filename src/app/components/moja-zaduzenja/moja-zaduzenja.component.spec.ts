import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MojaZaduzenjaComponent } from './moja-zaduzenja.component';

describe('MojaZaduzenjaComponent', () => {
  let component: MojaZaduzenjaComponent;
  let fixture: ComponentFixture<MojaZaduzenjaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MojaZaduzenjaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MojaZaduzenjaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
