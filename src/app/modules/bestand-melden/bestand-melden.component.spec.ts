import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BestandMeldenComponent } from './bestand-melden.component';

describe('BestandMeldenComponent', () => {
  let component: BestandMeldenComponent;
  let fixture: ComponentFixture<BestandMeldenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BestandMeldenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BestandMeldenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
