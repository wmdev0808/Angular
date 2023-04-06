import { Component } from '@angular/core';

@Component({
  selector: 'app-slide-toggles',
  templateUrl: './slide-toggles.component.html',
  styleUrls: ['./slide-toggles.component.scss'],
})
export class SlideTogglesComponent {
  logFirst(obj: { checked: boolean }) {
    console.log('first toggle', obj.checked);
  }

  logSecond(obj: { checked: boolean }) {
    console.log('second toggle', obj.checked);
  }
}
