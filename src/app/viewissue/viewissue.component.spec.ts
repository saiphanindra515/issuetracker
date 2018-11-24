import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewissueComponent } from './viewissue.component';

describe('ViewissueComponent', () => {
  let component: ViewissueComponent;
  let fixture: ComponentFixture<ViewissueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewissueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewissueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
