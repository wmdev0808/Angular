# Dependency injection

## Dependency injection in Angular

- When you develop a smaller part of your system, like a module or a class, you may need to use features from other classes. For example, you may need an HTTP service to make backend calls. Dependency Injection, or DI, is a design pattern and mechanism for creating and delivering some parts of an application to other parts of an application that require them. Angular supports this design pattern and you can use it in your applications to increase flexibility and modularity.

- In Angular, dependencies are typically services, but they also can be values, such as strings or functions. An injector for an application (created automatically during bootstrap) instantiates dependencies when needed, using a configured provider of the service or value.

## Understanding injection

- Dependency injection, or DI, is one of the fundamental concepts in Angular. DI is wired into the Angular framework and allows classes with Angular decorators, such as Components, Directives, Pipes, and Injectables, to configure dependencies that they need.

- Two main roles exist in the DI system: dependency consumer and dependency provider.

- Angular facilitates the interaction between dependency consumers and dependency providers using an abstraction called Injector. When a dependency is requested, the injector checks its registry to see if there is an instance already available there. If not, a new instance is created and stored in the registry. Angular creates an application-wide injector (also known as "root" injector) during the application bootstrap process, as well as any other injectors as needed. In most cases you don't need to manually create injectors, but you should know that there is a layer that connects providers and consumers.

- This topic covers basic scenarios of how a class can act as a dependency. Angular also allows you to use functions, objects, primitive types such as string or Boolean, or any other types as dependencies.

### Providing dependency

- Imagine there is a class called `HeroService` that needs to act as a dependency in a component.

- The first step is to add the `@Injectable` decorator to show that the class can be injected.

  ```
  @Injectable()
  class HeroService {}
  ```

- The next step is to make it available in the DI by providing it. A dependency can be provided in multiple places:

  - At the Component level, using the providers field of the `@Component` decorator. In this case the `HeroService` becomes available to all instances of this component and other components and directives used in the template. For example:

    ```
    @Component({
      selector: 'hero-list',
      template: '...',
      providers: [HeroService]
    })
    class HeroListComponent {}
    ```

    - When you register a provider at the component level, you get a new instance of the service with each new instance of that component.

  - At the NgModule level, using the providers field of the `@NgModule` decorator. In this scenario, the `HeroService` is available to all components, directives, and pipes declared in this NgModule. For example:

    ```
    @NgModule({
      declarations: [HeroListComponent]
      providers: [HeroService]
    })
    class HeroListModule {}
    ```

    - When you register a provider with a specific NgModule, the same instance of a service is available to all components in that NgModule.

  - At the application root level, which allows injecting it into other classes in the application. This can be done by adding the `providedIn: 'root'` field to the `@Injectable` decorator:

    ```
    @Injectable({
      providedIn: 'root'
    })
    class HeroService {}
    ```

    - When you provide the service at the root level, Angular creates a single, shared instance of the `HeroService` and injects it into any class that asks for it. Registering the provider in the `@Injectable` metadata also allows Angular to optimize an app by removing the service from the compiled application if it isn't used, a process known as tree-shaking.

### Injecting a dependency

- The most common way to inject a dependency is to declare it in a class constructor. When Angular creates a new instance of a component, directive, or pipe class, it determines which services or other dependencies that class needs by looking at the constructor parameter types. For example, if the `HeroListComponent` needs the `HeroService`, the constructor can look like this:

  ```
  @Component({ … })
  class HeroListComponent {
    constructor(private service: HeroService) {}
  }
  ```

- When Angular discovers that a component depends on a service, it first checks if the injector has any existing instances of that service. If a requested service instance doesn't yet exist, the injector creates one using the registered provider, and adds it to the injector before returning the service to Angular.

