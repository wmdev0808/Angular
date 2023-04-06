import { createAction, props } from '@ngrx/store';

import { Recipe } from '../recipe.model';

export const SET_RECIPES = '[Recipes] Set Recipes';
export const FETCH_RECIPES = '[Recipes] Fetch Recipes';
export const ADD_RECIPE = '[Recipe] Add Recipe';
export const UPDATE_RECIPE = '[Recipe] Update Recipe';
export const DELETE_RECIPE = '[Recipe] Delete Recipe';
export const STORE_RECIPES = '[Recipe] Store Recipes';

export const setRecipes = createAction(
  SET_RECIPES,
  props<{ payload: Recipe[] }>()
);

export const fetchRecipes = createAction(FETCH_RECIPES);

export const addRecipe = createAction(ADD_RECIPE, props<{ payload: Recipe }>());

export const updateRecipe = createAction(
  UPDATE_RECIPE,
  props<{ payload: { index: number; newRecipe: Recipe } }>()
);

export const deleteRecipe = createAction(
  DELETE_RECIPE,
  props<{ payload: number }>()
);

export const storeRecipes = createAction(STORE_RECIPES);
