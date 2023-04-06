import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, switchMap } from 'rxjs/operators';

import { Recipe } from '../recipe.model';
import * as fromApp from '../../store/app.reducer';
import * as RecipesActions from '../store/recipes.actions';
import * as ShoppingListActions from '../../shopping-list/store/shopping-list.actions';
import { selectRecipesRecipes } from '../store/recipes.selectors';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.scss'],
})
export class RecipeDetailComponent implements OnInit {
  recipe!: Recipe;
  id!: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private readonly store: Store<fromApp.AppState>
  ) {}

  ngOnInit() {
    this.route.params
      .pipe(
        map((params) => {
          return +params['id'];
        }),
        switchMap((id) => {
          this.id = id;
          return this.store.select(selectRecipesRecipes).pipe(
            map((recipes) => {
              return recipes.find((_recipe, index) => {
                return index === this.id;
              });
            })
          );
        })
      )
      .subscribe((recipe) => {
        this.recipe = recipe!;
      });
  }

  onAddToShoppingList() {
    this.store.dispatch(
      ShoppingListActions.addIngredients({
        payload: this.recipe.ingredients,
      })
    );
  }

  onEditRecipe() {
    this.router.navigate(['edit'], { relativeTo: this.route });
    // this.router.navigate(['../', this.id, 'edit'], { relativeTo: this.route });
  }

  onDeleteRecipe() {
    this.store.dispatch(RecipesActions.deleteRecipe({ payload: this.id }));
    this.router.navigate(['/recipes']);
  }
}
