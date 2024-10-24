import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListarViajesPage } from './listar-viajes.page';

describe('ListarViajesPage', () => {
  let component: ListarViajesPage;
  let fixture: ComponentFixture<ListarViajesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ListarViajesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
