# NgModules

## Ng Modules introduction

- `NgModules` configure the injector and the compiler and help organize related things together.

### Angular modularity

- Modules are a great way to organize an application and extend it with capabilities from external libraries.

  - Angular libraries are NgModules, such as `FormsModule`, `HttpClientModule`, and `RouterModule`. Many third-party libraries are available as NgModules such as `Material Design`, `Ionic`, and `AngularFire2`.

- NgModules consolidate components, directives, and pipes into cohesive blocks of functionality, each focused on a feature area, application business domain, workflow, or common collection of utilities.

- Modules can also add services to the application. Such services might be internally developed, like something you'd develop yourself or come from outside sources, such as the Angular router and HTTP client.

- Modules can be loaded eagerly when the application starts or lazy loaded asynchronously by the router.

- Every Angular application has at least one module, the root module. You bootstrap that module to launch the application.

- The root module is all you need in an application with few components. As the application grows, you refactor the root module into feature modules that represent collections of related functionality. You then import these modules into the root module.

### The basic NgModule

- src/app/app.module.ts (default AppModule)

  ```
  // imports
  import { BrowserModule } from '@angular/platform-browser';
  import { NgModule } from '@angular/core';

  import { AppComponent } from './app.component';

  // @NgModule decorator with its metadata
  @NgModule({
    declarations: [AppComponent],
    imports: [BrowserModule],
    providers: [],
    bootstrap: [AppComponent]
  })
  export class AppModule {}
  ```

## JS Modules vs NgModules

- JavaScript modules and NgModules can help you modularize your code, but they are very different. Angular applications rely on both kinds of modules.

### JavaScript modules: Files containing code

- A JavaScript module is an individual file with JavaScript code, usually containing a class or a library of functions for a specific purpose within your application. JavaScript modules let you spread your work across multiple files.

- To make the code in a JavaScript module available to other modules, use an export statement at the end of the relevant code in the module, such as the following:

  ```
  export class AppComponent { … }
  ```

- When you need that module's code in another module, use an import statement as follows:

  ```
  import { AppComponent } from './app.component';
  ```

- The Angular framework itself is loaded as a set of JavaScript modules.

### NgModules: Classes with metadata for compiling

- An `NgModule` is a class marked by the `@NgModule` decorator with a metadata object that describes how that particular part of the application fits together with the other parts. NgModules are specific to Angular. While classes with an `@NgModule` decorator are by convention kept in their own files, they differ from JavaScript modules because they include this metadata.

- Rather than defining all member classes in one giant file as a JavaScript module, declare which components, directives, and pipes belong to the NgModule in the @NgModule.declarations list. These classes are called declarables. An NgModule can export only the declarable classes it owns or imports from other NgModules. It doesn't declare or export any other kind of class. Declarables are the only classes that matter to the Angular compilation process.

### An example that uses both

- src/app/app.module.ts (default AppModule)

  ```
  // imports
  import { BrowserModule } from '@angular/platform-browser';
  import { NgModule } from '@angular/core';

  import { AppComponent } from './app.component';

  // @NgModule decorator with its metadata
  @NgModule({
    declarations: [AppComponent],
    imports: [BrowserModule],
    providers: [],
    bootstrap: [AppComponent]
  })
  export class AppModule {}
  ```

  - `bootstrap`: The entry component that Angular creates and inserts into the index.html host web page, thereby bootstrapping the application. This entry component, AppComponent, appears in both the declarations and the bootstrap arrays.

## Launching apps with a root module

### The declarations array

- You must declare every component in exactly one NgModule class. If you use a component without declaring it, Angular returns an error message.

- The declarations array only takes declarables. Declarables are components, directives, and pipes. All of a module's declarables must be in the declarations array. Declarables must belong to exactly one module. The compiler emits an error if you try to declare the same class in more than one module.

  - An example of what goes into a declarations array follows:
    ```
    declarations: [
      YourComponent,
      YourPipe,
      YourDirective
    ],
    ```

- A declarable can only belong to one module, so only declare it in one @NgModule. When you need it elsewhere, import the module that contains the declarable you need.

#### Using directives with @NgModule

### The imports array

- The module's imports array appears exclusively in the @NgModule metadata object. It tells Angular about other NgModules that this particular module needs to function properly.

  - src/app/app.module.ts (excerpt)

    ```
    imports: [
      BrowserModule,
      FormsModule,
      HttpClientModule
    ],
    ```

  - This list of modules are those that export components, directives, or pipes that component templates in this module reference.

### The providers array

- The providers array is where you list the services the application needs. When you list services here, they are available app-wide. You can scope them when using feature modules and lazy loading.

### The bootstrap array

- The application launches by bootstrapping the root AppModule, which is also referred to as an entryComponent. Among other things, the bootstrapping process creates the component(s) listed in the bootstrap array and inserts each one into the browser DOM.

- Each bootstrapped component is the base of its own tree of components. Inserting a bootstrapped component usually triggers a cascade of component creations that fill out that tree.

- While you can put more than one component tree on a host web page, most applications have only one component tree and bootstrap a single root component.

  - This one root component is usually called `AppComponent` and is in the root module's `bootstrap` array.

- In a situation where you want to bootstrap a component based on an API response, or you want to mount the AppComponent in a different DOM node that doesn't match the component selector, please refer to `ApplicationRef.bootstrap()` documentation.

  - Example

    - Generally, we define the component to bootstrap in the bootstrap array of NgModule, but it requires us to know the component while writing the application code.
    - Imagine a situation where we have to wait for an API call to decide about the component to bootstrap. We can use the `ngDoBootstrap` hook of the NgModule and call this method to dynamically bootstrap a component.

      ```
      ngDoBootstrap(appRef: ApplicationRef) {
        this.fetchDataFromApi().then((componentName: string) => {
          if (componentName === 'ComponentOne') {
            appRef.bootstrap(ComponentOne);
          } else {
            appRef.bootstrap(ComponentTwo);
          }
        });
      }
      ```

    - Optionally, a component can be mounted onto a DOM element that does not match the selector of the bootstrapped component.

      - In the following example, we are providing a CSS selector to match the target element.

        ```
        ngDoBootstrap(appRef: ApplicationRef) {
          appRef.bootstrap(ComponentThree, '#root-element');
        }
        ```

      - While in this example, we are providing reference to a DOM node.
        ```
        ngDoBootstrap(appRef: ApplicationRef) {
          const element = document.querySelector('#root-element');
          appRef.bootstrap(ComponentFour, element);
        }
        ```

## Frequently used NgModules

- The following are frequently used Angular modules with examples of some of the things they contain:

| NGMODULE            | IMPORT IT FROM            | WHY YOU USE IT                                        |
| ------------------- | ------------------------- | ----------------------------------------------------- |
| BrowserModule       | @angular/platform-browser | To run your application in a browser.                 |
| CommonModule        | @angular/common           | To use NgIf and NgFor.                                |
| FormsModule         | @angular/forms            | To build template driven forms (includes NgModel).    |
| ReactiveFormsModule | @angular/forms            | To build reactive forms.                              |
| RouterModule        | @angular/router           | To use RouterLink, .forRoot(), and .forChild().       |
| HttpClientModule    | @angular/common/http      | To communicate with a server using the HTTP protocol. |

### Importing modules

- When you use these Angular modules, import them in AppModule, or your feature module as appropriate, and list them in the @NgModule imports array.

  ```
  /* import modules so that AppModule can access them */
  import { BrowserModule } from '@angular/platform-browser';
  import { NgModule } from '@angular/core';

  import { AppComponent } from './app.component';

  @NgModule({
    declarations: [
      AppComponent
    ],
    imports: [ /* add modules here so Angular knows to use them */
      BrowserModule,
    ],
    providers: [],
    bootstrap: [AppComponent]
  })
  export class AppModule { }
  ```

### BrowserModule and CommonModule

- `BrowserModule` imports `CommonModule`, which contributes many common directives such as `ngIf` and `ngFor`. Additionally, BrowserModule re-exports `CommonModule` making all of its directives available to any module that imports `BrowserModule`.

