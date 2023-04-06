import { tap } from 'rxjs/operators';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';

export interface SlideToggleState {
  checked: boolean;
}

/** Change event object emitted by a SlideToggleComponent. */
export interface MatSlideToggleChange {
  /** The source MatSlideToggle of the event. */
  readonly source: SlideToggleComponent;
  /** The new `checked` value of the MatSlideToggle. */
  readonly checked: boolean;
}

@Component({
  selector: 'mat-slide-toggle',
  templateUrl: './slide-toggle.component.html',
  styleUrls: ['./slide-toggle.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ComponentStore],
})
export class SlideToggleComponent {
  @Input() set checked(value: boolean) {
    this.setChecked(value);
  }
  // Observable<MatSlideToggleChange> used instead of EventEmitter
  @Output() readonly change = this.componentStore.select((state) => ({
    source: this,
    checked: state.checked,
  }));

  @ViewChild('input') inputElement!: ElementRef<HTMLInputElement>;

  readonly setChecked = this.componentStore.updater(
    (state, value: boolean) => ({ ...state, checked: value })
  );

  // ViewModel for the component
  readonly vm$ = this.componentStore.select((state) => ({
    checked: state.checked,
  }));

  constructor(
    private readonly componentStore: ComponentStore<SlideToggleState>
  ) {
    // set defaults
    this.componentStore.setState({
      checked: false,
    });
  }

  onChangeEvent = this.componentStore.effect<Event>((event$) => {
    return event$.pipe(
      tap<Event>((event) => {
        event.stopPropagation();
        this.setChecked(this.inputElement.nativeElement.checked);
      })
    );
  });
}
