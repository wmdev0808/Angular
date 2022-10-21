# Angular elements overview

- Angular elements are Angular components packaged as _custom elements_ (also called Web Components), a web standard for defining new HTML elements in a framework-agnostic way.

- [Custom elements](https://developer.mozilla.org/docs/Web/Web_Components/Using_custom_elements) are a Web Platform feature currently supported by Chrome, Edge (Chromium-based), Firefox, Opera, and Safari, and available in other browsers through polyfills (see Browser Support).

- A custom element extends HTML by allowing you to define a tag whose content is created and controlled by JavaScript code. The browser maintains a `CustomElementRegistry` of defined custom elements, which maps an instantiable JavaScript class to an HTML tag.

- The `@angular/elements` package exports a `createCustomElement()` API that provides a bridge from Angular's component interface and change detection functionality to the built-in DOM API.

- Transforming a component to a custom element makes all of the required Angular infrastructure available to the browser.

- Creating a custom element is simple and straightforward, and automatically connects your component-defined view with change detection and data binding, mapping Angular functionality to the corresponding built-in HTML equivalents.

## Using custom elements

- Custom elements bootstrap themselves - they start automatically when they are added to the DOM, and are automatically destroyed when removed from the DOM. Once a custom element is added to the DOM for any page, it looks and behaves like any other HTML element, and does not require any special knowledge of Angular terms or usage conventions.

- Easy dynamic content in an Angular application

  - Transforming a component to a custom element provides a straightforward path to creating dynamic HTML content in your Angular application. HTML content that you add directly to the DOM in an Angular application is normally displayed without Angular processing, unless you define a dynamic component, adding your own code to connect the HTML tag to your application data, and participate in change detection. With a custom element, all of that wiring is taken care of automatically.

- Content-rich applications
  - If you have a content-rich application, such as the Angular app that presents this documentation, custom elements let you give your content providers sophisticated Angular functionality without requiring knowledge of Angular. For example, an Angular guide like this one is added directly to the DOM by the Angular navigation tools, but can include special elements like `<code-snippet>` that perform complex operations. All you need to tell your content provider is the syntax of your custom element. They don't need to know anything about Angular, or anything about your component's data structures or implementation.

### How it works

- Use the `createCustomElement()` function to convert a component into a class that can be registered with the browser as a custom element. After you register your configured class with the browser's custom-element registry, use the new element just like a built-in HTML element in content that you add directly into the DOM:

  ```
  <my-popup message="Use Angular!"></my-popup>
  ```

- When your custom element is placed on a page, the browser creates an instance of the registered class and adds it to the DOM. The content is provided by the component's template, which uses Angular template syntax, and is rendered using the component and DOM data. Input properties in the component correspond to input attributes for the element.

  ![](https://angular.io/generated/images/guide/elements/customElement1.png)

## Transforming components to custom elements

- Angular provides the `createCustomElement()` function for converting an Angular component, together with its dependencies, to a custom element. The function collects the component's observable properties, along with the Angular functionality the browser needs to create and destroy instances, and to detect and respond to changes.

- The conversion process implements the `NgElementConstructor` interface, and creates a constructor class that is configured to produce a self-bootstrapping instance of your component.

- Use the built-in `customElements.define()` function to register the configured constructor and its associated custom-element tag with the browser's `CustomElementRegistry`. When the browser encounters the tag for the registered element, it uses the constructor to create a custom-element instance.

  ![](https://angular.io/generated/images/guide/elements/createElement.png)

- Avoid using the `@Component selector` as the custom-element tag name. This can lead to unexpected behavior, due to Angular creating two component instances for a single DOM element: One regular Angular component and a second one using the custom element.

### Mapping

- A custom element hosts an Angular component, providing a bridge between the data and logic defined in the component and standard DOM APIs. Component properties and logic maps directly into HTML attributes and the browser's event system.

  - The creation API parses the component looking for input properties, and defines corresponding attributes for the custom element. It transforms the property names to make them compatible with custom elements, which do not recognize case distinctions. The resulting attribute names use dash-separated lowercase. For example, for a component with `@Input('myInputProp') inputProp`, the corresponding custom element defines an attribute `my-input-prop`.

  - Component outputs are dispatched as HTML [Custom Events](https://developer.mozilla.org/docs/Web/API/CustomEvent), with the name of the custom event matching the output name. For example, for a component with `@Output() valueChanged = new EventEmitter()`, the corresponding custom element dispatches events with the name "valueChanged", and the emitted data is stored on the event's `detail` property. If you provide an alias, that value is used; for example, `@Output('myClick') clicks = new EventEmitter<string>();` results in dispatch events with the name "myClick".

## Browser support for custom elements

- The recently-developed custom elements Web Platform feature is currently supported natively in a number of browsers.

  - Chrome: Supported natively.
  - Edge (Chromium-based): Supported natively.
  - Firefox: Supported natively.
  - Opera: Supported natively.
  - Safari: Supported natively.

- To add the `@angular/elements` package to your workspace, run the following command:
  ```
  npm install @angular/elements --save
  ```

## Example: A Popup Service

- Previously, when you wanted to add a component to an application at runtime, you had to define a dynamic component, and then you would have to load it, attach it to an element in the DOM, and wire up all of the dependencies, change detection, and event handling, as described in [Dynamic Component Loader](https://angular.io/guide/dynamic-component-loader).

- Using an Angular custom element makes the process much simpler and more transparent, by providing all of the infrastructure and framework automatically —all you have to do is define the kind of event handling you want. (You do still have to exclude the component from compilation, if you are not going to use it in your application.)

- The following Popup Service example application defines a component that you can either load dynamically or convert to a custom element.

  | FILES              | DETAILS                                                                                                                                                                                                                      |
  | ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
  | popup.component.ts | Defines a simple pop-up element that displays an input message, with some animation and styling.                                                                                                                             |
  | popup.service.ts   | Creates an injectable service that provides two different ways to invoke the `PopupComponent`; as a dynamic component, or as a custom element Notice how much more setup is required for the dynamic-loading method.         |
  | app.module.ts      | Adds the PopupComponent in the module's declarations list.                                                                                                                                                                   |
  | app.component.ts   | Defines the application's root component, which uses the `PopupService` to add the pop-up to the DOM at run time. When the application runs, the root component's constructor converts `PopupComponent` to a custom element. |

- For comparison, the demo shows both methods. One button adds the popup using the dynamic-loading method, and the other uses the custom element. The result is the same; only the preparation is different.

  - popup.component.ts

    ```
    import { Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';
    import { animate, state, style, transition, trigger } from '@angular/animations';

    @Component({
      selector: 'my-popup',
      template: `
        <span>Popup: {{message}}</span>
        <button type="button" (click)="closed.next()">&#x2716;</button>
      `,
      animations: [
        trigger('state', [
          state('opened', style({transform: 'translateY(0%)'})),
          state('void, closed', style({transform: 'translateY(100%)', opacity: 0})),
          transition('* => *', animate('100ms ease-in')),
        ])
      ],
      styles: [`
        :host {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: #009cff;
          height: 48px;
          padding: 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 1px solid black;
          font-size: 24px;
        }

        button {
          border-radius: 50%;
        }
      `]
    })
    export class PopupComponent {
      @HostBinding('@state')
      state: 'opened' | 'closed' = 'closed';

      @Input()
      get message(): string { return this._message; }
      set message(message: string) {
        this._message = message;
        this.state = 'opened';
      }
      private _message = '';

      @Output()
      closed = new EventEmitter<void>();
    }
    ```

  - popup.service.ts

    ```
    import { ApplicationRef, ComponentFactoryResolver, Injectable, Injector } from '@angular/core';
    import { NgElement, WithProperties } from '@angular/elements';
    import { PopupComponent } from './popup.component';


    @Injectable()
    export class PopupService {
      constructor(private injector: Injector,
                  private applicationRef: ApplicationRef,
                  private componentFactoryResolver: ComponentFactoryResolver) {}

      // Previous dynamic-loading method required you to set up infrastructure
      // before adding the popup to the DOM.
      showAsComponent(message: string) {
        // Create element
        const popup = document.createElement('popup-component');

        // Create the component and wire it up with the element
        const factory = this.componentFactoryResolver.resolveComponentFactory(PopupComponent);
        const popupComponentRef = factory.create(this.injector, [], popup);

        // Attach to the view so that the change detector knows to run
        this.applicationRef.attachView(popupComponentRef.hostView);

        // Listen to the close event
        popupComponentRef.instance.closed.subscribe(() => {
          document.body.removeChild(popup);
          this.applicationRef.detachView(popupComponentRef.hostView);
        });

        // Set the message
        popupComponentRef.instance.message = message;

        // Add to the DOM
        document.body.appendChild(popup);
      }

      // This uses the new custom-element method to add the popup to the DOM.
      showAsElement(message: string) {
        // Create element
        const popupEl: NgElement & WithProperties<PopupComponent> = document.createElement('popup-element') as any;

        // Listen to the close event
        popupEl.addEventListener('closed', () => document.body.removeChild(popupEl));

        // Set the message
        popupEl.message = message;

        // Add to the DOM
        document.body.appendChild(popupEl);
      }
    }
    ```

  - app.module.ts

    ```
    import { NgModule } from '@angular/core';
    import { BrowserModule } from '@angular/platform-browser';
    import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

    import { AppComponent } from './app.component';
    import { PopupComponent } from './popup.component';
    import { PopupService } from './popup.service';

    @NgModule({
      imports: [BrowserModule, BrowserAnimationsModule],
      providers: [PopupService],
      declarations: [AppComponent, PopupComponent],
      bootstrap: [AppComponent],
    })
    export class AppModule {
    }
    ```

  - app.component.ts

    ```
    import { Component, Injector } from '@angular/core';
    import { createCustomElement } from '@angular/elements';
    import { PopupService } from './popup.service';
    import { PopupComponent } from './popup.component';

    @Component({
      selector: 'app-root',
      template: `
        <input #input value="Message">
        <button type="button" (click)="popup.showAsComponent(input.value)">Show as component</button>
        <button type="button" (click)="popup.showAsElement(input.value)">Show as element</button>
      `,
    })
    export class AppComponent {
      constructor(injector: Injector, public popup: PopupService) {
        // Convert `PopupComponent` to a custom element.
        const PopupElement = createCustomElement(PopupComponent, {injector});
        // Register the custom element with the browser.
        customElements.define('popup-element', PopupElement);
      }
    }
    ```

## Typings for custom elements

- Generic DOM APIs, such as `document.createElement()` or `document.querySelector()`, return an element type that is appropriate for the specified arguments. For example, calling `document.createElement('a')` returns an `HTMLAnchorElement`, which TypeScript knows has an `href` property. Similarly, `document.createElement('div')` returns an `HTMLDivElement`, which TypeScript knows has no `href` property.

- When called with unknown elements, such as a custom element name (`popup-element` in our example), the methods return a generic type, such as `HTMLElement`, because TypeScript can't infer the correct type of the returned element.

- Custom elements created with Angular extend `NgElement` (which in turn extends `HTMLElement`). Additionally, these custom elements will have a property for each input of the corresponding component. For example, our `popup-element` has a `message` property of type `string`.

- There are a few options if you want to get correct types for your custom elements. Assume you create a `my-dialog` custom element based on the following component:

  ```
  @Component(…)
  class MyDialog {
    @Input() content: string;
  }
  ```

- The most straightforward way to get accurate typings is to cast the return value of the relevant DOM methods to the correct type. For that, use the `NgElement` and `WithProperties` types (both exported from `@angular/elements`):

  ```
  const aDialog = document.createElement('my-dialog') as NgElement & WithProperties<{content: string}>;
  aDialog.content = 'Hello, world!';
  aDialog.content = 123;  // <-- ERROR: TypeScript knows this should be a string.
  aDialog.body = 'News';  // <-- ERROR: TypeScript knows there is no `body` property on `aDialog`.
  ```

- This is a good way to quickly get TypeScript features, such as type checking and autocomplete support, for your custom element. But it can get cumbersome if you need it in several places, because you have to cast the return type on every occurrence.

- An alternative way, that only requires defining each custom element's type once, is augmenting the `HTMLElementTagNameMap`, which TypeScript uses to infer the type of a returned element based on its tag name (for DOM methods such as `document.createElement()`, `document.querySelector()`, etc.):

  ```
  declare global {
    interface HTMLElementTagNameMap {
      'my-dialog': NgElement & WithProperties<{content: string}>;
      'my-other-element': NgElement & WithProperties<{foo: 'bar'}>;
      …
    }
  }
  ```

- Now, TypeScript can infer the correct type the same way it does for built-in elements:
  ```
  document.createElement('div')               //--> HTMLDivElement (built-in element)
  document.querySelector('foo')               //--> Element        (unknown element)
  document.createElement('my-dialog')         //--> NgElement & WithProperties<{content: string}> (custom element)
  document.querySelector('my-other-element')  //--> NgElement & WithProperties<{foo: 'bar'}>      (custom element)
  ```
