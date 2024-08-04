import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokusajiComponent } from './pokusaji.component';

describe('PokusajiComponent', () => {
  let component: PokusajiComponent;
  let fixture: ComponentFixture<PokusajiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PokusajiComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PokusajiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
