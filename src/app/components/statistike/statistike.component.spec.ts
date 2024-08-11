import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatistikeComponent } from './statistike.component';

describe('StatistikeComponent', () => {
  let component: StatistikeComponent;
  let fixture: ComponentFixture<StatistikeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StatistikeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StatistikeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
