# Problem

- Create two new Components (manually or with CLI): WarningAlert and SuccessAlert
- Output them beneath each other in the AppComponent
- Output a warning or success message in the Components
- Style the Components appropriately (maybe some red/green text)
- Use external or internal templates and styles!
- Feel free to create more components, nest them into each other or play around with different types of selectors!

# References

- Create a new Angular app using CLI

  ```
  ng new app_name
  ```

- Create a new component using CLI
  ```
  ng g c component_name
  ```
- Integrate Bootstrap into the project

  - Install `bootstrap` and `bootstrap-icons` npm packages
    ```
    npm i bootstrap bootstrap-icons
    ```
  - Configure the app for Bootstrap using `angular.json`

    ```
    {
      ...,
      "projects": {
        "challenge-001": {
          ...,
          "architect": {
            "build": {
              ...,
              "options": {
                ...,
                "styles": [
                  "node_modules/bootstrap/scss/bootstrap.scss",
                  "node_modules/bootstrap-icons/font/bootstrap-icons.css",
                  "src/styles.scss"
                ],
                "scripts": [
                  "node_modules/bootstrap/dist/js/bootstrap.bundle.min.js"
                ]
              },
              ...
            },
            ...
          }
        }
      }
    }

    ```

- API

  - Component from `@angular/core`

    - `selector`:

      - The CSS selector that identifies this directive in a template and triggers instantiation of the directive.
      - Declare as one of the following:

        - `element-name`: Select by element name.
        - `.class`: Select by class name.
        - `[attribute]`: Select by attribute name.
        - `[attribute=value]`: Select by attribute name and value.
        - `:not(sub_selector)`: Select only if the element does not match the sub_selector.
        - `selector1, selector2`: Select if either selector1 or selector2 matches.

    - `templateUrl?`:
      - The relative path or absolute URL of a template file for an Angular component. If provided, do not supply an inline template using `template`.
    - `template?`:
      - An inline template for an Angular component. If provided, do not supply a template file using `templateUrl`.
    - `styleUrls?`:
      - One or more relative paths or absolute URLs for files containing CSS stylesheets to use in this component.
    - `styles?`:
      - One or more inline CSS stylesheets to use in this component.
