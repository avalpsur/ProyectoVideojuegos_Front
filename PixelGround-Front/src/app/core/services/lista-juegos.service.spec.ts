import { TestBed } from '@angular/core/testing';

import { ListaJuegosService } from './lista-juegos.service';

describe('ListaJuegosService', () => {
  let service: ListaJuegosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ListaJuegosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
