import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditCompany } from './add-edit-company';

describe('AddEditCompany', () => {
  let component: AddEditCompany;
  let fixture: ComponentFixture<AddEditCompany>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditCompany]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditCompany);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
