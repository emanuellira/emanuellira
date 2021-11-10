import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageIndicadoresComponent } from './page-indicadores.component';

describe('PageIndicadoresComponent', () => {
  let component: PageIndicadoresComponent;
  let fixture: ComponentFixture<PageIndicadoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PageIndicadoresComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PageIndicadoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
