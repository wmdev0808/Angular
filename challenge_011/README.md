# Pipes

## Understanding pipes

- Use `pipes` to transform strings, currency amounts, dates, and other data for display.

### What is a pipe

- Pipes are simple functions to use in template expressions to accept an input value and return a transformed value. Pipes are useful because you can use them throughout your application, while only declaring each pipe once. For example, you would use a pipe to show a date as April 15, 1988 rather than the raw string format.

### Built-in pipes

- Angular provides built-in pipes for typical data transformations, including transformations for internationalization (i18n), which use locale information to format data. The following are commonly used built-in pipes for data formatting:

  - DatePipe: Formats a date value according to locale rules.
  - UpperCasePipe: Transforms text to all upper case.
  - LowerCasePipe: Transforms text to all lower case.
  - CurrencyPipe: Transforms a number to a currency string, formatted according to locale rules.
  - DecimalPipe: Transforms a number into a string with a decimal point, formatted according to locale rules.
  - PercentPipe: Transforms a number to a percentage string, formatted according to locale rules.

### Pipes and precedence

- The pipe operator has a higher precedence than the ternary operator (?:), which means a ? b : c | x is parsed as a ? b : (c | x). The pipe operator cannot be used without parentheses in the first and second operands of ?:.

- Due to precedence, if you want a pipe to apply to the result of a ternary, wrap the entire expression in parentheses; for example, (a ? b : c) | x.

  - src/app/precedence.component.html
    ```
    <!-- use parentheses in the third operand so the pipe applies to the whole expression -->
    {{ (true ? 'true' : 'false') | uppercase }}
    ```

## Using a pipe in a template

- To apply a pipe, use the pipe operator (|) within a template expression as shown in the following code example, along with the _name_ of the pipe, which is `date` for the built-in `DatePipe`.

- app.component.html uses `date` in a separate template to display a birthday.

  ```
  <p>The hero's birthday is {{ birthday | date }}</p>
  ```

- hero-birthday1.component.ts uses the same pipe as part of an in-line template in a component that also sets the birthday value.

  ```
  import { Component } from '@angular/core';

  @Component({
    selector: 'app-hero-birthday',
    template: "<p>The hero's birthday is {{ birthday | date }}</p>"
  })
  export class HeroBirthdayComponent {
    birthday = new Date(1988, 3, 15); // April 15, 1988 -- since month parameter is zero-based
  }
  ```

## Transforming data with parameters and chained pipes

- Use optional parameters to fine-tune a pipe's output. For example, use the `CurrencyPipe` with a country code such as EUR as a parameter. The template expression {{ amount | currency:'EUR' }} transforms the amount to currency in euros. Follow the pipe name (currency) with a colon (:) and the parameter value ('EUR').

- If the pipe accepts multiple parameters, separate the values with colons. For example, {{ amount | currency:'EUR':'Euros '}} adds the second parameter, the string literal 'Euros ', to the output string. Use any valid template expression as a parameter, such as a string literal or a component property.

- Some pipes require at least one parameter and allow more optional parameters, such as `SlicePipe`. For example, {{ slice:1:5 }} creates a new array or string containing a subset of the elements starting with element 1 and ending with element 5.

### Example: Formatting a date

- The `app.component.html` template uses a format parameter for the DatePipe (named date) to show the date as 04/15/88.

  ```
  <p>The hero's birthday is {{ birthday | date:"MM/dd/yy" }} </p>
  ```

- The `hero-birthday2.component.ts` component binds the pipe's format parameter to the component's `format` property in the template section, and adds a button for a click event bound to the component's `toggleFormat()` method.

  ```
  template: `
    <p>The hero's birthday is {{ birthday | date:format }}</p>
    <button type="button" (click)="toggleFormat()">Toggle Format</button>
  `
  ```

- The `hero-birthday2.component.ts` component's `toggleFormat()` method toggles the component's format property between a short form ('shortDate') and a longer form ('fullDate').

  ```
  export class HeroBirthday2Component {
    birthday = new Date(1988, 3, 15); // April 15, 1988 -- since month parameter is zero-based
    toggle = true; // start with true == shortDate

    get format()   { return this.toggle ? 'shortDate' : 'fullDate'; }
    toggleFormat() { this.toggle = !this.toggle; }
  }
  ```

- Clicking the Toggle Format button alternates the date format between 04/15/1988 and Friday, April 15, 1988.

### Example: Applying two formats by chaining pipes

- Chain pipes so that the output of one pipe becomes the input to the next.

  ```
  The chained hero's birthday is
  {{ birthday | date | uppercase}}
  ```

  ```
  The chained hero's birthday is
  {{  birthday | date:'fullDate' | uppercase}}
  ```

## Creating pipes for custom data transformations

- Create custom pipes to encapsulate transformations that are not provided with the built-in pipes.

