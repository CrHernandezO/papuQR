import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TomarViajePage } from './tomar-viaje.page';

describe('TomarViajePage', () => {
  let component: TomarViajePage;
  let fixture: ComponentFixture<TomarViajePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TomarViajePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
