import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BentoComponent } from './bento.component';

describe('Bento', () => {
  let component: BentoComponent;
  let fixture: ComponentFixture<BentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BentoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
