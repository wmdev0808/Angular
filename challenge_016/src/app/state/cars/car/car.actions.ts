import { createAction, props } from '@ngrx/store';
import { Car } from './car.reducer';

// We'll only populate cars in the store on app init
export const appInit = createAction('[App] Init', props<{ cars: Car[] }>());
