import { ActionReducerMap } from '@ngrx/store';
import * as fromAuth from '../auth/store/auth.reducer';
import * as fromShoppingList from '../shopping-list/store/shopping-list.reducer';
import * as fromRecipes from '../recipes/store/recipes.reducer';

export interface AppState {
  auth: fromAuth.AuthState;
  shoppingList: fromShoppingList.ShoppingListState;
  recipes: fromRecipes.RecipesState;
}

export const appReducer: ActionReducerMap<AppState> = {
  auth: fromAuth.authReducer,
  shoppingList: fromShoppingList.shoppingListReducer,
  recipes: fromRecipes.recipesReducer,
};
