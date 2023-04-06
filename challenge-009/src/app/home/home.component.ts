import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  filter,
  interval,
  map,
  Observable,
  Observer,
  Subscription,
} from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  private firstObsSubscription?: Subscription;

  constructor() {}

  ngOnInit() {
    // this.firstObsSubscription = interval(1000).subscribe((count) => {
    //   console.log(count);
    // });
    const customIntervalObservable = new Observable(
      (observer: Observer<number>) => {
        let count = 0;
        setInterval(() => {
          observer.next(count);
          if (count === 5) {
            observer.complete();
          }
          if (count > 3) {
            observer.error(new Error('Count is greater than 3!'));
          }
          count++;
        }, 1000);
      }
    );

    this.firstObsSubscription = customIntervalObservable
      .pipe(
        filter((data) => {
          return data > 0;
        }),
        map((data: number) => {
          return 'Round: ' + (data + 1);
        })
      )
      .subscribe({
        next: (data) => {
          console.log(data);
        },
        error: (error) => {
          console.log(error);
        },
        complete: () => {
          console.log('Completed!');
        },
      });
  }

  ngOnDestroy() {
    this.firstObsSubscription?.unsubscribe();
  }
}
