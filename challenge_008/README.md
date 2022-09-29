# Angular Routing

- To handle the navigation from one view to the next, you use the Angular Router. The Router enables navigation by interpreting a browser URL as an instruction to change the view.

## Defining a basic route

- 1. Import `RouterModule` and `Routes` into your routing module.

  ```
  import { NgModule } from '@angular/core';
  import { Routes, RouterModule } from '@angular/router'; // CLI imports router

  const routes: Routes = []; // sets up routes constant where you define your routes

  // configures NgModule imports and exports
  @NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  export class AppRoutingModule { }
  ```

- 2. Define your routes in your Routes array.

  - Each route in this array is a JavaScript object that contains two properties. The first property, path, defines the URL path for the route. The second property, component, defines the component Angular should use for the corresponding path.

  ```
  const routes: Routes = [
    { path: 'first-component', component: FirstComponent },
    { path: 'second-component', component: SecondComponent },
  ];
  ```

- 3. Add your routes to your application.

  - Template with `routerLink` and `router-outlet`

    ```
    <h1>Angular Router App</h1>
    <!-- This nav gives you links to click, which tells the router which route to use (defined in the routes constant in  AppRoutingModule) -->
    <nav>
      <ul>
        <li><a routerLink="/first-component" routerLinkActive="active" ariaCurrentWhenActive="page">First Component</a></li>
        <li><a routerLink="/second-component" routerLinkActive="active" ariaCurrentWhenActive="page">Second Component</a></li>
      </ul>
    </nav>
    <!-- The routed views render in the <router-outlet>-->
    <router-outlet></router-outlet>
    ```

- Route order
  - The order of routes is important because the `Router` uses a first-match wins strategy when matching routes, so more specific routes should be placed above less specific routes. List routes with a static path first, followed by an empty path route, which matches the default route. The `wildcard route` comes last because it matches every URL and the Router selects it only if no other routes match first.

## Getting route information

- To get information from a route:
  - 1. Import `ActivatedRoute` and `ParamMap` to your component.
    ```
    import { Router, ActivatedRoute, ParamMap } from '@angular/router';
    ```
  - 2. Inject an instance of `ActivatedRoute` by adding it to your application's constructor:
    ```
    constructor(
      private route: ActivatedRoute,
    ) {}
    ```
  - 3. Update the `ngOnInit()` method to access the `ActivatedRoute` and track the `name` parameter:
    ```
    ngOnInit() {
      this.route.queryParams.subscribe(params => {
        this.name = params['name'];
      });
    }
    ```

## Setting up wildcard routes

- A well-functioning application should gracefully handle when users attempt to navigate to a part of your application that does not exist. To add this functionality to your application, you set up a wildcard route. The Angular router selects this route any time the requested URL doesn't match any router paths.

- To set up a wildcard route, add the following code to your `routes` definition.

  ```
  { path: '**', component: <component-name> }
  ```

## Displaying a 404 page

- To display a 404 page, set up a wildcard route with the component property set to the component you'd like to use for your 404 page as follows:

  ```
  const routes: Routes = [
    { path: 'first-component', component: FirstComponent },
    { path: 'second-component', component: SecondComponent },
    { path: '**', component: PageNotFoundComponent },  // Wildcard route for a 404 page
  ];
  ```

## Setting up redirects

- To set up a redirect, configure a route with the path you want to redirect from, the component you want to redirect to, and a pathMatch value that tells the router how to match the URL.

  ```
  const routes: Routes = [
    { path: 'first-component', component: FirstComponent },
    { path: 'second-component', component: SecondComponent },
    { path: '',   redirectTo: '/first-component', pathMatch: 'full' }, // redirect to `first-component`
    { path: '**', component: PageNotFoundComponent },  // Wildcard route for a 404 page
  ];
  ```

## Nesting routes

