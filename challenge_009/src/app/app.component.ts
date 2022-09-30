import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { UserService } from './user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  userActivated = false;
  private activatedSub?: Subscription;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.activatedSub = this.userService.activatedEmitter.subscribe(
      (didActivate) => {
        this.userActivated = didActivate;
      }
    );
  }
  ngOnDestroy() {
    this.activatedSub?.unsubscribe();
  }
}
