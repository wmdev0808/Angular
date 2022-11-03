# Angular Material

## Getting Started with Angular Material

### Install Angular Material

- Use the Angular CLI's installation `schematic` to set up your Angular Material project by running the following command:

  ```
  ng add @angular/material
  ```

  - The `ng add` command will install Angular Material, the [Component Dev Kit (CDK)](https://material.angular.io/cdk/categories), [Angular Animations](https://angular.io/guide/animations)

### Display a component

- Let's display a slider component in your app and verify that everything works.

- You need to import the `MatSliderModule` that you want to display by adding the following lines to your `app.module.ts` file.

  ```
  import { MatSliderModule } from '@angular/material/slider';

  @NgModule ({
    imports: [
      MatSliderModule,
    ]
  })
  class AppModule {}
  ```

- Add the `<mat-slider>` tag to the `app.component.html` like so:

  ```
  <mat-slider min="1" max="100" step="1" value="50"></mat-slider>
  ```

- In addition to the installation `schematic`, Angular Material comes with several `other schematics` (like nav, table, address-form, etc.) that can be used to easily generate pre-built components in your application.