- As your application grows more complex, you might want to create routes that are relative to a component other than your root component. These types of nested routes are called child routes. This means you're adding a second `<router-outlet>` to your app, because it is in addition to the `<router-outlet>` in AppComponent.

  ```
  <h2>First Component</h2>

  <nav>
    <ul>
      <li><a routerLink="child-a">Child A</a></li>
      <li><a routerLink="child-b">Child B</a></li>
    </ul>
  </nav>

  <router-outlet></router-outlet>
  ```

- A child route is like any other route, in that it needs both a `path` and a `component`. The one difference is that you place child routes in a children array within the parent route.

  - AppRoutingModule(excerpt)
    ```
    const routes: Routes = [
      {
        path: 'first-component',
        component: FirstComponent, // this is the component with the <router-outlet> in the template
        children: [
          {
            path: 'child-a', // child route path
            component: ChildAComponent, // child route component that the router renders
          },
          {
            path: 'child-b',
            component: ChildBComponent, // another child route component that the router renders
          },
        ],
      },
    ];
    ```

## Setting the page title

- Each page in your application should have a unique title so that they can be identified in the browser history. The `Router` sets the document's title using the `title` property from the `Route` config.

  - AppRoutingModule (excerpt)

    ```
    const routes: Routes = [
      {
        path: 'first-component',
        title: 'First component',
        component: FirstComponent,  // this is the component with the <router-outlet> in the template
        children: [
          {
            path: 'child-a',  // child route path
            title: ResolvedChildATitle,
            component: ChildAComponent,  // child route component that the router renders
          },
          {
            path: 'child-b',
            title: 'child b',
            component: ChildBComponent,  // another child route component that the router renders
          },
        ],
      },
    ];

    @Injectable({providedIn: 'root'})
    export class ResolvedChildATitle implements Resolve<string> {
      resolve() {
        return Promise.resolve('child a');
      }
    }
    ```

  - NOTE: The `title` property follows the same rules as static route data and dynamic values that implement `Resolve`.

- You can also provide a custom title strategy by extending the `TitleStrategy`.

  - AppRoutingModule (excerpt)

    ```
    @Injectable({providedIn: 'root'})
    export class TemplatePageTitleStrategy extends TitleStrategy {
      constructor(private readonly title: Title) {
        super();
      }

      override updateTitle(routerState: RouterStateSnapshot) {
        const title = this.buildTitle(routerState);
        if (title !== undefined) {
          this.title.setTitle(`My Application | ${title}`);
        }
      }
    }

    @NgModule({
      imports: [RouterModule.forRoot(routes)],
      exports: [RouterModule],
      providers: [
        {provide: TitleStrategy, useClass: TemplatePageTitleStrategy},
      ]
    })
    export class AppRoutingModule {
    }
    ```

## Using relative paths

- Relative paths let you define paths that are relative to the current URL segment.

  - In the template

    ```
    <h2>First Component</h2>

    <nav>
      <ul>
        <li><a routerLink="../second-component">Relative Route to second component</a></li>
      </ul>
    </nav>
    <router-outlet></router-outlet>
    ```

  - In addition to ../, use ./ or no leading slash to specify the current level.

- Specifying a relative route

  - To specify a relative route, use the `NavigationExtras` `relativeTo` property. In the component class, import `NavigationExtras` from the @angular/router.

  - Then use `relativeTo` in your navigation method. After the link parameters array, which here contains items, add an object with the relativeTo property set to the `ActivatedRoute`, which is `this.route`.

    - RelativeTo
      ```
      goToItems() {
        this.router.navigate(['items'], { relativeTo: this.route });
      }
      ```

## Accessing query parameters and fragments

- Component import statements (excerpt)

  ```
  import { ActivatedRoute } from '@angular/router';
  import { Observable } from 'rxjs';
  import { switchMap } from 'rxjs/operators';
  ```

- Component (excerpt)

  ```
  constructor(private route: ActivatedRoute) {}
  ```

