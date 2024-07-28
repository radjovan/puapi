import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MojiZadaciComponent } from './moji-zadaci.component';

describe('MojiZadaciComponent', () => {
  let component: MojiZadaciComponent;
  let fixture: ComponentFixture<MojiZadaciComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MojiZadaciComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MojiZadaciComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
