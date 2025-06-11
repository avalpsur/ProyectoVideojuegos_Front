import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HilosForoComponent } from './hilos-foro.component';

describe('HilosForoComponent', () => {
  let component: HilosForoComponent;
  let fixture: ComponentFixture<HilosForoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HilosForoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HilosForoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