- Component 1 (excerpt)

  ```
  heroes$: Observable<Hero[]>;
  selectedId: number;
  heroes = HEROES;

  ngOnInit() {
    this.heroes$ = this.route.paramMap.pipe(
      switchMap(params => {
        this.selectedId = Number(params.get('id'));
        return this.service.getHeroes();
      })
    );
  }
  ```

- Component2 (excerpt)
  ```
  import { Router, ActivatedRoute, ParamMap } from '@angular/router';
  import { Observable } from 'rxjs';
  ```
- Component 2 (excerpt)

  ```
  hero$: Observable<Hero>;

  constructor(
    private route: ActivatedRoute,
    private router: Router  ) {}

  ngOnInit() {
    const heroId = this.route.snapshot.paramMap.get('id');
    this.hero$ = this.service.getHero(heroId);
  }

  gotoItems(hero: Hero) {
    const heroId = hero ? hero.id : null;
    // Pass along the hero id if available
    // so that the HeroList component can select that item.
    this.router.navigate(['/heroes', { id: heroId }]);
  }
  ```

## Lazy loading

- You can configure your routes to lazy load modules, which means that Angular only loads modules as needed, rather than loading all modules when the application launches. Additionally, preload parts of your application in the background to improve the user experience.

## Preventing unauthorized access

- Use route guards to prevent users from navigating to parts of an application without authorization.
- The following route guards are available in Angular:

  - CanActivate
  - CanActivateChild
  - CanDeactivate
  - Resolve
  - CanLoad

- Create a service for your guard:

  ```
  ng generate guard your-guard
  ```

- In your guard class, implement the guard you want to use. The following example uses `CanActivate` to guard the route.

  ```
  export class YourGuard implements CanActivate {
    canActivate(
      next: ActivatedRouteSnapshot,
      state: RouterStateSnapshot): boolean {
        // your  logic goes here
    }
  }
  ```

- In your routing module, use the appropriate property in your `routes` configuration. Here, `canActivate` tells the router to mediate navigation to this particular route.

  - Routing module (excerpt)
    ```
    {
      path: '/your-path',
      component: YourComponent,
      canActivate: [YourGuard],
    }
    ```

- CanActivateChild

  - Interface that a class can implement to be a guard deciding if a child route can be activated. If all guards return true, navigation continues. If any guard returns false, navigation is cancelled. If any guard returns a `UrlTree`, current navigation is cancelled and a new navigation begins to the `UrlTree` returned from the guard.

- CanDeactivate
  - Interface that a class can implement to be a guard deciding if a route can be deactivated. If all guards return true, navigation continues. If any guard returns false, navigation is cancelled. If any guard returns a `UrlTree`, current navigation is cancelled and a new navigation begins to the `UrlTree` returned from the guard.

## Link parameters array

- A link parameters array holds the following ingredients for router navigation:

  - The path of the route to the destination component
  - Required and optional route parameters that go into the route URL

- Bind the `RouterLink` directive to such an array like this:

  - src/app/app.component.ts (h-anchor)

    ```
    <a [routerLink]="['/heroes']">Heroes</a>
    ```

  - The following is a two-element array when specifying a route parameter:
    - src/app/heroes/hero-list/hero-list.component.html (nav-to-detail)
      ```
      <a [routerLink]="['/hero', hero.id]">
        <span class="badge">{{ hero.id }}</span>{{ hero.name }}
      </a>
      ```
  - Provide optional route parameters in an object, as in { foo: 'foo' }:
    - src/app/app.component.ts (cc-query-params)
      ```
      <a [routerLink]="['/crisis-center', { foo: 'foo' }]">Crisis Center</a>
      ```

## LocationStrategy and browser URL styles

- When the router navigates to a new component view, it updates the browser's location and history with a URL for that view.

