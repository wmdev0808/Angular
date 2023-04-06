import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DecimalPipeComponent } from './decimal-pipe.component';

describe('DecimalPipeComponent', () => {
  let component: DecimalPipeComponent;
  let fixture: ComponentFixture<DecimalPipeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DecimalPipeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DecimalPipeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
