import { createFeatureSelector, createSelector } from '@ngrx/store';
import { selectRouteParams } from '../router.selectors';
import { CarState, carAdapter } from './car.reducer';

export const carsFeatureSelector = createFeatureSelector<CarState>('cars');

const { selectEntities, selectAll } = carAdapter.getSelectors();

export const selectCarEntities = createSelector(
  carsFeatureSelector,
  selectEntities
);

export const selectCars = createSelector(carsFeatureSelector, selectAll);

// You can combine the `selectRouteParams` with `selectCarEntities`
// to get a selector for the active car for this component based on the route
export const selectCar = createSelector(
  selectCarEntities,
  selectRouteParams,
  (cars, { carId }) => cars[carId]
);
