# What are Directives?

- Directives are Instructions in the DOM!
  ```
  <p appTurnGreen>Receives a green background!</p>
  ```
  ```
  @Directive({
    selector: '[appTurnGreen]'
  })
  export class TurnGreenDirective {
    ...
  }
  ```

# Directive types

- `Components`: Used with a template. This type of directive is the most common directive type.
- `Attribute directives`: Change the appearance or behavior of an element, component, or another directive.
- `Structural directives`: Change the DOM layout by adding and removing DOM elements.

# Typical built-in directives

- `ngIf` structural directive to display data conditionally

  - Simple form with shorthand syntax:
    ```
    <div *ngIf="condition">Content to render when condition is true.</div>
    ```
  - Simple form with expanded syntax:
    ```
    <ng-template [ngIf]="condition">
      <div>Content to render when condition is true.</div>
    </ng-template>
    ```
  - Form with an "else" block:
    ```
    <div *ngIf="condition; else elseBlock">
      Content to render when condition is true.
    </div>
    <ng-template #elseBlock>
      Content to render when condition is false.
    </ng-template>
    ```
  - Shorthand form with "then" and "else" blocks:

    ```
    <div *ngIf="condition; then thenBlock else elseBlock"></div>
    <ng-template #thenBlock>Content to render when condition is true.</ng-template>
    <ng-template #elseBlock>Content to render when condition is false.</ng-template>
    ```

  - Form with storing the value locally:
    ```
    <div *ngIf="condition as value; else elseBlock">{{value}}</div>
    <ng-template #elseBlock>Content to render when value is null.</ng-template>
    ```

- `ngStyle` attribute directive for styling elements dinamically

  - An attribute directive that updates styles for the containing HTML element. Sets one or more style properties, specified as colon-separated key-value pairs. The key is a style name, with an optional .<unit> suffix (such as 'top.px', 'font-style.em'). The value is an expression to be evaluated. The resulting non-null value, expressed in the given unit, is assigned to the given style property. If the result of evaluation is null, the corresponding style is removed.

  - Set the font of the containing element to the result of an expression.
    ```
    <some-element [ngStyle]="{'font-style': styleExp}">...</some-element>
    ```
  - Set the width of the containing element to a pixel value returned by an expression.
    ```
    <some-element [ngStyle]="{'max-width.px': widthExp}">...</some-element>
    ```
  - Set a collection of style values using an expression that returns key-value pairs.
    ```
    <some-element [ngStyle]="objExp">...</some-element>
    ```

- Applying CSS classes dynamically with `ngClass` directive

  - Adds and removes CSS classes on an HTML element.
  - The CSS classes are updated as follows, depending on the type of the expression evaluation:

    - string - the CSS classes listed in the string (space delimited) are added,
    - Array - the CSS classes declared as Array elements are added,
    - Object - keys are CSS classes that get added when the expression given in the value evaluates to a truthy value, otherwise they are removed.

    ```
    <some-element [ngClass]="'first second'">...</some-element>

    <some-element [ngClass]="['first', 'second']">...</some-element>

    <some-element [ngClass]="{'first': true, 'second': true, 'third': false}">...</some-element>

    <some-element [ngClass]="stringExp|arrayExp|objExp">...</some-element>

    <some-element [ngClass]="{'class1 class2 class3' : true}">...</some-element>
    ```

- Displaying lists using the `ngFor` structural directive

  - A structural directive that renders a template for each item in a collection. The directive is placed on an element, which becomes the parent of the cloned templates.

  - shorthand form
    ```
    <li *ngFor="let item of items; index as i; trackBy: trackByFn">...</li>
    ```
  - expanded form
    ```
    <ng-template ngFor let-item [ngForOf]="items" let-i="index" [ngForTrackBy]="trackByFn">
      <li>...</li>
    </ng-template>
    ```
  - Local variables

    - `NgForOf` provides exported values that can be aliased to local variables. For example:

    ```
    <li *ngFor="let user of users; index as i; first as isFirst">
      {{i}}/{{users.length}}. {{user}} <span *ngIf="isFirst">default</span>
    </li>
    ```

    - The following exported values can be aliased to local variables:

      - `$implicit: T`: The value of the individual items in the iterable (ngForOf).
      - `ngForOf: NgIterable<T>`: The value of the iterable expression. Useful when the expression is more complex then a property access, for example when using the async pipe (userStreams | async).
      - `index: number`: The index of the current item in the iterable.
      - `count: number`: The length of the iterable.
      - `first: boolean`: True when the item is the first item in the iterable.
      - `last: boolean`: True when the item is the last item in the iterable.
      - `even: boolean`: True when the item has an even index in the iterable.
      - `odd: boolean`: True when the item has an odd index in the iterable.

# Problem

- Add aa button which says 'Display Details'
- Add a paragraph with any content of your choice (e.g. 'Secret Password = tuna')
- Toggle the displaying of that paragraph with the button created in the first step.
- Log all button clicks in an array and output that array below the secret paragraph (maybe log a timestamp or simply an incrementing number)
- Starting at the 5th log item, give all future log items a blue background (via ngStyle) and white color (ngClass)
