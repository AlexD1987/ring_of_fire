import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkGameComponent } from './link-game.component';

describe('LinkGameComponent', () => {
  let component: LinkGameComponent;
  let fixture: ComponentFixture<LinkGameComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LinkGameComponent]
    });
    fixture = TestBed.createComponent(LinkGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
