import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { cold, getTestScheduler } from 'jasmine-marbles';

import { TwainComponent } from './twain.component';
import { TwainService } from './twain.service';

describe('TwainComponent (marbles)', () => {
  let component: TwainComponent;
  let fixture: ComponentFixture<TwainComponent>;
  let getQuoteSpy: jasmine.Spy;
  let quoteEl: HTMLElement;
  let testQuote: string;

  // Helper function to get the error message element value
  // An *ngIf keeps it out of the DOM until there is an error
  const errorMessage = () => {
    const el = fixture.nativeElement.querySelector('.error');
    return el ? el.textContent : null;
  };

  beforeEach(() => {
    // Create a fake TwainService object with a `getQuote()` spy
    const twainService = jasmine.createSpyObj('TwainService', ['getQuote']);
    getQuoteSpy = twainService.getQuote;

    TestBed.configureTestingModule({
      declarations: [TwainComponent],
      providers: [{ provide: TwainService, useValue: twainService }],
    });

    fixture = TestBed.createComponent(TwainComponent);
    component = fixture.componentInstance;
    quoteEl = fixture.nativeElement.querySelector('.twain');
    testQuote = 'Test Quote';
  });

  // A synchronous test that simulates async behavior
  it('should show quote after getQuote (marbles)', () => {
    // observable test quote value and complete(), after delay
    const q$ = cold('---x|', { x: testQuote });
    getQuoteSpy.and.returnValue(q$);

    fixture.detectChanges(); /// ngOnInit()
    expect(quoteEl.textContent)
      .withContext('should show placeholder')
      .toBe('...');

    getTestScheduler().flush(); // flush the observables

    fixture.detectChanges(); // update view

    expect(quoteEl.textContent)
      .withContext('should show quote')
      .toBe(testQuote);
    expect(errorMessage()).withContext('should not show error').toBeNull();
  });

  // Still need fakeAsync() because of component's setTimeout()
  it('should display error when TwainService fails', fakeAsync(() => {
    // observable error after delay
    const q$ = cold('---#|', null, new Error('TwainService test failure'));
    getQuoteSpy.and.returnValue(q$);

    fixture.detectChanges(); // ngOnInit()
    expect(quoteEl.textContent)
      .withContext('should show placeholder')
      .toBe('...');

    getTestScheduler().flush(); // flush the observables
    tick(); // component shows error after a setTimeout()
    fixture.detectChanges(); // update error message

    expect(errorMessage())
      .withContext('should display error')
      .toMatch(/test failure/);
    expect(quoteEl.textContent)
      .withContext('should show placeholder')
      .toBe('...');
  }));
});
