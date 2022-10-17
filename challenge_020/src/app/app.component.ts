import { Component, HostBinding } from '@angular/core';
import { ChildrenOutletContexts } from '@angular/router';

import { slideInAnimation } from './animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    slideInAnimation,
    // animation triggers go here
  ],
})
export class AppComponent {
  @HostBinding('@.disabled')
  public animationsDisabled = false;

  constructor(private contexts: ChildrenOutletContexts) {}

  getRouteAnimationData() {
    return this.contexts.getContext('primary')?.route?.snapshot?.data?.[
      'animation'
    ];
  }

  toggleAnimations() {
    this.animationsDisabled = !this.animationsDisabled;
  }
}
