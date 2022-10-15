import { createReducer, on } from '@ngrx/store';

import { Ingredient } from 'src/app/shared/ingredient.modle';
import * as ShoppingListActions from './shopping-list.actions';

export interface ShoppingListState {
  ingredients: Ingredient[];
  editedIngredient: Ingredient | null;
  editedIngredientIndex: number;
}

const initialState: ShoppingListState = {
  ingredients: [new Ingredient('Apples', 5), new Ingredient('Tomatoes', 10)],
  editedIngredient: null,
  editedIngredientIndex: -1,
};

export const shoppingListReducer = createReducer(
  initialState,
  on(ShoppingListActions.addIngredient, (state, { payload }) => {
    return {
      ...state,
      ingredients: [...state.ingredients, payload],
    };
  }),
  on(ShoppingListActions.addIngredients, (state, { payload }) => {
    return {
      ...state,
      ingredients: [...state.ingredients, ...payload],
    };
  }),
  on(ShoppingListActions.updateIngredient, (state, { payload }) => {
    const ingredient = state.ingredients[state.editedIngredientIndex];
    const updatedIngredient = {
      ...ingredient,
      ...payload,
    };
    const updatedIngredients = [...state.ingredients];
    updatedIngredients[state.editedIngredientIndex] = updatedIngredient;

    return {
      ...state,
      ingredients: updatedIngredients,
      editedIngredientIndex: -1,
      editedIngredient: null,
    };
  }),
  on(ShoppingListActions.deleteIngredient, (state) => {
    return {
      ...state,
      ingredients: state.ingredients.filter((ingredient, index) => {
        return index !== state.editedIngredientIndex;
      }),
      editedIngredientIndex: -1,
      editedIngredient: null,
    };
  }),
  on(ShoppingListActions.startEdit, (state, { payload }) => {
    return {
      ...state,
      editedIngredientIndex: payload,
      editedIngredient: { ...state.ingredients[payload] },
    };
  }),
  on(ShoppingListActions.stopEdit, (state) => {
    return {
      ...state,
      editedIngredientIndex: -1,
      editedIngredient: null,
    };
  })
);
