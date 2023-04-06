# Directives(Attribute vs Structural)

- Attribute Directives

  - Look like a normal HTML Attribute(possibly with databinding or event binding)
  - Only affect/change the element they are added to

- Structural Directives
  - Look like a normal HTML Attribute but have a leding \*(for desugaring)
  - Affect a whole area in the DOM (elements get added/removed)

# Attribute directives

- Change the appearance or behavior of DOM elements and Angular components with attribute directives.

- Example:

  ```
  import { Directive, ElementRef } from '@angular/core';

  @Directive({
    selector: '[appHighlight]'
  })
  export class HighlightDirective {
      constructor(private el: ElementRef) {
        this.el.nativeElement.style.backgroundColor = 'yellow';
      }
  }
  ```

# Renderer2

- Extend this base class to implement custom rendering. By default, Angular renders a template into DOM. You can use custom rendering to intercept rendering calls, or to render to something other than DOM.

- setStyle()

  - Implement this callback to set a CSS style for an element in the DOM.
  - abstract setStyle(
    el: any,
    style: string,
    value: any,
    flags?: RendererStyleFlags2
    ): void

    - Parameters

      - el: any - The element.

      - style: string - The name of the style.

      - value: any - The new value.

      - flags: RendererStyleFlags2
        - Flags for style variations. No flags are set by default.
        - Optional. Default is undefined.

    - Returns
      - void

  - RendererStyleFlags2
    - Flags for renderer-specific style modifiers.
      ```
      enum RendererStyleFlags2 {
        Important: 1 << 0 // Marks a style as important.
        DashCase: 1 << 1 // Marks a style as using dash case naming (this-is-dash-case).
      }
      ```

- Example:

  ```
  import { ElementRef, Renderer2 } from '@angular/core';

  @Directive({
    selector: '[appBetterHighlight]'
  })
  export class BetterHighlightDirecive implements OnInit {
    constructor(private elRef: ElementRef, private renderer: Renderer2) {}

    ngOnInit() {
      this.renderer.setStyle(this.elRef.nativeElement, 'background-color', 'blue', flase, false);
    }
  }
  ```

# HostListener

- Decorator that declares a DOM event to listen for, and provides a handler method to run when that event occurs.

- Options

  - eventName: The DOM event to listen for.
    ```
    eventName?: string
    ```
  - args: A set of arguments to pass to the handler method when the event occurs.
    ```
    args?: string[]
    ```

- Example

  ```
  @Directive({selector: 'button[counting]'})
  class CountClicks {
    numberOfClicks = 0;

    @HostListener('click', ['$event.target'])
    onClick(btn) {
      console.log('button', btn, 'number of clicks:', this.numberOfClicks++);
    }
  }

  @Component({
    selector: 'app',
    template: '<button counting>Increment</button>',
  })
  class App {}
  ```

# HostBinding

- Decorator that marks a DOM property as a host-binding property and supplies configuration metadata. Angular automatically checks host property bindings during change detection, and if a binding changes it updates the host element of the directive.
- Option
  - hostPropertyName?: The DOM property that is bound to a data property.
    ```
    hostPropertyName?: string
    ```
- Example

  - The following example creates a directive that sets the valid and invalid properties on the DOM element that has an ngModel directive on it.

  ```
  @Directive({selector: '[ngModel]'})
  class NgModelStatus {
    constructor(public control: NgModel) {}
    @HostBinding('class.valid') get valid() { return this.control.valid; }
    @HostBinding('class.invalid') get invalid() { return this.control.invalid; }
  }

  @Component({
    selector: 'app',
    template: `<input [(ngModel)]="prop">`,
  })
  class App {
    prop;
  }
  ```

# Binding to Directive Properties

- Two options to do so

  - using other Input properties
  - using Input property with the same alias as the directive's name

- Shothand for property binding with string value
  - For example
    - [propertyName]="'string'" equals to
    - propertyName="string"

