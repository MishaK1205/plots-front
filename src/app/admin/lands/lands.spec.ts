import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Lands } from './lands';

describe('Lands', () => {
  let component: Lands;
  let fixture: ComponentFixture<Lands>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Lands]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Lands);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

