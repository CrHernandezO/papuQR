import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetalleReservaPage } from './detalle-reserva.page';

describe('DetalleReservaPage', () => {
  let component: DetalleReservaPage;
  let fixture: ComponentFixture<DetalleReservaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleReservaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
