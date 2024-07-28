import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZadaciComponent } from './zadaci.component';

describe('ZadaciComponent', () => {
  let component: ZadaciComponent;
  let fixture: ComponentFixture<ZadaciComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ZadaciComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ZadaciComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
