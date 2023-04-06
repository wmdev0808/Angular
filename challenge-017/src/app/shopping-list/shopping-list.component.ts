import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { Ingredient } from '../shared/ingredient.modle';
import { LoggingService } from '../logging.service';
import * as fromApp from '../store/app.reducer';
import * as ShoppingListActions from './store/shopping-list.actions';
import { selectShoppingListIngredients } from './store/shopping-list.selectors';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.scss'],
})
export class ShoppingListComponent implements OnInit {
  ingredients$!: Observable<Ingredient[]>;

  constructor(
    private loggingService: LoggingService,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit() {
    this.ingredients$ = this.store.select(selectShoppingListIngredients);
    this.loggingService.printLog('Hello from ShoppingListComponent');
  }

  onEditItem(index: number) {
    this.store.dispatch(ShoppingListActions.startEdit({ payload: index }));
  }
}
