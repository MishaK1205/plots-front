import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditLand } from './add-edit-land';

describe('AddEditLand', () => {
  let component: AddEditLand;
  let fixture: ComponentFixture<AddEditLand>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditLand]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditLand);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

