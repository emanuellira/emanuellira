import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolImageComponent } from './tool-image.component';

describe('ToolImageComponent', () => {
  let component: ToolImageComponent;
  let fixture: ComponentFixture<ToolImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ToolImageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
