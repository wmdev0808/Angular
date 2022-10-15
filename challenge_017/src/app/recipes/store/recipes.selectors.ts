import { createFeatureSelector, createSelector } from '@ngrx/store';

import { RecipesState } from './recipes.reducer';

export const recipesFeatureKey = 'recipes';

export const selectRecipes =
  createFeatureSelector<RecipesState>(recipesFeatureKey);

export const selectRecipesRecipes = createSelector(
  selectRecipes,
  (state) => state.recipes
);
