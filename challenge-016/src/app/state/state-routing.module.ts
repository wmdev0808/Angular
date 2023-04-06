import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BooksComponent } from './books/books.component';
import { CarComponent } from './cars/car/car.component';
import { CarsComponent } from './cars/cars.component';
import { MyCounterComponent } from './counter/my-counter/my-counter.component';
import { PaginatorProvidingComponentStoreComponent } from './paginator-providing-component-store/paginator-providing-component-store.component';
import { PaginatorWithPaginatorStoreServiceComponent } from './paginator-with-paginator-store-service/paginator-with-paginator-store-service.component';
import { SlideTogglesComponent } from './slide-toggles/slide-toggles.component';
import { StateComponent } from './state.component';

const routes: Routes = [
  {
    path: '',
    component: StateComponent,
    children: [
      { path: '', redirectTo: 'ngrx-store-counter', pathMatch: 'full' },
      { path: 'ngrx-store-counter', component: MyCounterComponent },
      { path: 'ngrx-store-books', component: BooksComponent },
      {
        path: 'ngrx-router-store-cars',
        component: CarsComponent,
        children: [{ path: ':carId', component: CarComponent }],
      },
      {
        path: 'ngrx-component-store-slide-toggle',
        component: SlideTogglesComponent,
      },
      {
        path: 'ngrx-component-store-paginator-providing-component-store',
        component: PaginatorProvidingComponentStoreComponent,
      },
      {
        path: 'ngrx-component-store-paginator-with-paginator-store-service',
        component: PaginatorWithPaginatorStoreServiceComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StateRoutingModule {}
