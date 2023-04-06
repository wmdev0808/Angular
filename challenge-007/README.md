# Services & Dependency Injection

## What are Services?

- Service is a broad category encompassing any value, function, or feature that an application needs.
- A service is typically a class with a narrow, well-defined purpose. It should do something specific and do it well.

- Angular distinguishes components from services to increase modularity and reusability.

- Use cases

  - Duplication of code
  - Shared data storage

- Service example

  - src/app/logger.service.ts(class)

    ```
    export class Logger {
      log(msg: any)   { console.log(msg); }
      error(msg: any) { console.error(msg); }
      warn(msg: any)  { console.warn(msg); }
    }
    ```

  - src/app/hero.service.ts(class)

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

## Dependency injection (DI)

- Dependency injection (DI) is the part of the Angular framework that provides components with access to services and other resources. Angular provides the ability for you to inject a service into a component to give that component access to the service.

- The @Injectable() decorator defines a class as a service in Angular and allows Angular to inject it into a component as a dependency. Likewise, the @Injectable() decorator indicates that a component, class, pipe, or NgModule has a dependency on a service.

  - The injector is the main mechanism. Angular creates an application-wide injector for you during the bootstrap process, and additional injectors as needed. You don't have to create injectors.

  - An injector creates dependencies and maintains a container of dependency instances that it reuses, if possible.

  - A provider is an object that tells an injector how to obtain or create a dependency

- For any dependency that you need in your app, you must register a provider with the application's injector, so that the injector can use the provider to create new instances. For a service, the provider is typically the service class itself.

  - A dependency doesn't have to be a service —it could be a function, for example, or a value.

- When Angular creates a new instance of a component class, it determines which services or other dependencies that component needs by looking at the constructor parameter types. For example, the constructor of HeroListComponent needs HeroService.

  ```
  constructor(private service: HeroService) { }
  ```

- When Angular discovers that a component depends on a service, it first checks if the injector has any existing instances of that service. If a requested service instance doesn't yet exist, the injector makes one using the registered provider and adds it to the injector before returning the service to Angular.

- When all requested services have been resolved and returned, Angular can call the component's constructor with those services as arguments.

- Providing services

  - You must register at least one provider of any service you are going to use. The provider can be part of the service's own metadata, making that service available everywhere, or you can register providers with specific modules or components. You register providers in the metadata of the service (in the @Injectable() decorator), or in the @NgModule() or @Component() metadata

  - By default, the Angular CLI command ng generate service registers a provider with the root injector for your service by including provider metadata in the @Injectable() decorator.

    ```
    @Injectable({
      providedIn: 'root',
    })
    ```

    - When you provide the service at the root level, Angular creates a single, shared instance of HeroService and injects it into any class that asks for it. Registering the provider in the @Injectable() metadata also allows Angular to optimize an app by removing the service from the compiled application if it isn't used, a process known as _tree-shaking_.

  - When you register a provider with a specific NgModule, the same instance of a service is available to all components in that NgModule. To register at this level, use the providers property of the @NgModule() decorator.

    ```
    @NgModule({
      providers: [
        BackendService,
        Logger
      ],
      …
    })
    ```

  - When you register a provider at the component level, you get a new instance of the service with each new instance of that component. At the component level, register a service provider in the providers property of the @Component() metadata.

    ```
    @Component({
      selector:    'app-hero-list',
      templateUrl: './hero-list.component.html',
      providers:  [ HeroService ]
    })
    ```

- Hierarchical Injector

  - AppModule
    - Same instance of Service is available **Application-wide**
  - AppComponent
    - Same instance of Service is available for **all Components** (but **not for other Services**)
  - Any other Component
    - Same instance of Service is available for **the Component and all its child components**

- Injectable

  - Decorator that marks a class as available to be provided and injected as a dependency.
  - Usage notes

    - Marking a class with @Injectable ensures that the compiler will generate the necessary metadata to create the class's dependencies when the class is injected.
    - The following example shows how a service class is properly marked so that a supporting service can be injected upon creation.

      ```
      @Injectable()
      class UsefulService {
      }

      @Injectable()
      class NeedsService {
        constructor(public service: UsefulService) {}
      }

      const injector = Injector.create({
        providers:
            [{provide: NeedsService, deps: [UsefulService]}, {provide: UsefulService, deps: []}]
      });
      expect(injector.get(NeedsService).service instanceof UsefulService).toBe(true);
      ```

# Creating a Data Service

# Using Services for Cross-component Communication

# Problem

- Optimize this app by adding a UsersService which manages the active and inactive users.
- Also add a CounterService which counts the number of active->inactive and inactive->active actions.
