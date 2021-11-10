import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolTextareaComponent } from './tool-textarea.component';

describe('ToolTextareaComponent', () => {
  let component: ToolTextareaComponent;
  let fixture: ComponentFixture<ToolTextareaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ToolTextareaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolTextareaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
