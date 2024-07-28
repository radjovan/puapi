import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MojeVezbeComponent } from './moje-vezbe.component';

describe('MojeVezbeComponent', () => {
  let component: MojeVezbeComponent;
  let fixture: ComponentFixture<MojeVezbeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MojeVezbeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MojeVezbeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
