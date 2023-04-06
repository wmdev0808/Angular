import { createReducer, on } from '@ngrx/store';

import { Recipe } from '../recipe.model';
import * as RecipesActions from './recipes.actions';

export interface RecipesState {
  recipes: Recipe[];
}

const initialState: RecipesState = {
  recipes: [],
};

export const recipesReducer = createReducer(
  initialState,
  on(RecipesActions.setRecipes, (state, { payload }) => {
    return {
      ...state,
      recipes: [...payload],
    };
  }),
  on(RecipesActions.addRecipe, (state, { payload }) => {
    return {
      ...state,
      recipes: [...state.recipes, payload],
    };
  }),
  on(
    RecipesActions.updateRecipe,
    (state, { payload: { index, newRecipe } }) => {
      const updatedRecipe = {
        ...state.recipes[index],
        ...newRecipe,
      };
      const updatedRecipes = [...state.recipes];
      updatedRecipes[index] = updatedRecipe;

      return {
        ...state,
        recipes: updatedRecipes,
      };
    }
  ),
  on(RecipesActions.deleteRecipe, (state, { payload }) => {
    return {
      ...state,
      recipes: state.recipes.filter((_recipe, index) => {
        return index !== payload;
      }),
    };
  })
);
