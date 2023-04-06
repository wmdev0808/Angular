# Best practices

## Security

- BEST PRACTICES
  |PRACTICES| DETAILS|
  |---------|--------|
  |Keep current with the latest Angular library releases| The Angular libraries get regular updates, and these updates might fix security defects discovered in previous versions. Check the Angular change log for security-related updates.|
  |Don't alter your copy of Angular| Private, customized versions of Angular tend to fall behind the current version and might not include important security fixes and enhancements. Instead, share your Angular improvements with the community and make a pull request.|
  |Avoid Angular APIs marked in the documentation as "Security Risk"| For more information, see the `Trusting safe values` section of this page.

### Preventing cross-site scripting (XSS)

- Cross-site scripting (XSS) enables attackers to inject malicious code into web pages. Such code can then, for example, steal user and login data, or perform actions that impersonate the user. This is one of the most common attacks on the web.

To block XSS attacks, you must prevent malicious code from entering the Document Object Model (DOM). For example, if attackers can trick you into inserting a `<script>` tag in the DOM, they can run arbitrary code on your website. The attack isn't limited to `<script>` tags —many elements and properties in the DOM allow code execution, for example, `<img alt="" onerror="...">` and `<a href="javascript:...">`. If attacker-controlled data enters the DOM, expect security vulnerabilities.

#### Angular's cross-site scripting security model

- Angular's cross-site scripting security model
  To systematically block XSS bugs, Angular treats all values as untrusted by default. When a value is inserted into the DOM from a template binding, or interpolation, Angular sanitizes and escapes untrusted values. If a value was already sanitized outside of Angular and is considered safe, communicate this to Angular by marking the `value as trusted`.

- Unlike values to be used for rendering, Angular templates are considered trusted by default, and should be treated as executable code. Never create templates by concatenating user input and template syntax. Doing this would enable attackers to inject arbitrary code into your application. To prevent these vulnerabilities, always use the default Ahead-Of-Time (AOT) template compiler in production deployments.

- An extra layer of protection can be provided through the use of Content security policy and Trusted Types. These web platform features operate at the DOM level which is the most effective place to prevent XSS issues. Here they can't be bypassed using other, lower-level APIs. For this reason, it is strongly encouraged to take advantage of these features. To do this, configure the content security policy for the application and enable trusted types enforcement.

#### Sanitization and security contexts

- _Sanitization_ is the inspection of an untrusted value, turning it into a value that's safe to insert into the DOM. In many cases, sanitization doesn't change a value at all. Sanitization depends on context: A value that's harmless in CSS is potentially dangerous in a URL.

- Angular defines the following security contexts:

  | SECURITY CONTEXTS | DETAILS                                                                           |
  | ----------------- | --------------------------------------------------------------------------------- |
  | HTML              | Used when interpreting a value as HTML, for example, when binding to `innerHtml`. |
  | Style             | Used when binding CSS into the `style` property.                                  |
  | URL               | Used for URL properties, such as `<a href>`.                                      |
  | Resource URL      | A URL that is loaded and executed as code, for example, in `<script src>`.        |

- Angular sanitizes untrusted values for HTML, styles, and URLs. Sanitizing resource URLs isn't possible because they contain arbitrary code. In development mode, Angular prints a console warning when it has to change a value during sanitization.

#### Sanitization example

- The following template binds the value of `htmlSnippet`. Once by interpolating it into an element's content, and once by binding it to the `innerHTML` property of an element:

  - src/app/inner-html-binding.component.html
    ```
    <h3>Binding innerHTML</h3>
    <p>Bound value:</p>
    <p class="e2e-inner-html-interpolated">{{htmlSnippet}}</p>
    <p>Result of binding to innerHTML:</p>
    <p class="e2e-inner-html-bound" [innerHTML]="htmlSnippet"></p>
    ```

- Interpolated content is always escaped —the HTML isn't interpreted and the browser displays angle brackets in the element's text content.

