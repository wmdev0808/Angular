import { selectRecipesRecipes } from './recipes.selectors';
import { Recipe } from '../recipe.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, switchMap } from 'rxjs/operators';

import * as fromApp from '../../store/app.reducer';
import * as RecipesActions from './recipes.actions';
import { environment } from 'src/environments/environment';

@Injectable()
export class RecipesEffects {
  fetchRecipes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RecipesActions.fetchRecipes),
      switchMap(() => {
        return this.http
          .get<Recipe[]>(`${environment.apiUrl}/recipes.json`)
          .pipe(
            map((recipes) => {
              return recipes.map((recipe) => {
                return {
                  ...recipe,
                  ingredients: recipe.ingredients ? recipe.ingredients : [],
                };
              });
            }),
            map((recipes) => {
              return RecipesActions.setRecipes({ payload: recipes });
            })
          );
      })
    )
  );

  storeRecipes$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(RecipesActions.storeRecipes),
        concatLatestFrom(() => this.store.select(selectRecipesRecipes)),
        switchMap(([, recipes]) => {
          return this.http.put(`${environment.apiUrl}/recipes.json`, recipes);
        })
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private readonly store: Store<fromApp.AppState>
  ) {}
}
