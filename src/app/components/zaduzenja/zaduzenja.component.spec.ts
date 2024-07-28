import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZaduzenjaComponent } from './zaduzenja.component';

describe('ZaduzenjaComponent', () => {
  let component: ZaduzenjaComponent;
  let fixture: ComponentFixture<ZaduzenjaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ZaduzenjaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ZaduzenjaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