- Modern HTML5 browsers support [history.pushState](https://developer.mozilla.org/docs/Web/API/History_API/Working_with_the_History_API#adding_and_modifying_history_entries), a technique that changes a browser's location and history without triggering a server page request. The router can compose a "natural" URL that is indistinguishable from one that would otherwise require a page load.

  - HTML5 pushState style:

    ```
    localhost:3002/crisis-center
    ```

  - "hash URL"
    ```
    localhost:3002/src/#/crisis-center
    ```

- The router supports both styles with two `LocationStrategy` providers:
  Provider | Details

  - `PathLocationStrategy`: The default "HTML5 pushState" style.
  - `HashLocationStragegy`: The "hash URL" style.

- The RouterModule.forRoot() function sets the LocationStrategy to the PathLocationStrategy, which makes it the default strategy. You also have the option of switching to the HashLocationStrategy with an override during the bootstrapping process.

## Choosing a routing strategy

- You must choose a routing strategy early in the development of your project because once the application is in production, visitors to your site use and depend on application URL references.
- Almost all Angular projects should use the default HTML5 style. It produces URLs that are easier for users to understand and it preserves the option to do server-side rendering.

## `<base href>`

- You must add a `<base href>` element to the application's index.html for pushState routing to work. The browser uses the `<base href>` value to prefix relative URLs when referencing CSS files, scripts, and images.

- Add the `<base>` element just after the `<head>` tag. If the app folder is the application root, as it is for this application, set the href value in index.html as shown here.

  - src/index.html (base-href)
    ```
    <base href="/">
    ```

- HTML5 URLs and the `<base href>`

  - foo://example.com:8042/over/there?name=ferret#nose
    ***
    scheme authority path query fragment

- HashLocationStrategy

  - Use `HashLocationStrategy` by providing the `useHash: true` in an object as the second argument of the `RouterModule.forRoot()` in the AppModule.

    - src/app/app.module.ts (hash URL strategy)

      ```
      import { NgModule } from '@angular/core';
      import { BrowserModule } from '@angular/platform-browser';
      import { FormsModule } from '@angular/forms';
      import { Routes, RouterModule } from '@angular/router';

      import { AppComponent } from './app.component';
      import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

      const routes: Routes = [

      ];

      @NgModule({
        imports: [
          BrowserModule,
          FormsModule,
          RouterModule.forRoot(routes, { useHash: true })  // .../#/crisis-center/
        ],
        declarations: [
          AppComponent,
          PageNotFoundComponent
        ],
        providers: [

        ],
        bootstrap: [ AppComponent ]
      })
      export class AppModule { }
      ```

# RouterLinkActive

- Tracks whether the linked route of an element is currently active, and allows you to specify one or more CSS classes to add to the element when the linked route is active.

  - Use this directive to create a visual distinction for elements associated with an active route.
    ```
    <a routerLink="/user/bob" routerLinkActive="active-link">Bob</a>
    ```
  - You can set more than one class using a space-separated string or an array. For example:

    ```
    <a routerLink="/user/bob" routerLinkActive="class1 class2">Bob</a>
    <a routerLink="/user/bob" [routerLinkActive]="['class1', 'class2']">Bob</a>
    ```

  - To add the classes only when the URL matches the link exactly, add the option exact: true:

    ```
    <a
      routerLink="/user/bob"
      routerLinkActive="active-link"
      [routerLinkActiveOptions]="{exact: true}"
    >
    Bob
    </a>
    ```

  - To directly check the isActive status of the link, assign the RouterLinkActive instance to a template variable.
    ```
    <a routerLink="/user/bob" routerLinkActive #rla="routerLinkActive">
      Bob {{ rla.isActive ? '(already open)' : ''}}
    </a>
    ```
  - You can apply the `RouterLinkActive` directive to an ancestor of linked elements.
    ```
    <div routerLinkActive="active-link" [routerLinkActiveOptions]="{exact: true}">
      <a routerLink="/user/jim">Jim</a>
      <a routerLink="/user/bob">Bob</a>
    </div>
    ```

# RouterLink

- When applied to an element in a template, makes that element a link that initiates navigation to a route. Navigation opens one or more routed components in one or more `<router-outlet>` locations on the page.

- Setting and handling query params and fragments

  ```
  <a
    [routerLink]="['/user/bob']"
    [queryParams]="{debug: true}"
    fragment="education">
    link to user component
  </a>
  ```

  - The example generates the link: /user/bob?debug=true#education.

  - You can instruct the directive to handle query parameters differently by specifying the queryParamsHandling option in the link. Allowed values are:

    - 'merge': Merge the given queryParams into the current query params.
    - 'preserve': Preserve the current query params.

    ```
    <a
      [routerLink]="['/user/bob']"
      [queryParams]="{debug: true}"
      queryParamsHandling="merge"
    >
      link to user component
    </a>
    ```

- Preserving navigation history

  - You can provide a state value to be persisted to the browser's History.state
    property. For example:

    ```
    <a [routerLink]="['/user/bob']" [state]="{tracingId: 123}">
      link to user component
    </a>
    ```

  - Use `Router#getCurrentNavigation` to retrieve a saved navigation-state value. For example, to capture the `tracingId` during the `NavigationStart` event:

    ```
    // Get NavigationStart events
    router.events.pipe(filter(e => e instanceof NavigationStart)).subscribe(e => {
      const navigation = router.getCurrentNavigation();
      tracingService.trace({id: navigation.extras.state.tracingId});
    });
    ```

## Reolve

- Interface that classes can implement to be a data provider. A data provider class can be used with the router to resolve data during navigation. The interface defines a resolve() method that is invoked right after the `ResolveStart` router event. The router waits for the data to be resolved before the route is finally activated.

  ```
  interface Resolve<T> {
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<T> | Promise<T> | T
  }
  ```

- Example

  - The following example implements a resolve() method that retrieves the data needed to activate the requested route.

    ```
    @Injectable({ providedIn: 'root' })
    export class HeroResolver implements Resolve<Hero> {
      constructor(private service: HeroService) {}

      resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
      ): Observable<Hero>|Promise<Hero>|Hero {
        return this.service.getHero(route.paramMap.get('id'));
      }
    }
    ```

  - Here, the defined resolve() function is provided as part of the Route object in the router configuration:

    ```
    @NgModule({
      imports: [
        RouterModule.forRoot([
          {
            path: 'detail/:id',
            component: HeroDetailComponent,
            resolve: {
              hero: HeroResolver
            }
          }
        ])
      ],
      exports: [RouterModule]
    })
    export class AppRoutingModule {}
    ```

  - You can alternatively provide an in-line function with the ResolveFn signature:

    ```
    export const myHero: Hero = {
      // ...
    }

    @NgModule({
      imports: [
        RouterModule.forRoot([
          {
            path: 'detail/:id',
            component: HeroComponent,
            resolve: {
              hero: (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => myHero
            }
          }
        ])
      ],
    })
    export class AppModule {}
    ```

  - And you can access to your resolved data from HeroComponent:

    ```
    @Component({
      selector: "app-hero",
      templateUrl: "hero.component.html",
    })
    export class HeroComponent {

      constructor(private activatedRoute: ActivatedRoute) {}

      ngOnInit() {
        this.activatedRoute.data.subscribe(({ hero }) => {
          // do something with your resolved data ...
        })
      }

    }
    ```

## NavigationExtras

- Options that modify the Router navigation strategy. Supply an object containing any of these properties to a `Router` navigation function to control how the target URL should be constructed or interpreted.

  ```
  interface NavigationExtras extends UrlCreationOptions, NavigationBehaviorOptions {

    // inherited from router/UrlCreationOptions
    relativeTo?: ActivatedRoute | null
    queryParams?: Params | null
    fragment?: string
    queryParamsHandling?: QueryParamsHandling | null
    preserveFragment?: boolean

    // inherited from router/NavigationBehaviorOptions
    skipLocationChange?: boolean
    replaceUrl?: boolean
    state?: {...}
  }
  ```
