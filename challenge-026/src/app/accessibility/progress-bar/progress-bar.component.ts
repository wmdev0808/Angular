import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-progress-bar',
  template: '<div class="bar" [style.width.%]="value"></div>',
  styleUrls: ['./progress-bar.component.scss'],
  host: {
    // Sets the role for this component to "progressbar"
    role: 'progressbar',

    // Sets the minimum and maximum values for the progressbar role.
    'aria-valuemin': '0',
    'aria-valuemax': '100',

    // Binding that updates the current value of the progressbar.
    '[attr.aria-valuenow]': 'value',
  },
})
export class ProgressBarComponent {
  /** Current value of the progressbar. */
  @Input() value = 0;
}
