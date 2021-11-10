import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolDateComponent } from './tool-date.component';

describe('ToolDateComponent', () => {
  let component: ToolDateComponent;
  let fixture: ComponentFixture<ToolDateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ToolDateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
