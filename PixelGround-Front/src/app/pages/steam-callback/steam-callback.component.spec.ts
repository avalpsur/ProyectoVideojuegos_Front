import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SteamCallbackComponent } from './steam-callback.component';

describe('SteamCallbackComponent', () => {
  let component: SteamCallbackComponent;
  let fixture: ComponentFixture<SteamCallbackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SteamCallbackComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SteamCallbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
