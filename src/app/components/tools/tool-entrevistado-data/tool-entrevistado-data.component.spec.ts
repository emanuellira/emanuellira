import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolEntrevistadoDataComponent } from './tool-entrevistado-data.component';

describe('ToolEntrevistadoDataComponent', () => {
  let component: ToolEntrevistadoDataComponent;
  let fixture: ComponentFixture<ToolEntrevistadoDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ToolEntrevistadoDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolEntrevistadoDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
