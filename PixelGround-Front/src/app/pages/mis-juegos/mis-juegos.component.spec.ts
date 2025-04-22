import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MisJuegosComponent } from './mis-juegos.component';

describe('MisJuegosComponent', () => {
  let component: MisJuegosComponent;
  let fixture: ComponentFixture<MisJuegosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MisJuegosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MisJuegosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
