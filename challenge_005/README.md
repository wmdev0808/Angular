# Components and Databinding - Deep Dive

## Sharing data between child and parent directives and components

A common pattern in Angular is sharing data between a parent component and one or more child components. Implement this pattern with the @Input() and @Output() decorators.

- Input

  - Decorator that marks a class field as an input property and supplies configuration metadata. The input property is bound to a DOM property in the template. During change detection, Angular automatically updates the data property with the DOM property's value.

  - You can supply an optional name to use in templates when the component is instantiated, that maps to the name of the bound property. By default, the original name of the bound property is used for input binding.

  ```
  @Component({
    selector: 'bank-account',
    template: `
      Bank Name: {{bankName}}
      Account Id: {{id}}
    `
  })
  class BankAccount {
    // This property is bound using its original name.
    @Input() bankName: string;
    // this property value is bound to a different property name
    // when this component is instantiated in a template.
    @Input('account-id') id: string;

    // this property is not bound, and is not automatically updated by Angular
    normalizedBankName: string;
  }

  @Component({
    selector: 'app',
    template: `
      <bank-account bankName="RBC" account-id="4747"></bank-account>
    `
  })
  class App {}
  ```

- Output

  - Decorator that marks a class field as an output property and supplies configuration metadata. The DOM property bound to the output property is automatically updated during change detection.

  - You can supply an optional name to use in templates when the component is instantiated, that maps to the name of the bound property. By default, the original name of the bound property is used for output binding.

  - The child component uses the @Output() property to raise an event to notify the parent of the change. To raise an event, an @Output() must have the type of EventEmitter, which is a class in @angular/core that you use to emit custom events.

  ```
  import { Output, EventEmitter } from '@angular/core';

  export class ItemOutputComponent {

    @Output() newItemEvent = new EventEmitter<string>();

    addNewItem(value: string) {
      this.newItemEvent.emit(value);
    }
  }
  ```

  - Configuring the child's template

    ```
    <label for="item-input">Add an item:</label>
    <input type="text" id="item-input" #newItem>
    <button type="button" (click)="addNewItem(newItem.value)">
      Add to parent's list
    </button>
    ```

  - Configuring the parent component

    ```
    export class AppComponent {
      items = ['item1', 'item2', 'item3', 'item4'];

      addItem(newItem: string) {
        this.items.push(newItem);
      }
    }
    ```

  - Configuring the parent's template
    ```
    <app-item-output (newItemEvent)="addItem($event)"></app-item-output>
    ```

## View encapsulation

In Angular, a component's styles can be encapsulated within the component's host element so that they don't affect the rest of the application.

The Component's decorator provides the `encapsulation` option which can be used to control how the encapsulation is applied on a per component basis.

