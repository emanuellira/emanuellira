import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolCapturistaDataComponent } from './tool-capturista-data.component';

describe('ToolCapturistaDataComponent', () => {
  let component: ToolCapturistaDataComponent;
  let fixture: ComponentFixture<ToolCapturistaDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ToolCapturistaDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolCapturistaDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
