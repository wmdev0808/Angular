# Understanding Databinding

- Databinding is communication between TypeScript Code(Business Logic) and Template(HTML)

  - Output Data
    - String Interpolation(`{{ data }}`)
    - Property Binding(`[property]="data"`)
  - React to (User) Events
    - Event Binding(`(event)="expression"`)
  - Combination of Both: Two-Way-Binding(`[(ngModel)]="data"`)

- String interpolation vs. Property binding

  ```
  <p>{{ value }}</p>
  ```

  is equal to

  ```
  <p [innerText]="value"></p>
  ```

- Event binding

  - Passing and using data with event binding
    ```
    <input
      ...
      (input)="onMethodName($event)"
    />
    ```
    - Use reserved word `$event`, which means the data that the event emitted

- Two-way binding
  - Two-way binding gives components in your application a way to share data. Use two-way binding to listen for events and update values simultaneously between parent and child components.
  - To be able to use `ngModel`, the `FormsModule` (from `@angular/forms`) needs to be added to your imports[] array in the AppModule

# Problem

- Add a Input field which updates a property ('username') via Two-Way-Binding.
- Output the username property via String Interpolation(in a paragraph below the input).
- Add a button which may only be clicked if the username is NOT an empty string.
- Upon clicking the button, the username should be reset to an empty string.