- Choose from the following modes:

  - ViewEncapsulation.ShadowDom

    - Angular uses the browser's built-in [Shadow DOM API](https://developer.mozilla.org/docs/Web/Web_Components/Shadow_DOM) to enclose the component's view inside a ShadowRoot (used as the component's host element) and apply the provided styles in an isolated manner.

  - ViewEncapsulation.Emulated

    - Angular modifies the component's CSS selectors so that they are only applied to the component's view and do not affect other elements in the application (emulating Shadow DOM behavior).

  - ViewEncapsulation.None
    - Angular does not apply any sort of view encapsulation meaning that any styles specified for the component are actually globally applied and can affect any HTML element present within the application. This mode is essentially the same as including the styles into the HTML itself.

- Inspecting generated CSS

  - When using the emulated view encapsulation, Angular pre-processes all the component's styles so that they are only applied to the component's view.

  - In the DOM of a running Angular application, elements belonging to components using emulated view encapsulation have some extra attributes attached to them:

    ```
    <hero-details _nghost-pmm-5>
      <h2 _ngcontent-pmm-5>Mister Fantastic</h2>
      <hero-team _ngcontent-pmm-5 _nghost-pmm-6>
        <h3 _ngcontent-pmm-6>Team</h3>
      </hero-team>
    </hero-details>
    ```

  - There are two kinds of such attributes:

    - `_nghost`
      - Are added to elements that enclose a component's view and that would be ShadowRoots in a native Shadow DOM encapsulation. This is typically the case for components' host elements.
    - `_ngcontent`
      - Are added to child element within a component's view, those are used to match the elements with their respective emulated ShadowRoots (host elements with a matching \_nghost attribute).

  - They are targeted by the generated component styles, which are injected in the <head> section of the DOM:
    ```
    [_nghost-pmm-5] {
      display: block;
      border: 1px solid black;
    }
    h3[_ngcontent-pmm-6] {
      background-color: white;
      border: 1px solid #777;
    }
    ```

## Practical example

  <li>Create three new components: GameControl, Odd and Even</li>
  <li>The GameControl Component should have buttons to start and stop the game</li>
  <li>When starting the game, an event (holding a incrementing number) should get emitted each second (ref = setInterval())</li>
  <li>The event should be listenable from outside the component</li>
  <li>When stopping the game, no more events should get emitted (clearInterval(ref))</li>
  <li>A new Odd component should get created for every odd number emitted, the same should happen for the Even Component (on even numbers)</li>
  <li>Simply output Odd - NUMBER or Even - NUMBER in the two components</li>
  <li>Style the element (e.g. paragraph) holding your output text differently in both components</li>

# Understanding template variables(Local references in templates)

- Template variables help you use data from one part of a template in another part of the template. Use template variables to perform tasks such as respond to user input or finely tune your application's forms.

- A template variable can refer to the following:

  - a DOM element within a template
  - a directive or component
  - a [TemplateRef](https://angular.io/api/core/TemplateRef) from an [ng-template](https://angular.io/api/core/ng-template)
  - a [web component](https://developer.mozilla.org/en-US/docs/Web/Web_Components)

- Syntax

  - In the template, you use the hash symbol, #, to declare a template variable. The following template variable, #phone, declares a phone variable with the `<input>` element as its value.

    ```
    <input #phone placeholder="phone number" />
    ```

  - Refer to a template variable anywhere in the component's template. Here, a `<button> `further down the template refers to the phone variable.

    ```
    <input #phone placeholder="phone number" />

    <!-- lots of other elements -->

    <!-- phone refers to the input element; pass its `value` to an event handler -->
    <button type="button" (click)="callPhone(phone.value)">Call</button>
    ```

  - How Angular assigns values to template variables

    - Angular assigns a template variable a value based on where you declare the variable:

      - If you declare the variable on a component, the variable refers to the component instance.
      - If you declare the variable on a standard HTML tag, the variable refers to the element.
      - If you declare the variable on an <ng-template> element, the variable refers to a `TemplateRef` instance which represents the template. For more information on `<ng-template>`, see How Angular uses the asterisk, \*, syntax in Structural directives.

  - Variable specifying a name

    - If the variable specifies a name on the right-hand side, such as #var="ngModel", the variable refers to the directive or component on the element with a matching exportAs name.

    - Using NgForm with template variables

      ```
      <form #itemForm="ngForm" (ngSubmit)="onSubmit(itemForm)">
        <label for="name">Name</label>
        <input type="text" id="name" class="form-control" name="name" ngModel required />
        <button type="submit">Submit</button>
      </form>

      <div [hidden]="!itemForm.form.valid">
        <p>{{ submitMessage }}</p>
      </div>
      ```

      - Without the ngForm attribute value, the reference value of itemForm would be the HTMLFormElement, `<form>`. If an element is an Angular Component, a reference with no attribute value will automatically reference the component instance. Otherwise, a reference with no value will reference the DOM element, even if the element has one or more directives applied to it.

  - Template variable scope

    - Just like variables in JavaScript or TypeScript code, template variables are scoped to the template that declares them.

    - Similarly, Structural directives such as *ngIf and *ngFor, or `<ng-template>` declarations create a new nested template scope, much like JavaScript's control flow statements like if and for create new lexical scopes. You cannot access template variables within one of these structural directives from outside of its boundaries.

    - Accessing in a nested template

      - An inner template can access template variables that the outer template defines.

        ```
        <input #ref1 type="text" [(ngModel)]="firstExample" />
        <span *ngIf="true">Value: {{ ref1.value }}</span>
        ```

        - In this case, the \*ngIf on <span> creates a new template scope, which includes the ref1 variable from its parent scope.

      - However, accessing a template variable from a child scope in the parent template doesn't work:
        ```
        <input *ngIf="true" #ref2 type="text" [(ngModel)]="secondExample" />
        <span>Value: {{ ref2?.value }}</span> <!-- doesn't work -->
        ```
        - Here, ref2 is declared in the child scope created by \*ngIf, and is not accessible from the parent template.

  - Template input variable

    - A template input variable is a variable with a value that is set when an instance of that template is created. See: [Writing structural directives](https://angular.io/guide/structural-directives)

      ```
      <ul>
        <ng-template ngFor let-hero [ngForOf]="heroes">
          <li>{{hero.name}}
        </ng-template>
      </ul>
      ```

      - The NgFor directive will instantiate this once for each hero in the heroes array, and will set the hero variable for each instance accordingly.
      - NgFor for example also provides access to the index of each hero in the array:
        ```
        <ul>
          <ng-template ngFor let-hero let-i="index" [ngForOf]="heroes">
            <li>Hero number {{i}}: {{hero.name}}
          </ng-template>
        </ul>
        ```

# ViewChild

- Property decorator that configures a view query. The change detector looks for the first element or the directive matching the selector in the view DOM. If the view DOM changes, and a new child matches the selector, the property is updated.

- Description

  - View queries are set before the ngAfterViewInit callback is called.
  - Metadata Properties:

    - **selector** - The directive type or the name used for querying.
    - **read** - Used to read a different token from the queried elements.
    - **static** - True to resolve query results before change detection runs, false to resolve after change detection. Defaults to false.

  - The following selectors are supported.

    - Any class with the @Component or @Directive decorator
    - A template reference variable as a string (e.g. query <my-component #cmp></my-component> with @ViewChild('cmp'))
    - Any provider defined in the child component tree of the current component (e.g. @ViewChild(SomeService) someService: SomeService)
    - Any provider defined through a string token (e.g. @ViewChild('someToken') someTokenVal: any)
    - A TemplateRef (e.g. query <ng-template></ng-template> with @ViewChild(TemplateRef) template;)

  - The following values are supported by read:

    - Any class with the @Component or @Directive decorator
    - Any provider defined on the injector of the component that is matched by the selector of this query
    - Any provider defined through a string token (e.g. {provide: 'token', useValue: 'val'})
    - `TemplateRef`, `ElementRef`, and `ViewContainerRef`

- Usage notes

  ```
  import {Component, Directive, Input, ViewChild} from '@angular/core';

  @Directive({selector: 'pane'})
  export class Pane {
    @Input() id!: string;
  }

  @Component({
    selector: 'example-app',
    template: `
      <pane id="1" *ngIf="shouldShow"></pane>
      <pane id="2" *ngIf="!shouldShow"></pane>

      <button (click)="toggle()">Toggle</button>

      <div>Selected: {{selectedPane}}</div>
    `,
  })
  export class ViewChildComp {
    @ViewChild(Pane)
    set pane(v: Pane) {
      setTimeout(() => {
        this.selectedPane = v.id;
      }, 0);
    }
    selectedPane: string = '';
    shouldShow = true;
    toggle() {
      this.shouldShow = !this.shouldShow;
    }
  }
  ```

  - Example 2

    ```
    import {AfterViewInit, Component, Directive, ViewChild} from '@angular/core';

    @Directive({selector: 'child-directive'})
    class ChildDirective {
    }

    @Component({selector: 'someCmp', templateUrl: 'someCmp.html'})
    class SomeCmp implements AfterViewInit {
      @ViewChild(ChildDirective) child!: ChildDirective;

      ngAfterViewInit() {
        // child is set
      }
    }
    ```

# Content projection

- This topic describes how to use content projection to create flexible, reusable components.
- Content projection is a pattern in which you insert, or project, the content you want to use inside another component. For example, you could have a Card component that accepts content provided by another component.

## Single-slot content projection

- With this type of content projection, a component accepts content from a single source.
- Single-slot content projection refers to creating a component into which you can project one component.

  ```
  import { Component } from '@angular/core';

  @Component({
    selector: 'app-zippy-basic',
    template: `
      <h2>Single-slot content projection</h2>
      <ng-content></ng-content>
    `
  })
  export class ZippyBasicComponent {}
  ```

- With the `<ng-content>` element in place, users of this component can now project their own message into the component. For example:
  ```
  <app-zippy-basic>
    <p>Is content projection cool?</p>
  </app-zippy-basic>
  ```
- The `<ng-content>` element is a placeholder that does not create a real DOM element. Custom attributes applied to `<ng-content>` are ignored.

## Multi-slot content projection

- In this scenario, a component accepts content from multiple sources.
- A component can have multiple slots. Each slot can specify a CSS selector that determines which content goes into that slot. This pattern is referred to as multi-slot content projection. With this pattern, you must specify where you want the projected content to appear. You accomplish this task by using the `select` attribute of `<ng-content>`.

  ```
  import { Component } from '@angular/core';

  @Component({
    selector: 'app-zippy-multislot',
    template: `
      <h2>Multi-slot content projection</h2>

      Default:
      <ng-content></ng-content>

      Question:
      <ng-content select="[question]"></ng-content>
    `
  })
  export class ZippyMultislotComponent {}
  ```

  - Content that uses the question attribute is projected into the `<ng-content>` element with the select=[question] attribute.
    ```
    <app-zippy-multislot>
      <p question>
        Is content projection cool?
      </p>
      <p>Let's learn about content projection!</p>
    </app-zippy-multislot>
    ```

## Conditional content projection

- Components that use conditional content projection render content only when specific conditions are met.
- If your component needs to conditionally render content, or render content multiple times, you should configure that component to accept an `<ng-template>` element that contains the content you want to conditionally render.

- Using an `<ng-content>` element in these cases is not recommended, because when the consumer of a component supplies the content, that content is always initialized, even if the component does not define an `<ng-content>` element or if that `<ng-content>` element is inside of an ngIf statement.

- With an `<ng-template>` element, you can have your component explicitly render content based on any condition you want, as many times as you want. Angular will not initialize the content of an `<ng-template>` element until that element is explicitly rendered.

  ```
  <div *ngIf="expanded" [id]="contentId">
    <ng-container [ngTemplateOutlet]="content.templateRef"></ng-container>
  </div>
  ```

  - In the template where you want to project content, wrap the projected content in an `<ng-template>` element, such as:

    ```
    <ng-template appExampleZippyContent>
      It depends on what you do with it.
    </ng-template>
    ```

  - Create an attribute directive with a selector that matches the custom attribute for your template. In this directive, inject a TemplateRef instance.
    ```
    @Directive({
      selector: '[appExampleZippyContent]'
    })
    export class ZippyContentDirective {
      constructor(public templateRef: TemplateRef<unknown>) {}
    }
    ```
  - In the component you want to project content into, use @ContentChild to get the template of the projected content.
    ```
    @ContentChild(ZippyContentDirective) content!: ZippyContentDirective;
    ```

## Projecting content in more complex environments

- For example, in the following HTML template, a paragraph tag uses a custom attribute, question, to project content into the app-zippy-multislot component.
  ```
  <app-zippy-multislot>
    <p question>
      Is content projection cool?
    </p>
    <p>Let's learn about content projection!</p>
  </app-zippy-multislot>
  ```
- In some cases, you might want to project content as a different element. For example, the content you want to project might be a child of another element. Accomplish this with the ngProjectAs attribute.
  ```
  <ng-container ngProjectAs="[question]">
    <p>Is content projection cool?</p>
  </ng-container>
  ```
  - In this example, the content we want to project resides inside another element. To project this content as intended, the template uses the ngProjectAs attribute. With ngProjectAs, the entire `<ng-container>` element is projected into a component using the [question] selector.

# Lifecycle hooks

A component instance has a lifecycle that starts when Angular instantiates the component class and renders the component view along with its child views. The lifecycle continues with change detection, as Angular checks to see when data-bound properties change, and updates both the view and the component instance as needed. The lifecycle ends when Angular destroys the component instance and removes its rendered template from the DOM. Directives have a similar lifecycle, as Angular creates, updates, and destroys instances in the course of execution.

Your application can use lifecycle hook methods to tap into key events in the lifecycle of a component or directive to initialize new instances, initiate change detection when needed, respond to updates during change detection, and clean up before deletion of instances.

## Responding to lifecycle events

- Respond to events in the lifecycle of a component or directive by implementing one or more of the lifecycle hook interfaces in the Angular core library. The hooks give you the opportunity to act on a component or directive instance at the appropriate moment, as Angular creates, updates, or destroys that instance.

- For example, the OnInit interface has a hook method named ngOnInit(). If you implement this method in your component or directive class, Angular calls it shortly after checking the input properties for that component or directive for the first time.

  ```
  @Directive({selector: '[appPeekABoo]'})
  export class PeekABooDirective implements OnInit {
    constructor(private logger: LoggerService) { }

    // implement OnInit's `ngOnInit` method
    ngOnInit() {
      this.logIt('OnInit');
    }

    logIt(msg: string) {
      this.logger.log(`#${nextId++} ${msg}`);
    }
  }
  ```

### Lifecycle event sequence

- After your application instantiates a component or directive by calling its constructor, Angular calls the hook methods you have implemented at the appropriate point in the lifecycle of that instance.
- Angular executes hook methods in the following sequence. Use them to perform the following kinds of operations.

  - `ngOnChanges()`

    - Respond when Angular sets or resets data-bound input properties. The method receives a [SimpleChanges](https://angular.io/api/core/SimpleChanges) object of current and previous property values.
    - Called before ngOnInit() (if the component has bound inputs) and whenever one or more data-bound input properties change.
      - NOTE: If your component has no inputs or you use it without providing any inputs, the framework will not call ngOnChanges().

  - `ngOnInit()`

    - Initialize the directive or component after Angular first displays the data-bound properties and sets the directive or component's input properties.
    - Called once, after the first ngOnChanges(). ngOnInit() is still called even when ngOnChanges() is not (which is the case when there are no template-bound inputs).
    - Use cases
      - Perform complex initializations outside of the constructor
        - An ngOnInit() is a good place for a component to fetch its initial data.
      - Set up the component after Angular sets the input properties
        - Keep in mind that a directive's data-bound input properties are not set until after construction. If you need to initialize the directive based on those properties, set them when ngOnInit() runs.

  - `ngDoCheck()`

    - Detect and act upon changes that Angular can't or won't detect on its own.
    - Called immediately after ngOnChanges() on every change detection run, and immediately after ngOnInit() on the first run.

  - `ngAfterContentInit()`

    - Respond after Angular projects external content into the component's view, or into the view that a directive is in.
    - Called once after the first ngDoCheck().

  - `ngAfterContentChecked()`

    - Respond after Angular checks the content projected into the directive or component.
    - Called after ngAfterContentInit() and every subsequent ngDoCheck().

  - `ngAfterViewInit()`

    - Respond after Angular initializes the component's views and child views, or the view that contains the directive.
    - Called once after the first ngAfterContentChecked().

  - `ngAfterViewChecked()`

    - Respond after Angular checks the component's views and child views, or the view that contains the directive.
    - Called after the ngAfterViewInit() and every subsequent ngAfterContentChecked().

  - `ngOnDestroy()`

    - Cleanup just before Angular destroys the directive or component. Unsubscribe Observables and detach event handlers to avoid memory leaks.
    - Called immediately before Angular destroys the directive or component.
    - Use cases
      - Put cleanup logic in ngOnDestroy(), the logic that must run before Angular destroys the directive.
      - Unsubscribe from Observables and DOM events
      - Stop interval timers
      - Unregister all callbacks that the directive registered with global or application services

  - Example: Sequence and frequency of all lifecycle events
    1 OnChanges
    2 OnInit
    3 DoCheck
    4 AfterContentInit
    5 AfterContentChecked
    6 AfterViewInit
    7 AfterViewChecked
    8 DoCheck
    9 AfterContentChecked
    10 AfterViewChecked
    11 OnDestroy
