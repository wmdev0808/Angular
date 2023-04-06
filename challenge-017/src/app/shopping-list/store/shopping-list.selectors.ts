import { createFeatureSelector, createSelector } from '@ngrx/store';

import { ShoppingListState } from './shopping-list.reducer';

export const shoppingListFeatureKey = 'shoppingList';

export const selectShoppingList = createFeatureSelector<ShoppingListState>(
  shoppingListFeatureKey
);

export const selectShoppingListIngredients = createSelector(
  selectShoppingList,
  (state) => state.ingredients
);