# Structural Directives

- Structural directives are directives which change the DOM layout by adding and removing DOM elements.
- Structural directive shorthand

  - When structural directives are applied they generally are prefixed by an asterisk, \*, such as \*ngIf. This convention is shorthand that Angular interprets and converts into a longer form. Angular transforms the asterisk in front of a structural directive into an `<ng-template>` that surrounds the host element and its descendants.

  - Example(shorthand)
    ```
    <div *ngIf="hero" class="name">{{hero.name}}</div>
    ```
  - Example (ng-template)

    ```
    <ng-template [ngIf]="hero">
      <div class="name">{{hero.name}}</div>
    </ng-template>
    ```

  - Example (\*ngFor)

    ```
    <div
      *ngFor="let hero of heroes; let i=index; let odd=odd; trackBy: trackById"
      [class.odd]="odd">
      ({{i}}) {{hero.name}}
    </div>

    <ng-template ngFor let-hero [ngForOf]="heroes"
      let-i="index" let-odd="odd" [ngForTrackBy]="trackById">
      <div [class.odd]="odd">
        ({{i}}) {{hero.name}}
      </div>
    </ng-template>
    ```

- One structural directive per element

  - It's a quite common use-case to repeat a block of HTML but only when a particular condition is true. An intuitive way to do that is to put both an *ngFor and an *ngIf on the same element. However, since both *ngFor and *ngIf are structural directives, this would be treated as an error by the compiler. You may apply only one structural directive to an element.

  - The reason is simplicity.

    - Structural directives can do complex things with the host element and its descendants.

    - When two directives lay claim to the same host element, which one should take precedence?

    - Which should go first, the NgIf or the NgFor? Can the NgIf cancel the effect of the NgFor? If so (and it seems like it should be so), how should Angular generalize the ability to cancel for other structural directives?

    - There are no easy answers to these questions. Prohibiting multiple structural directives makes them moot.

  - There's an easy solution for this use case: put the *ngIf on a container element that wraps the *ngFor element.
    - One or both elements can be an <ng-container> so that no extra DOM elements are generated.

- Building a structural directive

  - Example: (`UnlessDirective` does the opposite of `NgIf`)

    ```
    import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

    /**
    * Add the template content to the DOM unless the condition is true.
    */
    @Directive({ selector: '[appUnless]'})
    export class UnlessDirective {
      private hasView = false;

      constructor(
        private templateRef: TemplateRef<any>,
        private viewContainer: ViewContainerRef) { }

      @Input() set appUnless(condition: boolean) {
        if (!condition && !this.hasView) {
          this.viewContainer.createEmbeddedView(this.templateRef);
          this.hasView = true;
        } else if (condition && this.hasView) {
          this.viewContainer.clear();
          this.hasView = false;
        }
      }
    }
    ```

    - Angular sets the appUnless property whenever the value of the condition changes.

- NgSwitch

  - The [ngSwitch] directive on a container specifies an expression to match against. The expressions to match are provided by ngSwitchCase directives on views within the container.

    - Every view that matches is rendered.
    - If there are no matches, a view with the ngSwitchDefault directive is rendered.
    - Elements within the [NgSwitch] statement but outside of any NgSwitchCase or ngSwitchDefault directive are preserved at the location.

  - Example:
    ```
    <container-element [ngSwitch]="switch_expression">
      <some-element *ngSwitchCase="match_expression_1">...</some-element>
      <some-element *ngSwitchCase="match_expression_2">...</some-element>
      <some-other-element *ngSwitchCase="match_expression_3">...</some-other-element>
      <ng-container *ngSwitchCase="match_expression_3">
        <!-- use a ng-container to group multiple root nodes -->
        <inner-element></inner-element>
        <inner-other-element></inner-other-element>
      </ng-container>
      <some-element *ngSwitchDefault>...</some-element>
    </container-element>
    ```
