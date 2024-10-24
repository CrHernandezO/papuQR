import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TomarTrabajoPage } from './tomar-trabajo.page';

describe('TomarTrabajoPage', () => {
  let component: TomarTrabajoPage;
  let fixture: ComponentFixture<TomarTrabajoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TomarTrabajoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