### Marking a class as a pipe

- To mark a class as a pipe and supply configuration metadata, apply the `@Pipe decorator` to the class.

### Using the PipeTransform interface

- Implement the `PipeTransform` interface in your custom pipe class to perform the transformation.
- Angular invokes the `transform` method with the value of a binding as the first argument, and any parameters as the second argument in list form, and returns the transformed value.

### Example: Transforming a value exponentially

- In a game, you might want to implement a transformation that raises a value exponentially to increase a hero's power. For example, if the hero's score is 2, boosting the hero's power exponentially by 10 produces a score of 1024. Use a custom pipe for this transformation.

- The `exponential-strength.pipe.ts` component defines a custom pipe named `exponentialStrength` with the `transform` method that performs the transformation. It defines an argument to the `transform` method (`exponent`) for a parameter passed to the pipe.

- The `power-booster.component.ts` component demonstrates how to use the pipe, specifying a value (2) and the exponent parameter (10).

- src/app/exponential-strenth.pipe.ts

  ```
  import { Pipe, PipeTransform } from '@angular/core';
  /*
  * Raise the value exponentially
  * Takes an exponent argument that defaults to 1.
  * Usage:
  *   value | exponentialStrength:exponent
  * Example:
  *   {{ 2 | exponentialStrength:10 }}
  *   formats to: 1024
  */
  @Pipe({name: 'exponentialStrength'})
  export class ExponentialStrengthPipe implements PipeTransform {
    transform(value: number, exponent = 1): number {
      return Math.pow(value, exponent);
    }
  }
  ```

- src/app/power-booster.component.ts

  ```
  import { Component } from '@angular/core';

  @Component({
    selector: 'app-power-booster',
    template: `
      <h2>Power Booster</h2>
      <p>Super power boost: {{2 | exponentialStrength: 10}}</p>
    `
  })
  export class PowerBoosterComponent { }
  ```

## Pipe decorator

- Decorator that marks a class as pipe and supplies configuration metadata.
- Options
  |Option| Description|
  |------|-------------|
  |name|The pipe name to use in template bindings. Typically uses lowerCamelCase because the name cannot contain hyphens.|
  |pure?|When true, the pipe is pure, meaning that the transform() method is invoked only when its input arguments change. Pipes are pure by default.|
  |standalone? |Angular pipes marked as standalone do not need to be declared in an NgModule. Such pipes don't depend on any "intermediate context" of an NgModule (ex. configured providers).|

## AsyncPipe

- Unwraps a value from an asynchronous primitive.
  ```
  {{ obj_expression | async }}
  ```
- Input value

  - obj: Observable<T> | Subscribable<T> | Promise<T>

- Description

  - The async pipe subscribes to an Observable or Promise and returns the latest value it has emitted. When a new value is emitted, the async pipe marks the component to be checked for changes. When the component gets destroyed, the async pipe unsubscribes automatically to avoid potential memory leaks. When the reference of the expression changes, the async pipe automatically unsubscribes from the old Observable or Promise and subscribes to the new one.

- Usage notes

  - Examples

    - This example binds a Promise to the view. Clicking the Resolve button resolves the promise.

      ```
      @Component({
        selector: 'async-promise-pipe',
        template: `<div>
          <code>promise|async</code>:
          <button (click)="clicked()">{{ arrived ? 'Reset' : 'Resolve' }}</button>
          <span>Wait for it... {{ greeting | async }}</span>
        </div>`
      })
      export class AsyncPromisePipeComponent {
        greeting: Promise<string>|null = null;
        arrived: boolean = false;

        private resolve: Function|null = null;

        constructor() {
          this.reset();
        }

        reset() {
          this.arrived = false;
          this.greeting = new Promise<string>((resolve, reject) => {
            this.resolve = resolve;
          });
        }

        clicked() {
          if (this.arrived) {
            this.reset();
          } else {
            this.resolve!('hi there!');
            this.arrived = true;
          }
        }
      }
      ```

    - It's also possible to use `async` with Observables. The example below binds the time Observable to the view. The Observable continuously updates the view with the current time.

      ```
      @Component({
        selector: 'async-observable-pipe',
        template: '<div><code>observable|async</code>: Time: {{ time | async }}</div>'
      })
      export class AsyncObservablePipeComponent {
        time = new Observable<string>((observer: Observer<string>) => {
          setInterval(() => observer.next(new Date().toString()), 1000);
        });
      }
      ```

## Assignment

- Task 1

  - Build a reverse pipe that basically reverses a string. (There is a reverse method in JavaScript that you can use but it only works on “real arrays”, not on string which technically is array of characters) (Hint: You would have to split the string by empty character first, then apply reverse and then join it together with empty character to get a string again)

- Task 2
  - Build a sort pipe, which sorts this list by name of the instance, production user database and so on.
