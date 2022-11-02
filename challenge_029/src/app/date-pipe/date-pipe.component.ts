import { Component } from '@angular/core';

@Component({
  selector: 'app-date-pipe',
  templateUrl: './date-pipe.component.html',
})
// Get the current date and time as a date-time value.
export class DatePipeComponent {
  today: number = Date.now();
}
