import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MensajesForoComponent } from './mensajes-foro.component';

describe('MensajesForoComponent', () => {
  let component: MensajesForoComponent;
  let fixture: ComponentFixture<MensajesForoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MensajesForoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MensajesForoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
