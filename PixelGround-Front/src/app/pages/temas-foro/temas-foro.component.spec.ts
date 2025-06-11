import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemasForoComponent } from './temas-foro.component';

describe('TemasForoComponent', () => {
  let component: TemasForoComponent;
  let fixture: ComponentFixture<TemasForoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TemasForoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TemasForoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