- For applications that run in the browser, import `BrowserModule` in the root AppModule because it provides services that are essential to launch and run a browser application. `BrowserModule`'s providers are for the whole application so it should only be in the root module, not in feature modules. Feature modules only need the common directives in `CommonModule`; they don't need to re-install app-wide providers.

  - If you do import `BrowserModule` into a lazy loaded feature module, Angular returns an error telling you to use `CommonModule` instead.

## Types of feature modules

### Guidelines for creating NgModules

- NgModules are a great way to organize an application and keep code related to a specific functionality or feature separate from other code.

- Use NgModules to consolidate components, directives, and pipes into cohesive blocks of functionality. Focus each block on a feature or business domain, a workflow or navigation flow, a common collection of utilities, or one or more providers for services.

### Summary of NgModule categories

- All applications start by bootstrapping a root NgModule.

- This topic provides some guidelines for the following general categories of NgModules:

  | CATEGORY | DETAILS                                                                                     |
  | -------- | ------------------------------------------------------------------------------------------- |
  | Domain   | Is organized around a feature, business domain, or user experience.                         |
  | Routed   | Is the top component of the NgModule. Acts as the destination of a router navigation route. |
  | Routing  | Provides the routing configuration for another NgModule.                                    |
  | Service  | Provides utility services such as data access and messaging.                                |
  | Widget   | Makes a component, directive, or pipe available to other NgModules.                         |
  | Shared   | Makes a set of components, directives, and pipes available to other NgModules.              |

- The following table summarizes the key characteristics of each category.

  | NGMODULE | DECLARATIONS | PROVIDERS    | EXPORTS       | IMPORTED BY                  |
  | -------- | ------------ | ------------ | ------------- | ---------------------------- |
  | Domain   | Yes          | Rare         | Top component | Another domain, AppModule    |
  | Routed   | Yes          | Rare         | No            | None                         |
  | Routing  | No           | Yes (Guards) | RouterModule  | Another domain (for routing) |
  | Service  | No           | Yes          | No            | AppModule                    |
  | Widget   | Yes          | Rare         | Yes           | Another domain               |
  | Shared   | Yes          | No           | Yes           | Another domain               |

### Domain NgModules

- Use a domain NgModule to deliver a user experience dedicated to a particular feature or application domain, such as editing a customer or placing an order.
  One example is `ContactModule`

- Your top component in the domain NgModule acts as the feature or domain's root, and is the only component you export.

- Domain NgModules consist mostly of declarations. You rarely include providers. If you do, the lifetime of the provided services should be the same as the lifetime of the NgModule.

### Routed NgModules

- Use a routed NgModule for all lazy-loaded NgModules. Use the top component of the NgModule as the destination of a router navigation route. Routed NgModules don't export anything because their components never appear in the template of an external component.

- Don't import a lazy-loaded routed NgModule into another NgModule, as this would trigger an eager load, defeating the purpose of lazy loading.

- Routed NgModules rarely have providers because you load a routed NgModule only when needed (such as for routing). Services listed in the NgModules' provider array would not be available because the root injector wouldn't know about the lazy-loaded NgModule.

### Routing NgModules

- Use a routing NgModule to provide the routing configuration for a domain NgModule, thereby separating routing concerns from its companion domain NgModule. One example is `ContactRoutingModule`

- Use a routing NgModule to do the following tasks:

  - Define routes
  - Add router configuration to the NgModule's import
  - Add guard and resolver service providers to the NgModule's providers

- The name of the routing NgModule should parallel the name of its companion NgModule, using the suffix `Routing`. For example, `ContactModul`e in `contact.module.ts` has a routing NgModule named `ContactRoutingModule` in `contact-routing.module.ts`.

- In your routing NgModule, re-export the RouterModule as a convenience so that components of the companion NgModule have access to router directives such as `RouterLink` and `RouterOutlet`.

- Don't use declarations in a routing NgModule. Components, directives, and pipes are the responsibility of the companion domain NgModule, not the routing NgModule.

### Service NgModules

- Use a service NgModule to provide a utility service such as data access or messaging. Ideal service NgModules consist entirely of providers and have no declarations. Angular's `HttpClientModule` is a good example of a service NgModule.

- Use only the root `AppModule` to import service NgModules.

### Widget NgModules

- Use a widget NgModule to make a component, directive, or pipe available to external NgModules. Import widget NgModules into any NgModules that need the widgets in their templates. Many third-party UI component libraries are provided as widget NgModules.

- A widget NgModule should consist entirely of declarations, most of them exported. It would rarely have providers.

### Shared NgModules

- Put commonly used directives, pipes, and components into one NgModule, typically named SharedModule, and then import just that NgModule wherever you need it in other parts of your application. You can import the shared NgModule in your domain NgModules, including lazy-loaded NgModules. One example is `SharedModule`, which provides the `AwesomePipe` custom pipe and `HighlightDirective` directive.

- Shared NgModules should not include providers, nor should any of its imported or re-exported NgModules include providers.

## Entry components

- Entry components are deprecated

