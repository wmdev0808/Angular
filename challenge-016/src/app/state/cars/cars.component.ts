import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { appInit } from './car/car.actions';
import { selectCars } from './car/car.selectors';

@Component({
  selector: 'app-cars',
  templateUrl: './cars.component.html',
  styleUrls: ['./cars.component.scss'],
})
export class CarsComponent implements OnInit {
  cars$ = this.store.select(selectCars);

  constructor(private store: Store) {}

  ngOnInit() {
    this.store.dispatch(
      appInit({
        cars: [
          { id: '1', make: 'ford', model: 'mustang', year: '2005' },
          { id: '2', make: 'ford', model: 'mustang', year: '1987' },
          { id: '3', make: 'ford', model: 'mustang', year: '1976' },
        ],
      })
    );
  }
}
