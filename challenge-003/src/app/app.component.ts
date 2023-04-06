import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  showSecret = false;
  logs: Date[] = [];

  onToggleDetails() {
    this.showSecret = !this.showSecret;
    this.logs.push(new Date());
  }
}