- An entry component is any component that Angular loads imperatively, (which means you're not referencing it in the template), by type. You specify an entry component by bootstrapping it in an NgModule, or including it in a routing definition.

- To contrast the two types of components, there are components which are included in the template, which are declarative. Additionally, there are components which you load imperatively; that is, entry components.

- There are two main kinds of entry components:

  - The bootstrapped root component
  - A component you specify in a route definition

### A bootstrapped entry component

- The following is an example of specifying a bootstrapped component, AppComponent, in a basic app.module.ts:

  ```
  @NgModule({
    declarations: [
      AppComponent
    ],
    imports: [
      BrowserModule,
      FormsModule,
      HttpClientModule,
      AppRoutingModule
    ],
    providers: [],
    bootstrap: [AppComponent] // bootstrapped entry component
  })
  ```

- A bootstrapped component is an entry component that Angular loads into the DOM during the bootstrap process (application launch). Other entry components are loaded dynamically by other means, such as with the router.

- Angular loads a root AppComponent dynamically because it's listed by type in @NgModule.bootstrap.

- A component can also be bootstrapped imperatively in the module's ngDoBootstrap() method. The @NgModule.bootstrap property tells the compiler that this is an entry component and it should generate code to bootstrap the application with this component.

### A routed entry component

- The second kind of entry component occurs in a route definition like this:

  ```
  const routes: Routes = [
    {
      path: '',
      component: CustomerListComponent
    }
  ];
  ```

  - A route definition refers to a component by its type with component: CustomerListComponent.

- All router components must be entry components. Because this would require you to add the component in two places (router and entryComponents) the Compiler is smart enough to recognize that this is a router definition and automatically add the router component into entryComponents.

### The entryComponents array

- Since 9.0.0 with Ivy, the `entryComponents` property is no longer necessary.

- Though the @NgModule decorator has an entryComponents array, most of the time you won't have to explicitly set any entry components because Angular adds components listed in @NgModule.bootstrap and those in route definitions to entry components automatically. Though these two mechanisms account for most entry components, if your application happens to bootstrap or dynamically load a component by type imperatively, you must add it to entryComponents explicitly.

#### entryComponents and the compiler

- For production applications you want to load the smallest code possible. The code should contain only the classes that you actually need and exclude components that are never used. For this reason, the Angular compiler only generates code for components which are reachable from the entryComponents; This means that adding more references to @NgModule.declarations does not imply that they will necessarily be included in the final bundle.

- In fact, many libraries declare and export components you'll never use. For example, a material design library will export all components because it doesn't know which ones you will use. However, it is unlikely that you will use them all. For the ones you don't reference, the tree shaker drops these components from the final code package.

- If a component isn't an entry component and isn't found in a template, the tree shaker will throw it away. So, it's best to add only the components that are truly entry components to help keep your app as trim as possible.

## Feature modules

- Feature modules are NgModules for the purpose of organizing code.

- As your application grows, you can organize code relevant for a specific feature. This helps apply clear boundaries for features. With feature modules, you can keep code related to a specific functionality or feature separate from other code.

- Delineating areas of your application helps with collaboration between developers and teams, separating directives, and managing the size of the root module.

### Feature modules vs. root modules

- A feature module is an organizational best practice, as opposed to a concept of the core Angular API. A feature module delivers a cohesive set of functionality focused on a specific application need such as a user workflow, routing, or forms. While you can do everything within the root module, feature modules help you partition the application into focused areas. A feature module collaborates with the root module and with other modules through the services it provides and the components, directives, and pipes that it shares.

### How to make a feature module

- In CLI:

  ```
  ng generate module CustomerDashboard
  ```

- This causes the CLI to create a folder called customer-dashboard with a file inside called customer-dashboard.module.ts with the following contents:

  ```
  import { NgModule } from '@angular/core';
  import { CommonModule } from '@angular/common';

  @NgModule({
    imports: [
      CommonModule
    ],
    declarations: []
  })
  export class CustomerDashboardModule { }
  ```

  - The second imports `CommonModule`, which contributes many common directives such as `ngIf` and `ngFor`. Feature modules import `CommonModule` instead of `BrowserModule`, which is only imported once in the root module. `CommonModule` only contains information for common directives such as `ngIf` and `ngFor` which are needed in most templates, whereas `BrowserModule` configures the Angular application for the browser which needs to be done only once.

  - The `declarations` array is available for you to add declarables, which are components, directives, and pipes that belong exclusively to this particular module.

  - Create a component for a feature module

    ```
    ng generate component customer-dashboard/CustomerDashboard
    ```

    -This generates a folder for the new component within the customer-dashboard folder and updates the feature module with the CustomerDashboardComponent info:

    ```
    // import the new component
    import { CustomerDashboardComponent } from './customer-dashboard/customer-dashboard.component';

    @NgModule({
      imports: [
        CommonModule
      ],
      declarations: [
        CustomerDashboardComponent
      ],
    })
    ```

### Importing a feature module

- To incorporate the feature module into your app, you have to let the root module, app.module.ts, know about it.

- To import it into the AppModule, add it to the `imports` in `app.module.ts` and to the `imports` array:

  ```
  import { HttpClientModule } from '@angular/common/http';
  import { NgModule } from '@angular/core';
  import { FormsModule } from '@angular/forms';
  import { BrowserModule } from '@angular/platform-browser';

  import { AppComponent } from './app.component';
  // import the feature module here so you can add it to the imports array below
  import { CustomerDashboardModule } from './customer-dashboard/customer-dashboard.module';

  @NgModule({
    declarations: [
      AppComponent
    ],
    imports: [
      BrowserModule,
      FormsModule,
      HttpClientModule,
      CustomerDashboardModule // add the feature module here
    ],
    providers: [],
    bootstrap: [AppComponent]
  })
  export class AppModule { }
  ```

  - Now the AppModule knows about the feature module. If you were to add any service providers to the feature module, AppModule would know about those too, as would any other feature modules. However, NgModules don't expose their components by default.

### Rendering a feature module's component template

- In customer-dashboard.module.ts, just beneath the declarations array, add an exports array containing CustomerDashboardComponent:

- src/app/customer-dashboard/customer-dashboard.module.ts

  ```
  exports: [
    CustomerDashboardComponent
  ]
  ```

- Next, in the AppComponent, app.component.html, add the tag `<app-customer-dashboard>`:

  - src/app/app.component.html

    ```
    <h1>
      {{title}}
    </h1>

    <!-- add the selector from the CustomerDashboardComponent -->
    <app-customer-dashboard></app-customer-dashboard>
    ```

## Providing dependencies

- A provider is an instruction to the `Dependency Injection` system on how to obtain a value for a dependency. Most of the time, these dependencies are services that you create and provide.

### Providing a service

- In CLI:

  ```
  ng generate service User
  ```

  - This command creates the following UserService skeleton:

    - src/app/user.service.ts

      ```
      import { Injectable } from '@angular/core';

      @Injectable({
        providedIn: 'root',
      })
      export class UserService {
      }
      ```

  - You can now inject UserService anywhere in your application.

### Provider scope

- When you add a service provider to the root application injector, it's available throughout the application.

- Additionally, these providers are also available to all the classes in the application as long they have the lookup token.

- You should always provide your service in the root injector unless there is a case where you want the service to be available only if the consumer imports a particular @NgModule.

### providedIn and NgModules

- It's also possible to specify that a service should be provided in a particular @NgModule. For example, if you don't want UserService to be available to applications unless they import a UserModule you've created, you can specify that the service should be provided in the module:

  - src/app/user.service.ts

    ```
    import { Injectable } from '@angular/core';
    import { UserModule } from './user.module';

    @Injectable({
      providedIn: UserModule,
    })
    export class UserService {
    }
    ```

- The example above shows the preferred way to provide a service in a module. This method is preferred because it enables tree-shaking of the service if nothing injects it. If it's not possible to specify in the service which module should provide it, you can also declare a provider for the service within the module:

  - src/app/user.module.ts

    ```
    import { NgModule } from '@angular/core';

    import { UserService } from './user.service';

    @NgModule({
      providers: [UserService],
    })
    export class UserModule {
    }
    ```

### Limiting provider scope by lazy loading modules

- Angular uses an injector system to make things available between modules. In an eagerly loaded app, the root application injector makes all of the providers in all of the modules available throughout the application.

- This behavior necessarily changes when you use lazy loading. Lazy loading is when you load modules only when you need them; for example, when routing. They aren't loaded right away like with eagerly loaded modules. This means that any services listed in their provider arrays aren't available because the root injector doesn't know about these modules.

- When the Angular router lazy-loads a module, it creates a new injector. This injector is a child of the root application injector. Imagine a tree of injectors; there is a single root injector and then a child injector for each lazy loaded module. This child injector gets populated with all the module-specific providers, if any. Look up resolution for every provider follows the rules of dependency injection hierarchy.

- Any component created within a lazy loaded module's context, such as by router navigation, gets its own local instance of child provided services, not the instance in the root application injector. Components in external modules continue to receive the instances created for the application root injector.

- Though you can provide services by lazy loading modules, not all services can be lazy loaded. For instance, some modules only work in the root module, such as the Router. The Router works with the global location object in the browser.

- As of Angular version 9, you can provide a new instance of a service with each lazy loaded module. The following code adds this functionality to UserService.

  - src/app/user.service.ts

    ```
    import { Injectable } from '@angular/core';

    @Injectable({
      providedIn: 'any',
    })
    export class UserService {
    }
    ```

  - With `providedIn: 'any'`, all eagerly loaded modules share a singleton instance; however, lazy loaded modules each get their own unique instance, as shown in the following diagram.

    ![](https://angular.io/generated/images/guide/providers/any-provider.svg)

### Limiting provider scope with components

- Another way to limit provider scope is by adding the service you want to limit to the component's providers array. Component providers and NgModule providers are independent of each other. This method is helpful when you want to eagerly load a module that needs a service all to itself. Providing a service in the component limits the service only to that component and its descendants. Other components in the same module can't access it.

  - src/app/app.component.ts
    ```
    @Component({
      /* . . . */
      providers: [UserService]
    })
    ```

### Providing services in modules vs. components

- Generally, provide services the whole application needs in the root module and scope services by providing them in lazy loaded modules.

- The router works at the root level so if you put providers in a component, even AppComponent, lazy loaded modules, which rely on the router, can't see them.

- Register a provider with a component when you must limit a service instance to a component and its component tree, that is, its child components. For example, a user editing component, `UserEditorComponent`, that needs a private copy of a caching `UserService` should register the `UserService` with the `UserEditorComponent`. Then each new instance of the `UserEditorComponent` gets its own cached service instance.

### Injector hierarchy and service instances

- Services are singletons within the scope of an injector, which means there is at most one instance of a service in a given injector.

- Angular DI has a hierarchical injection system, which means that nested injectors can create their own service instances. Whenever Angular creates a new instance of a component that has providers specified in @Component(), it also creates a new child injector for that instance. Similarly, when a new NgModule is lazy-loaded at run time, Angular can create an injector for it with its own providers.

- Child modules and component injectors are independent of each other, and create their own separate instances of the provided services. When Angular destroys an NgModule or component instance, it also destroys that injector and that injector's service instances.

## Singleton services

- A singleton service is a service for which only one instance exists in an application.

### Providing a singleton service

- There are two ways to make a service a singleton in Angular:
  - Set the `providedIn` property of the `@Injectable()` to "root"
  - Include the service in the `AppModule` or in a module that is only imported by the `AppModule`

#### Using providedIn

- Beginning with Angular 6.0, the preferred way to create a singleton service is to set `providedIn` to `root` on the service's `@Injectable()` decorator. This tells Angular to provide the service in the application root.

  - src/app/user.service.ts

    ```
    import { Injectable } from '@angular/core';

    @Injectable({
      providedIn: 'root',
    })
    export class UserService {
    }
    ```

#### NgModule providers array

- In applications built with Angular versions prior to 6.0, services are registered NgModule `providers` arrays as follows:

  ```
  @NgModule({
  …
    providers: [UserService],
    …
  })
  ```

  - If this NgModule were the root AppModule, the UserService would be a singleton and available throughout the application. Though you may see it coded this way, using the providedIn property of the @Injectable() decorator on the service itself is preferable as of Angular 6.0 as it makes your services tree-shakable.

### The forRoot() pattern

- Generally, you'll only need `providedIn` for providing services and `forRoot()`/`forChild()` for routing.

- If a module defines both providers and declarations (components, directives, pipes), then loading the module in multiple feature modules would duplicate the registration of the service. This could result in multiple service instances and the service would no longer behave as a singleton.

  - There are multiple ways to prevent this:

    - Use the `providedIn` syntax instead of registering the service in the module.
    - Separate your services into their own module.
    - Define `forRoot()` and `forChild()` methods in the module.

  - Use `forRoot()` to separate providers from a module so you can import that module into the root module with `providers` and child modules without `providers`.

    1. Create a static method forRoot() on the module.
    2. Place the providers into the forRoot() method.

    - src/app/greeting/greeting.module.ts
      ```
      static forRoot(config: UserServiceConfig): ModuleWithProviders<GreetingModule> {
        return {
          ngModule: GreetingModule,
          providers: [
            {provide: UserServiceConfig, useValue: config }
          ]
        };
      }
      ```

#### forRoot() and the Router

- `RouterModule` provides the `Router` service, as well as router directives, such as `RouterOutlet` and `routerLink`. The root application module imports `RouterModule` so that the application has a `Router` and the root application components can access the router directives. Any feature modules must also import `RouterModule` so that their components can place router directives into their templates.

- If the `RouterModule` didn't have `forRoot()` then each feature module would instantiate a new `Router` instance, which would break the application as there can only be one `Router`. By using the `forRoot()` method, the root application module imports `RouterModule.forRoot(...)` and gets a `Router`, and all feature modules import `RouterModule.forChild(...)` which does not instantiate another `Router`.

- NOTE:
  - If you have a module which has both providers and declarations, you can use this technique to separate them out and you may see this pattern in legacy applications. However, since Angular 6.0, the best practice for providing services is with the @Injectable() providedIn property.

#### How forRoot() works

- `forRoot()` takes a service configuration object and returns a `ModuleWithProviders`, which is a simple object with the following properties:

  | PROPERTIES | DETAILS                                   |
  | ---------- | ----------------------------------------- |
  | ngModule   | In this example, the GreetingModule class |
  | providers  | The configured providers                  |

- src/app/greeting/user.service.ts(constructor)

  ```
  constructor(@Optional() config?: UserServiceConfig) {
    if (config) { this._userName = config.userName; }
  }
  ```

- src/app/greeting/greeting.module.ts (forRoot)

  ```
  static forRoot(config: UserServiceConfig): ModuleWithProviders<GreetingModule> {
    return {
      ngModule: GreetingModule,
      providers: [
        {provide: UserServiceConfig, useValue: config }
      ]
    };
  }
  ```

- src/app/app.module.ts (imports)
  ```
  import { GreetingModule } from './greeting/greeting.module';
  @NgModule({
    imports: [
      GreetingModule.forRoot({userName: 'Miss Marple'}),
    ],
  })
  ```
- The application displays "Miss Marple" as the user instead of the default "Sherlock Holmes".

- Remember to import `GreetingModule` as a Javascript import at the top of the file and don't add it to more than one `@NgModule` `imports` list.

### Prevent reimport of the GreetingModule

- Only the root `AppModule` should import the `GreetingModule`. If a lazy-loaded module imports it too, the application can generate multiple instances of a service.

- To guard against a lazy loaded module re-importing `GreetingModule`, add the following `GreetingModule` constructor.

  - src/app/greeting/greeting.module.ts

    ```
    constructor(@Optional() @SkipSelf() parentModule?: GreetingModule) {
      if (parentModule) {
        throw new Error(
          'GreetingModule is already loaded. Import it in the AppModule only');
      }
    }
    ```

  - The constructor tells Angular to inject the GreetingModule into itself. The injection would be circular if Angular looked for GreetingModule in the current injector, but the @SkipSelf() decorator means "look for GreetingModule in an ancestor injector, above me in the injector hierarchy."

  - By default, the injector throws an error when it can't find a requested provider. The @Optional() decorator means not finding the service is OK. The injector returns null, the parentModule parameter is null, and the constructor concludes uneventfully.

  - It's a different story if you improperly import GreetingModule into a lazy loaded module such as CustomersModule.

  - Angular creates a lazy loaded module with its own injector, a child of the root injector. @SkipSelf() causes Angular to look for a GreetingModule in the parent injector, which this time is the root injector. Of course it finds the instance imported by the root AppModule. Now parentModule exists and the constructor throws the error.

- Here are the two files in their entirety for reference:

  - app.module.ts

    ```
    import { BrowserModule } from '@angular/platform-browser';
    import { NgModule } from '@angular/core';

    /* App Root */
    import { AppComponent } from './app.component';

    /* Feature Modules */
    import { ContactModule } from './contact/contact.module';
    import { GreetingModule } from './greeting/greeting.module';

    /* Routing Module */
    import { AppRoutingModule } from './app-routing.module';

    @NgModule({
      imports: [
        BrowserModule,
        ContactModule,
        GreetingModule.forRoot({userName: 'Miss Marple'}),
        AppRoutingModule
      ],
      declarations: [
        AppComponent
      ],
      bootstrap: [AppComponent]
    })
    export class AppModule { }
    ```

  - greeting.module.ts

    ```
    import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';

    import { CommonModule } from '@angular/common';

    import { GreetingComponent } from './greeting.component';
    import { UserServiceConfig } from './user.service';


    @NgModule({
      imports:      [ CommonModule ],
      declarations: [ GreetingComponent ],
      exports:      [ GreetingComponent ]
    })
    export class GreetingModule {
      constructor(@Optional() @SkipSelf() parentModule?: GreetingModule) {
        if (parentModule) {
          throw new Error(
            'GreetingModule is already loaded. Import it in the AppModule only');
        }
      }

      static forRoot(config: UserServiceConfig): ModuleWithProviders<GreetingModule> {
        return {
          ngModule: GreetingModule,
          providers: [
            {provide: UserServiceConfig, useValue: config }
          ]
        };
      }
    }
    ```

## Sharing NgModules

- Creating shared modules allows you to organize and streamline your code. You can put commonly used directives, pipes, and components into one module and then import just that module wherever you need it in other parts of your application.

- Consider the following module from an imaginary app:

  ```
  import { CommonModule } from '@angular/common';
  import { NgModule } from '@angular/core';
  import { FormsModule } from '@angular/forms';
  import { CustomerComponent } from './customer.component';
  import { NewItemDirective } from './new-item.directive';
  import { OrdersPipe } from './orders.pipe';

  @NgModule({
  imports:      [ CommonModule ],
  declarations: [ CustomerComponent, NewItemDirective, OrdersPipe ],
  exports:      [ CustomerComponent, NewItemDirective, OrdersPipe,
                  CommonModule, FormsModule ]
  })
  export class SharedModule { }
  ```

- Notice the following:

  - It imports the `CommonModule` because the module's component needs common directives
  - It declares and exports the utility pipe, directive, and component classes
  - It re-exports the `CommonModule` and `FormsModule`

- By re-exporting `CommonModule` and `FormsModule`, any other module that imports this `SharedModule`, gets access to directives like `NgIf` and `NgFor` from `CommonModule` and can bind to component properties with `[(ngModel)]`, a directive in the `FormsModule`.

- Even though the components declared by `SharedModule` might not bind with [(ngModel)] and there may be no need for `SharedModule` to import `FormsModule`, `SharedModule` can still export `FormsModule` without listing it among its imports. This way, you can give other modules access to `FormsModule` without having to import it directly into the `@NgModule` decorator.

## NgModule API

- At a high level, NgModules are a way to organize Angular applications and they accomplish this through the metadata in the `@NgModule` decorator. The metadata falls into three categories:

  | CATEGORY                 | DETAILS                                                                                                                                                                                                       |
  | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
  | Static                   | Compiler configuration which tells the compiler about directive selectors and where in templates the directives should be applied through selector matching. This is configured using the declarations array. |
  | Runtime                  | Injector configuration using the providers array.                                                                                                                                                             |
  | Composability / Grouping | Bringing NgModules together and making them available using the `imports` and `exports` arrays.                                                                                                               |

  ```
  @NgModule({
    // Static, that is compiler configuration
    declarations: [], // Configure the selectors

    // Runtime, or injector configuration
    providers: [], // Runtime injector configuration

    // Composability / Grouping
    imports: [], // composing NgModules together
    exports: [] // making NgModules available to other parts of the app
  })
  ```

### @NgModule metadata

- The following table summarizes the `@NgModule` metadata properties.

  | PROPERTY     | DETAILS                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
  | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
  | declarations | A list of declarable classes (components, directives, and pipes) that belong to this module. <br> 1. When compiling a template, you need to determine a set of selectors which should be used for triggering their corresponding directives. <br>2. The template is compiled within the context of an NgModule —the NgModule within which the template's component is declared— which determines the set of selectors using the following rules:\n- All selectors of directives listed in declarations.\n- All selectors of directives exported from imported NgModules. Components, directives, and pipes must belong to exactly one module. The compiler emits an error if you try to declare the same class in more than one module. Be careful not to re-declare a class that is imported directly or indirectly from another module.                                                                                                                                                                                                              |
  | providers    | A list of dependency-injection providers.<br>Angular registers these providers with the NgModule's injector. If it is the NgModule used for bootstrapping then it is the root injector. These services become available for injection into any component, directive, pipe or service which is a child of this injector.<br>A lazy-loaded module has its own injector which is typically a child of the application root injector. Lazy-loaded services are scoped to the lazy module's injector. If a lazy-loaded module also provides the UserService, any component created within that module's context (such as by router navigation) gets the local instance of the service, not the instance in the root application injector. Components in external modules continue to receive the instance provided by their injectors. For more information on injector hierarchy and scoping, see [Providers](https://angular.io/guide/providers) and the [DI Guide](https://angular.io/guide/dependency-injection).                                       |
  | imports      | A list of modules which should be folded into this module. Folded means it is as if all the imported NgModule's exported properties were declared here. Specifically, it is as if the list of modules whose exported components, directives, or pipes are referenced by the component templates were declared in this module. A component template can reference another component, directive, or pipe when the reference is declared in this module or if the imported module has exported it. For example, a component can use the NgIf and NgFor directives only if the module has imported the Angular CommonModule (perhaps indirectly by importing BrowserModule). You can import many standard directives from the CommonModule but some familiar directives belong to other modules. For example, you can use [(ngModel)] only after importing the Angular FormsModule.                                                                                                                                                                        |
  | exports      | A list of declarations —component, directive, and pipe classes— that an importing module can use. Exported declarations are the module's public API. A component in another module can use this module's `UserComponent` if it imports this module and this module exports `UserComponent`. Declarations are private by default. If this module does not export `UserComponent`, then only the components within this module can use `UserComponent`. Importing a module does not automatically re-export the imported module's imports. Module 'B' can't use `ngIf` just because it imported module 'A' which imported `CommonModule`. Module 'B' must import `CommonModule` itself. A module can list another module among its exports, in which case all of that module's public components, directives, and pipes are exported. Re-export makes module transitivity explicit. If Module 'A' re-exports `CommonModule` and Module 'B' imports Module 'A', Module 'B' components can use `ngIf` even though 'B' itself didn't import `CommonModule`. |
  | bootstrap    | A list of components that are automatically bootstrapped. Usually there's only one component in this list, the root component of the application. Angular can launch with multiple bootstrap components, each with its own location in the host web page.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |

## NgModule FAQs

- NgModules help organize an application into cohesive blocks of functionality.

### What classes should I add to the declarations array?

- Add declarable classes —components, directives, and pipes— to a declarations list.

- Declare these classes in exactly one module of the application. Declare them in a module if they belong to that particular module.

### What is a declarable?

- Declarables are the class types —components, directives, and pipes— that you can add to a module's declarations list. They're the only classes that you can add to declarations.

### What classes should I not add to declarations?

- Add only declarable classes to an NgModule's declarations list.

- Do not declare the following:

  - A class that's already declared in another module, whether an application module, @NgModule, or third-party module.

  - An array of directives imported from another module. For example, don't declare FORMS_DIRECTIVES from @angular/forms because the FormsModule already declares it.

  - Module classes.

  - Service classes.

  - Non-Angular classes and objects, such as strings, numbers, functions, entity models, configurations, business logic, and helper classes.

### Why list the same component in multiple NgModule properties?

- AppComponent is often listed in both declarations and bootstrap. You might see the same component listed in declarations and exports.

- While that seems redundant, these properties have different functions. Membership in one list doesn't imply membership in another list.

  - AppComponent could be declared in this module but not bootstrapped.
  - AppComponent could be bootstrapped in this module but declared in a different feature module.
  - A component could be imported from another application module (so you can't declare it) and re-exported by this module.
  - A component could be exported for inclusion in an external component's template as well as dynamically loaded in a pop-up dialog.

### What does "Can't bind to 'x' since it isn't a known property of 'y'" mean?

- This error often means that you haven't declared the directive "x" or haven't imported the NgModule to which "x" belongs.

  - Perhaps you declared "x" in an application submodule but forgot to export it. The "x" class isn't visible to other modules until you add it to the exports list.

### What should I import?

- Import NgModules whose public (exported) declarable classes you need to reference in this module's component templates.

- This always means importing `CommonModule` from `@angular/common` for access to the Angular directives such as `NgIf` and `NgFor`. You can import it directly or from another NgModule that re-exports it.

- Import `FormsModule` from `@angular/forms` if your components have `[(ngModel)]` two-way binding expressions.

- Import shared and feature modules when this module's components incorporate their components, directives, and pipes.

- Import `BrowserModule` only in the root `AppModule`.

### Should I import BrowserModule or CommonModule?

- The root application module, AppModule, of almost every browser application should import BrowserModule from @angular/platform-browser.

- BrowserModule provides services that are essential to launch and run a browser application.

- BrowserModule also re-exports CommonModule from @angular/common, which means that components in the AppModule also have access to the Angular directives every application needs, such as NgIf and NgFor.

- Do not import BrowserModule in any other module. Feature modules and lazy-loaded modules should import CommonModule instead. They need the common directives. They don't need to re-install the app-wide providers.

- Importing CommonModule also frees feature modules for use on any target platform, not just browsers.

### What if I import the same module twice?

- That's not a problem. When three modules all import Module 'A', Angular evaluates Module 'A' once, the first time it encounters it, and doesn't do so again.

- That's true at whatever level A appears in a hierarchy of imported NgModules. When Module 'B' imports Module 'A', Module 'C' imports 'B', and Module 'D' imports [C, B, A], then 'D' triggers the evaluation of 'C', which triggers the evaluation of 'B', which evaluates 'A'. When Angular gets to the 'B' and 'A' in 'D', they're already cached and ready to go.

- Angular doesn't like NgModules with circular references, so don't let Module 'A' import Module 'B', which imports Module 'A'.

### What should I export?

- Export declarable classes that components in other NgModules are able to reference in their templates. These are your public classes. If you don't export a declarable class, it stays private, visible only to other components declared in this NgModule.

- You can export any declarable class —components, directives, and pipes— whether it's declared in this NgModule or in an imported NgModule.

- You can re-export entire imported NgModules, which effectively re-export all of their exported classes. An NgModule can even export a module that it doesn't import.

### What should I not export?

- Don't export the following:

  - Private components, directives, and pipes that you need only within components declared in this NgModule. If you don't want another NgModule to see it, don't export it.

  - Non-declarable objects such as services, functions, configurations, and entity models.

  - Components that are only loaded dynamically by the router or by bootstrapping. Such entry components can never be selected in another component's template. While there's no harm in exporting them, there's also no benefit.

  - Pure service modules that don't have public (exported) declarations. For example, there's no point in re-exporting HttpClientModule because it doesn't export anything. Its only purpose is to add http service providers to the application as a whole.

### Can I re-export classes and modules?

- Absolutely.

- NgModules are a great way to selectively aggregate classes from other NgModules and re-export them in a consolidated, convenience module.

- An NgModule can re-export entire NgModules, which effectively re-exports all of their exported classes. Angular's own BrowserModule exports a couple of NgModules like this:

  ```
  exports: [CommonModule, ApplicationModule]
  ```

- An NgModule can export a combination of its own declarations, selected imported classes, and imported NgModules.

- Don't bother re-exporting pure service modules. Pure service modules don't export declarable classes that another NgModule could use. For example, there's no point in re-exporting HttpClientModule because it doesn't export anything. Its only purpose is to add http service providers to the application as a whole.

### What is the forRoot() method?

- The forRoot() static method is a convention that makes it easy for developers to configure services and providers that are intended to be singletons. A good example of forRoot() is the RouterModule.forRoot() method.

- Applications pass a Routes array to RouterModule.forRoot() in order to configure the app-wide Router service with routes. RouterModule.forRoot() returns a ModuleWithProviders. You add that result to the imports list of the root AppModule.

- Only call and import a forRoot() result in the root application module, AppModule. Avoid importing it in any other module, particularly in a lazy-loaded module. For more information on forRoot() see the forRoot() pattern section of the Singleton Services guide.

- NOTE:
  The forRoot() import can be used in a module other than AppModule. Importantly, forRoot() should only be called once, and the module that imports the forRoot() needs to be available to the root ModuleInjector. For more information, refer to the guide on Hierarchical injectors.

- For a service, instead of using forRoot(), specify providedIn: 'root' on the service's @Injectable() decorator, which makes the service automatically available to the whole application and thus singleton by default.

- RouterModule also offers a forChild() static method for configuring the routes of lazy-loaded modules.

- forRoot() and forChild() are conventional names for methods that configure services in root and feature modules respectively.

- Follow this convention when you write similar modules with configurable service providers.

### Why is a service provided in a feature module visible everywhere?

Providers listed in the @NgModule.providers of a bootstrapped module have application scope. Adding a service provider to @NgModule.providers effectively publishes the service to the entire application.

When you import an NgModule, Angular adds the module's service providers (the contents of its providers list) to the application root injector.

This makes the provider visible to every class in the application that knows the provider's lookup token, or name.

Extensibility through NgModule imports is a primary goal of the NgModule system. Merging NgModule providers into the application injector makes it easy for a module library to enrich the entire application with new services. By adding the HttpClientModule once, every application component can make HTTP requests.

However, this might feel like an unwelcome surprise if you expect the module's services to be visible only to the components declared by that feature module. If the HeroModule provides the HeroService and the root AppModule imports HeroModule, any class that knows the HeroService type can inject that service, not just the classes declared in the HeroModule.

To limit access to a service, consider lazy loading the NgModule that provides that service. See How do I restrict service scope to a module? for more information.

### Why is a service provided in a lazy-loaded module visible only to that module?

Unlike providers of the modules loaded at launch, providers of lazy-loaded modules are module-scoped.

When the Angular router lazy-loads a module, it creates a new execution context. That context has its own injector, which is a direct child of the application injector.

The router adds the lazy module's providers and the providers of its imported NgModules to this child injector.

These providers are insulated from changes to application providers with the same lookup token. When the router creates a component within the lazy-loaded context, Angular prefers service instances created from these providers to the service instances of the application root injector.

### What if two modules provide the same service?

When two imported modules, loaded at the same time, list a provider with the same token, the second module's provider "wins". That's because both providers are added to the same injector.

When Angular looks to inject a service for that token, it creates and delivers the instance created by the second provider.

Every class that injects this service gets the instance created by the second provider. Even classes declared within the first module get the instance created by the second provider.

If NgModule A provides a service for token 'X' and imports an NgModule B that also provides a service for token 'X', then NgModule A's service definition "wins".

The service provided by the root AppModule takes precedence over services provided by imported NgModules. The AppModule always wins.

### How do I restrict service scope to a module?

When a module is loaded at application launch, its @NgModule.providers have application-wide scope; that is, they are available for injection throughout the application.

Imported providers are easily replaced by providers from another imported NgModule. Such replacement might be by design. It could be unintentional and have adverse consequences.

As a general rule, import modules with providers exactly once, preferably in the application's root module. That's also usually the best place to configure, wrap, and override them.

Suppose a module requires a customized HttpBackend that adds a special header for all Http requests. If another module elsewhere in the application also customizes HttpBackend or merely imports the HttpClientModule, it could override this module's HttpBackend provider, losing the special header. The server will reject http requests from this module.

To avoid this problem, import the HttpClientModule only in the AppModule, the application root module.

If you must guard against this kind of "provider corruption", don't rely on a launch-time module's providers.

Load the module lazily if you can. Angular gives a lazy-loaded module its own child injector. The module's providers are visible only within the component tree created with this injector.

If you must load the module eagerly, when the application starts, provide the service in a component instead.

Continuing with the same example, suppose the components of a module truly require a private, custom HttpBackend.

Create a "top component" that acts as the root for all of the module's components. Add the custom HttpBackend provider to the top component's providers list rather than the module's providers. Recall that Angular creates a child injector for each component instance and populates the injector with the component's own providers.

When a child of this component asks for the HttpBackend service, Angular provides the local HttpBackend service, not the version provided in the application root injector. Child components make proper HTTP requests no matter what other modules do to HttpBackend.

Be sure to create module components as children of this module's top component.

You can embed the child components in the top component's template. Alternatively, make the top component a routing host by giving it a `<router-outlet>`. Define child routes and let the router load module components into that outlet.

Though you can limit access to a service by providing it in a lazy loaded module or providing it in a component, providing services in a component can lead to multiple instances of those services. Thus, the lazy loading is preferable.

### Should I add application-wide providers to the root AppModule or the root AppComponent?

Define application-wide providers by specifying providedIn: 'root' on its @Injectable() decorator (in the case of services) or at InjectionToken construction (in the case where tokens are provided). Providers that are created this way automatically are made available to the entire application and don't need to be listed in any module.

If a provider cannot be configured in this way (perhaps because it has no sensible default value), then register application-wide providers in the root AppModule, not in the AppComponent.

Lazy-loaded modules and their components can inject AppModule services; they can't inject AppComponent services.

Register a service in AppComponent providers only if the service must be hidden from components outside the AppComponent tree. This is a rare use case.

More generally, prefer registering providers in NgModules to registering in components.

#### Discussion

Angular registers all startup module providers with the application root injector. The services that root injector providers create have application scope, which means they are available to the entire application.

Certain services, such as the Router, only work when you register them in the application root injector.

By contrast, Angular registers AppComponent providers with the AppComponent's own injector. AppComponent services are available only to that component and its component tree. They have component scope.

The AppComponent's injector is a child of the root injector, one down in the injector hierarchy. For applications that don't use the router, that's almost the entire application. But in routed applications, routing operates at the root level where AppComponent services don't exist. This means that lazy-loaded modules can't reach them.

### Should I add other providers to a module or a component?

Providers should be configured using @Injectable syntax. If possible, they should be provided in the application root (providedIn: 'root'). Services that are configured this way are lazily loaded if they are only used from a lazily loaded context.

If it's the consumer's decision whether a provider is available application-wide or not, then register providers in modules (@NgModule.providers) instead of registering in components (@Component.providers).

Register a provider with a component when you must limit the scope of a service instance to that component and its component tree. Apply the same reasoning to registering a provider with a directive.

For example, an editing component that needs a private copy of a caching service should register the service with the component. Then each new instance of the component gets its own cached service instance. The changes that editor makes in its service don't touch the instances elsewhere in the application.

Always register application-wide services with the root AppModule, not the root AppComponent.

### Why is it bad if a shared module provides a service to a lazy-loaded module?

#### The eagerly loaded scenario

When an eagerly loaded module provides a service, for example a UserService, that service is available application-wide. If the root module provides UserService and imports another module that provides the same UserService, Angular registers one of them in the root application injector (see What if I import the same module twice?).

Then, when some component injects UserService, Angular finds it in the application root injector, and delivers the app-wide singleton service. No problem.

#### The lazy loaded scenario

Now consider a lazy loaded module that also provides a service called UserService.

When the router lazy loads a module, it creates a child injector and registers the UserService provider with that child injector. The child injector is not the root injector.

When Angular creates a lazy component for that module and injects UserService, it finds a UserService provider in the lazy module's child injector and creates a new instance of the UserService. This is an entirely different UserService instance than the app-wide singleton version that Angular injected in one of the eagerly loaded components.

This scenario causes your application to create a new instance every time, instead of using the singleton.

### Why does lazy loading create a child injector?

Angular adds @NgModule.providers to the application root injector, unless the NgModule is lazy-loaded. For a lazy-loaded NgModule, Angular creates a child injector and adds the module's providers to the child injector.

This means that an NgModule behaves differently depending on whether it's loaded during application start or lazy-loaded later. Neglecting that difference can lead to adverse consequences.

Why doesn't Angular add lazy-loaded providers to the application root injector as it does for eagerly loaded NgModules?

The answer is grounded in a fundamental characteristic of the Angular dependency-injection system. An injector can add providers until it's first used. Once an injector starts creating and delivering services, its provider list is frozen; no new providers are allowed.

When an application starts, Angular first configures the root injector with the providers of all eagerly loaded NgModules before creating its first component and injecting any of the provided services. Once the application begins, the application root injector is closed to new providers.

Time passes and application logic triggers lazy loading of an NgModule. Angular must add the lazy-loaded module's providers to an injector somewhere. It can't add them to the application root injector because that injector is closed to new providers. So Angular creates a new child injector for the lazy-loaded module context.

### How can I tell if an NgModule or service was previously loaded?

Some NgModules and their services should be loaded only once by the root AppModule. Importing the module a second time by lazy loading a module could produce errant behavior that may be difficult to detect and diagnose.

To prevent this issue, write a constructor that attempts to inject the module or service from the root application injector. If the injection succeeds, the class has been loaded a second time. You can throw an error or take other remedial action.

Certain NgModules, such as BrowserModule, implement such a guard. Here is a custom constructor for an NgModule called GreetingModule.

- src/app/greeting/greeting.module.ts (Constructor)
  ```
  constructor(@Optional() @SkipSelf() parentModule?: GreetingModule) {
    if (parentModule) {
      throw new Error(
        'GreetingModule is already loaded. Import it in the AppModule only');
    }
  }
  ```

### What is an entry component?

An entry component is any component that Angular loads imperatively by type.

A component loaded declaratively by way of its selector is not an entry component.

Angular loads a component declaratively when using the component's selector to locate the element in the template. Angular then creates the HTML representation of the component and inserts it into the DOM at the selected element. These aren't entry components.

The bootstrapped root AppComponent is an entry component. True, its selector matches an element tag in index.html. But index.html isn't a component template and the AppComponent selector doesn't match an element in any component template.

Components in route definitions are also entry components. A route definition refers to a component by its type. The router ignores a routed component's selector, if it even has one, and loads the component dynamically into a RouterOutlet.

For more information, see Entry Components.

### What kinds of modules should I have and how should I use them?

Every application is different. Developers have various levels of experience and comfort with the available choices. Some suggestions and guidelines appear to have wide appeal.

#### SharedModule

SharedModule is a conventional name for an NgModule with the components, directives, and pipes that you use everywhere in your application. This module should consist entirely of declarations, most of them exported.

The SharedModule may re-export other widget modules, such as CommonModule, FormsModule, and NgModules with the UI controls that you use most widely.

The SharedModule should not have providers for reasons explained previously. Nor should any of its imported or re-exported modules have providers.

Import the SharedModule in your feature modules, both those loaded when the application starts and those you lazy load later.

#### Feature Modules

Feature modules are modules you create around specific application business domains, user workflows, and utility collections. They support your application by containing a particular feature, such as routes, services, widgets, etc. To conceptualize what a feature module might be in your app, consider that if you would put the files related to a certain functionality, like a search, in one folder, that the contents of that folder would be a feature module that you might call your SearchModule. It would contain all of the components, routing, and templates that would make up the search functionality.

For more information, see Feature Modules and Module Types

### What's the difference between NgModules and JavaScript Modules?

In an Angular app, NgModules and JavaScript modules work together.

In modern JavaScript, every file is a module (see the Modules page of the Exploring ES6 website). Within each file you write an export statement to make parts of the module public.

An Angular NgModule is a class with the @NgModule decorator —JavaScript modules don't have to have the @NgModule decorator. Angular's NgModule has imports and exports and they serve a similar purpose.

You import other NgModules so you can use their exported classes in component templates. You export this NgModule's classes so they can be imported and used by components of other NgModules.

For more information, see JavaScript Modules vs. NgModules.

### How does Angular find components, directives, and pipes in a template? What is a template reference?

The Angular compiler looks inside component templates for other components, directives, and pipes. When it finds one, that's a template reference.

The Angular compiler finds a component or directive in a template when it can match the selector of that component or directive to some HTML in that template.

The compiler finds a pipe if the pipe's name appears within the pipe syntax of the template HTML.

Angular only matches selectors and pipe names for classes that are declared by this module or exported by a module that this module imports.

### What is the Angular compiler?

The Angular compiler converts the application code you write into highly performant JavaScript code. The @NgModule metadata plays an important role in guiding the compilation process.

The code you write isn't immediately executable. For example, components have templates that contain custom elements, attribute directives, Angular binding declarations, and some peculiar syntax that clearly isn't native HTML.

The Angular compiler reads the template markup, combines it with the corresponding component class code, and emits component factories.

A component factory creates a pure, 100% JavaScript representation of the component that incorporates everything described in its @Component metadata: The HTML, the binding instructions, the attached styles.

Because directives and pipes appear in component templates, the Angular compiler incorporates them into compiled component code too.

@NgModule metadata tells the Angular compiler what components to compile for this module and how to link this module with other modules.

# Lazy-loading feature modules

- By default, NgModules are eagerly loaded, which means that as soon as the application loads, so do all the NgModules, whether or not they are immediately necessary. For large applications with lots of routes, consider lazy loading —a design pattern that loads NgModules as needed. Lazy loading helps keep initial bundle sizes smaller, which in turn helps decrease load times.

## Lazy loading basics

- To lazy load Angular modules, use loadChildren (instead of component) in your AppRoutingModule routes configuration as follows.

  - AppRoutingModule (excerpt)
    ```
    const routes: Routes = [
      {
        path: 'items',
        loadChildren: () => import('./items/items.module').then(m => m.ItemsModule)
      }
    ];
    ```

- In the lazy-loaded module's routing module, add a route for the component.

  - Routing module for lazy loaded module (excerpt)
    ```
    const routes: Routes = [
      {
        path: '',
        component: ItemsComponent
      }
    ];
    ```

- Also be sure to remove the `ItemsModule` from the `AppModule`.

## Step-by-step setup

- There are two main steps to setting up a lazy-loaded feature module:
  1. Create the feature module with the CLI, using the --route flag.
  2. Configure the routes.

### Set up an app

- If you don't already have an app, follow the following steps to create one with the CLI.
  ```
  ng new customer-app --routing
  ```

### Create a feature module with routing

- Next, you'll need a feature module with a component to route to.

  ```
  ng generate module customers --route customers --module app.module
  ```

  - This creates a customers folder having the new lazy-loadable feature module CustomersModule defined in the customers.module.ts file and the routing module CustomersRoutingModule defined in the customers-routing.module.ts file. The command automatically declares the CustomersComponent and imports CustomersRoutingModule inside the new feature module.

  - Because the new module is meant to be lazy-loaded, the command does NOT add a reference to the new feature module in the application's root module file, app.module.ts. Instead, it adds the declared route, customers to the routes array declared in the module provided as the --module option.

  - src/app/app-routing.module.ts

    ```
    const routes: Routes = [
      {
        path: 'customers',
        loadChildren: () => import('./customers/customers.module').then(m => m.CustomersModule)
      }
    ];
    ```

    - Notice that the lazy-loading syntax uses loadChildren followed by a function that uses the browser's built-in import('...') syntax for dynamic imports. The import path is the relative path to the module.

    - STRING-BASED LAZY LOADING

      - In Angular version 8, the string syntax for the loadChildren route specification was deprecated in favor of the import() syntax. However, you can opt into using string-based lazy loading (loadChildren: './path/to/module#Module') by including the lazy-loaded routes in your tsconfig file, which includes the lazy-loaded files in the compilation.

      - By default the CLI generates projects with stricter file inclusions intended to be used with the import() syntax.

### Add another feature module

- Use the same command to create a second lazy-loaded feature module with routing, along with its stub component.

  ```
  ng generate module orders --route orders --module app.module
  ```

  - This creates a new folder called orders containing the OrdersModule and OrdersRoutingModule, along with the new OrdersComponent source files. The orders route, specified with the --route option, is added to the routes array inside the app-routing.module.ts file, using the lazy-loading syntax.

    - src/app/app-routing.module.ts
      ```
      const routes: Routes = [
        {
          path: 'customers',
          loadChildren: () => import('./customers/customers.module').then(m => m.CustomersModule)
        },
        {
          path: 'orders',
          loadChildren: () => import('./orders/orders.module').then(m => m.OrdersModule)
        }
      ];
      ```

### Set up the UI

- src/app/app.component.html

  ```
  <h1>
    {{title}}
  </h1>

  <button type="button" routerLink="/customers">Customers</button>
  <button type="button" routerLink="/orders">Orders</button>
  <button type="button" routerLink="">Home</button>

  <router-outlet></router-outlet>
  ```

### Imports and route configuration

- src/app/app-routing.module.ts

  ```
  const routes: Routes = [
    {
      path: 'customers',
      loadChildren: () => import('./customers/customers.module').then(m => m.CustomersModule)
    },
    {
      path: 'orders',
      loadChildren: () => import('./orders/orders.module').then(m => m.OrdersModule)
    },
    {
      path: '',
      redirectTo: '',
      pathMatch: 'full'
    }
  ];
  ```

  - The first two paths are the routes to the CustomersModule and the OrdersModule. The final entry defines a default route. The empty path matches everything that doesn't match an earlier path.

### Inside the feature module

- src/app/customers/customers.module.ts

  ```
  import { NgModule } from '@angular/core';
  import { CommonModule } from '@angular/common';
  import { CustomersRoutingModule } from './customers-routing.module';
  import { CustomersComponent } from './customers.component';

  @NgModule({
    imports: [
      CommonModule,
      CustomersRoutingModule
    ],
    declarations: [CustomersComponent]
  })
  export class CustomersModule { }
  ```

- src/app/customers/customers-routing.module.ts
  import { NgModule } from '@angular/core';
  import { Routes, RouterModule } from '@angular/router';

  import { CustomersComponent } from './customers.component';

  const routes: Routes = [
  {
  path: '',
  component: CustomersComponent
  }
  ];

  @NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
  })
  export class CustomersRoutingModule { }

  - The path here is set to an empty string because the path in AppRoutingModule is already set to customers, so this route in the CustomersRoutingModule, is already within the customers context. Every route in this routing module is a child route.

- src/app/orders/orders-routing.module.ts (excerpt)

  ```
  import { OrdersComponent } from './orders.component';

  const routes: Routes = [
    {
      path: '',
      component: OrdersComponent
    }
  ];
  ```

## forRoot() and forChild()

- You might have noticed that the CLI adds RouterModule.forRoot(routes) to the AppRoutingModule imports array. This lets Angular know that the AppRoutingModule is a routing module and forRoot() specifies that this is the root routing module. It configures all the routes you pass to it, gives you access to the router directives, and registers the Router service. Use forRoot() only once in the application, inside the AppRoutingModule.

- The CLI also adds RouterModule.forChild(routes) to feature routing modules. This way, Angular knows that the route list is only responsible for providing additional routes and is intended for feature modules. You can use forChild() in multiple modules.

- The forRoot() method takes care of the global injector configuration for the Router. The forChild() method has no injector configuration. It uses directives such as RouterOutlet and RouterLink. For more information, see the forRoot() pattern section of the Singleton Services guide.

## Preloading

- Preloading improves UX by loading parts of your application in the background. You can preload modules or component data.

### Preloading modules

- Preloading modules improves UX by loading parts of your application in the background so users don't have to wait for the elements to download when they activate a route.

- To enable preloading of all lazy loaded modules, import the `PreloadAllModules` token from the Angular router.

  - AppRoutingModule (excerpt)
    ```
    import { PreloadAllModules } from '@angular/router';
    ```

- Still in the `AppRoutingModule`, specify your preloading strategy in `forRoot()`.
  - AppRoutingModule (excerpt)
    ```
    RouterModule.forRoot(
      appRoutes,
      {
        preloadingStrategy: PreloadAllModules
      }
    )
    ```

### Preloading component data

- To preload component data, use a `resolver`. Resolvers improve UX by blocking the page load until all necessary data is available to fully display the page.

#### Resolvers

- Create a resolver service. With the CLI, the command to generate a service is as follows:

  ```
  ng generate service <service-name>
  ```

- Resolver service (excerpt)

  ```
  import { Resolve } from '@angular/router';

  …

  /* An interface that represents your data model */
  export interface Crisis {
    id: number;
    name: string;
  }

  export class CrisisDetailResolverService implements Resolve<Crisis> {
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Crisis> {
      // your logic goes here
    }
  }
  ```

- Import this resolver into your module's routing module.

  - Feature module's routing module (excerpt)

    ```
    import { CrisisDetailResolverService } from './crisis-detail-resolver.service';
    ```

- Add a resolve object to the component's route configuration.

  - Feature module's routing module (excerpt)
    ```
    {
      path: '/your-path',
      component: YourComponent,
      resolve: {
        crisis: CrisisDetailResolverService
      }
    }
    ```

- In the component's constructor, inject an instance of the ActivatedRoute class that represents the current route.

  - Component's constructor (excerpt)

    ```
    import { ActivatedRoute } from '@angular/router';

    @Component({ … })
    class YourComponent {
      constructor(private route: ActivatedRoute) {}
    }
    ```

- Use the injected instance of the `ActivatedRoute` class to access `data` associated with a given route.

  - Component's ngOnInit lifecycle hook (excerpt)

    ```
    import { ActivatedRoute } from '@angular/router';

    @Component({ … })
    class YourComponent {
      constructor(private route: ActivatedRoute) {}

      ngOnInit() {
        this.route.data
          .subscribe(data => {
            const crisis: Crisis = data.crisis;
            // …
          });
      }
    }
    ```

## Troubleshooting lazy-loading modules

- A common error when lazy-loading modules is importing common modules in multiple places within an application. Test for this condition by first generating the module using the Angular CLI and including the --route route-name parameter, where route-name is the name of your module. Next, generate the module without the --route parameter. If the Angular CLI generates an error when you use the --route parameter, but runs correctly without it, you might have imported the same module in multiple places.

- Remember, many common Angular modules should be imported at the base of your application.
