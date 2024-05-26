import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitConfirmationDialogComponent } from './submit-confirmation-dialog.component';

describe('SubmitConfirmationDialogComponent', () => {
  let component: SubmitConfirmationDialogComponent;
  let fixture: ComponentFixture<SubmitConfirmationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubmitConfirmationDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmitConfirmationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