- When all requested services have been resolved and returned, Angular can call the component's constructor with those services as arguments.

  ![](https://angular.io/generated/images/guide/architecture/injector-injects.png)

## Creating an injectable service

- Service is a broad category encompassing any value, function, or feature that an application needs. A service is typically a class with a narrow, well-defined purpose. A component is one type of class that can use DI.

- Angular distinguishes components from services to increase modularity and reusability. By separating a component's view-related features from other kinds of processing, you can make your component classes lean and efficient.

- Ideally, a component's job is to enable the user experience and nothing more. A component should present properties and methods for data binding, to mediate between the view (rendered by the template) and the application logic (which often includes some notion of a model).

- A component can delegate certain tasks to services, such as fetching data from the server, validating user input, or logging directly to the console. By defining such processing tasks in an injectable service class, you make those tasks available to any component. You can also make your application more adaptable by injecting different providers of the same kind of service, as appropriate in different circumstances.

- Angular does not enforce these principles. Angular helps you follow these principles by making it easy to factor your application logic into services and make those services available to components through DI.

### Service examples

- Here's an example of a service class that logs to the browser console.

  - src/app/logger.service.ts (class)
    ```
    export class Logger {
      log(msg: any)   { console.log(msg); }
      error(msg: any) { console.error(msg); }
      warn(msg: any)  { console.warn(msg); }
    }
    ```

- Services can depend on other services. For example, here's a `HeroService` that depends on the `Logger` service, and also uses `BackendService` to get heroes. That service in turn might depend on the `HttpClient` service to fetch heroes asynchronously from a server.

  - src/app/hero.service.ts (class)

    ```
    export class HeroService {
      private heroes: Hero[] = [];

      constructor(
        private backend: BackendService,
        private logger: Logger) { }

      getHeroes() {
        this.backend.getAll(Hero).then( (heroes: Hero[]) => {
          this.logger.log(`Fetched ${heroes.length} heroes.`);
          this.heroes.push(...heroes); // fill cache
        });
        return this.heroes;
      }
    }
    ```

### Creating an injectable service

- Angular CLI provides a command to create a new service. In the following example, you add a new service to your application, which was created earlier with the `ng new` command.

- To generate a new `HeroService` class in the `src/app/heroes` folder, follow these steps:

  - 1. Run this Angular CLI command:

    ```
    ng generate service heroes/hero
    ```

    - This command creates the following default `HeroService`.

      - src/app/heroes/hero.service.ts (CLI-generated)

        ```
        import { Injectable } from '@angular/core';

        @Injectable({
          providedIn: 'root',
        })
        export class HeroService {
          constructor() { }
        }
        ```

      - The `@Injectable()` decorator specifies that Angular can use this class in the DI system. The metadata, providedIn: 'root', means that the `HeroService` is visible throughout the application.

  - 2. Add a `getHeroes()` method that returns the heroes from `mock.heroes.ts` to get the hero mock data:

    - src/app/heroes/hero.service.ts

      ```
      import { Injectable } from '@angular/core';
      import { HEROES } from './mock-heroes';

      @Injectable({
        // declares that this service should be created
        // by the root application injector.
        providedIn: 'root',
      })
      export class HeroService {
        getHeroes() { return HEROES; }
      }
      ```

- For clarity and maintainability, it is recommended that you define components and services in separate files.

### Injecting services

- To inject a service as a dependency into a component, you can use component's `constructor()` and supply a constructor argument with the dependency type. The following example specifies the HeroService in the `HeroListComponent` constructor. The type of the `heroService` is `HeroService`. Angular recognizes the `HeroService` as a dependency, since that class was previously annotated with the `@Injectable` decorator.

  - src/app/heroes/hero-list.component (constructor signature)
    ```
    constructor(heroService: HeroService)
    ```

### Injecting services in other services

- When a service depends on another service, follow the same pattern as injecting into a component. In the following example `HeroService` depends on a `Logger` service to report its activities.

- First, import the `Logger` service. Next, inject the `Logger` service in the `HeroService constructor()` by specifying `private logger: Logger`.

- Here, the `constructor()` specifies a type of `Logger` and stores the instance of `Logger` in a private field called `logger`.

- The following code tabs feature the `Logger` service and two versions of `HeroService`. The first version of `HeroService` does not depend on the `Logger` service. The revised second version does depend on `Logger` service.

- src/app/heroes/hero.service(v2)

  ```
  import { Injectable } from '@angular/core';
  import { HEROES } from './mock-heroes';
  import { Logger } from '../logger.service';

  @Injectable({
    providedIn: 'root',
  })
  export class HeroService {

    constructor(private logger: Logger) {  }

    getHeroes() {
      this.logger.log('Getting heroes ...');
      return HEROES;
    }
  }
  ```

  - src/app/logger.service

    ```
    import { Injectable } from '@angular/core';

    @Injectable({
      providedIn: 'root'
    })
    export class Logger {
      logs: string[] = []; // capture logs for testing

      log(message: string) {
        this.logs.push(message);
        console.log(message);
      }
    }
    ```

  - In this example, the `getHeroes()` method uses the `Logger` service by logging a message when fetching heroes.

## Defining dependency providers

- The Creating and injecting services topic describes how to use classes as dependencies. Besides classes, you can also use other values such as Boolean, string, date, and objects as dependencies. Angular DI provides the necessary APIs to make the dependency configuration flexible, so you can make those values available in DI.

### Specifying a provider token

- If you specify the service class as the provider token, the default behavior is for the injector to instantiate that class using the `new` operator.

- In the following example, the `Logger` class provides a `Logger` instance.

  ```
  providers: [Logger]
  ```

- You can, however, configure a DI to use a different class or any other different value to associate with the `Logger` class. So when the `Logger` is injected, this new value is used instead.

- In fact, the class provider syntax is a shorthand expression that expands into a provider configuration, defined by the [Provider](https://angular.io/api/core/Provider) interface.

- Angular expands the `providers` value in this case into a full provider object as follows:

  ```
  [{ provide: Logger, useClass: Logger }]
  ```

- The expanded provider configuration is an object literal with two properties:

  - The provide property holds the token that serves as the key for both locating a dependency value and configuring the injector.

  - The second property is a provider definition object, which tells the injector how to create the dependency value. The provider-definition key can be one of the following:

    - useClass - this option tells Angular DI to instantiate a provided class when a dependency is injected

    - useExisting - allows you to alias a token and reference any existing one.

    - useFactory - allows you to define a function that constructs a dependency.

    - useValue - provides a static value that should be used as a dependency.

- The section below describes how to use the mentioned provider definition keys.

#### Class providers: useClass

- The `useClass` provider key lets you create and return a new instance of the specified class. You can use this type of provider to substitute an alternative implementation for a common or default class. The alternative implementation can, for example, implement a different strategy, extend the default class, or emulate the behavior of the real class in a test case. In the following example, the `BetterLogger` class would be instantiated when the `Logger` dependency is requested in a component or any other class.

  ```
  [{ provide: Logger, useClass: BetterLogger }]
  ```

- If the alternative class providers have their own dependencies, specify both providers in the providers metadata property of the parent module or component.

  ```
  [ UserService,
  { provide: Logger, useClass: EvenBetterLogger }]
  ```

- In this example, `EvenBetterLogger` displays the user name in the log message. This logger gets the user from an injected `UserService` instance.

  ```
  @Injectable()
  export class EvenBetterLogger extends Logger {
    constructor(private userService: UserService) { super(); }

    override log(message: string) {
      const name = this.userService.user.name;
      super.log(`Message to ${name}: ${message}`);
    }
  }
  ```

- Angular DI knows how to construct the `UserService` dependency, since it has been configured above and is available in the injector.

#### Alias providers: useExisting

- The `useExisting` provider key lets you map one token to another. In effect, the first token is an alias for the service associated with the second token, creating two ways to access the same service object.

- In the following example, the injector injects the singleton instance of `NewLogger` when the component asks for either the new or the old logger. In this way, `OldLogger` is an alias for `NewLogger`.

  ```
  [ NewLogger,
  // Alias OldLogger w/ reference to NewLogger
  { provide: OldLogger, useExisting: NewLogger}]
  ```

- Ensure you do not alias `OldLogger` to `NewLogger` with `useClass`, as this creates two different `NewLogger` instances.

#### Factory providers: useFactory

- The `useFactory` provider key lets you create a dependency object by calling a factory function. With this approach you can create a dynamic value based on information available in the DI and elsewhere in the app.

- In the following example, only authorized users should see secret heroes in the `HeroService`. Authorization can change during the course of a single application session, as when a different user logs in .

- To keep security-sensitive information in `UserService` and out of `HeroService`, give the `HeroService` constructor a boolean flag to control display of secret heroes.

  - src/app/heroes/hero.service.ts (excerpt)

    ```
    constructor(
      private logger: Logger,
      private isAuthorized: boolean) { }

    getHeroes() {
      const auth = this.isAuthorized ? 'authorized ' : 'unauthorized';
      this.logger.log(`Getting heroes for ${auth} user.`);
      return HEROES.filter(hero => this.isAuthorized || !hero.isSecret);
    }
    ```

- To implement the `isAuthorized` flag, use a factory provider to create a new logger instance for `HeroService`.

  - src/app/heroes/hero.service.provider.ts (excerpt)
    ```
    const heroServiceFactory = (logger: Logger, userService: UserService) =>
      new HeroService(logger, userService.user.isAuthorized);
    ```

- The factory function has access to `UserService`. You inject both `Logger` and `UserService` into the factory provider so the injector can pass them along to the factory function.

  - src/app/heroes/hero.service.provider.ts (excerpt)

    ```
    export const heroServiceProvider =
    { provide: HeroService,
      useFactory: heroServiceFactory,
      deps: [Logger, UserService]
    };
    ```

  - The `useFactory` field specifies that the provider is a factory function whose implementation is `heroServiceFactory`.

  - The `deps` property is an array of provider tokens. The `Logger` and `UserService` classes serve as tokens for their own class providers. The injector resolves these tokens and injects the corresponding services into the matching `heroServiceFactory` factory function parameters.

- Capturing the factory provider in the exported variable, `heroServiceProvider`, makes the factory provider reusable.

#### Value providers: useValue

- The `useValue` key lets you associate a fixed value with a DI token. Use this technique to provide runtime configuration constants such as website base addresses and feature flags. You can also use a value provider in a unit test to provide mock data in place of a production data service. The next section provides more information about the `useValue` key.

### Using an InjectionToken object

- Define and use an `InjectionToken` object for choosing a provider token for non-class dependencies. The following example defines a token, `APP_CONFIG` of the type `InjectionToken`.

  - src/app/app.config.ts

    ```
    import { InjectionToken } from '@angular/core';

    export const APP_CONFIG = new InjectionToken<AppConfig>('app.config');
    ```

- The optional type parameter, `<AppConfig>`, and the token description, `app.config`, specify the token's purpose.

- Next, register the dependency provider in the component using the `InjectionToken` object of `APP_CONFIG`.

  - src/app/providers.component.ts
    ```
    providers: [{ provide: APP_CONFIG, useValue: HERO_DI_CONFIG }]
    ```

- Now, inject the configuration object into the constructor with `@Inject()` parameter decorator.
  - src/app/app.component.ts
    ```
    constructor(@Inject(APP_CONFIG) config: AppConfig) {
      this.title = config.title;
    }
    ```

#### Interfaces and DI

- Though the TypeScript `AppConfig` interface supports typing within the class, the AppConfig interface plays no role in DI. In TypeScript, an interface is a design-time artifact, and does not have a runtime representation, or token, that the DI framework can use.

- When the transpiler changes TypeScript to JavaScript, the interface disappears because JavaScript doesn't have interfaces.

- Because there is no interface for Angular to find at runtime, the interface cannot be a token, nor can you inject it.

  ```
  // Can't use interface as provider token
  [{ provide: AppConfig, useValue: HERO_DI_CONFIG })]
  ```

  ```
  // Can't inject using the interface as the parameter type
  constructor(private config: AppConfig){ }
  ```

## [Hierarchical injectors](../challenge_015/README.md)
