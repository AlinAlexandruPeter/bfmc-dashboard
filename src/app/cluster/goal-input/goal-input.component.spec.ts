import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoalInputComponent } from './goal-input.component';

describe('GoalInputComponent', () => {
  let component: GoalInputComponent;
  let fixture: ComponentFixture<GoalInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GoalInputComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GoalInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
