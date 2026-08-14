import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoggerTest } from './logger-test';

describe('LoggerTest', () => {
  let component: LoggerTest;
  let fixture: ComponentFixture<LoggerTest>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoggerTest]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoggerTest);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
