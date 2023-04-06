import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { StoreRouterConnectingModule, routerReducer } from '@ngrx/router-store';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';

import { StateRoutingModule } from './state-routing.module';
import { StateComponent } from './state.component';
import { MyCounterComponent } from './counter/my-counter/my-counter.component';
import { counterReducer } from './counter/counter.reducer';
import { BooksComponent } from './books/books.component';
import { BookCollectionComponent } from './books/book-collection/book-collection.component';
import { BookListComponent } from './books/book-list/book-list.component';
import { booksReducer } from './books/state/books.reducer';
import { collectionReducer } from './books/state/collection.reducer';
import { CarsComponent } from './cars/cars.component';
import { CarComponent } from './cars/car/car.component';
import { reducer } from './cars/car/car.reducer';
import { SlideTogglesComponent } from './slide-toggles/slide-toggles.component';
import { SlideToggleComponent } from './slide-toggles/slide-toggle/slide-toggle.component';
import { PaginatorProvidingComponentStoreComponent } from './paginator-providing-component-store/paginator-providing-component-store.component';
import { PaginatorWithPaginatorStoreServiceComponent } from './paginator-with-paginator-store-service/paginator-with-paginator-store-service.component';
import { Paginator1Component } from './paginator-providing-component-store/paginator1/paginator1.component';
import { Paginator2Component } from './paginator-with-paginator-store-service/paginator2/paginator2.component';

@NgModule({
  declarations: [
    StateComponent,
    MyCounterComponent,
    BooksComponent,
    BookCollectionComponent,
    BookListComponent,
    CarsComponent,
    CarComponent,
    SlideTogglesComponent,
    SlideToggleComponent,
    PaginatorProvidingComponentStoreComponent,
    PaginatorWithPaginatorStoreServiceComponent,
    Paginator1Component,
    Paginator2Component,
  ],
  imports: [
    CommonModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatSelectModule,
    MatTooltipModule,
    MatRippleModule,
    StoreModule.forRoot({
      count: counterReducer,
      books: booksReducer,
      collection: collectionReducer,
      cars: reducer,
      router: routerReducer,
    }),
    StoreRouterConnectingModule.forRoot(),
    StateRoutingModule,
  ],
})
export class StateModule {}
