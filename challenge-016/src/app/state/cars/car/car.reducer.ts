import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { appInit } from './car.actions';

export interface Car {
  id: string;
  year: string;
  make: string;
  model: string;
}

export type CarState = EntityState<Car>;

export const carAdapter = createEntityAdapter<Car>({
  selectId: (car) => car.id,
});

const initialState = carAdapter.getInitialState();

export const reducer = createReducer<CarState>(
  initialState,
  on(appInit, (state, { cars }) => carAdapter.addMany(cars, state))
);