- For the HTML to be interpreted, bind it to an HTML property such as `innerHTML`. Be aware that binding a value that an attacker might control into `innerHTML` normally causes an XSS vulnerability. For example, one could run JavaScript in a following way:

  - src/app/inner-html-binding.component.ts (class)

    ```
    export class InnerHtmlBindingComponent {
      // For example, a user/attacker-controlled value from a URL.
      htmlSnippet = 'Template <script>alert("0wned")</script> <b>Syntax</b>';
    }
    ```

  - Angular recognizes the value as unsafe and automatically sanitizes it, which removes the script element but keeps safe content such as the `<b>` element.

    ![](https://angular.io/generated/images/guide/security/binding-inner-html.png)

#### Direct use of the DOM APIs and explicit sanitization calls

- Unless you enforce Trusted Types, the built-in browser DOM APIs don't automatically protect you from security vulnerabilities. For example, document, the node available through `ElementRef`, and many third-party APIs contain unsafe methods. Likewise, if you interact with other libraries that manipulate the DOM, you likely won't have the same automatic sanitization as with Angular interpolations. Avoid directly interacting with the DOM and instead use Angular templates where possible.

- For cases where this is unavoidable, use the built-in Angular sanitization functions. Sanitize untrusted values with the `DomSanitizer.sanitize` method and the appropriate `SecurityContext`. That function also accepts values that were marked as trusted using the `bypassSecurityTrust` … functions, and does not sanitize them, as described below.

#### Trusting safe values

- Sometimes applications genuinely need to include executable code, display an `<iframe>` from some URL, or construct potentially dangerous URLs. To prevent automatic sanitization in these situations, tell Angular that you inspected a value, checked how it was created, and made sure it is secure. Do be careful. If you trust a value that might be malicious, you are introducing a security vulnerability into your application. If in doubt, find a professional security reviewer.

- To mark a value as trusted, inject `DomSanitizer` and call one of the following methods:

  - bypassSecurityTrustHtml
  - bypassSecurityTrustScript
  - bypassSecurityTrustStyle
  - bypassSecurityTrustUrl
  - bypassSecurityTrustResourceUrl

- Remember, whether a value is safe depends on context, so choose the right context for your intended use of the value. Imagine that the following template needs to bind a URL to a javascript:alert(...) call:

  - src/app/bypass-security.component.html (URL)
    ```
    <h4>An untrusted URL:</h4>
    <p><a class="e2e-dangerous-url" [href]="dangerousUrl">Click me</a></p>
    <h4>A trusted URL:</h4>
    <p><a class="e2e-trusted-url" [href]="trustedUrl">Click me</a></p>
    ```

- Normally, Angular automatically sanitizes the URL, disables the dangerous code, and in development mode, logs this action to the console. To prevent this, mark the URL value as a trusted URL using the `bypassSecurityTrustUrl` call:

  - src/app/bypass-security.component.ts (trust-url)
    ```
    constructor(private sanitizer: DomSanitizer) {
    // javascript: URLs are dangerous if attacker controlled.
    // Angular sanitizes them in data binding, but you can
    // explicitly tell Angular to trust this value:
    this.dangerousUrl = 'javascript:alert("Hi there")';
    this.trustedUrl = sanitizer.bypassSecurityTrustUrl(this.dangerousUrl);
    ```

  ![](https://angular.io/generated/images/guide/security/bypass-security-component.png)

- If you need to convert user input into a trusted value, use a component method. The following template lets users enter a YouTube video ID and load the corresponding video in an `<iframe>`. The `<iframe src>` attribute is a resource URL security context, because an untrusted source can, for example, smuggle in file downloads that unsuspecting users could run. To prevent this, call a method on the component to construct a trusted video URL, which causes Angular to let binding into `<iframe src>`:

  - src/app/bypass-security.component.html (iframe)

    ```
    <h4>Resource URL:</h4>
    <p>Showing: {{dangerousVideoUrl}}</p>
    <p>Trusted:</p>
    <iframe class="e2e-iframe-trusted-src" width="640" height="390" [src]="videoUrl"></iframe>
    <p>Untrusted:</p>
    <iframe class="e2e-iframe-untrusted-src" width="640" height="390" [src]="dangerousVideoUrl"></iframe>
    ```

  - src/app/bypass-security.component.ts (trust-video-url)
    ```
    updateVideoUrl(id: string) {
      // Appending an ID to a YouTube URL is safe.
      // Always make sure to construct SafeValue objects as
      // close as possible to the input data so
      // that it's easier to check if the value is safe.
      this.dangerousVideoUrl = 'https://www.youtube.com/embed/' + id;
      this.videoUrl =
          this.sanitizer.bypassSecurityTrustResourceUrl(this.dangerousVideoUrl);
    }
    ```

#### Content security policy

- Content Security Policy (CSP) is a defense-in-depth technique to prevent XSS. To enable CSP, configure your web server to return an appropriate `Content-Security-Policy` HTTP header. Read more about content security policy at the [Web Fundamentals guide](https://developers.google.com/web/fundamentals/security/csp) on the Google Developers website.

- The minimal policy required for brand-new Angular is:

  ```
  default-src 'self'; style-src 'self' 'unsafe-inline';
  ```

  | SECTIONS                          | DETAILS                                                                                                                                                                                                         |
  | --------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
  | default-src 'self';               | Allows the page to load all its required resources from the same origin.                                                                                                                                        |
  | style-src 'self' 'unsafe-inline'; | Allows the page to load global styles from the same origin ('self') and enables components to load their styles ('unsafe-inline' - see [angular/angular#6361](https://github.com/angular/angular/issues/6361)). |

- Angular itself requires only these settings to function correctly. As your project grows, you may need to expand your CSP settings to accommodate extra features specific to your application.

#### Enforcing Trusted Types

- It is recommended that you use Trusted Types as a way to help secure your applications from cross-site scripting attacks. Trusted Types is a web platform feature that can help you prevent cross-site scripting attacks by enforcing safer coding practices. Trusted Types can also help simplify the auditing of application code.

- To enforce Trusted Types for your application, you must configure your application's web server to emit HTTP headers with one of the following Angular policies:

  | POLICIES              | DETAIL                                                                                                                                                                                                                                            |
  | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
  | angular               | This policy is used in security-reviewed code that is internal to Angular, and is required for Angular to function when Trusted Types are enforced. Any inline template values or content sanitized by Angular is treated as safe by this policy. |
  | angular#unsafe-bypass | This policy is used for applications that use any of the methods in Angular's `DomSanitizer` that bypass security, such as `bypassSecurityTrustHtml`. Any application that uses these methods must enable this policy.                            |
  | angular#unsafe-jit    | This policy is used by the `Just-In-Time (JIT) compiler`. You must enable this policy if your application interacts directly with the JIT compiler or is running in JIT mode using the `platform browser dynamic`.                                |
  | angular#bundler       | This policy is used by the Angular CLI bundler when creating lazy chunk files.                                                                                                                                                                    |

- You should configure the HTTP headers for Trusted Types in the following locations:

  - Production serving infrastructure
  - Angular CLI (`ng serve`), using the headers property in the `angular.json` file, for local development and end-to-end testing
  - Karma (`ng test`), using the `customHeaders` property in the `karma.config.js` file, for unit testing

- The following is an example of a header specifically configured for Trusted Types and Angular:

  ```
  Content-Security-Policy: trusted-types angular; require-trusted-types-for 'script';
  ```

- An example of a header specifically configured for Trusted Types and Angular applications that use any of Angular's methods in `DomSanitizer` that bypasses security:

  ```
  Content-Security-Policy: trusted-types angular angular#unsafe-bypass; require-trusted-types-for 'script';
  ```

- The following is an example of a header specifically configured for Trusted Types and Angular applications using JIT:

  ```
  Content-Security-Policy: trusted-types angular angular#unsafe-jit; require-trusted-types-for 'script';
  ```

- The following is an example of a header specifically configured for Trusted Types and Angular applications that use lazy loading of modules:

  ```
  Content-Security-Policy: trusted-types angular angular#bundler; require-trusted-types-for 'script';
  ```

#### Use the AOT template compiler

- The AOT template compiler prevents a whole class of vulnerabilities called template injection, and greatly improves application performance. The AOT template compiler is the default compiler used by Angular CLI applications, and you should use it in all production deployments.

- An alternative to the AOT compiler is the JIT compiler which compiles templates to executable template code within the browser at runtime. Angular trusts template code, so dynamically generating templates and compiling them, in particular templates containing user data, circumvents Angular's built-in protections. This is a security anti-pattern. For information about dynamically constructing forms in a safe way, see the Dynamic Forms guide.

#### Server-side XSS protection

- HTML constructed on the server is vulnerable to injection attacks. Injecting template code into an Angular application is the same as injecting executable code into the application: It gives the attacker full control over the application. To prevent this, use a templating language that automatically escapes values to prevent XSS vulnerabilities on the server. Don't create Angular templates on the server side using a templating language. This carries a high risk of introducing template-injection vulnerabilities.

### HTTP-level vulnerabilities

- Angular has built-in support to help prevent two common HTTP vulnerabilities, cross-site request forgery (CSRF or XSRF) and cross-site script inclusion (XSSI). Both of these must be mitigated primarily on the server side, but Angular provides helpers to make integration on the client side easier.

#### Cross-site request forgery

- In a common anti-XSRF technique, the application server sends a randomly created authentication token in a cookie. The client code reads the cookie and adds a custom request header with the token in all following requests. The server compares the received cookie value to the request header value and rejects the request if the values are missing or don't match.

- This technique is effective because all browsers implement the same origin policy. Only code from the website on which cookies are set can read the cookies from that site and set custom headers on requests to that site. That means only your application can read this cookie token and set the custom header. The malicious code on evil.com can't.

- Angular's `HttpClient` has built-in support for the client-side half of this technique. Read about it more in the `HttpClient guide`.

- For information about CSRF at the Open Web Application Security Project (OWASP), see [Cross-Site Request Forgery (CSRF)](https://owasp.org/www-community/attacks/csrf) and [Cross-Site Request Forgery (CSRF) Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html). The Stanford University paper [Robust Defenses for Cross-Site Request Forgery](https://seclab.stanford.edu/websec/csrf/csrf.pdf) is a rich source of detail.

See also Dave Smith's [talk on XSRF at AngularConnect 2016](https://www.youtube.com/watch?v=9inczw6qtpY).

#### Cross-site script inclusion (XSSI)

- Cross-site script inclusion, also known as JSON vulnerability, can allow an attacker's website to read data from a JSON API. The attack works on older browsers by overriding built-in JavaScript object constructors, and then including an API URL using a `<script>` tag.

- This attack is only successful if the returned JSON is executable as JavaScript. Servers can prevent an attack by prefixing all JSON responses to make them non-executable, by convention, using the well-known string `")]}',\n"`.

- Angular's `HttpClient` library recognizes this convention and automatically strips the string `")]}',\n"` from all responses before further parsing.

- For more information, see the XSSI section of this [Google web security blog post](https://security.googleblog.com/2011/05/website-security-for-webmasters.html).

### Auditing Angular applications

- Angular applications must follow the same security principles as regular web applications, and must be audited as such. Angular-specific APIs that should be audited in a security review, such as the `bypassSecurityTrust` methods, are marked in the documentation as security sensitive.

## Accessibility

- The web is used by a wide variety of people, including those who have visual or motor impairments. A variety of assistive technologies are available that make it much easier for these groups to interact with web-based software applications. Also, designing an application to be more accessible generally improves the user experience for all users.

- For an in-depth introduction to issues and techniques for designing accessible applications, see the [Accessibility](https://developers.google.com/web/fundamentals/accessibility/#what_is_accessibility) section of the Google's [Web Fundamentals](https://developers.google.com/web/fundamentals).

### Accessibility attributes

- Building accessible web experience often involves setting Accessible Rich Internet Applications (ARIA) attributes to provide semantic meaning where it might otherwise be missing. Use attribute binding template syntax to control the values of accessibility-related attributes.

- When binding to ARIA attributes in Angular, you must use the attr. prefix. The ARIA specification depends specifically on HTML attributes rather than properties of DOM elements.

  ```
  <!-- Use attr. when binding to an ARIA attribute -->
  <button [attr.aria-label]="myActionLabel">…</button>
  ```

- NOTE

  - This syntax is only necessary for attribute bindings. Static ARIA attributes require no extra syntax.
    ```
    <!-- Static ARIA attributes require no extra syntax -->
    <button aria-label="Save document">…</button>
    ```

- By convention, HTML attributes use lowercase names (`tabindex`), while properties use camelCase names (`tabIndex`).

  - See the [Binding syntax](https://angular.io/guide/binding-syntax#html-attribute-vs-dom-property) guide for more background on the difference between attributes and properties.

### Angular UI components

- The `Angular Material` library, which is maintained by the Angular team, is a suite of reusable UI components that aims to be fully accessible. The `Component Development Kit (CDK)` includes the `a11y` package that provides tools to support various areas of accessibility. For example:

  - `LiveAnnouncer` is used to announce messages for screen-reader users using an `aria-live` region. See the W3C documentation for more information on `aria-live regions`.

  - The `cdkTrapFocus` directive traps Tab-key focus within an element. Use it to create accessible experience for components such as modal dialogs, where focus must be constrained.

- For full details of these and other tools, see the `Angular CDK accessibility overview`.

#### Augmenting native elements

- Native HTML elements capture several standard interaction patterns that are important to accessibility. When authoring Angular components, you should re-use these native elements directly when possible, rather than re-implementing well-supported behaviors.

- For example, instead of creating a custom element for a new variety of button, create a component that uses an attribute selector with a native `<button>` element. This most commonly applies to `<button>` and `<a>`, but can be used with many other types of element.

- You can see examples of this pattern in Angular Material: `MatButton`, `MatTabNav`, and `MatTable`.

#### Using containers for native elements

- Sometimes using the appropriate native element requires a container element. For example, the native `<input>` element cannot have children, so any custom text entry components need to wrap an `<input>` with extra elements. By just including `<input>` in your custom component's template, it's impossible for your component's users to set arbitrary properties and attributes to the `<input>` element. Instead, create a container component that uses content projection to include the native control in the component's API.

- You can see `MatFormField` as an example of this pattern.

### Case study: Building a custom progress bar

- The following example shows how to make a progress bar accessible by using host binding to control accessibility-related attributes.

  - The component defines an accessibility-enabled element with both the standard HTML attribute `role`, and ARIA attributes. The ARIA attribute `aria-valuenow` is bound to the user's input.

    - src/app/progress-bar.component.ts

      ```
      import { Component, Input } from '@angular/core';

      /**
      * Example progressbar component.
      */
      @Component({
        selector: 'app-example-progressbar',
        template: '<div class="bar" [style.width.%]="value"></div>',
        styleUrls: ['./progress-bar.component.css'],
        host: {
          // Sets the role for this component to "progressbar"
          role: 'progressbar',

          // Sets the minimum and maximum values for the progressbar role.
          'aria-valuemin': '0',
          'aria-valuemax': '100',

          // Binding that updates the current value of the progressbar.
          '[attr.aria-valuenow]': 'value',
        }
      })
      export class ExampleProgressbarComponent  {
        /** Current value of the progressbar. */
        @Input() value = 0;
      }
      ```

  - In the template, the `aria-label` attribute ensures that the control is accessible to screen readers.

    - src/app/app.component.html

      ```
      <label>
        Enter an example progress value
        <input type="number" min="0" max="100"
            [value]="progress" (input)="setProgress($event)">
      </label>

      <!-- The user of the progressbar sets an aria-label to communicate what the progress means. -->
      <app-example-progressbar [value]="progress" aria-label="Example of a progress bar">
      </app-example-progressbar>
      ```

### Routing

#### Focus management after navigation

- Tracking and controlling focus in a UI is an important consideration in designing for accessibility. When using Angular routing, you should decide where page focus goes upon navigation.

- To avoid relying solely on visual cues, you need to make sure your routing code updates focus after page navigation. Use the `NavigationEnd` event from the `Router` service to know when to update focus.

- The following example shows how to find and focus the main content header in the DOM after navigation.

  ```
  router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe(() => {
    const mainHeader = document.querySelector('#main-content-header')
    if (mainHeader) {
      mainHeader.focus();
    }
  });
  ```

- In a real application, the element that receives focus depends on your specific application structure and layout. The focused element should put users in a position to immediately move into the main content that has just been routed into view. You should avoid situations where focus returns to the body element after a route change.

#### Active links identification

- CSS classes applied to active `RouterLink` elements, such as `RouterLinkActive`, provide a visual cue to identify the active link. Unfortunately, a visual cue doesn't help blind or visually impaired users. Applying the `aria-current` attribute to the element can help identify the active link. For more information, see Mozilla Developer Network (MDN) aria-current).

- The `RouterLinkActive` directive provides the `ariaCurrentWhenActive` input which sets the `aria-current` to a specified value when the link becomes active.

- The following example shows how to apply the `active-page` class to active links as well as setting their `aria-current` attribute to "page" when they are active:

  ```
  <nav>
    <a routerLink="home"
      routerLinkActive="active-page"
      ariaCurrentWhenActive="page">
      Home
    </a>
    <a routerLink="about"
      routerLinkActive="active-page"
      ariaCurrentWhenActive="page">
      About
    </a>
    <a routerLink="shop"
      routerLinkActive="active-page"
      ariaCurrentWhenActive="page">
      Shop
    </a>
  </nav>
  ```

## Keeping up-to-date

- Just like Web and the entire web ecosystem, Angular is continuously improving. Angular balances continuous improvement with a strong focus on stability and making updates straightforward. Keeping your Angular application up-to-date enables you to take advantage of leading-edge new features, as well as optimizations and bug fixes.

### Getting notified of new releases

- To be notified when new releases are available, follow [@angular](https://twitter.com/angular) on Twitter or subscribe to the [Angular blog](https://blog.angular.io/)

### Learning about new features

### Checking your version of Angular

- To check your application's version of Angular: From within your project directory, use the `ng version` command.

### Finding the current version of Angular

- The most recent stable released version of Angular appears in the Angular documentation at the bottom of the left side navigation. For example, `stable (v13.0.3)`.

- You can also find the most current version of Angular by using the CLI command `ng update`. By default, `ng update`(without additional arguments) lists the updates that are available to you.

### Updating your environment and apps

- To make updating uncomplicated, we provide complete instructions in the interactive Angular Update Guide.

- The Angular Update Guide provides customized update instructions, based on the current and target versions that you specify. It includes basic and advanced update paths, to match the complexity of your applications. It also includes troubleshooting information and any recommended manual changes to help you get the most out of the new release.

- For simple updates, the CLI command ng update is all you need. Without additional arguments, ng update lists the updates that are available to you and provides recommended steps to update your application to the most current version.

- Angular Versioning and Releases describes the level of change that you can expect based a release's version number. It also describes supported update paths.

### Resource summary

- Release announcements: [Angular blog - release announcements](https://blog.angular.io/tagged/release%20notes)

- Release announcements (older): [Angular blog - announcements about releases prior to August 2017](https://blog.angularjs.org/search?q=available&by-date=true)

- Release details: [Angular change log](https://github.com/angular/angular/blob/main/CHANGELOG.md)

- Update instructions: [Angular Update Guide](https://update.angular.io/)

- Update command reference: [Angular CLI ng update command reference](https://angular.io/cli/update)

- Versioning, release, support, and deprecation practices: [Angular versioning and releases](https://angular.io/guide/releases)

## Property binding best practices

### Avoid side effects

- Evaluation of a template expression should have no visible side effects. Use the syntax for template expressions to help avoid side effects. In general, the correct syntax prevents you from assigning a value to anything in a property binding expression. The syntax also prevents you from using increment and decrement operators.

#### An example of producing side effects

- If you had an expression that changed the value of something else that you were binding to, that change of value would be a side effect. Angular might or might not display the changed value. If Angular does detect the change, it throws an error.

- As a best practice, use only properties and methods that return values.

### Return the proper type

- A template expression should result in the type of value that the target property expects. For example, return:

  - a string, if the target property expects a string
  - a number, if it expects a number
  - an object, if it expects an object.

#### Passing in a string

- In the following example, the `childItem` property of the `ItemDetailComponent` expects a string.

  - src/app/app.component.html
    ```
    <app-item-detail [childItem]="parentItem"></app-item-detail>
    ```

- Confirm this expectation by looking in the `ItemDetailComponent` where the `@Input()` type is string:

  - src/app/item-detail/item-detail.component.ts (setting the @Input() type)
    ```
    @Input() childItem = '';
    ```

- The `parentItem` in `AppComponent` is a string, which means that the expression, `parentItem` within `[childItem]="parentItem"`, evaluates to a string.

  - src/app/app.component.ts
    ```
    parentItem = 'lamp';
    ```

- If parentItem were some other type, you would need to specify `childItem` `@Input()` as that type as well.

#### Passing in an object

- In this example, `ItemListComponent` is a child component of `AppComponent` and the `items` property expects an array of objects.

  - src/app/app.component.html
    ```
    <app-item-list [items]="currentItems"></app-item-list>
    ```

- In the `ItemListComponent` the `@Input()`, `items`, has a type of `Item[]`.

  - src/app/item-list.component.ts
    ```
    @Input() items: Item[] = [];
    ```

- Notice that `Item` is an object that it has two properties, an `id` and a `name`.

  - src/app/item.ts
    ```
    export interface Item {
      id: number;
      name: string;
    }
    ```

- In `app.component.ts`, `currentItems` is an array of objects in the same shape as the `Item` object in `items.ts`, with an `id` and a `name`.

  - src/app.component.ts
    ```
    currentItems = [{
      id: 21,
      name: 'phone'
    }];
    ```

- By supplying an object in the same shape, you meet the expectations of `items` when Angular evaluates the expression `currentItems`.

## [Lazy loading feature modules](../challenge-014/README.md#Lazy-loading-feature-modules)

## Lightweight injection tokens for libraries

### Optimizing client app size with lightweight injection tokens

- This page provides a conceptual overview of a dependency injection technique that is recommended for library developers. Designing your library with lightweight injection tokens helps optimize the bundle size of client applications that use your library.

- You can manage the dependency structure among your components and injectable services to optimize bundle size by using tree-shakable providers. This normally ensures that if a provided component or service is never actually used by the app, the compiler can eliminate its code from the bundle.

- However, due to the way Angular stores injection tokens, it is possible that such an unused component or service can end up in the bundle anyway. This page describes a dependency-injection design pattern that supports proper tree-shaking by using lightweight injection tokens.

- The lightweight injection token design pattern is especially important for library developers. It ensures that when an application uses only some of your library's capabilities, the unused code can be eliminated from the client's application bundle.

- When an application uses your library, there might be some services that your library supplies which the client application doesn't use. In this case, the application developer should expect that service to be tree-shaken, and not contribute to the size of the compiled application. Because the application developer cannot know about or remedy a tree-shaking problem in the library, it is the responsibility of the library developer to do so. To prevent the retention of unused components, your library should use the lightweight injection token design pattern.

### When tokens are retained

- To better explain the condition under which token retention occurs, consider a library that provides a library-card component, which contains a body and can contain an optional header.

  ```
  <lib-card>
    <lib-header>…</lib-header>
  </lib-card>
  ```

- In a likely implementation, the `<lib-card>` component uses `@ContentChild()` or `@ContentChildren()` to obtain `<lib-header>` and `<lib-body>`, as in the following.

  ```
  @Component({
  selector: 'lib-header',
    …,
  })
  class LibHeaderComponent {}

  @Component({
    selector: 'lib-card',
    …,
  })
  class LibCardComponent {
    @ContentChild(LibHeaderComponent)
    header: LibHeaderComponent|null = null;
  }
  ```

- Because `<lib-header>` is optional, the element can appear in the template in its minimal form, `<lib-card></lib-card>`. In this case, `<lib-header>` is not used and you would expect it to be tree-shaken, but that is not what happens. This is because `LibCardComponent` actually contains two references to the `LibHeaderComponent`.

  ```
  @ContentChild(LibHeaderComponent) header: LibHeaderComponent;
  ```

  - One of these reference is in the type position-- that is, it specifies `LibHeaderComponent` as a type: `header: LibHeaderComponent;`.

  - The other reference is in the value position-- that is, LibHeaderComponent is the value of the `@ContentChild()` parameter decorator: `@ContentChild(LibHeaderComponent)`.

- The compiler handles token references in these positions differently.

  - The compiler erases _type position_ references after conversion from TypeScript, so they have no impact on tree-shaking.

  - The compiler must retain _value position_ references at runtime, which prevents the component from being tree-shaken.

- In the example, the compiler retains the `LibHeaderComponent` token that occurs in the value position, which prevents the referenced component from being tree-shaken, even if the application developer does not actually use `<lib-header>` anywhere. If `LibHeaderComponent` is large (code, template, and styles), including it unnecessarily can significantly increase the size of the client application.

### When to use the lightweight injection token pattern

- The tree-shaking problem arises when a component is used as an injection token. There are two cases when that can happen.

  - The token is used in the value position of a `content query`.
  - The token is used as a type specifier for constructor injection.

- In the following example, both uses of the `OtherComponent` token cause retention of `OtherComponent` (that is, prevent it from being tree-shaken when it is not used).

  ```
  class MyComponent {
    constructor(@Optional() other: OtherComponent) {}

    @ContentChild(OtherComponent)
    other: OtherComponent|null;
  }
  ```

- Although tokens used only as type specifiers are removed when converted to JavaScript, all tokens used for dependency injection are needed at runtime. These effectively change `constructor(@Optional() other: OtherComponent)` to `constructor(@Optional() @Inject(OtherComponent) other)`. The token is now in a value position, and causes the tree shaker to retain the reference.

  - For all services, a library should use tree-shakable providers, providing dependencies at the root level rather than in component constructors.

### Using lightweight injection tokens

- The lightweight injection token design pattern consists of using a small abstract class as an injection token, and providing the actual implementation at a later stage. The abstract class is retained (not tree-shaken), but it is small and has no material impact on the application size.

- The following example shows how this works for the `LibHeaderComponent`.

  ```
  abstract class LibHeaderToken {}

  @Component({
    selector: 'lib-header',
    providers: [
      {provide: LibHeaderToken, useExisting: LibHeaderComponent}
    ]
    …,
  })
  class LibHeaderComponent extends LibHeaderToken {}

  @Component({
    selector: 'lib-card',
    …,
  })
  class LibCardComponent {
    @ContentChild(LibHeaderToken) header: LibHeaderToken|null = null;
  }
  ```

- In this example, the `LibCardComponent` implementation no longer refers to `LibHeaderComponent` in either the type position or the value position. This lets full tree shaking of `LibHeaderComponent` take place. The `LibHeaderToken` is retained, but it is only a class declaration, with no concrete implementation. It is small and does not materially impact the application size when retained after compilation.

- Instead, `LibHeaderComponent` itself implements the abstract `LibHeaderToken` class. You can safely use that token as the provider in the component definition, allowing Angular to correctly inject the concrete type.

- To summarize, the lightweight injection token pattern consists of the following.

  1. A lightweight injection token that is represented as an abstract class.
  2. A component definition that implements the abstract class.
  3. Injection of the lightweight pattern, using `@ContentChild()` or `@ContentChildren()`.
  4. A provider in the implementation of the lightweight injection token which associates the lightweight injection token with the implementation.

#### Use the lightweight injection token for API definition

- A component that injects a lightweight injection token might need to invoke a method in the injected class. Because the token is now an abstract class, and the injectable component implements that class, you must also declare an abstract method in the abstract lightweight injection token class. The implementation of the method (with all of its code overhead) resides in the injectable component that can be tree-shaken. This lets the parent communicate with the child (if it is present) in a type-safe manner.

- For example, the `LibCardComponent` now queries `LibHeaderToken` rather than `LibHeaderComponent`. The following example shows how the pattern lets `LibCardComponent` communicate with the `LibHeaderComponent` without actually referring to `LibHeaderComponent`.

  ```
  abstract class LibHeaderToken {
    abstract doSomething(): void;
  }

  @Component({
    selector: 'lib-header',
    providers: [
      {provide: LibHeaderToken, useExisting: LibHeaderComponent}
    ]
    …,
  })
  class LibHeaderComponent extends LibHeaderToken {
    doSomething(): void {
      // Concrete implementation of `doSomething`
    }
  }

  @Component({
    selector: 'lib-card',
    …,
  })
  class LibCardComponent implement AfterContentInit {
    @ContentChild(LibHeaderToken)
    header: LibHeaderToken|null = null;

    ngAfterContentInit(): void {
      this.header && this.header.doSomething();
    }
  }
  ```

  - In this example the parent queries the token to obtain the child component, and stores the resulting component reference if it is present. Before calling a method in the child, the parent component checks to see if the child component is present. If the child component has been tree-shaken, there is no runtime reference to it, and no call to its method.

#### Naming your lightweight injection token

- Lightweight injection tokens are only useful with components. The Angular style guide suggests that you name components using the "Component" suffix. The example "LibHeaderComponent" follows this convention.

- To maintain the relationship between the component and its token while still distinguishing between them, the recommended style is to use the component base name with the suffix "Token" to name your lightweight injection tokens: "LibHeaderToken".
