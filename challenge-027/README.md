# Angular tools

## Development workflow

### Deploying applications

- When you are ready to deploy your Angular application to a remote server, you have various options for deployment.

#### Simple deployment options

- Before fully deploying your application, you can test the process, build configuration, and deployed behavior by using one of these interim techniques.

##### Building and serving from disk

- During development, you typically use the `ng serve` command to build, watch, and serve the application from local memory, using [webpack-dev-server](https://webpack.js.org/guides/development/#webpack-dev-server). When you are ready to deploy, however, you must use the `ng build` command to build the application and deploy the build artifacts elsewhere.

- Both `ng build` and `ng serve` clear the output folder before they build the project, but only the `ng build` command writes the generated build artifacts to the output folder.

- The output folder is `dist/project-name/` by default. To output to a different folder, change the `outputPath` in `angular.json`.

- As you near the end of the development process, serving the contents of your output folder from a local web server can give you a better idea of how your application will behave when it is deployed to a remote server. You will need two terminals to get the live-reload experience.

  - On the first terminal, run the `ng build` command in _watch_ mode to compile the application to the `dist` folder.

    ```
    ng build --watch
    ```

    - Like the `ng serve` command, this regenerates output files when source files change.

  - On the second terminal, install a web server (such as [lite-server](https://github.com/johnpapa/lite-server)), and run it against the output folder. For example:

    ```
    lite-server --baseDir="dist/project-name"
    ```

    - The server will automatically reload your browser when new files are output.

- This method is for development and testing only, and is not a supported or secure way of deploying an application.

##### Automatic deployment with the CLI

- The Angular CLI command `ng deploy` (introduced in version 8.3.0) executes the `deploy` [CLI builder](https://angular.io/guide/cli-builder) associated with your project. A number of third-party builders implement deployment capabilities to different platforms. You can add any of them to your project by running `ng add [package name]`.

- When you add a package with deployment capability, it'll automatically update your workspace configuration (`angular.json` file) with a `deploy` section for the selected project. You can then use the `ng deploy` command to deploy that project.

  - For example, the following command automatically deploys a project to Firebase.

    ```
    ng add @angular/fire
    ng deploy
    ```

    - The command is interactive. In this case, you must have or create a Firebase account, and authenticate using that account. The command prompts you to select a Firebase project for deployment

    - The command builds your application and uploads the production assets to Firebase.

- In the table below, you can find a list of packages which implement deployment functionality to different platforms. The `deploy` command for each package may require different command line options. You can read more by following the links associated with the package names below:

  | DEPLOYMENT TO                                                     | PACKAGE                                                                            |
  | ----------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
  | [Firebase hosting](https://firebase.google.com/docs/hosting)      | [@angular/fire](https://npmjs.org/package/@angular/fire)                           |
  | [Vercel](https://vercel.com/solutions/angular)                    | [vercel init angular](https://github.com/vercel/vercel/tree/main/examples/angular) |
  | [Netlify](https://www.netlify.com/)                               | [@netlify-builder/deploy](https://npmjs.org/package/@netlify-builder/deploy)       |
  | [GitHub pages](https://pages.github.com/)                         | [angular-cli-ghpages](https://npmjs.org/package/angular-cli-ghpages)               |
  | [NPM](https://npmjs.com/)                                         | [ngx-deploy-npm](https://npmjs.org/package/ngx-deploy-npm)                         |
  | [Amazon Cloud S3](https://aws.amazon.com/s3/?nc2=h_ql_prod_st_s3) | [@jefiozie/ngx-aws-deploy](https://www.npmjs.com/package/@jefiozie/ngx-aws-deploy) |

- If you're deploying to a self-managed server or there's no builder for your favorite cloud platform, you can either create a builder that allows you to use the `ng deploy` command, or read through this guide to learn how to manually deploy your application.

##### Basic deployment to a remote server

- For the simplest deployment, create a production build and copy the output directory to a web server.

  - 1. Start with the production build:

    ```
    ng build
    ```

  - 2. Copy everything within the output folder (`dist/project-name/` by default) to a folder on the server.

  - 3. Configure the server to redirect requests for missing files to `index.html`. Learn more about server-side redirects below.

- This is the simplest production-ready deployment of your application.

##### Deploy to GitHub Pages

- To deploy your Angular application to GitHub Pages, complete the following steps:

  - 1. Create a GitHub repository for your project.

  - 2. Configure `git` in your local project by adding a remote that specifies the GitHub repository you created in previous step. GitHub provides these commands when you create the repository so that you can copy and paste them at your command prompt. The commands should be similar to the following, though GitHub fills in your project-specific settings for you:

    ```
    git remote add origin https://github.com/your-username/your-project-name.git
    git branch -M main
    git push -u origin main
    ```

  - 3. Create and check out a git branch named `gh-pages`.

    ```
    git checkout -b gh-pages
    ```

  - 4. Build your project using the GitHub project name, with the Angular CLI command `ng build` and the following options, where `your_project_name` is the name of the project that you gave the GitHub repository in step 1.

    - Be sure to include the slashes on either side of your project name as in `/your_project_name/`.

      ```
      ng build --output-path docs --base-href /your_project_name/
      ```

  - 5. When the build is complete, make a copy of `docs/index.html` and name it `docs/404.html`.

  - 6. Commit your changes and push.

  - 7. On the GitHub project page, go to Settings and scroll down to the GitHub Pages section to configure the site to `publish from the docs folder`.

  - 8. Click Save.

  - 9. Click on the GitHub Pages link at the top of the GitHub Pages section to see your deployed application. The format of the link is `https://<user_name>.github.io/<project_name>`.

- Check out [angular-cli-ghpages](https://github.com/angular-buch/angular-cli-ghpages), a full-featured package that does all this for you and has extra functionality.

#### Server configuration

- This section covers changes you may have to make to the server or to files deployed on the server.

##### Routed apps must fall back to index.html

- Angular applications are perfect candidates for serving with a simple static HTML server. You don't need a server-side engine to dynamically compose application pages because Angular does that on the client-side.

- If the application uses the Angular router, you must configure the server to return the application's host page (`index.html`) when asked for a file that it does not have.

- A routed application should support "deep links". A _deep link_ is a URL that specifies a path to a component inside the application. For example, `http://www.mysite.com/heroes/42` is a _deep link_ to the hero detail page that displays the hero with `id: 42`.

- There is no issue when the user navigates to that URL from within a running client. The Angular router interprets the URL and routes to that page and hero.

- But clicking a link in an email, entering it in the browser address bar, or merely refreshing the browser while on the hero detail page —all of these actions are handled by the browser itself, outside the running application. The browser makes a direct request to the server for that URL, bypassing the router.

- A static server routinely returns `index.html` when it receives a request for `http://www.mysite.com/`. But it rejects `http://www.mysite.com/heroes/42` and returns a `404 - Not Found` error unless it is configured to return `index.html` instead.

- **Fallback configuration examples**

  - There is no single configuration that works for every server. The following sections describe configurations for some of the most popular servers. The list is by no means exhaustive, but should provide you with a good starting point.

  - Ref:
    https://angular.io/guide/deployment#fallback-configuration-examples

  - [Apache](https://httpd.apache.org/)

    - Add a [rewrite rule](https://httpd.apache.org/docs/current/mod/mod_rewrite.html) to the `.htaccess` file as shown (https://ngmilk.rocks/2015/03/09/angularjs-html5-mode-or-pretty-urls-on-apache-using-htaccess):

    ```
    RewriteEngine On
      # If an existing asset or directory is requested go to it as it is
      RewriteCond %{DOCUMENT_ROOT}%{REQUEST_URI} -f [OR]
      RewriteCond %{DOCUMENT_ROOT}%{REQUEST_URI} -d
      RewriteRule ^ - [L]

      # If the requested resource doesn't exist, use index.html
      RewriteRule ^ /index.html
    ```

  - [Nginx](https://nginx.org/)

    - Use `try_files`, as described in [Front Controller Pattern Web Apps](https://www.nginx.com/resources/wiki/start/topics/tutorials/config_pitfalls/#front-controller-pattern-web-apps), modified to serve `index.html`:

      ```
      try_files $uri $uri/ /index.html;
      ```

  - [Ruby](https://www.ruby-lang.org/)

    - Create a Ruby server using ([sinatra](http://sinatrarb.com/)) with a basic Ruby file that configures the server `server.rb`:

      ```
      require 'sinatra'

      # Folder structure
      # .
      # -- server.rb
      # -- public
      #    |-- project-name
      #        |-- index.html

      get '/' do
        folderDir = settings.public_folder + '/project-name'  # ng build output folder
        send_file File.join(folderDir, 'index.html')
      end
      ```

  - [IIS](https://www.iis.net/)

    - Add a rewrite rule to `web.config`, similar to the one shown [here](https://stackoverflow.com/a/26152011):

      ```
      <system.webServer>
        <rewrite>
          <rules>
            <rule name="Angular Routes" stopProcessing="true">
              <match url=".*" />
              <conditions logicalGrouping="MatchAll">
                <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
                <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
              </conditions>
              <action type="Rewrite" url="/index.html" />
            </rule>
          </rules>
        </rewrite>
      </system.webServer>
      ```

  - [GitHub Pages](https://pages.github.com/) - You can't [directly configure](https://github.com/isaacs/github/issues/408) the GitHub Pages server, but you can add a 404 page. Copy `index.html` into `404.html`. It will still be served as the 404 response, but the browser will process that page and load the application properly. It's also a good idea to [serve from `docs` on main](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site#choosing-a-publishing-source) and to [create a `.nojekyll` file](https://www.bennadel.com/blog/3181-including-node-modules-and-vendors-folders-in-your-github-pages-site.htm)

  - [Firebase hosting](https://firebase.google.com/docs/hosting)

    - Add a [rewrite rule](https://firebase.google.com/docs/hosting/url-redirects-rewrites#section-rewrites).

      ```
      "rewrites": [ {
        "source": "**",
        "destination": "/index.html"
      } ]
      ```

##### Configuring correct MIME-type for JavaScript assets

- All of your application JavaScript files must be served by the server with the [Content-Type header](https://developer.mozilla.org/docs/Web/HTTP/Headers/Content-Type) set to `text/javascript` or another [JavaScript-compatible MIME-type](https://developer.mozilla.org/docs/Web/HTTP/Basics_of_HTTP/MIME_types#textjavascript)

- Most servers and hosting services already do this by default.

- Server with misconfigured mime-type for JavaScript files will cause an application to fail to start with the following error:

  ```
  Failed to load module script: The server responded with a non-JavaScript MIME type of "text/plain". Strict MIME type checking is enforced for module scripts per HTML spec.
  ```

- If this is the case, you will need to check your server configuration and reconfigure it to serve `.js` files with `Content-Type: text/javascript`. See your server's manual for instructions on how to do this.

##### Requesting services from a different server (CORS)

- Angular developers may encounter a [cross-origin resource sharing](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing) error when making a service request (typically a data service request) to a server other than the application's own host server. Browsers forbid such requests unless the server permits them explicitly.

- There isn't anything the client application can do about these errors. The server must be configured to accept the application's requests. Read about how to enable CORS for specific servers at [enable-cors.org](https://enable-cors.org/server.html)

#### Production optimizations

- The `production` configuration engages the following build optimization features.

  | FEATURES                        | DETAILS                                                                  |
  | ------------------------------- | ------------------------------------------------------------------------ |
  | Ahead-of-Time (AOT) Compilation | Pre-compiles Angular component templates.                                |
  | Production mode                 | Deploys the production environment which enables _production mode_.      |
  | Bundling                        | Concatenates your many application and library files into a few bundles. |
  | Minification                    | Removes excess whitespace, comments, and optional tokens.                |
  | Uglification                    | Rewrites code to use short, cryptic variable and function names.         |
  | Dead code elimination           | Removes unreferenced modules and much unused code.                       |

##### Enable runtime production mode

- In addition to build optimizations, Angular also has a runtime production mode. Angular applications run in development mode by default, as you can see by the following message on the browser console:

  ```
  Angular is running in development mode.
  Call `enableProdMode()` to enable production mode.
  ```

- Production mode improves application performance by disabling development-only safety checks and debugging utilities, such as the expression-changed-after-checked detection. Building your application with the production configuration automatically enables Angular's runtime production mode.

##### Lazy loading

- You can dramatically reduce launch time by only loading the application modules that absolutely must be present when the application starts.

- Configure the Angular Router to defer loading of all other modules (and their associated code), either by `waiting until the app has launched` or by _lazy loading_ them on demand.

- DON'T EAGERLY IMPORT SOMETHING FROM A LAZY-LOADED MODULE

  - If you mean to lazy-load a module, be careful not to import it in a file that's eagerly loaded when the application starts (such as the root `AppModule`). If you do that, the module will be loaded immediately.

  - The bundling configuration must take lazy loading into consideration. Because lazy-loaded modules aren't imported in JavaScript, bundlers exclude them by default. Bundlers don't know about the router configuration and can't create separate bundles for lazy-loaded modules. You would have to create these bundles manually.

  - The CLI runs the [Angular Ahead-of-Time Webpack Plugin](https://github.com/angular/angular-cli/tree/main/packages/ngtools/webpack) which automatically recognizes lazy-loaded NgModules and creates separate bundles for them.

##### Measure performance

- You can make better decisions about what to optimize and how when you have a clear and accurate understanding of what's making the application slow. The cause may not be what you think it is. You can waste a lot of time and money optimizing something that has no tangible benefit or even makes the application slower.

- You should measure the application's actual behavior when running in the environments that are important to you.

- The [Chrome DevTools Network Performance page](https://developer.chrome.com/docs/devtools/network/reference) is a good place to start learning about measuring performance.

- The [WebPageTest](https://www.webpagetest.org/) tool is another good choice that can also help verify that your deployment was successful.

##### Inspect the bundles

- The [source-map-explorer](https://github.com/danvk/source-map-explorer/blob/master/README.md) tool is a great way to inspect the generated JavaScript bundles after a production build.

- Install `source-map-explorer`:

  ```
  npm install source-map-explorer --save-dev
  ```

- Build your application for production _including the source maps_

  ```
  ng build --source-map
  ```

- List the generated bundles in the `dist/project-name/` folder.

  ```
  ls dist/project-name/*.js
  ```

- Run the explorer to generate a graphical representation of one of the bundles. The following example displays the graph for the _main_ bundle.

  ```
  node_modules/.bin/source-map-explorer dist/project-name/main*
  ```

- The `source-map-explorer` analyzes the source map generated with the bundle and draws a map of all dependencies, showing exactly which classes are included in the bundle.

- Here's the output for the main bundle of an example application called `cli-quickstart`.

  ![](https://angular.io/generated/images/guide/deployment/quickstart-sourcemap-explorer.png)

#### The base tag

- The HTML `<base href="..." />` specifies a base path for resolving relative URLs to assets such as images, scripts, and style sheets. For example, given the `<base href="/my/app/">`, the browser resolves a URL such as `some/place/foo.jpg` into a server request for `my/app/some/place/foo.jpg`. During navigation, the Angular router uses the _base href_ as the base path to component, template, and module files.

  - See also the [APP_BASE_HREF](https://angular.io/api/common/APP_BASE_HREF) alternative.

- In development, you typically start the server in the folder that holds `index.html`. That's the root folder and you'd add `<base href="/">` near the top of index.html because `/` is the root of the application.

- But on the shared or production server, you might serve the application from a subfolder. For example, when the URL to load the application is something like `http://www.mysite.com/my/app`, the subfolder is `my/app/` and you should add `<base href="/my/app/">` to the server version of the `index.html`.

- When the `base` tag is mis-configured, the application fails to load and the browser console displays `404 - Not Found` errors for the missing files. Look at where it tried to find those files and adjust the base tag appropriately.

#### The deploy url

- A command line option used to specify the base path for resolving relative URLs for assets such as images, scripts, and style sheets at compile time. For example: `ng build --deploy-url /my/assets`.

- The effects of defining a `deploy url` and `base href` can overlap.

  - Both can be used for initial scripts, stylesheets, lazy scripts, and css resources.

- However, defining a `base href` has a few unique effects.

  - Defining a `base href` can be used for locating relative template (HTML) assets, and relative fetch/XMLHttpRequests.

- The base href can also be used to define the Angular router's default base (see `APP_BASE_HREF`). Users with more complicated setups may need to manually configure the `APP_BASE_HREF` token within the application (for example, application routing base is `/` but `assets/scripts/etc.` are at `/assets/`).

- Unlike the `base href` which can be defined in a single place, the `deploy url` needs to be hard-coded into an application at build time. This means specifying a `deploy url` will decrease build speed, but this is the unfortunate cost of using an option that embeds itself throughout an application. That is why a `base href` is generally the better option.

### AOT compiler

#### Ahead-of-Time compilation

- An Angular application consists mainly of components and their HTML templates. Because the components and templates provided by Angular cannot be understood by the browser directly, Angular applications require a compilation process before they can run in a browser.

- The Angular `ahead-of-time (AOT)` compiler converts your Angular HTML and TypeScript code into efficient JavaScript code during the build phase before the browser downloads and runs that code. Compiling your application during the build process provides a faster rendering in the browser.

- This guide explains how to specify metadata and apply available compiler options to compile your applications efficiently using the AOT compiler.

- Here are some reasons you might want to use AOT.

  - Faster rendering

    - With AOT, the browser downloads a pre-compiled version of the application. The browser loads executable code so it can render the application immediately, without waiting to compile the application first.

  - Fewer asynchronous requests

    - The compiler inlines external HTML templates and CSS style sheets within the application JavaScript, eliminating separate ajax requests for those source files.

  - Smaller Angular framework download size

    - There's no need to download the Angular compiler if the application is already compiled. The compiler is roughly half of Angular itself, so omitting it dramatically reduces the application payload.

  - Detect template errors earlier

    - The AOT compiler detects and reports template binding errors during the build step before users can see them.

  - Better security
    - AOT compiles HTML templates and components into JavaScript files long before they are served to the client. With no templates to read and no risky client-side HTML or JavaScript evaluation, there are fewer opportunities for injection attacks.

##### Choosing a compiler

- Angular offers two ways to compile your application:

  | ANGULAR COMPILE     | DETAILS                                                                                           |
  | ------------------- | ------------------------------------------------------------------------------------------------- |
  | Just-in-Time (JIT)  | Compiles your application in the browser at runtime. This was the default until Angular 8.        |
  | Ahead-of-Time (AOT) | Compiles your application and libraries at build time. This is the default starting in Angular 9. |

- When you run the `ng build` (build only) or `ng serve` (build and serve locally) CLI commands, the type of compilation (JIT or AOT) depends on the value of the `aot` property in your build configuration specified in `angular.json`. By default, `aot` is set to `true` for new CLI applications.

##### How AOT works

- The Angular AOT compiler extracts metadata to interpret the parts of the application that Angular is supposed to manage. You can specify the metadata explicitly in decorators such as `@Component()` and `@Input()`, or implicitly in the constructor declarations of the decorated classes. The metadata tells Angular how to construct instances of your application classes and interact with them at runtime.

- In the following example, the `@Component()` metadata object and the class constructor tell Angular how to create and display an instance of `TypicalComponent`.

  ```
  @Component({
    selector: 'app-typical',
    template: '<div>A typical component for {{data.name}}</div>'
  })
  export class TypicalComponent {
    @Input() data: TypicalData;
    constructor(private someService: SomeService) { … }
  }
  ```

- The Angular compiler extracts the metadata once and generates a factory for TypicalComponent. When it needs to create a TypicalComponent instance, Angular calls the factory, which produces a new visual element, bound to a new instance of the component class with its injected dependency.

- Compilation phases

  - There are three phases of AOT compilation.

    - 1: code analysis

      - In this phase, the TypeScript compiler and AOT collector create a representation of the source. The collector does not attempt to interpret the metadata it collects. It represents the metadata as best it can and records errors when it detects a metadata syntax violation.

    - 2: code generation

      - In this phase, the compiler's `StaticReflector` interprets the metadata collected in phase 1, performs additional validation of the metadata, and throws an error if it detects a metadata restriction violation.

    - 3: template type checking
      - In this optional phase, the Angular template compiler uses the TypeScript compiler to validate the binding expressions in templates. You can enable this phase explicitly by setting the `fullTemplateTypeCheck` configuration option; see `Angular compiler options`.

- Metadata restrictions

  - You write metadata in a subset of TypeScript that must conform to the following general constraints:

    - Limit expression syntax to the supported subset of JavaScript
    - Only reference exported symbols after code folding
    - Only call functions supported by the compiler
    - Decorated and data-bound class members must be public

  - Errors in AOT compilation commonly occur because of metadata that does not conform to the compiler's requirements (as described more fully below). For help in understanding and resolving these problems, see `AOT Metadata Errors`.

- Configuring AOT compilation
  - You can provide options in the TypeScript configuration file that controls the compilation process. See Angular compiler options for a complete list of available options.

##### Phase 1: Code analysis

- The TypeScript compiler does some of the analytic work of the first phase. It emits the `.d.ts` type definition files with type information that the AOT compiler needs to generate application code. At the same time, the AOT collector analyzes the metadata recorded in the Angular decorators and outputs metadata information in `.metadata.json` files, one per `.d.ts` file.

- You can think of `.metadata.json` as a diagram of the overall structure of a decorator's metadata, represented as an [abstract syntax tree (AST)](https://en.wikipedia.org/wiki/Abstract_syntax_tree).

  - Angular's `schema.ts` describes the JSON format as a collection of TypeScript interfaces.

- Expression syntax limitations

  - The AOT collector only understands a subset of JavaScript. Define metadata objects with the following limited syntax:
    ...

  - If an expression uses unsupported syntax, the collector writes an error node to the `.metadata.json` file. The compiler later reports the error if it needs that piece of metadata to generate the application code.

    - If you want `ngc` to report syntax errors immediately rather than produce a `.metadata.json` file with errors, set the `strictMetadataEmit` option in the TypeScript configuration file.

      ```
      "angularCompilerOptions": {
        …
        "strictMetadataEmit" : true
      }
      ```

      - Angular libraries have this option to ensure that all Angular .metadata.json files are clean and it is a best practice to do the same when building your own libraries.

- No arrow functions

  - The AOT compiler does not support function expressions and arrow functions, also called lambda functions.

  - Consider the following component decorator:

    ```
    @Component({
      …
      providers: [{provide: server, useFactory: () => new Server()}]
    })
    ```

  - You can fix the error by converting to this:

    ```
    export function serverFactory() {
      return new Server();
    }

    @Component({
      …
      providers: [{provide: server, useFactory: serverFactory}]
    })
    ```

  - In version 5 and later, the compiler automatically performs this rewriting while emitting the .js file.

- Code folding

  - The compiler can only resolve references to exported symbols. The collector, however, can evaluate an expression during collection and record the result in the .metadata.json, rather than the original expression. This allows you to make limited use of non-exported symbols within expressions.

  - For example, the collector can evaluate the expression 1 + 2 + 3 + 4 and replace it with the result, 10. This process is called folding. An expression that can be reduced in this manner is foldable.

  - The collector can evaluate references to module-local const declarations and initialized var and let declarations, effectively removing them from the .metadata.json file.

  - Consider the following component definition:

    ```
    const template = '<div>{{hero.name}}</div>';

    @Component({
      selector: 'app-hero',
      template: template
    })
    export class HeroComponent {
      @Input() hero: Hero;
    }
    ```

  - The compiler could not refer to the `template` constant because it isn't exported. The collector, however, can fold the template constant into the metadata definition by in-lining its contents. The effect is the same as if you had written:

    ```
    @Component({
      selector: 'app-hero',
      template: '<div>{{hero.name}}</div>'
    })
    export class HeroComponent {
      @Input() hero: Hero;
    }
    ```

    - There is no longer a reference to template and, therefore, nothing to trouble the compiler when it later interprets the collector's output in .metadata.json.

  - You can take this example a step further by including the template constant in another expression:

    ```
    const template = '<div>{{hero.name}}</div>';

    @Component({
      selector: 'app-hero',
      template: template + '<div>{{hero.title}}</div>'
    })
    export class HeroComponent {
      @Input() hero: Hero;
    }
    ```

  - The collector reduces this expression to its equivalent _folded_ string:

    ```
    '<div>{{hero.name}}</div><div>{{hero.title}}</div>'
    ```

  - Foldable syntax
    - If an expression is not foldable, the collector writes it to .metadata.json as an AST for the compiler to resolve.

##### Phase 2: code generation

- The collector makes no attempt to understand the metadata that it collects and outputs to .metadata.json. It represents the metadata as best it can and records errors when it detects a metadata syntax violation. It's the compiler's job to interpret the .metadata.json in the code generation phase.

- The compiler understands all syntax forms that the collector supports, but it may reject syntactically correct metadata if the semantics violate compiler rules.

- Public symbols

  - The compiler can only reference exported symbols.

    - Decorated component class members must be public. You cannot make an `@Input()` property private or protected.

    - Data bound properties must also be public

- Supported classes and functions

  - The collector can represent a function call or object creation with new as long as the syntax is valid. The compiler, however, can later refuse to generate a call to a particular function or creation of a particular object.

  - The compiler can only create instances of certain classes, supports only core decorators, and only supports calls to macros (functions or static methods) that return expressions.

- Functions and static method calls

  - The collector accepts any function or static method that contains a single return statement. The compiler, however, only supports macros in the form of functions or static methods that return an expression.

  - For example, consider the following function:

    ```
    export function wrapInArray<T>(value: T): T[] {
      return [value];
    }
    ```

  - You can call the wrapInArray in a metadata definition because it returns the value of an expression that conforms to the compiler's restrictive JavaScript subset.

  - You might use wrapInArray() like this:

    ```
    @NgModule({
      declarations: wrapInArray(TypicalComponent)
    })
    export class TypicalModule {}
    ```

  - The compiler treats this usage as if you had written:

    ```
    @NgModule({
      declarations: [TypicalComponent]
    })
    export class TypicalModule {}
    ```

  - The Angular RouterModule exports two macro static methods, forRoot and forChild, to help declare root and child routes. Review the source code for these methods to see how macros can simplify configuration of complex NgModules.

- Metadata rewriting

  - The compiler treats object literals containing the fields useClass, useValue, useFactory, and data specially, converting the expression initializing one of these fields into an exported variable that replaces the expression. This process of rewriting these expressions removes all the restrictions on what can be in them because the compiler doesn't need to know the expression's value —it just needs to be able to generate a reference to the value.

  - You might write something like:

    ```
    class TypicalServer {

    }

    @NgModule({
      providers: [{provide: SERVER, useFactory: () => TypicalServer}]
    })
    export class TypicalModule {}
    ```

  - Without rewriting, this would be invalid because lambdas are not supported and TypicalServer is not exported. To allow this, the compiler automatically rewrites this to something like:

    ```
    class TypicalServer {

    }

    export const θ0 = () => new TypicalServer();

    @NgModule({
      providers: [{provide: SERVER, useFactory: θ0}]
    })
    export class TypicalModule {}
    ```

    - This allows the compiler to generate a reference to θ0 in the factory without having to know what the value of θ0 contains.

    - The compiler does the rewriting during the emit of the .js file. It does not, however, rewrite the .d.ts file, so TypeScript doesn't recognize it as being an export. And it does not interfere with the ES module's exported API.

##### Phase 3: Template type checking

- One of the Angular compiler's most helpful features is the ability to type-check expressions within templates, and catch any errors before they cause crashes at runtime. In the template type-checking phase, the Angular template compiler uses the TypeScript compiler to validate the binding expressions in templates.

- Enable this phase explicitly by adding the compiler option "fullTemplateTypeCheck" in the "angularCompilerOptions" of the project's TypeScript configuration file (see Angular Compiler Options).

- Template validation produces error messages when a type error is detected in a template binding expression, similar to how type errors are reported by the TypeScript compiler against code in a .ts file.

- For example, consider the following component:

  ```
  @Component({
    selector: 'my-component',
    template: '{{person.addresss.street}}'
  })
  class MyComponent {
    person?: Person;
  }
  ```

- This produces the following error:

  ```
  my.component.ts.MyComponent.html(1,1): : Property 'addresss' does not exist on type 'Person'. Did you mean 'address'?
  ```

- The file name reported in the error message, my.component.ts.MyComponent.html, is a synthetic file generated by the template compiler that holds contents of the MyComponent class template. The compiler never writes this file to disk. The line and column numbers are relative to the template string in the @Component annotation of the class, MyComponent in this case. If a component uses templateUrl instead of template, the errors are reported in the HTML file referenced by the templateUrl instead of a synthetic file.

- The error location is the beginning of the text node that contains the interpolation expression with the error. If the error is in an attribute binding such as [value]="person.address.street", the error location is the location of the attribute that contains the error.

- The validation uses the TypeScript type checker and the options supplied to the TypeScript compiler to control how detailed the type validation is. For example, if the strictTypeChecks is specified, the error

  ```
  my.component.ts.MyComponent.html(1,1): : Object is possibly 'undefined'
  ```

  is reported as well as the above error message.

- Type narrowing

  - The expression used in an ngIf directive is used to narrow type unions in the Angular template compiler, the same way the if expression does in TypeScript. For example, to avoid Object is possibly 'undefined' error in the template above, modify it to only emit the interpolation if the value of person is initialized as shown below:

    ```
    @Component({
      selector: 'my-component',
      template: ' {{person.address.street}} '
    })
    class MyComponent {
      person?: Person;
    }
    ```

  - Using \*ngIf allows the TypeScript compiler to infer that the `person` used in the binding expression will never be undefined.

- Non-null type assertion operator

  - Use the non-null type assertion operator to suppress the Object is possibly 'undefined' error when it is inconvenient to use \*ngIf or when some constraint in the component ensures that the expression is always non-null when the binding expression is interpolated.

  - In the following example, the person and address properties are always set together, implying that address is always non-null if person is non-null. There is no convenient way to describe this constraint to TypeScript and the template compiler, but the error is suppressed in the example by using address!.street.

    ```
    @Component({
      selector: 'my-component',
      template: '<span *ngIf="person"> {{person.name}} lives on {{address!.street}} </span>'
    })
    class MyComponent {
      person?: Person;
      address?: Address;

      setData(person: Person, address: Address) {
        this.person = person;
        this.address = address;
      }
    }
    ```

    - The non-null assertion operator should be used sparingly as refactoring of the component might break this constraint.

  - In this example it is recommended to include the checking of address in the \*ngIf as shown below:

    ```
    @Component({
      selector: 'my-component',
      template: '<span *ngIf="person && address"> {{person.name}} lives on {{address.street}} </span>'
    })
    class MyComponent {
      person?: Person;
      address?: Address;

      setData(person: Person, address: Address) {
        this.person = person;
        this.address = address;
      }
    }
    ```

#### Angular compiler options

- When you use `ahead-of-time compilation (AOT)`, you can control how your application is compiled by specifying template compiler options in the `TypeScript configuration file`.

- The template options object, `angularCompilerOptions`, is a sibling to the `compilerOptions` object that supplies standard options to the TypeScript compiler.

  - tsconfig.json
    ```
    {
      "compileOnSave": false,
      "compilerOptions": {
        "baseUrl": "./",
        // ...
      },
      "angularCompilerOptions": {
        "enableI18nLegacyMessageIdFormat": false,
        "strictInjectionParameters": true,
        // ...
      }
    }
    ```

##### Configuration inheritance with extends

- Like the TypeScript compiler, the Angular AOT compiler also supports `extends` in the `angularCompilerOptions` section of the TypeScript configuration file. The `extends` property is at the top level, parallel to `compilerOptions` and `angularCompilerOptions`.

- A TypeScript configuration can inherit settings from another file using the extends property. The configuration options from the base file are loaded first, then overridden by those in the inheriting configuration file.

  - For example:
    - tsconfig.app.json
      ```
      {
        "extends": "./tsconfig.json",
        "compilerOptions": {
          "outDir": "./out-tsc/app",
        // ...
        "angularCompilerOptions": {
          "strictTemplates": true,
          "preserveWhitespaces": true,
          // ...
        },
      }
      ```

##### Template options

- Ref:
  - https://angular.io/guide/angular-compiler-options#template-options

##### Command line options

- Most of the time you interact with the Angular Compiler indirectly using Angular CLI. When debugging certain issues, you might find it useful to invoke the Angular Compiler directly. You can use the `ngc` command provided by the `@angular/compiler-cli` npm package to call the compiler from the command line.

- The `ngc` command is just a wrapper around TypeScript's `tsc` compiler command and is primarily configured via the `tsconfig.json` configuration options documented in the previous sections.

- Besides the configuration file, you can also use `tsc` command line options to configure `ngc`.

#### AOT metadata errrors

##### Expression form not supported

- The compiler encountered an expression it didn't understand while evaluating Angular metadata.

- Language features outside of the compiler's restricted expression syntax can produce this error, as seen in the following example:

  ```
  // ERROR
  export class Fooish { … }
  …
  const prop = typeof Fooish; // typeof is not valid in metadata
    …
    // bracket notation is not valid in metadata
    { provide: 'token', useValue: { [prop]: 'value' } };
    …
  ```

  - You can use typeof and bracket notation in normal application code. You just can't use those features within expressions that define Angular metadata.

- Avoid this error by sticking to the compiler's restricted expression syntax when writing Angular metadata and be wary of new or unusual TypeScript features.

##### Reference to a local (non-exported) symbol

- Reference to a local (non-exported) symbol 'symbol name'. Consider exporting the symbol.

- The compiler encountered a referenced to a locally defined symbol that either wasn't exported or wasn't initialized.

- Here's a `provider` example of the problem.

  ```
  // ERROR
  let foo: number; // neither exported nor initialized

  @Component({
    selector: 'my-component',
    template: … ,
    providers: [
      { provide: Foo, useValue: foo }
    ]
  })
  export class MyComponent {}
  ```

- You could fix the problem by initializing foo.

  ```
  let foo = 42; // initialized
  ```

- The compiler will fold the expression into the provider as if you had written this.

  ```
  providers: [
    { provide: Foo, useValue: 42 }
  ]
  ```

- Alternatively, you can fix it by exporting `foo` with the expectation that `foo` will be assigned at runtime when you actually know its value.

  ```
  // CORRECTED
  export let foo: number; // exported

  @Component({
    selector: 'my-component',
    template: … ,
    providers: [
      { provide: Foo, useValue: foo }
    ]
  })
  export class MyComponent {}
  ```

- Adding export often works for variables referenced in metadata such as `providers` and `animations` because the compiler can generate references to the exported variables in these expressions. It doesn't need the values of those variables.

- Adding export doesn't work when the compiler needs the actual value in order to generate code. For example, it doesn't work for the template property.

  ```
  // ERROR
  export let someTemplate: string; // exported but not initialized

  @Component({
    selector: 'my-component',
    template: someTemplate
  })
  export class MyComponent {}
  ```

- The compiler needs the value of the `template` property right now to generate the component factory. The variable reference alone is insufficient. Prefixing the declaration with `export` merely produces a new error, "Only initialized variables and constants can be referenced".

##### Only initialized variables and constants

- Only initialized variables and constants can be referenced because the value of this variable is needed by the template compiler.

- The compiler found a reference to an exported variable or static field that wasn't initialized. It needs the value of that variable to generate code.

- The following example tries to set the component's `template` property to the value of the exported `someTemplate` variable which is declared but _unassigned_.

  ```
  // ERROR
  export let someTemplate: string;

  @Component({
    selector: 'my-component',
    template: someTemplate
  })
  export class MyComponent {}
  ```

- You'd also get this error if you imported `someTemplate` from some other module and neglected to initialize it there.

  ```
  // ERROR - not initialized there either
  import { someTemplate } from './config';

  @Component({
    selector: 'my-component',
    template: someTemplate
  })
  export class MyComponent {}
  ```

- The compiler cannot wait until runtime to get the template information. It must statically derive the value of the someTemplate variable from the source code so that it can generate the component factory, which includes instructions for building the element based on the template.

- To correct this error, provide the initial value of the variable in an initializer clause on the same line.

  ```
  // CORRECTED
  export let someTemplate = '<h1>Greetings from Angular</h1>';

  @Component({
    selector: 'my-component',
    template: someTemplate
  })
  export class MyComponent {}
  ```

##### Reference to a non-exported class

- _Reference to a non-exported class `<class name>`. Consider exporting the class_.

- Metadata referenced a class that wasn't exported.

- For example, you may have defined a class and used it as an injection token in a providers array but neglected to export that class.

  ```
  // ERROR
  abstract class MyStrategy { }

    …
    providers: [
      { provide: MyStrategy, useValue: … }
    ]
    …
  ```

- Angular generates a class factory in a separate module and that factory can only access exported classes. To correct this error, export the referenced class.

  ```
  // CORRECTED
  export abstract class MyStrategy { }

    …
    providers: [
      { provide: MyStrategy, useValue: … }
    ]
    …
  ```

##### Reference to a non-exported function

- _Metadata referenced a function that wasn't exported_.

- For example, you may have set a providers `useFactory` property to a locally defined function that you neglected to export.

  ```
  // ERROR
  function myStrategy() { … }

    …
    providers: [
      { provide: MyStrategy, useFactory: myStrategy }
    ]
    …
  ```

- Angular generates a class factory in a separate module and that factory can only access exported functions. To correct this error, export the function.

  ```
  // CORRECTED
  export function myStrategy() { … }

    …
    providers: [
      { provide: MyStrategy, useFactory: myStrategy }
    ]
    …
  ```

##### Function calls are not supported

- _Function calls are not supported. Consider replacing the function or lambda with a reference to an exported function_.

- The compiler does not currently support `function expressions or lambda functions`. For example, you cannot set a provider's `useFactory` to an anonymous function or arrow function like this.

  ```
  // ERROR
    …
    providers: [
      { provide: MyStrategy, useFactory: function() { … } },
      { provide: OtherStrategy, useFactory: () => { … } }
    ]
    …
  ```

- You also get this error if you call a function or method in a provider's `useValue`.

  ```
  // ERROR
  import { calculateValue } from './utilities';

    …
    providers: [
      { provide: SomeValue, useValue: calculateValue() }
    ]
    …
  ```

- To correct this error, export a function from the module and refer to the function in a useFactory provider instead.

  ```
  // CORRECTED
  import { calculateValue } from './utilities';

  export function myStrategy() { … }
  export function otherStrategy() { … }
  export function someValueFactory() {
    return calculateValue();
  }
    …
    providers: [
      { provide: MyStrategy, useFactory: myStrategy },
      { provide: OtherStrategy, useFactory: otherStrategy },
      { provide: SomeValue, useFactory: someValueFactory }
    ]
    …
  ```

##### Destructured variable or constant not supported

- _Referencing an exported destructured variable or constant is not supported by the template compiler. Consider simplifying this to avoid destructuring_.

- The compiler does not support references to variables assigned by destructuring.

- For example, you cannot write something like this:

  ```
  // ERROR
  import { configuration } from './configuration';

  // destructured assignment to foo and bar
  const {foo, bar} = configuration;
    …
    providers: [
      {provide: Foo, useValue: foo},
      {provide: Bar, useValue: bar},
    ]
    …
  ```

- To correct this error, refer to non-destructured values.
  ```
  // CORRECTED
  import { configuration } from './configuration';
    …
    providers: [
      {provide: Foo, useValue: configuration.foo},
      {provide: Bar, useValue: configuration.bar},
    ]
    …
  ```

##### Could not resolve type

- _The compiler encountered a type and can't determine which module exports that type._

- This can happen if you refer to an ambient type. For example, the `Window` type is an ambient type declared in the global `.d.ts` file.

- You'll get an error if you reference it in the component constructor, which the compiler must statically analyze.

  ```
  // ERROR
  @Component({ })
  export class MyComponent {
    constructor (private win: Window) { … }
  }
  ```

- TypeScript understands ambient types so you don't import them. The Angular compiler does not understand a type that you neglect to export or import.

- In this case, the compiler doesn't understand how to inject something with the `Window` token.

- Do not refer to ambient types in metadata expressions.

- If you must inject an instance of an ambient type, you can finesse the problem in four steps:

  - 1. Create an injection token for an instance of the ambient type.
  - 2. Create a factory function that returns that instance.
  - 3. Add a `useFactory` provider with that factory function.
  - 4. Use `@Inject` to inject the instance.

- Here's an illustrative example.

  ```
  // CORRECTED
  import { Inject } from '@angular/core';

  export const WINDOW = new InjectionToken('Window');
  export function _window() { return window; }

  @Component({
    …
    providers: [
      { provide: WINDOW, useFactory: _window }
    ]
  })
  export class MyComponent {
    constructor (@Inject(WINDOW) private win: Window) { … }
  }
  ```

- The `Window` type in the constructor is no longer a problem for the compiler because it uses the `@Inject(WINDOW)` to generate the injection code.

- Angular does something similar with the `DOCUMENT` token so you can inject the browser's `document` object (or an abstraction of it, depending upon the platform in which the application runs).

  ```
  import { Inject }   from '@angular/core';
  import { DOCUMENT } from '@angular/common';

  @Component({ … })
  export class MyComponent {
    constructor (@Inject(DOCUMENT) private doc: Document) { … }
  }
  ```

##### Name expected

- _The compiler expected a name in an expression it was evaluating._

- This can happen if you use a number as a property name as in the following example.

  ```
  // ERROR
  provider: [{ provide: Foo, useValue: { 0: 'test' } }]
  ```

- Change the name of the property to something non-numeric.
  ```
  // CORRECTED
  provider: [{ provide: Foo, useValue: { '0': 'test' } }]
  ```

##### Unsupported enum member name

- _Angular couldn't determine the value of the `enum member` that you referenced in metadata._

- The compiler can understand simple enum values but not complex values such as those derived from computed properties.

  ```
  // ERROR
  enum Colors {
    Red = 1,
    White,
    Blue = "Blue".length // computed
  }

    …
    providers: [
      { provide: BaseColor,   useValue: Colors.White } // ok
      { provide: DangerColor, useValue: Colors.Red }   // ok
      { provide: StrongColor, useValue: Colors.Blue }  // bad
    ]
    …
  ```

- Avoid referring to enums with complicated initializers or computed properties.

##### Tagged template expressions are not supported

- _Tagged template expressions are not supported in metadata._

- The compiler encountered a JavaScript ES2015 [tagged template expression](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Template_literals#Tagged_template_literals) such as the following.

  ```
  // ERROR
  const expression = 'funky';
  const raw = String.raw`A tagged template ${expression} string`;
  …
  template: '<div>' + raw + '</div>'
  …
  ```

  - [String.raw()](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String/raw) is a tag function native to JavaScript ES2015.

- The AOT compiler does not support tagged template expressions; avoid them in metadata expressions.

##### Symbol reference expected

- _The compiler expected a reference to a symbol at the location specified in the error message._

- This error can occur if you use an expression in the `extends` clause of a class.

#### Template type-checking

##### Overview of template type checking

- Just as TypeScript catches type errors in your code, Angular checks the expressions and bindings within the templates of your application and can report any type errors it finds. Angular currently has three modes of doing this, depending on the value of the `fullTemplateTypeCheck` and `strictTemplates` flags in the TypeScript configuration file.

- Basic mode

  - In the most basic type-checking mode, with the `fullTemplateTypeCheck` flag set to `false`, Angular validates only top-level expressions in a template.

  - If you write `<map [city]="user.address.city">`, the compiler verifies the following:

    - `user` is a property on the component class
    - `user` is an object with an address property
    - `user.address` is an object with a city property

  - The compiler does not verify that the value of `user.address.city` is assignable to the city input of the `<map>` component.

  - The compiler also has some major limitations in this mode:

    - Importantly, it doesn't check embedded views, such as `*ngIf`, `*ngFor`, other `<ng-template>` embedded view.
    - It doesn't figure out the types of `#refs`, the results of pipes, or the type of `$event` in event bindings.

  - In many cases, these things end up as type `any`, which can cause subsequent parts of the expression to go unchecked.

- Full mode

  - If the `fullTemplateTypeCheck` flag is set to `true`, Angular is more aggressive in its type-checking within templates. In particular:

    - Embedded views (such as those within an `*ngIf` or `*ngFor`) are checked
    - Pipes have the correct return type
    - Local references to directives and pipes have the correct type (except for any generic parameters, which will be `any`)

  - The following still have type `any`.

    - Local references to DOM elements
    - The `$event` object
    - Safe navigation expressions

  - The `fullTemplateTypeCheck` flag has been deprecated in Angular 13. The `strictTemplates` family of compiler options should be used instead.

- Strict mode

  - Angular maintains the behavior of the `fullTemplateTypeCheck` flag, and introduces a third "strict mode". Strict mode is a superset of full mode, and is accessed by setting the `strictTemplates` flag to true. This flag supersedes the `fullTemplateTypeCheck` flag. In strict mode, Angular uses checks that go beyond the version 8 type-checker.

  - NOTE:

    - Strict mode is only available if using Ivy.

  - In addition to the full mode behavior, Angular does the following:

    - Verifies that component/directive bindings are assignable to their `@Input()`s
    - Obeys TypeScript's `strictNullChecks` flag when validating the preceding mode
    - Infers the correct type of components/directives, including generics
    - Infers template context types where configured (for example, allowing correct type-checking of `NgFor`)
    - Infers the correct type of `$event` in component/directive, DOM, and animation event bindings
    - Infers the correct type of local references to DOM elements, based on the tag name (for example, the type that `document.createElement` would return for that tag)

##### Checking for \*ngFor

- The three modes of type-checking treat embedded views differently. Consider the following example.

  - User interface

    ```
    interface User {
      name: string;
      address: {
        city: string;
        state: string;
      }
    }
    ```

    ```
    <div *ngFor="let user of users">
      <h2>{{config.title}}</h2>
      <span>City: {{user.address.city}}</span>
    </div>
    ```

  - The `<h2>` and the `<span>` are in the `*ngFor` embedded view. In basic mode, Angular doesn't check either of them. However, in full mode, Angular checks that `config` and `user` exist and assumes a type of `any`. In strict mode, Angular knows that the `user` in the `<span>` has a type of `User`, and that `address` is an object with a `city` property of type `string`.

##### Troubleshooting template errors

- With strict mode, you might encounter template errors that didn't arise in either of the previous modes. These errors often represent genuine type mismatches in the templates that were not caught by the previous tooling. If this is the case, the error message should make it clear where in the template the problem occurs.

- There can also be false positives when the typings of an Angular library are either incomplete or incorrect, or when the typings don't quite line up with expectations as in the following cases.

  - When a library's typings are wrong or incomplete (for example, missing `null | undefined` if the library was not written with `strictNullChecks` in mind)

  - When a library's input types are too narrow and the library hasn't added appropriate metadata for Angular to figure this out. This usually occurs with disabled or other common Boolean inputs used as attributes, for example, `<input disabled>`.

  - When using `$event.target` for DOM events (because of the possibility of event bubbling, `$event.target` in the DOM typings doesn't have the type you might expect)

- In case of a false positive like these, there are a few options:

  - Use the [`$any()` type-cast function](https://angular.io/guide/template-expression-operators#any-type-cast-function) in certain contexts to opt out of type-checking for a part of the expression
  - Disable strict checks entirely by setting `strictTemplates: false` in the application's TypeScript configuration file, `tsconfig.json`

  - Disable certain type-checking operations individually, while maintaining strictness in other aspects, by setting a _strictness_ flag to `false`
  - If you want to use `strictTemplates` and `strictNullChecks` together, opt out of strict null type checking specifically for input bindings using `strictNullInputTypes`

- Unless otherwise commented, each following option is set to the value for `strictTemplates` (`true` when `strictTemplates` is `true` and conversely, the other way around).

  | STRICTNESS FLAG            | EFFECT                                                                                                                                                                                                                                                                                                 |
  | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
  | strictInputTypes           | Whether the assignability of a binding expression to the `@Input()` field is checked. Also affects the inference of directive generic types.                                                                                                                                                           |
  | strictInputAccessModifiers | Whether access modifiers such as `private/protected/readonly` are honored when assigning a binding expression to an `@Input()`. If disabled, the access modifiers of the `@Input` are ignored; only the type is checked. This option is `false` by default, even with `strictTemplates` set to `true`. |
  | strictNullInputTypes       | Whether `strictNullChecks` is honored when checking `@Input()` bindings (per `strictInputTypes`). Turning this off can be useful when using a library that was not built with `strictNullChecks` in mind.                                                                                              |
  | strictAttributeTypes       | Whether to check `@Input()` bindings that are made using text attributes. For example,<br> `<input matInput disabled="true">`<br>(setting the `disabled` property to the string `'true'`) vs <br> `<input matInput [disabled]="true">` <br> (setting the `disabled` property to the boolean `true`).   |
  | strictSafeNavigationTypes  | Whether the return type of safe navigation operations (for example, `user?.name` will be correctly inferred based on the type of `user`). If disabled, `user?.name` will be of type `any`.                                                                                                             |
  | strictDomLocalRefTypes     | Whether local references to DOM elements will have the correct type. If disabled `ref` will be of type `any` for `<input #ref>`.                                                                                                                                                                       |
  | strictOutputEventTypes     | Whether `$event` will have the correct type for event bindings to component/directive an `@Output()`, or to animation events. If disabled, it will be `any`.                                                                                                                                           |
  | strictDomEventTypes        | Whether `$event` will have the correct type for event bindings to DOM events. If disabled, it will be `any`.                                                                                                                                                                                           |
  | strictContextGenerics      | Whether the type parameters of generic components will be inferred correctly (including any generic bounds). If disabled, any type parameters will be `any`.                                                                                                                                           |
  | strictLiteralTypes         | Whether object and array literals declared in the template will have their type inferred. If disabled, the type of such literals will be `any`. This flag is `true` when either `fullTemplateTypeCheck` or `strictTemplates` is set to `true`.                                                         |

- If you still have issues after troubleshooting with these flags, fall back to full mode by disabling `strictTemplates`.

- If that doesn't work, an option of last resort is to turn off full mode entirely with `fullTemplateTypeCheck: false`.

- A type-checking error that you cannot resolve with any of the recommended methods can be the result of a bug in the template type-checker itself. If you get errors that require falling back to basic mode, it is likely to be such a bug. If this happens, file an issue so the team can address it.

##### Inputs and type-checking

- The template type checker checks whether a binding expression's type is compatible with that of the corresponding directive input. As an example, consider the following component:

  ```
  export interface User {
    name: string;
  }

  @Component({
    selector: 'user-detail',
    template: '{{ user.name }}',
  })
  export class UserDetailComponent {
    @Input() user: User;
  }
  ```

- The `AppComponent` template uses this component as follows:

  ```
  @Component({
    selector: 'app-root',
    template: '<user-detail [user]="selectedUser"></user-detail>',
  })
  export class AppComponent {
    selectedUser: User | null = null;
  }
  ```

  - Here, during type checking of the template for `AppComponent`, the `[user]="selectedUser"` binding corresponds with the `UserDetailComponent.user` input. Therefore, Angular assigns the `selectedUser` property to `UserDetailComponent.user`, which would result in an error if their types were incompatible. TypeScript checks the assignment according to its type system, obeying flags such as `strictNullChecks` as they are configured in the application.

  - Avoid run-time type errors by providing more specific in-template type requirements to the template type checker. Make the input type requirements for your own directives as specific as possible by providing template-guard functions in the directive definition. See [Improving template type checking for custom directives](https://angular.io/guide/structural-directives#directive-type-checks) in this guide.

- Strict null checks

  - When you enable `strictTemplates` and the TypeScript flag `strictNullChecks`, typecheck errors might occur for certain situations that might not easily be avoided. For example:

    - A nullable value that is bound to a directive from a library which did not have `strictNullChecks` enabled.
      For a library compiled without `strictNullChecks`, its declaration files will not indicate whether a field can be `null` or not. For situations where the library handles `null` correctly, this is problematic, as the compiler will check a nullable value against the declaration files which omit the `null` type. As such, the compiler produces a type-check error because it adheres to `strictNullChecks`.

    - Using the `async` pipe with an Observable which you know will emit synchronously.
      The `async` pipe currently assumes that the Observable it subscribes to can be asynchronous, which means that it's possible that there is no value available yet. In that case, it still has to return something —which is `null`. In other words, the return type of the `async` pipe includes `null`, which might result in errors in situations where the Observable is known to emit a non-nullable value synchronously.

  - There are two potential workarounds to the preceding issues:

    - In the template, include the non-null assertion operator `!` at the end of a nullable expression, such as

      ```
      <user-detail [user]="user!"></user-detail>
      ```

      - In this example, the compiler disregards type incompatibilities in nullability, just as in TypeScript code. In the case of the `async` pipe, notice that the expression needs to be wrapped in parentheses, as in

        ```
        <user-detail [user]="(user$ | async)!"></user-detail>
        ```

    - Disable strict null checks in Angular templates completely.
      - When `strictTemplates` is enabled, it is still possible to disable certain aspects of type checking. Setting the option `strictNullInputTypes` to `false` disables strict null checks within Angular templates. This flag applies for all components that are part of the application.

- Advice for library authors
  - As a library author, you can take several measures to provide an optimal experience for your users. First, enabling `strictNullChecks` and including `null` in an input's type, as appropriate, communicates to your consumers whether they can provide a nullable value or not. Additionally, it is possible to provide type hints that are specific to the template type checker. See Improving template type checking for custom directives, and Input setter coercion.

##### Input setter coercion

- Occasionally it is desirable for the `@Input()` of a directive or component to alter the value bound to it, typically using a getter/setter pair for the input. As an example, consider this custom button component:

  ```
  @Component({
    selector: 'submit-button',
    template: `
      <div class="wrapper">
        <button [disabled]="disabled">Submit</button>
      </div>
    `,
  })
  class SubmitButton {
    private _disabled: boolean;

    @Input()
    get disabled(): boolean {
      return this._disabled;
    }

    set disabled(value: boolean) {
      this._disabled = value;
    }
  }
  ```

- Here, the `disabled` input of the component is being passed on to the `<button>` in the template. All of this works as expected, as long as a `boolean` value is bound to the input. But, suppose a consumer uses this input in the template as an attribute:

  ```
  <submit-button disabled></submit-button>
  ```

- This has the same effect as the binding:

  ```
  <submit-button [disabled]="''"></submit-button>
  ```

- At runtime, the input will be set to the empty string, which is not a `boolean` value. Angular component libraries that deal with this problem often "coerce" the value into the right type in the setter:

  ```
  set disabled(value: boolean) {
    this._disabled = (value === '') || value;
  }
  ```

- It would be ideal to change the type of `value` here, from `boolean` to `boolean|''`, to match the set of values which are actually accepted by the setter. TypeScript prior to version 4.3 requires that both the getter and setter have the same type, so if the getter should return a `boolean` then the setter is stuck with the narrower type.

- If the consumer has Angular's strictest type checking for templates enabled, this creates a problem: the empty string (`''`) is not actually assignable to the `disabled` field, which creates a type error when the attribute form is used.

- As a workaround for this problem, Angular supports checking a wider, more permissive type for `@Input()` than is declared for the input field itself. Enable this by adding a static property with the `ngAcceptInputType_` prefix to the component class:

  ```
  class SubmitButton {
    private _disabled: boolean;

    @Input()
    get disabled(): boolean {
      return this._disabled;
    }

    set disabled(value: boolean) {
      this._disabled = (value === '') || value;
    }

    static ngAcceptInputType_disabled: boolean|'';
  }
  ```

  - Since TypeScript 4.3, the setter could have been declared to accept `boolean|''` as type, making the input setter coercion field obsolete. As such, input setters coercion fields have been deprecated.

- This field does not need to have a value. Its existence communicates to the Angular type checker that the `disabled` input should be considered as accepting bindings that match the type `boolean|''`. The suffix should be the `@Input` _field_ name.

- Care should be taken that if an `ngAcceptInputType_` override is present for a given input, then the setter should be able to handle any values of the overridden type.

##### Disabling type checking using $any()

- Disable checking of a binding expression by surrounding the expression in a call to the `$any() cast pseudo-function`. The compiler treats it as a cast to the `any` type just like in TypeScript when a `<any>` or `as any` cast is used.

- In the following example, casting `person` to the `any` type suppresses the error `Property address does not exist`.

  ```
  @Component({
    selector: 'my-component',
    template: '{{$any(person).address.street}}'
  })
  class MyComponent {
    person?: Person;
  }
  ```

### Building & serving

- This page discusses build-specific configuration options for Angular projects.

#### Configuring application environments

- You can define different named build configurations for your project, such as _staging_ and _production_, with different defaults.

- Each named configuration can have defaults for any of the options that apply to the various `builder targets`, such as `build`, `serve`, and `test`. The Angular CLI `build`, `serve`, and `test` commands can then replace files with appropriate versions for your intended target environment.

##### Configure environment-specific defaults

- A project's `src/environments/` folder contains the base configuration file, `environment.ts`, which provides a default environment. You can add override defaults for additional environments, such as production and staging, in target-specific configuration files.

- For example:
  myProject/src/environments
  environment.ts
  environment.prod.ts
  environment.staging.ts

- The base file `environment.ts`, contains the default environment settings. For example:

  ```
  export const environment = {
    production: false
  };
  ```

- The `build` command uses this as the build target when no environment is specified. You can add further variables, either as additional properties on the environment object, or as separate objects. For example, the following adds a default for a variable to the default environment:

  ```
  export const environment = {
    production: false,
    apiUrl: 'http://my-api-url'
  };
  ```

- You can add target-specific configuration files, such as `environment.prod.ts`. The following content sets default values for the production build target:

  ```
  export const environment = {
    production: true,
    apiUrl: 'http://my-prod-url'
  };
  ```

##### Using environment-specific variables in your app

- The following application structure configures build targets for production and staging environments:

  ```
  src
    app
      app.component.html
      app.component.ts
    environments
      environment.ts
      environment.prod.ts
      environment.staging.ts
  ```

- To use the environment configurations you have defined, your components must import the original environments file:

  ```
  import { environment } from './../environments/environment';
  ```

  - This ensures that the build and serve commands can find the configurations for specific build targets.

- The following code in the component file (`app.component.ts`) uses an environment variable defined in the configuration files.

  ```
  import { Component } from '@angular/core';
  import { environment } from './../environments/environment';

  @Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
  })
  export class AppComponent {
    constructor() {
      console.log(environment.production); // Logs false for default environment
    }
    title = 'app works!';
  }
  ```

#### Configure target-specific file replacements

- The main CLI configuration file, `angular.json`, contains a `fileReplacements` section in the configuration for each build target, which lets you replace any file in the TypeScript program with a target-specific version of that file. This is useful for including target-specific code or variables in a build that targets a specific environment, such as production or staging.

- By default no files are replaced. You can add file replacements for specific build targets. For example:

  ```
  "configurations": {
    "production": {
      "fileReplacements": [
        {
          "replace": "src/environments/environment.ts",
          "with": "src/environments/environment.prod.ts"
        }
      ],
      …
  ```

  - This means that when you build your production configuration with `ng build --configuration production`, the `src/environments/environment.ts` file is replaced with the target-specific version of the file, `src/environments/environment.prod.ts`.

- You can add additional configurations as required. To add a staging environment, create a copy of `src/environments/environment.ts` called `src/environments/environment.staging.ts`, then add a `staging` configuration to `angular.json`:

  ```
  "configurations": {
    "production": { … },
    "staging": {
      "fileReplacements": [
        {
          "replace": "src/environments/environment.ts",
          "with": "src/environments/environment.staging.ts"
        }
      ]
    }
  }
  ```

- You can add more configuration options to this target environment as well. Any option that your build supports can be overridden in a build target configuration.

- To build using the staging configuration, run the following command:

  ```
  ng build --configuration=staging
  ```

- You can also configure the `serve` command to use the targeted build configuration if you add it to the "serve:configurations" section of `angular.json`:

  ```
  "serve": {
    "builder": "@angular-devkit/build-angular:dev-server",
    "options": {
      "browserTarget": "your-project-name:build"
    },
    "configurations": {
      "production": {
        "browserTarget": "your-project-name:build:production"
      },
      "staging": {
        "browserTarget": "your-project-name:build:staging"
      }
    }
  },
  ```

#### Configuring size budgets

- As applications grow in functionality, they also grow in size. The CLI lets you set size thresholds in your configuration to ensure that parts of your application stay within size boundaries that you define.

- Define your size boundaries in the CLI configuration file, `angular.json`, in a `budgets` section for each `configured environment`.

  ```
  {
    …
    "configurations": {
      "production": {
        …
        budgets: []
      }
    }
  }
  ```

- You can specify size budgets for the entire app, and for particular parts. Each budget entry configures a budget of a given type. Specify size values in the following formats:

  | SIZE VALUE  | DETAILS                                                                   |
  | ----------- | ------------------------------------------------------------------------- |
  | 123 or 123b | Size in bytes.                                                            |
  | 123kb       | Size in kilobytes.                                                        |
  | 123mb       | Size in megabytes.                                                        |
  | 12%         | Percentage of size relative to baseline. (Not valid for baseline values.) |

- When you configure a budget, the build system warns or reports an error when a given part of the application reaches or exceeds a boundary size that you set.

- Each budget entry is a JSON object with the following properties:

  - type

    - The type of budget. One of:
      - bundle
        - The size of a specific bundle.
      - initial
        - The size of JavaScript needed for bootstrapping the application. Defaults to warning at 500kb and erroring at 1mb.
      - allScript
        - The size of all scripts.
      - all
        - The size of the entire application.
      - anyComponentStyle
        - This size of any one component stylesheet. Defaults to warning at 2kb and erroring at 4kb.
      - anyScript
        - The size of any one script.
      - any
        - The size of any file.

  - name

    - The name of the bundle (for type=bundle).

  - baseline

    - The baseline size for comparison.

  - maximumWarning

    - The maximum threshold for warning relative to the baseline.

  - maximumError

    - The maximum threshold for error relative to the baseline.

  - minimumWarning

    - The minimum threshold for warning relative to the baseline.

  - minimumError

    - The minimum threshold for error relative to the baseline.

  - warning

    - The threshold for warning relative to the baseline (min & max).

  - error
    - The threshold for error relative to the baseline (min & max).

#### Configuring CommonJS dependencies

- It is recommended that you avoid depending on CommonJS modules in your Angular applications. Depending on CommonJS modules can prevent bundlers and minifiers from optimizing your application, which results in larger bundle sizes. Instead, it is recommended that you use ECMAScript modules in your entire application. For more information, see [How CommonJS is making your bundles larger](https://web.dev/commonjs-larger-bundles).

- The Angular CLI outputs warnings if it detects that your browser application depends on CommonJS modules. To disable these warnings, add the CommonJS module name to `allowedCommonJsDependencies` option in the `build` options located in `angular.json` file.

  ```
  "build": {
    "builder": "@angular-devkit/build-angular:browser",
    "options": {
      "allowedCommonJsDependencies": [
          "lodash"
      ]
      …
    }
    …
  },
  ```

#### Configuring browser compatibility

- The CLI uses [Autoprefixer](https://github.com/postcss/autoprefixer) to ensure compatibility with different browser and browser versions. You might find it necessary to target specific browsers or exclude certain browser versions from your build.

- Internally, Autoprefixer relies on a library called [Browserslist](https://github.com/browserslist/browserslist) to figure out which browsers to support with prefixing. Browserslist looks for configuration options in a `browserslist` property of the package configuration file, or in a configuration file named `.browserslistrc`. Autoprefixer looks for the browserslist configuration when it prefixes your CSS.

  - Tell Autoprefixer what browsers to target by adding a browserslist property to the package configuration file, `package.json`:

    ```
    "browserslist": [
      "> 1%",
      "last 2 versions"
    ]
    ```

  - Alternatively, you can add a new file, `.browserslistrc`, to the project directory, that specifies browsers you want to support:
    ```
    ### Supported Browsers
    > 1%
    last 2 versions
    ```

#### Proxying to a backend server

- Use the [proxying support](https://webpack.js.org/configuration/dev-server/#devserverproxy) in the webpack development server to divert certain URLs to a backend server, by passing a file to the `--proxy-config` build option. For example, to divert all calls for `http://localhost:4200/api` to a server running on `http://localhost:3000/api`, take the following steps.

  - 1. Create a file `proxy.conf.json` in your project's `src/` folder.
  - 2. Add the following content to the new proxy file:
    ```
    {
      "/api": {
        "target": "http://localhost:3000",
        "secure": false
      }
    }
    ```
  - 3. In the CLI configuration file, `angular.json`, add the `proxyConfig` option to the `serve` target:

    ```
    …
    "architect": {
      "serve": {
        "builder": "@angular-devkit/build-angular:dev-server",
        "options": {
          "browserTarget": "your-application-name:build",
          "proxyConfig": "src/proxy.conf.json"
        },
    …
    ```

  - 4. To run the development server with this proxy configuration, call `ng serve`.

- Edit the proxy configuration file to add configuration options; following are some examples. For a description of all options, see [webpack DevServer documentation](https://webpack.js.org/configuration/dev-server/#devserverproxy).

- NOTE:
  - If you edit the proxy configuration file, you must relaunch the ng serve process to make your changes effective.

##### Rewrite the URL path

- The `pathRewrite` proxy configuration option lets you rewrite the URL path at run time. For example, specify the following `pathRewrite` value to the proxy configuration to remove "api" from the end of a path.

  ```
  {
    "/api": {
      "target": "http://localhost:3000",
      "secure": false,
      "pathRewrite": {
        "^/api": ""
      }
    }
  }
  ```

- If you need to access a backend that is not on `localhost`, set the `changeOrigin` option as well. For example:

  ```
  {
    "/api": {
      "target": "http://npmjs.org",
      "secure": false,
      "pathRewrite": {
        "^/api": ""
      },
      "changeOrigin": true
    }
  }
  ```

- To help determine whether your proxy is working as intended, set the `logLevel` option. For example:

  ```
  {
    "/api": {
      "target": "http://localhost:3000",
      "secure": false,
      "pathRewrite": {
        "^/api": ""
      },
      "logLevel": "debug"
    }
  }
  ```

  - Proxy log levels are `info` (the default), `debug`, `warn`, `error`, and `silent`.

##### Proxy multiple entries

- You can proxy multiple entries to the same target by defining the configuration in JavaScript.

- Set the proxy configuration file to `proxy.conf.js` (instead of `proxy.conf.json`), and specify configuration files as in the following example.

  ```
  const PROXY_CONFIG = [
      {
          context: [
              "/my",
              "/many",
              "/endpoints",
              "/i",
              "/need",
              "/to",
              "/proxy"
          ],
          target: "http://localhost:3000",
          secure: false
      }
  ]

  module.exports = PROXY_CONFIG;
  ```

- In the CLI configuration file, `angular.json`, point to the JavaScript proxy configuration file:
  ```
  …
  "architect": {
    "serve": {
      "builder": "@angular-devkit/build-angular:dev-server",
      "options": {
        "browserTarget": "your-application-name:build",
        "proxyConfig": "src/proxy.conf.js"
      },
  …
  ```

##### Bypass the proxy

- If you need to optionally bypass the proxy, or dynamically change the request before it's sent, add the bypass option, as shown in this JavaScript example.

  ```
  const PROXY_CONFIG = {
      "/api/proxy": {
          "target": "http://localhost:3000",
          "secure": false,
          "bypass": function (req, res, proxyOptions) {
              if (req.headers.accept.indexOf("html") !== -1) {
                  console.log("Skipping proxy for browser request.");
                  return "/index.html";
              }
              req.headers["X-Custom-Header"] = "yes";
          }
      }
  }

  module.exports = PROXY_CONFIG;
  ```

##### Using corporate proxy

- If you work behind a corporate proxy, the backend cannot directly proxy calls to any URL outside your local network. In this case, you can configure the backend proxy to redirect calls through your corporate proxy using an agent:

  ```
  npm install --save-dev https-proxy-agent
  ```

- When you define an environment variable `http_proxy` or `HTTP_PROXY`, an agent is automatically added to pass calls through your corporate proxy when running `npm start`.

- Use the following content in the JavaScript configuration file.

  ```
  var HttpsProxyAgent = require('https-proxy-agent');
  var proxyConfig = [{
    context: '/api',
    target: 'http://your-remote-server.com:3000',
    secure: false
  }];

  function setupForCorporateProxy(proxyConfig) {
    var proxyServer = process.env.http_proxy || process.env.HTTP_PROXY;
    if (proxyServer) {
      var agent = new HttpsProxyAgent(proxyServer);
      console.log('Using corporate proxy server: ' + proxyServer);
      proxyConfig.forEach(function(entry) {
        entry.agent = agent;
      });
    }
    return proxyConfig;
  }

  module.exports = setupForCorporateProxy(proxyConfig);
  ```

#### Configuring browser compatibility

- See [browser support guide](https://angular.io/guide/browser-support).

## Angular CLI builders

- A number of Angular CLI commands run a complex process on your code, such as linting, building, or testing. The commands use an internal tool called Architect to run CLI builders, which apply another tool to accomplish the wanted task.

- With Angular version 8, the CLI Builder API is stable and available to developers who want to customize the Angular CLI by adding or modifying commands. For example, you could supply a builder to perform an entirely new task, or to change which third-party tool is used by an existing command.

- This document explains how CLI builders integrate with the workspace configuration file, and shows how you can create your own builder.

- Find the code from the examples used here in this [GitHub repository](https://github.com/mgechev/cli-builders-demo)

### CLI builders

- The internal Architect tool delegates work to handler functions called _builders_. A builder handler function receives two arguments; a set of input `options` (a JSON object), and a `context` (a `BuilderContext` object).

- The separation of concerns here is the same as with `schematics`, which are used for other CLI commands that touch your code (such as `ng generate`).

  - The `options` object is provided by the CLI user, while the `context` object is provided by the CLI Builder API

  - In addition to the contextual information, the `context` object, which is an instance of the `BuilderContext`, also provides access to a scheduling method, `context.scheduleTarget()`. The scheduler executes the builder handler function with a given `target configuration`.

- The builder handler function can be synchronous (return a value) or asynchronous (return a Promise), or it can watch and return multiple values (return an Observable). The return value or values must always be of type `BuilderOutput`. This object contains a Boolean `success` field and an optional `error` field that can contain an error message.

- Angular provides some builders that are used by the CLI for commands such as `ng build` and `ng test`. Default target configurations for these and other built-in CLI builders can be found (and customized) in the "architect" section of the `workspace configuration file`, `angular.json`. Also, extend and customize Angular by creating your own builders, which you can run using the `ng run` CLI command.

#### Builder project structure

- A builder resides in a "project" folder that is similar in structure to an Angular workspace, with global configuration files at the top level, and more specific configuration in a source folder with the code files that define the behavior. For example, your myBuilder folder could contain the following files.

  | FILES                  | PURPOSE                                                      |
  | ---------------------- | ------------------------------------------------------------ |
  | src/my-builder.ts      | Main source file for the builder definition.                 |
  | src/my-builder.spec.ts | Source file for tests.                                       |
  | src/schema.json        | Definition of builder input options.                         |
  | builders.json          | Builders definition.                                         |
  | package.json           | Dependencies. See https://docs.npmjs.com/files/package.json. |
  | tsconfig.json          | TypeScript configuration.                                    |

- Publish the builder to npm (see [Publishing your Library](https://angular.io/guide/creating-libraries#publishing-your-library)). If you publish it as `&commat;example/my-builder`, install it using the following command.

  ```
  npm install @example/my-builder
  ```

### Creating a builder

- As an example, create a builder that copies a file. To create a builder, use the `createBuilder()` CLI Builder function, and return a `Promise<BuilderOutput>` object.

  - src/my-builder.ts (builder skeleton)

    ```
    import { BuilderContext, BuilderOutput, createBuilder } from '@angular-devkit/architect';
    import { JsonObject } from '@angular-devkit/core';

    interface Options extends JsonObject {
      source: string;
      destination: string;
    }

    export default createBuilder(copyFileBuilder);

    async function copyFileBuilder(
      options: Options,
      context: BuilderContext,
    ): Promise<BuilderOutput> {
    }
    ```

- Now let's add some logic to it. The following code retrieves the source and destination file paths from user options and copies the file from the source to the destination (using the [Promise version of the built-in NodeJS copyFile() function](https://nodejs.org/api/fs.html#fs_fspromises_copyfile_src_dest_mode)). If the copy operation fails, it returns an error with a message about the underlying problem.

  - src/my-builder.ts (builder)

    ```
    import { BuilderContext, BuilderOutput, createBuilder } from '@angular-devkit/architect';
    import { JsonObject } from '@angular-devkit/core';
    import { promises as fs } from 'fs';

    interface Options extends JsonObject {
      source: string;
      destination: string;
    }

    export default createBuilder(copyFileBuilder);

    async function copyFileBuilder(
      options: Options,
      context: BuilderContext,
    ): Promise<BuilderOutput> {
      try {
        await fs.copyFile(options.source, options.destination);
      } catch (err) {
        return {
          success: false,
          error: err.message,
        };
      }

      return { success: true };
    }
    ```

#### Handling output

- By default, `copyFile()` does not print anything to the process standard output or error. If an error occurs, it might be difficult to understand exactly what the builder was trying to do when the problem occurred. Add some additional context by logging additional information using the `Logger` API. This also lets the builder itself be executed in a separate process, even if the standard output and error are deactivated (as in an [Electron app](https://electronjs.org/)).

- You can retrieve a `Logger` instance from the context.

  - src/my-builder.ts (handling output)

    ```
    import { BuilderContext, BuilderOutput, createBuilder } from '@angular-devkit/architect';
    import { JsonObject } from '@angular-devkit/core';
    import { promises as fs } from 'fs';

    interface Options extends JsonObject {
      source: string;
      destination: string;
    }

    export default createBuilder(copyFileBuilder);

    async function copyFileBuilder(
      options: Options,
      context: BuilderContext,
    ): Promise<BuilderOutput> {
      try {
        await fs.copyFile(options.source, options.destination);
      } catch (err) {
        context.logger.error('Failed to copy file.');
        return {
          success: false,
          error: err.message,
        };
      }

      return { success: true };
    }
    ```

#### Progress and status reporting

- The CLI Builder API includes progress and status reporting tools, which can provide hints for certain functions and interfaces.

- To report progress, use the `context.reportProgress()` method, which takes a current value, (optional) total, and status string as arguments. The total can be any number; for example, if you know how many files you have to process, the total could be the number of files, and current should be the number processed so far. The status string is unmodified unless you pass in a new string value.

  - You can see an [example](https://github.com/angular/angular-cli/blob/ba21c855c0c8b778005df01d4851b5a2176edc6f/packages/angular_devkit/build_angular/src/tslint/index.ts#L107) of how the tslint builder reports progress.

- In our example, the copy operation either finishes or is still executing, so there's no need for a progress report, but you can report status so that a parent builder that called our builder would know what's going on. Use the `context.reportStatus()` method to generate a status string of any length.

- NOTE:

  - There's no guarantee that a long string will be shown entirely; it could be cut to fit the UI that displays it.

- Pass an empty string to remove the status.

  - src/my-builder.ts (progress reporting)

    ```
    import { BuilderContext, BuilderOutput, createBuilder } from '@angular-devkit/architect';
    import { JsonObject } from '@angular-devkit/core';
    import { promises as fs } from 'fs';

    interface Options extends JsonObject {
      source: string;
      destination: string;
    }

    export default createBuilder(copyFileBuilder);

    async function copyFileBuilder(
      options: Options,
      context: BuilderContext,
    ): Promise<BuilderOutput> {
      context.reportStatus(`Copying ${options.source} to ${options.destination}.`);
      try {
        await fs.copyFile(options.source, options.destination);
      } catch (err) {
        context.logger.error('Failed to copy file.');
        return {
          success: false,
          error: err.message,
        };
      }

      context.reportStatus('Done.');
      return { success: true };
    }
    ```

### Builder input

- You can invoke a builder indirectly through a CLI command, or directly with the Angular CLI `ng run` command.

- In either case, you must provide required inputs, but can let other inputs default to values that are pre-configured for a specific `target`, provide a pre-defined, named override configuration, and provide further override option values on the command line.

#### Input validation

- You define builder inputs in a JSON schema associated with that builder. The Architect tool collects the resolved input values into an `options` object, and validates their types against the schema before passing them to the builder function. (The Schematics library does the same kind of validation of user input.)

  - For our example builder, you expect the options value to be a `JsonObject` with two keys: A `source` and a `destination`, each of which are a string.

  - You can provide the following schema for type validation of these values.

    - src/schema.json

      ```
      {
        "$schema": "http://json-schema.org/schema",
        "type": "object",
        "properties": {
          "source": {
            "type": "string"
          },
          "destination": {
            "type": "string"
          }
        }
      }
      ```

    - This is a very simple example, but the use of a schema for validation can be very powerful. For more information, see the [JSON schemas website](http://json-schema.org/).

- To link our builder implementation with its schema and name, you need to create a _builder definition_ file, which you can point to in `package.json`.

  - Create a file named `builders.json` that looks like this:

    - builders.json
      ```
      {
        "builders": {
          "copy": {
            "implementation": "./dist/my-builder.js",
            "schema": "./src/schema.json",
            "description": "Copies a file."
          }
        }
      }
      ```

  - In the `package.json` file, add a `builders` key that tells the Architect tool where to find our builder definition file.

    - package.json

      ```
      {
        "name": "@example/copy-file",
        "version": "1.0.0",
        "description": "Builder for copying files",
        "builders": "builders.json",
        "dependencies": {
          "@angular-devkit/architect": "~0.1200.0",
          "@angular-devkit/core": "^12.0.0"
        }
      }
      ```

    - The official name of our builder is now `@example/copy-file:copy`. The first part of this is the package name (resolved using node resolution), and the second part is the builder name (resolved using the `builders.json` file).

- Using one of our `options` is very straightforward. You did this in the previous section when you accessed `options.source` and `options.destination`.

  - src/my-builder.ts (report status)

    ```
    context.reportStatus(`Copying ${options.source} to ${options.destination}.`);
    try {
      await fs.copyFile(options.source, options.destination);
    } catch (err) {
      context.logger.error('Failed to copy file.');
      return {
        success: false,
        error: err.message,
      };
    }

    context.reportStatus('Done.');
    return { success: true };
    ```

#### Target configuration

- A builder must have a defined target that associates it with a specific input configuration and `project`.

- Targets are defined in the `angular.json` CLI configuration file. A target specifies the builder to use, its default options configuration, and named alternative configurations. The Architect tool uses the target definition to resolve input options for a given run.

- The `angular.json` file has a section for each project, and the "architect" section of each project configures targets for builders used by CLI commands such as 'build', 'test', and 'lint'. By default, for example, the build command runs the builder `@angular-devkit/build-angular:browser` to perform the build task, and passes in default option values as specified for the `build` target in `angular.json`.

  - angular.json
    ```
    {
      "myApp": {
        …
        "architect": {
          "build": {
            "builder": "@angular-devkit/build-angular:browser",
            "options": {
              "outputPath": "dist/myApp",
              "index": "src/index.html",
              …
            },
            "configurations": {
              "production": {
                "fileReplacements": [
                  {
                    "replace": "src/environments/environment.ts",
                    "with": "src/environments/environment.prod.ts"
                  }
                ],
                "optimization": true,
                "outputHashing": "all",
                …
              }
            }
          },
          …
    ```

- The command passes the builder the set of default options specified in the "options" section. If you pass the `--configuration=production` flag, it uses the override values specified in the `production` alternative configuration. Specify further option overrides individually on the command line. You might also add more alternative configurations to the `build` target, to define other environments such as `stage` or `qa`.

##### Target strings

- The generic `ng run` CLI command takes as its first argument a target string of the following form.

  ```
  project:target[:configuration]
  ```

  - project

    - The name of the Angular CLI project that the target is associated with.

  - target

    - A named builder configuration from the `architect` section of the `angular.json` file.

  - configuration (optional)
    - The name of a specific configuration override for the given target, as defined in the `angular.json file`.

- If your builder calls another builder, it might need to read a passed target string. Parse this string into an object by using the `targetFromTargetString()` utility function from `@angular-devkit/architect`.

### Schedule and run

- Architect runs builders asynchronously. To invoke a builder, you schedule a task to be run when all configuration resolution is complete.

- The builder function is not executed until the scheduler returns a `BuilderRun` control object. The CLI typically schedules tasks by calling the `context.scheduleTarget()` function, and then resolves input options using the target definition in the `angular.json` file.

- Architect resolves input options for a given target by taking the default options object, then overwriting values from the configuration used (if any), then further overwriting values from the overrides object passed to `context.scheduleTarget()`. For the Angular CLI, the overrides object is built from command line arguments.

- Architect validates the resulting options values against the schema of the builder. If inputs are valid, Architect creates the context and executes the builder.

- Note:

  - You can also invoke a builder directly from another builder or test by calling `context.scheduleBuilder()`. You pass an options object directly to the method, and those option values are validated against the schema of the builder without further adjustment.

  Only the `context.scheduleTarget()` method resolves the configuration and overrides through the `angular.json` file.

#### Default architect configuration

- Let's create a simple `angular.json` file that puts target configurations into context.

- You can publish the builder to npm (see Publishing your Library), and install it using the following command:

  ```
  npm install @example/copy-file
  ```

- If you create a new project with `ng new builder-test`, the generated `angular.json` file looks something like this, with only default builder configurations.

  - angular.json
    ```
    {
      // …
      "projects": {
        // …
        "builder-test": {
          // …
          "architect": {
            // …
            "build": {
              "builder": "@angular-devkit/build-angular:browser",
              "options": {
                // … more options…
                "outputPath": "dist/builder-test",
                "index": "src/index.html",
                "main": "src/main.ts",
                "polyfills": "src/polyfills.ts",
                "tsConfig": "src/tsconfig.app.json"
              },
              "configurations": {
                "production": {
                  // … more options…
                  "optimization": true,
                  "aot": true,
                  "buildOptimizer": true
                }
              }
            }
          }
        }
      }
      // …
    }
    ```

angular.json

#### Adding a target

- Add a new target that will run our builder to copy a file. This target tells the builder to copy the `package.json` file.

- You need to update the `angular.json` file to add a target for this builder to the "architect" section of our new project.

  - We'll add a new target section to the "architect" object for our project

  - The target named "copy-package" uses our builder, which you published to `@example/copy-file`. (See Publishing your Library.)

  - The options object provides default values for the two inputs that you defined; `source`, which is the existing file you are copying, and `destination`, the path you want to copy to

  - The `configurations` key is optional, we'll leave it out for now

    - angular.json
      ```
      {
        "projects": {
          "builder-test": {
            "architect": {
              "copy-package": {
                "builder": "@example/copy-file:copy",
                "options": {
                  "source": "package.json",
                  "destination": "package-copy.json"
                }
              },
              "build": {
                "builder": "@angular-devkit/build-angular:browser",
                "options": {
                  "outputPath": "dist/builder-test",
                  "index": "src/index.html",
                  "main": "src/main.ts",
                  "polyfills": "src/polyfills.ts",
                  "tsConfig": "src/tsconfig.app.json"
                },
                "configurations": {
                  "production": {
                    "fileReplacements": [
                      {
                        "replace": "src/environments/environment.ts",
                        "with": "src/environments/environment.prod.ts"
                      }
                    ],
                    "optimization": true,
                    "aot": true,
                    "buildOptimizer": true
                  }
                }
              }
            }
          }
        }
      }
      ```

#### Running the builder

- To run our builder with the new target's default configuration, use the following CLI command.

  ```
  ng run builder-test:copy-package
  ```

  - This copies the `package.json` file to `package-copy.json`.

- Use command-line arguments to override the configured defaults. For example, to run with a different `destination` value, use the following CLI command.

  ```
  ng run builder-test:copy-package --destination=package-other.json
  ```

  - This copies the file to `package-other.json` instead of `package-copy.json`. Because you did not override the source option, it will copy from the `package.json` file (the default value provided for the target).

### Testing a builder

- Use integration testing for your builder, so that you can use the Architect scheduler to create a context, as in this [example](https://github.com/mgechev/cli-builders-demo).

  - In the builder source directory, you have created a new test file `my-builder.spec.ts`. The code creates new instances of `JsonSchemaRegistry` (for schema validation), `TestingArchitectHost` (an in-memory implementation of `ArchitectHost`), and `Architect`.

  - We've added a `builders.json` file next to the builder's `package.json` file, and modified the package file to point to it.

- Here's an example of a test that runs the copy file builder. The test uses the builder to copy the `package.json` file and validates that the copied file's contents are the same as the source.

  - src/my-builder.spec.ts

    ```
    import { Architect } from '@angular-devkit/architect';
    import { TestingArchitectHost } from '@angular-devkit/architect/testing';
    import { schema } from '@angular-devkit/core';
    import { promises as fs } from 'fs';

    describe('Copy File Builder', () => {
      let architect: Architect;
      let architectHost: TestingArchitectHost;

      beforeEach(async () => {
        const registry = new schema.CoreSchemaRegistry();
        registry.addPostTransform(schema.transforms.addUndefinedDefaults);

        // TestingArchitectHost() takes workspace and current directories.
        // Since we don't use those, both are the same in this case.
        architectHost = new TestingArchitectHost(__dirname, __dirname);
        architect = new Architect(architectHost, registry);

        // This will either take a Node package name, or a path to the directory
        // for the package.json file.
        await architectHost.addBuilderFromPackage('..');
      });

      it('can copy files', async () => {
        // A "run" can have multiple outputs, and contains progress information.
        const run = await architect.scheduleBuilder('@example/copy-file:copy', {
          source: 'package.json',
          destination: 'package-copy.json',
        });

        // The "result" member (of type BuilderOutput) is the next output.
        const output = await run.result;

        // Stop the builder from running. This stops Architect from keeping
        // the builder-associated states in memory, since builders keep waiting
        // to be scheduled.
        await run.stop();

        // Expect that the copied file is the same as its source.
        const sourceContent = await fs.readFile('package.json', 'utf8');
        const destinationContent = await fs.readFile('package-copy.json', 'utf8');
        expect(destinationContent).toBe(sourceContent);
      });
    });
    ```

  - When running this test in your repo, you need the [ts-node](https://github.com/TypeStrong/ts-node) package. You can avoid this by renaming `my-builder.spec.ts` to `my-builder.spec.js`.

#### Watch mode

- Architect expects builders to run once (by default) and return. This behavior is not entirely compatible with a builder that watches for changes (like Webpack, for example). Architect can support watch mode, but there are some things to look out for.

  - To be used with watch mode, a builder handler function should return an Observable. Architect subscribes to the Observable until it completes and might reuse it if the builder is scheduled again with the same arguments.

  - The builder should always emit a `BuilderOutput` object after each execution. Once it's been executed, it can enter a watch mode, to be triggered by an external event. If an event triggers it to restart, the builder should execute the `context.reportRunning()` function to tell Architect that it is running again. This prevents Architect from stopping the builder if another run is scheduled.

- When your builder calls `BuilderRun.stop()` to exit watch mode, Architect unsubscribes from the builder's Observable and calls the builder's teardown logic to clean up. (This behavior also allows for long-running builds to be stopped and cleaned up.)

- In general, if your builder is watching an external event, you should separate your run into three phases.

  | PHASES     | DETAILS                                                                                                                                                                                                                                                  |
  | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
  | Running    | For example, webpack compiles. This ends when webpack finishes and your builder emits a `BuilderOutput` object.                                                                                                                                          |
  | Watching   | Between two runs, watch an external event stream. For example, webpack watches the file system for any changes. This ends when webpack restarts building, and `context.reportRunning()` is called. This goes back to step 1.                             |
  | Completion | Either the task is fully completed (for example, webpack was supposed to run a number of times), or the builder run was stopped (using `BuilderRun.stop()`). Your teardown logic is executed, and Architect unsubscribes from your builder's Observable. |

### Summary

- The CLI Builder API provides a new way of changing the behavior of the Angular CLI by using builders to execute custom logic.

  - Builders can be synchronous or asynchronous, execute once or watch for external events, and can schedule other builders or targets

  - Builders have option defaults specified in the `angular.json` configuration file, which can be overwritten by an alternate configuration for the target, and further overwritten by command line flags

  - We recommend that you use integration tests to test Architect builders. Use unit tests to validate the logic that the builder executes.

  - If your builder returns an Observable, it should clean up in the teardown logic of that Observable

## Language service

- The Angular Language Service provides code editors with a way to get completions, errors, hints, and navigation inside Angular templates. It works with external templates in separate HTML files, and also with in-line templates.

### Configuring compiler options for the Angular Language Service

- To enable the latest Language Service features, set the `strictTemplates` option in `tsconfig.json` by setting `strictTemplates` to `true`, as shown in the following example:

  ```
  "angularCompilerOptions": {
    "strictTemplates": true
  }
  ```

### Featres

- Your editor autodetects that you are opening an Angular file. It then uses the Angular Language Service to read your tsconfig.json file, find all the templates you have in your application, and then provide language services for any templates that you open.

- Language services include:

  - Completions lists
  - AOT Diagnostic messages
  - Quick info
  - Go to definition

#### Autocompletion

- Autocompletion can speed up your development time by providing you with contextual possibilities and hints as you type. This example shows autocomplete in an interpolation. As you type it out, you can press tab to complete.

  ![](https://angular.io/generated/images/guide/language-service/language-completion.gif)

- There are also completions within elements. Any elements you have as a component selector will show up in the completion list.

#### Error checking

- The Angular Language Service can forewarn you of mistakes in your code. In this example, Angular doesn't know what `orders` is or where it comes from.

  ![](https://angular.io/generated/images/guide/language-service/language-error.gif)

#### Quick info and navigation

- The quick-info feature lets you hover to see where components, directives, and modules come from. You can then click "Go to definition" or press F12 to go directly to the definition.

  ![](https://angular.io/generated/images/guide/language-service/language-navigation.gif)

### Angular Language Service in your editor

- Angular Language Service is currently available as an extension for Visual Studio Code, WebStorm, Sublime Text and Eclipse IDE.

#### Visual Studio Code

- In Visual Studio Code, install the extension from the Extensions: Marketplace. Open the marketplace from the editor using the Extensions icon on the left menu pane, or use VS Quick Open (⌘+P on Mac, CTRL+P on Windows) and type "? ext". In the marketplace, search for Angular Language Service extension, and click the Install button.

- The Visual Studio Code integration with the Angular language service is maintained and distributed by the Angular team.

### How the Language Service works

- When you use an editor with a language service, the editor starts a separate language-service process and communicates with it through an [RPC](https://en.wikipedia.org/wiki/Remote_procedure_call), using the [Language Server Protocol](https://microsoft.github.io/language-server-protocol). When you type into the editor, the editor sends information to the language-service process to track the state of your project.

- When you trigger a completion list within a template, the editor first parses the template into an HTML [abstract syntax tree (AST)](https://en.wikipedia.org/wiki/Abstract_syntax_tree). The Angular compiler interprets that tree to determine the context: which module the template is part of, the current scope, the component selector, and where your cursor is in the template AST. It can then determine the symbols that could potentially be at that position.

- It's a little more involved if you are in an interpolation. If you have an interpolation of {{data.---}} inside a div and need the completion list after data.---, the compiler can't use the HTML AST to find the answer. The HTML AST can only tell the compiler that there is some text with the characters "{{data.---}}". That's when the template parser produces an expression AST, which resides within the template AST. The Angular Language Services then looks at data.--- within its context, asks the TypeScript Language Service what the members of data are, and returns the list of possibilities.

## DevTools

- Angular DevTools is a browser extension that provides debugging and profiling capabilities for Angular applications. Angular DevTools supports Angular v12 and later.

- When you open the extension, you'll see two additional tabs:
  |TABS| DETAILS|
  |----|---------|
  |Components| Lets you explore the components and directives in your application and preview or edit their state.|
  |Profiler| Lets you profile your application and understand what the performance bottleneck is during change detection execution.|

  ![](https://angular.io/generated/images/guide/devtools/devtools-tabs.png)

  - In the top-right corner of Angular DevTools you'll find which version of Angular is running on the page as well as the latest commit hash for the extension.

### Debug your application

- The **Components** tab lets you explore the structure of your application. You can visualize and inspect the component and directive instances and preview or modify their state. In the next couple of sections we'll look into how to use this tab effectively to debug your application.

#### Explore the application structure

![](https://angular.io/generated/images/guide/devtools/component-explorer.png)

- In the preceding screenshot, you can see the component tree of an application.

- The component tree displays a hierarchical relationship of the components and directives within your application. When you select a component or a directive instance, Angular DevTools presents additional information about that instance.

#### View properties

- Click the individual components or directives in the component explorer to select them and preview their properties. Angular DevTools displays their properties and metadata on the right-hand side of the component tree.

- To look up a component or directive by name use the search box above the component tree. To navigate to the next search match, press Enter. To navigate to the previous search match, press Shift + Enter.

  ![](https://angular.io/generated/images/guide/devtools/search.png)

#### Navigate to the host node

- To go to the host element of a particular component or directive, find it in the component explorer and double-click it. Browsers' DevTools opens the Elements tab in Chrome or the Inspector one in Firefox, and selects the associated DOM node.

#### Navigate to source

- For components, Angular DevTools also lets you navigate to the component definition in the source tab. After you select a particular component, click the icon at the top-right of the properties view:

  ![](https://angular.io/generated/images/guide/devtools/navigate-source.png)

#### Update property value

- Like browsers' DevTools, the properties view lets you edit the value of an input, output, or another property. Right-click on the property value. If edit functionality is available for this value type, you'll see a text input. Type the new value and press Enter.

  ![](https://angular.io/generated/images/guide/devtools/update-property.png)

#### Access selected component or directive in console

- As a shortcut in the console, Angular DevTools provides you access to instances of the recently selected components or directives. Type `$ng0` to get a reference to the instance of the currently selected component or directive, and type `$ng1` for the previously selected instance.

  ![](https://angular.io/generated/images/guide/devtools/access-console.png)

#### Select a directive or component

- Similar to browsers' DevTools, you can inspect the page to select a particular component or directive. Click the _Inspect element_ icon in the top left corner within Angular DevTools and hover over a DOM element on the page. The extension recognizes the associated directives and/or components and lets you select the corresponding element in the Component tree.

  ![](https://angular.io/generated/images/guide/devtools/inspect-element.png)

### Profile your application

- The **Profiler** tab lets you preview the execution of Angular's change detection.

  ![](https://angular.io/generated/images/guide/devtools/profiler.png)

- The Profiler lets you start profiling or import an existing profile. To start profiling your application, hover over the circle in the top-left corner within the `Profiler` tab and click `Start recording`.

- During profiling, Angular DevTools captures execution events, such as change detection and lifecycle hook execution. To finish recording, click the circle again to `Stop recording`.

- You can also import an existing recording. Read more about this feature in the Import recording section.

#### Understand your application's execution

- In the following screenshot, find the default view of the Profiler after you complete recording.

  ![](https://angular.io/generated/images/guide/devtools/default-profiler-view.png)

- Near the top of the view you can see a sequence of bars, each one of them symbolizing change detection cycles in your app. The taller a bar is, the longer your application has spent in this cycle. When you select a bar, DevTools renders a bar chart with all the components and directives that it captured during this cycle.

  ![](https://angular.io/generated/images/guide/devtools/profiler-selected-bar.png)

- Earlier on the change detection timeline, you can find how much time Angular spent in this cycle. Angular DevTools attempts to estimate the frame drop at this point to indicate when the execution of your application might impact the user experience.

- Angular DevTools also indicates what triggered the change detection (that is, the change detection's source).

#### Understand component execution

- When you click on a bar, you'll find a detailed view about how much time your application spent in the particular directive or component:

  ![](https://angular.io/generated/images/guide/devtools/directive-details.png)

  - Figure shows the total time spent by NgforOf directive and which method was called in it. It also shows the parent hierarchy of the directive selected.

#### Hierarchical views

![](https://angular.io/generated/images/guide/devtools/flame-graph-view.png)

- You can also preview the change detection execution in a flame graph-like view. Each tile in the graph represents an element on the screen at a specific position in the render tree.

- For example, if during one change detection cycle at a specific position in the component tree you had ComponentA, this component was removed and in its place Angular rendered ComponentB, you'll see both components at the same tile.

- Each tile is colored depending on how much time Angular spent there. DevTools determines the intensity of the color by the time spent relative to the tile where we've spent the most time in change detection.

- When you click on a certain tile, you'll see details about it in the panel on the right. Double-clicking the tile zooms it in so you can preview the nested children.

#### Debug OnPush

- To preview the components in which Angular did change detection, select the Change detection checkbox at the top, above the flame graph.

- This view colors all the tiles in which Angular performed change detection in green, and the rest in gray:

  ![](https://angular.io/generated/images/guide/devtools/debugging-onpush.png)

#### Import recording

- Click the Save Profile button at the top-left of a recorded profiling session to export it as a JSON file and save it to the disk. Then, import the file in the initial view of the profiler by clicking the Choose file input:

  ![](https://angular.io/generated/images/guide/devtools/save-profile.png)

## Schematics

### Schematics Overview

#### Generating code using schematics

- A schematic is a template-based code generator that supports complex logic. It is a set of instructions for transforming a software project by generating or modifying code. Schematics are packaged into `collections` and installed with npm.

- The schematic collection can be a powerful tool for creating, modifying, and maintaining any software project, but is particularly useful for customizing Angular projects to suit the particular needs of your own organization. You might use schematics, for example, to generate commonly-used UI patterns or specific components, using predefined templates or layouts. Use schematics to enforce architectural rules and conventions, making your projects consistent and interoperative.

#### Schematics for the Angular CLI

- Schematics are part of the Angular ecosystem. The Angular CLI uses schematics to apply transforms to a web-app project. You can modify these schematics, and define new ones to do things like update your code to fix breaking changes in a dependency, for example, or to add a new configuration option or framework to an existing project.

- Schematics that are included in the `@schematics/angular` collection are run by default by the commands `ng generate` and `ng add`. The package contains named schematics that configure the options that are available to the CLI for `ng generate` sub-commands, such as `ng generate component` and `ng generate service`. The sub-commands for `ng generate` are shorthand for the corresponding schematic. To specify and generate a particular schematic, or a collection of schematics, using the long form:

  ```
  ng generate my-schematic-collection:my-schematic-name
  ```

  or

  ```
  ng generate my-schematic-name --collection collection-name
  ```

##### Configuring CLI schematics

- A JSON schema associated with a schematic tells the Angular CLI what options are available to commands and sub-commands, and determines the defaults. These defaults can be overridden by providing a different value for an option on the command line. See Workspace Configuration for information about how to change the generation option defaults for your workspace.

- The JSON schemas for the default schematics used by the CLI to generate projects and parts of projects are collected in the package `@schematics/angular`
  . The schema describes the options available to the CLI for each of the `ng generate` sub-commands, as shown in the `--help` output.

#### Developing schematics for libraries

- As a library developer, you can create your own collections of custom schematics to integrate your library with the Angular CLI.

  - An add schematic lets developers install your library in an Angular workspace using `ng add`

  - Generation schematics can tell the `ng generate` sub-commands how to modify projects, add configurations and scripts, and scaffold artifacts that are defined in your library

  - An update schematic can tell the `ng update` command how to update your library's dependencies and adjust for breaking changes when you release a new version

##### Add schematics

- An add schematic is typically supplied with a library, so that the library can be added to an existing project with `ng add`. The `add` command uses your package manager to download new dependencies, and invokes an installation script that is implemented as a schematic.

- For example, the [@angular/material](https://material.angular.io/guide/schematics) schematic tells the add command to install and set up Angular Material and theming, and register new starter components that can be created with `ng generate`. Look at this one as an example and model for your own add schematic.

- Partner and third party libraries also support the Angular CLI with add schematics. For example, `@ng-bootstrap/schematics` adds [ng-bootstrap](https://ng-bootstrap.github.io/) to an app, and `@clr/angular` installs and sets up [Clarity from VMWare](https://clarity.design/documentation/get-started).

- An add schematic can also update a project with configuration changes, add additional dependencies (such as polyfills), or scaffold package-specific initialization code. For example, the `@angular/pwa` schematic turns your application into a PWA by adding an application manifest and service worker.

##### Generation schematics

- Generation schematics are instructions for the `ng generate` command. The documented sub-commands use the default Angular generation schematics, but you can specify a different schematic (in place of a sub-command) to generate an artifact defined in your library.

- Angular Material, for example, supplies generation schematics for the UI components that it defines. The following command uses one of these schematics to render an Angular Material `<mat-table>` that is pre-configured with a datasource for sorting and pagination.

  ```
  ng generate @angular/material:table <component-name>
  ```

##### Update schematics

- The `ng update` command can be used to update your workspace's library dependencies. If you supply no options or use the help option, the command examines your workspace and suggests libraries to update.

  ```
  ng update
  We analyzed your package.json, there are some packages to update:

    Name                                      Version                     Command to update
    ‐-------------------------------------------------------------------------------
    @angular/cdk                       7.2.2 -> 7.3.1           ng update @angular/cdk
    @angular/cli                       7.2.3 -> 7.3.0           ng update @angular/cli
    @angular/core                      7.2.2 -> 7.2.3           ng update @angular/core
    @angular/material                  7.2.2 -> 7.3.1           ng update @angular/material
    rxjs                                      6.3.3 -> 6.4.0           ng update rxjs

    There might be additional packages that are outdated.
    Run "ng update --all" to try to update all at the same time.
  ```

- If you pass the command a set of libraries to update (or the --all flag), it updates those libraries, their peer dependencies, and the peer dependencies that depend on them.

  - If there are inconsistencies (for example, if peer dependencies cannot be matched by a simple semver range), the command generates an error and does not change anything in the workspace.

  - We recommend that you do not force an update of all dependencies by default. Try updating specific dependencies first.

- If you create a new version of your library that introduces potential breaking changes, you can provide an update schematic to enable the ng update command to automatically resolve any such changes in the project being updated.

  - For example, suppose you want to update the Angular Material library.

    ```
    ng update @angular/material
    ```

  - This command updates both `@angular/material` and its dependency `@angular/cdk` in your workspace's `package.json`. If either package contains an update schematic that covers migration from the existing version to a new version, the command runs that schematic on your workspace.

### Authoring schematics

- You can create your own schematics to operate on Angular projects. Library developers typically package schematics with their libraries to integrate them with the Angular CLI. You can also create stand-alone schematics to manipulate the files and constructs in Angular applications as a way of customizing them for your development environment and making them conform to your standards and constraints. Schematics can be chained, running other schematics to perform complex operations.

- Manipulating the code in an application has the potential to be both very powerful and correspondingly dangerous. For example, creating a file that already exists would be an error, and if it was applied immediately, it would discard all the other changes applied so far. The Angular Schematics tooling guards against side effects and errors by creating a virtual file system. A schematic describes a pipeline of transformations that can be applied to the virtual file system. When a schematic runs, the transformations are recorded in memory, and only applied in the real file system once they're confirmed to be valid.

#### Schematics concepts

- The public API for schematics defines classes that represent the basic concepts.

  - The virtual file system is represented by a `Tree`. The `Tree` data structure contains a base (a set of files that already exists) and a staging area (a list of changes to be applied to the base). When making modifications, you don't actually change the base, but add those modifications to the staging area.

  - A `Rule` object defines a function that takes a `Tree`, applies transformations, and returns a new `Tree`. The main file for a schematic, `index.ts`, defines a set of rules that implement the schematic's logic.

  - A transformation is represented by an `Action`. There are four action types: `Create`, `Rename`, `Overwrite`, and `Delete`.

  - Each schematic runs in a context, represented by a `SchematicContext` object.

- The context object passed into a rule provides access to utility functions and metadata that the schematic might need to work with, including a logging API to help with debugging. The context also defines a _merge strategy_ that determines how changes are merged from the staged tree into the base tree. A change can be accepted or ignored, or throw an exception.

##### Defining rules and actions

- When you create a new blank schematic with the `Schematics CLI`, the generated entry function is a _rule factory_. A `RuleFactory` object defines a higher-order function that creates a `Rule`.

  - index.ts

    ```
    import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';

    // You don't have to export the function as default.
    // You can also have more than one rule factory per file.
    export function helloWorld(_options: any): Rule {
      return (tree: Tree, _context: SchematicContext) => {
        return tree;
      };
    }
    ```

- Your rules can make changes to your projects by calling external tools and implementing logic. You need a rule, for example, to define how a template in the schematic is to be merged into the hosting project.

- Rules can make use of utilities provided with the `@schematics/angular` package. Look for helper functions for working with modules, dependencies, TypeScript, AST, JSON, Angular CLI workspaces and projects, and more.

  - index.ts
    ```
    import {
      JsonAstObject,
      JsonObject,
      JsonValue,
      Path,
      normalize,
      parseJsonAst,
      strings,
    } from '@angular-devkit/core';
    ```

##### Defining input options with a schema and interfaces

- Rules can collect option values from the caller and inject them into templates. The options available to your rules, with their allowed values and defaults, are defined in the schematic's JSON schema file, `<schematic>/schema.json`. Define variable or enumerated data types for the schema using TypeScript interfaces.

- The schema defines the types and default values of variables used in the schematic. For example, the hypothetical "Hello World" schematic might have the following schema.

  - src/hello-world/schema.json
    ```
    {
        "properties": {
            "name": {
                "type": "string",
                "minLength": 1,
                "default": "world"
            },
            "useColor": {
                "type": "boolean"
            }
        }
    }
    ```

- See examples of schema files for the Angular CLI command schematics in [@schematics/angular](https://github.com/angular/angular-cli/blob/main/packages/schematics/angular/application/schema.json)
  .

##### Schematic prompts

- Schematic prompts introduce user interaction into schematic execution. Configure schematic options to display a customizable question to the user. The prompts are displayed before the execution of the schematic, which then uses the response as the value for the option. This lets users direct the operation of the schematic without requiring in-depth knowledge of the full spectrum of available options.

  - The "Hello World" schematic might, for example, ask the user for their name, and display that name in place of the default name "world". To define such a prompt, add an `x-prompt` property to the schema for the `name` variable.

  - Similarly, you can add a prompt to let the user decide whether the schematic uses color when executing its hello action. The schema with both prompts would be as follows.

    - src/hello-world/schema.json
      ```
      {
          "properties": {
              "name": {
                  "type": "string",
                  "minLength": 1,
                  "default": "world",
                  "x-prompt": "What is your name?"
              },
              "useColor": {
                  "type": "boolean",
                  "x-prompt": "Would you like the response in color?"
              }
          }
      }
      ```

- **Prompt short-form syntax**

  - These examples use a shorthand form of the prompt syntax, supplying only the text of the question. In most cases, this is all that is required. Notice however, that the two prompts expect different types of input. When using the shorthand form, the most appropriate type is automatically selected based on the property's schema. In the example, the `name` prompt uses the `input` type because it is a string property. The `useColor` prompt uses a `confirmation` type because it is a Boolean property. In this case, "yes" corresponds to true and "no" corresponds to false.

  - There are three supported input types.

    | INPUT TYPE   | DETAILS                                            |
    | ------------ | -------------------------------------------------- |
    | confirmation | A yes or no question; ideal for Boolean options.   |
    | input        | Textual input; ideal for string or number options. |
    | list         | A predefined set of allowed values.                |

  - In the short form, the type is inferred from the property's type and constraints.

    | PROPERTY SCHEMA   | PROMPT TYPE                                |
    | ----------------- | ------------------------------------------ |
    | "type": "boolean" | confirmation ("yes"=true, "no"=false)      |
    | "type": "string"  | input                                      |
    | "type": "number"  | input (only valid numbers accepted)        |
    | "type": "integer" | input (only valid numbers accepted)        |
    | "enum": […]       | list (enum members become list selections) |

  - In the following example, the property takes an enumerated value, so the schematic automatically chooses the list type, and creates a menu from the possible values.

    - schema.json
      ```
      "style": {
        "description": "The file extension or preprocessor to use for style files.",
        "type": "string",
        "default": "css",
        "enum": [
          "css",
          "scss",
          "sass",
          "less",
          "styl"
        ],
        "x-prompt": "Which stylesheet format would you like to use?"
      }
      ```

  - The prompt runtime automatically validates the provided response against the constraints provided in the JSON schema. If the value is not acceptable, the user is prompted for a new value. This ensures that any values passed to the schematic meet the expectations of the schematic's implementation, so that you do not need to add additional checks within the schematic's code.

- **Prompt long-form syntax**

  - The `x-prompt` field syntax supports a long form for cases where you require additional customization and control over the prompt. In this form, the `x-prompt` field value is a JSON object with subfields that customize the behavior of the prompt.

    | FIELD   | DATA VALUE                                                                |
    | ------- | ------------------------------------------------------------------------- |
    | type    | `confirmation`, `input`, or `list` (selected automatically in short form) |
    | message | string (required)                                                         |
    | items   | string and/or label/value object pair (only valid with type `list`)       |

  - The following example of the long form is from the JSON schema for the schematic that the CLI uses to `generate applications`. It defines the prompt that lets users choose which style preprocessor they want to use for the application being created. By using the long form, the schematic can provide more explicit formatting of the menu choices.

    - package/schematics/angular/application/schema.json
      ```
      "style": {
        "description": "The file extension or preprocessor to use for style files.",
        "type": "string",
        "default": "css",
        "enum": [
          "css",
          "scss",
          "sass",
          "less"
        ],
        "x-prompt": {
          "message": "Which stylesheet format would you like to use?",
          "type": "list",
          "items": [
            { "value": "css",  "label": "CSS" },
            { "value": "scss", "label": "SCSS   [ https://sass-lang.com/documentation/syntax#scss                ]" },
            { "value": "sass", "label": "Sass   [ https://sass-lang.com/documentation/syntax#the-indented-syntax ]" },
            { "value": "less", "label": "Less   [ http://lesscss.org/                                            ]" }
          ]
        },
      },
      ```

- x-prompt schema

  - The JSON schema that defines a schematic's options supports extensions to allow the declarative definition of prompts and their respective behavior. No additional logic or changes are required to the code of a schematic to support the prompts. The following JSON schema is a complete description of the long-form syntax for the `x-prompt` field.

    - x-prompt schema
      ```
      {
        "oneOf": [
            { "type": "string" },
            {
                "type": "object",
                "properties": {
                    "type": { "type": "string" },
                    "message": { "type": "string" },
                    "items": {
                        "type": "array",
                        "items": {
                            "oneOf": [
                                { "type": "string" },
                                {
                                    "type": "object",
                                    "properties": {
                                        "label": { "type": "string" },
                                        "value": { }
                                    },
                                    "required": [ "value" ]
                                }
                            ]
                        }
                    }
                },
                "required": [ "message" ]
            }
        ]
      }
      ```

#### Schematics CLI

- Schematics come with their own command-line tool. Using Node 6.9 or later, install the Schematics command line tool globally:

  ```
  npm install -g @angular-devkit/schematics-cli
  ```

  - This installs the `schematics` executable, which you can use to create a new schematics collection in its own project folder, add a new schematic to an existing collection, or extend an existing schematic.

- In the following sections, you will create a new schematics collection using the CLI to introduce the files and file structure, and some of the basic concepts.

- The most common use of schematics, however, is to integrate an Angular library with the Angular CLI. Do this by creating the schematic files directly within the library project in an Angular workspace, without using the Schematics CLI. See [Schematics for Libraries](https://angular.io/guide/schematics-for-libraries).

##### Creating a schematics collection

- The following command creates a new schematic named `hello-world` in a new project folder of the same name.

  ```
  schematics blank --name=hello-world
  ```

- The blank schematic is provided by the Schematics CLI. The command creates a new project folder (the root folder for the collection) and an initial named schematic in the collection.

- Go to the collection folder, install your npm dependencies, and open your new collection in your favorite editor to see the generated files. For example, if you are using VS Code:

  ```
  cd hello-world
  npm install
  npm run build
  code .
  ```

- The initial schematic gets the same name as the project folder, and is generated in `src/hello-world`. Add related schematics to this collection, and modify the generated skeleton code to define your schematic's functionality. Each schematic name must be unique within the collection.

##### Running a schematic

- Use the `schematics` command to run a named schematic. Provide the path to the project folder, the schematic name, and any mandatory options, in the following format.

  ```
  schematics <path-to-schematics-project>:<schematics-name> --<required-option>=<value>
  ```

- The path can be absolute or relative to the current working directory where the command is executed. For example, to run the schematic you just generated (which has no required options), use the following command.

  ```
  schematics .:hello-world
  ```

##### Adding a schematic to a collection

- To add a schematic to an existing collection, use the same command you use to start a new schematics project, but run the command inside the project folder.

  ```
  cd hello-world
  schematics blank --name=goodbye-world
  ```

  - The command generates the new named schematic inside your collection, with a main index.ts file and its associated test spec. It also adds the name, description, and factory function for the new schematic to the collection's schema in the `collection.json` file.

#### Collection contents

- The top level of the root project folder for a collection contains configuration files, a `node_modules` folder, and a `src/` folder. The `src/` folder contains subfolders for named schematics in the collection, and a schema, `collection.json`, which describes the collected schematics. Each schematic is created with a name, description, and factory function.

  ```
  {
    "$schema":
      "../node_modules/@angular-devkit/schematics/collection-schema.json",
    "schematics": {
      "hello-world": {
        "description": "A blank schematic.",
        "factory": "./hello-world/index#helloWorld"
      }
    }
  }
  ```

  - The `$schema` property specifies the schema that the CLI uses for validation.

  - The `schematics` property lists named schematics that belong to this collection. Each schematic has a plain-text description, and points to the generated entry function in the main file.

  - The `factory` property points to the generated entry function. In this example, you invoke the `hello-world` schematic by calling the `helloWorld()` factory function.

  - The optional `schema` property points to a JSON schema file that defines the command-line options available to the schematic.

  - The optional `aliases` array specifies one or more strings that can be used to invoke the schematic. For example, the schematic for the Angular CLI "generate" command has an alias "g", that lets you use the command `ng g`.

##### Named schematics

- When you use the Schematics CLI to create a blank schematics project, the new blank schematic is the first member of the collection, and has the same name as the collection. When you add a new named schematic to this collection, it is automatically added to the `collection.json` schema.

- In addition to the name and description, each schematic has a `factory` property that identifies the schematic's entry point. In the example, you invoke the schematic's defined functionality by calling the `helloWorld()` function in the main file, `hello-world/index.ts`.

  ![](https://angular.io/generated/images/guide/schematics/collection-files.gif)

  - Each named schematic in the collection has the following main parts.

    | PARTS       | DETAILS                                                           |
    | ----------- | ----------------------------------------------------------------- |
    | index.ts    | Code that defines the transformation logic for a named schematic. |
    | schema.json | Schematic variable definition.                                    |
    | schema.d.ts | Schematic variables.                                              |
    | files/      | Optional component/template files to replicate.                   |

  - It is possible for a schematic to provide all of its logic in the `index.ts` file, without additional templates. You can create dynamic schematics for Angular, however, by providing components and templates in the `files` folder, like those in standalone Angular projects. The logic in the index file configures these templates by defining rules that inject data and modify variables.

### Schematics for libraries

- When you create an Angular library, you can provide and package it with schematics that integrate it with the Angular CLI. With your schematics, your users can use `ng add` to install an initial version of your library, `ng generate` to create artifacts defined in your library, and `ng update` to adjust their project for a new version of your library that introduces breaking changes.

- All three types of schematics can be part of a collection that you package with your library.

- Download the [library schematics project](https://angular.io/generated/zips/schematics-for-libraries/schematics-for-libraries.zip) for a completed example of the following steps.

#### Creating a schematics collection

- To start a collection, you need to create the schematic files. The following steps show you how to add initial support without modifying any project files.

  - 1. In your library's root folder, create a `schematics` folder.

  - 2. In the `schematics/` folder, create an `ng-add` folder for your first schematic.

  - 3. At the root level of the `schematics` folder, create a `collection.json` file.

  - 4. Edit the `collection.json` file to define the initial schema for your collection.

    - projects/my-lib/schematics/collection.json (Schematics Collection)

      ```
      {
        "$schema": "../../../node_modules/@angular-devkit/schematics/collection-schema.json",
        "schematics": {
          "ng-add": {
            "description": "Add my library to the project.",
            "factory": "./ng-add/index#ngAdd"
          }
        }
      }
      ```

      - The `$schema` path is relative to the Angular Devkit collection schema.
      - The `schematics` object describes the named schematics that are part of this collection.
      - The first entry is for a schematic named `ng-add`. It contains the description, and points to the factory function that is called when your schematic is executed.

  - 5. In your library project's `package.json` file, add a "schematics" entry with the path to your schema file. The Angular CLI uses this entry to find named schematics in your collection when it runs commands.

    - projects/my-lib/package.json (Schematics Collection Reference)

      ```
      {
        "name": "my-lib",
        "version": "0.0.1",
        "schematics": "./schematics/collection.json",
      }
      ```

    - The initial schema that you have created tells the CLI where to find the schematic that supports the `ng add` command. Now you are ready to create that schematic.

#### Providing installation support

- A schematic for the `ng add` command can enhance the initial installation process for your users. The following steps define this type of schematic.

  - 1. Go to the `<lib-root>/schematics/ng-add` folder.

  - 2. Create the main file, `index.ts`.

  - 3. Open `index.ts` and add the source code for your schematic factory function.

    - projects/my-lib/schematics/ng-add/index.ts (ng-add Rule Factory)

      ```
      import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
      import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';

      // Just return the tree
      export function ngAdd(): Rule {
        return (tree: Tree, context: SchematicContext) => {
          context.addTask(new NodePackageInstallTask());
          return tree;
        };
      }
      ```

    - The only step needed to provide initial ng add support is to trigger an installation task using the `SchematicContext`. The task uses the user's preferred package manager to add the library to the project's `package.json` configuration file, and install it in the project's `node_modules` directory.

    - In this example, the function receives the current Tree and returns it without any modifications. If you need to, do additional setup when your package is installed, such as generating files, updating configuration, or any other initial setup your library requires.

##### Define dependency type

- Use the `save` option of `ng-add` to configure if the library should be added to the `dependencies`, the `devDependencies`, or not saved at all in the project's `package.json` configuration file.

  - projects/my-lib/package.json (ng-add Reference)

    ```
    "ng-add": {
      "save": "devDependencies"
    },
    ```

  - Possible values are:

    | VALUES            | DETAILS                                |
    | ----------------- | -------------------------------------- |
    | false             | Don't add the package to package.json  |
    | true              | Add the package to the dependencies    |
    | "dependencies"    | Add the package to the dependencies    |
    | "devDependencies" | Add the package to the devDependencies |

#### Building your schematics

- To bundle your schematics together with your library, you must configure the library to build the schematics separately, then add them to the bundle. You must build your schematics after you build your library, so they are placed in the correct directory.

  - Your library needs a custom Typescript configuration file with instructions on how to compile your schematics into your distributed library

  - To add the schematics to the library bundle, add scripts to the library's `package.json` file

- Assume you have a library project `my-lib` in your Angular workspace. To tell the library how to build the schematics, add a `tsconfig.schematics.json` file next to the generated `tsconfig.lib.json` file that configures the library build.

  - 1. Edit the `tsconfig.schematics.json` file to add the following content.

    - projects/my-lib/tsconfig.schematics.json (TypeScript Config)
      ```
      {
        "compilerOptions": {
          "baseUrl": ".",
          "lib": [
            "es2018",
            "dom"
          ],
          "declaration": true,
          "module": "commonjs",
          "moduleResolution": "node",
          "noEmitOnError": true,
          "noFallthroughCasesInSwitch": true,
          "noImplicitAny": true,
          "noImplicitThis": true,
          "noUnusedParameters": true,
          "noUnusedLocals": true,
          "rootDir": "schematics",
          "outDir": "../../dist/my-lib/schematics",
          "skipDefaultLibCheck": true,
          "skipLibCheck": true,
          "sourceMap": true,
          "strictNullChecks": true,
          "target": "es6",
          "types": [
            "jasmine",
            "node"
          ]
        },
        "include": [
          "schematics/**/*"
        ],
        "exclude": [
          "schematics/*/files/**/*"
        ]
      }
      ```

    | OPTIONS | DETAILS                                                                                                        |
    | ------- | -------------------------------------------------------------------------------------------------------------- |
    | rootDir | Specifies that your schematics folder contains the input files to be compiled.                                 |
    | outDir  | Maps to the library's output folder. By default, this is the dist/my-lib folder at the root of your workspace. |

  - 2. To make sure your schematics source files get compiled into the library bundle, add the following scripts to the `package.json` file in your library project's root folder (`projects/my-lib`).

    - projects/my-lib/package.json (Build Scripts)

      ```
      {
        "name": "my-lib",
        "version": "0.0.1",
        "scripts": {
          "build": "tsc -p tsconfig.schematics.json",
          "postbuild": "copyfiles schematics/*/schema.json schematics/*/files/** schematics/collection.json ../../dist/my-lib/"
        },
        "peerDependencies": {
          "@angular/common": "^7.2.0",
          "@angular/core": "^7.2.0"
        },
        "schematics": "./schematics/collection.json",
        "ng-add": {
          "save": "devDependencies"
        },
        "devDependencies": {
          "copyfiles": "file:../../node_modules/copyfiles",
          "typescript": "file:../../node_modules/typescript"
        }
      }
      ```

      - The `build` script compiles your schematic using the custom `tsconfig.schematics.json` file

      - The `postbuild` script copies the schematic files after the `build` script completes

      - Both the `build` and the `postbuild` scripts require the `copyfiles` and `typescript` dependencies. To install the dependencies, navigate to the path defined in `devDependencies` and run `npm install` before you run the scripts.

#### Providing generation support

- You can add a named schematic to your collection that lets your users use the `ng generate` command to create an artifact that is defined in your library.

- We'll assume that your library defines a service, `my-service`, that requires some setup. You want your users to be able to generate it using the following CLI command.

  ```
  ng generate my-lib:my-service
  ```

- To begin, create a new subfolder, `my-service`, in the `schematics` folder.

##### Configure the new schematic

- When you add a schematic to the collection, you have to point to it in the collection's schema, and provide configuration files to define options that a user can pass to the command.

  - 1. Edit the `schematics/collection.json` file to point to the new schematic subfolder, and include a pointer to a schema file that specifies inputs for the new schematic.

    - projects/my-lib/schematics/collection.json (Schematics Collection)
      ```
      {
        "$schema": "../../../node_modules/@angular-devkit/schematics/collection-schema.json",
        "schematics": {
          "ng-add": {
            "description": "Add my library to the project.",
            "factory": "./ng-add/index#ngAdd"
          },
          "my-service": {
            "description": "Generate a service in the project.",
            "factory": "./my-service/index#myService",
            "schema": "./my-service/schema.json"
          }
        }
      }
      ```

  - 2. Go to the `<lib-root>/schematics/my-service` folder.

  - 3. Create a `schema.json` file and define the available options for the schematic.

    - projects/my-lib/schematics/my-service/schema.json (Schematic JSON Schema)

      ```
      {
        "$schema": "http://json-schema.org/schema",
        "$id": "SchematicsMyService",
        "title": "My Service Schema",
        "type": "object",
        "properties": {
          "name": {
            "description": "The name of the service.",
            "type": "string"
          },
          "path": {
            "type": "string",
            "format": "path",
            "description": "The path to create the service.",
            "visible": false
          },
          "project": {
            "type": "string",
            "description": "The name of the project.",
            "$default": {
              "$source": "projectName"
            }
          }
        },
        "required": [
          "name"
        ]
      }
      ```

      - id: A unique ID for the schema in the collection.
      - title: A human-readable description of the schema.
      - type: A descriptor for the type provided by the properties.
      - properties: An object that defines the available options for the schematic.

    - Each option associates key with a type, description, and optional alias. The type defines the shape of the value you expect, and the description is displayed when the user requests usage help for your schematic. See the workspace schema for additional customizations for schematic options.

  - 4. Create a `schema.ts` file and define an interface that stores the values of the options defined in the `schema.json` file.

    - projects/my-lib/schematics/my-service/schema.ts (Schematic Interface)

      ```
      export interface Schema {
        // The name of the service.
        name: string;

        // The path to create the service.
        path?: string;

        // The name of the project.
        project?: string;
      }
      ```

    | OPTIONS | DETAILS                                                                                                                                     |
    | ------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
    | name    | The name you want to provide for the created service.                                                                                       |
    | path    | Overrides the path provided to the schematic. The default path value is based on the current working directory.                             |
    | project | Provides a specific project to run the schematic on. In the schematic, you can provide a default if the option is not provided by the user. |

##### Add template files

- To add artifacts to a project, your schematic needs its own template files. Schematic templates support special syntax to execute code and variable substitution.

  - 1. Create a `files/` folder inside the `schematics/my-service/` folder.

  - 2. Create a file named `__name@dasherize__.service.ts.template` that defines a template to use for generating files. This template will generate a service that already has Angular's `HttpClient` injected into its constructor.

    - projects/my-lib/schematics/my-service/files/__name@dasherize__.service.ts.template (Schematic Template)

      ```
      import { Injectable } from '@angular/core';
      import { HttpClient } from '@angular/common/http';

      @Injectable({
        providedIn: 'root'
      })
      export class <%= classify(name) %>Service {
        constructor(private http: HttpClient) { }
      }
      ```

    - The `classify` and `dasherize` methods are utility functions that your schematic uses to transform your source template and filename.

    - The `name` is provided as a property from your factory function. It is the same name you defined in the schema.

##### Add the factory function

- Now that you have the infrastructure in place, you can define the main function that performs the modifications you need in the user's project.

- The Schematics framework provides a file templating system, which supports both path and content templates. The system operates on placeholders defined inside files or paths that loaded in the input `Tree`. It fills these in using values passed into the `Rule`.

- For details of these data structures and syntax, see the [Schematics README](https://github.com/angular/angular-cli/blob/main/packages/angular_devkit/schematics/README.md).

  - 1. Create the main file `index.ts` and add the source code for your schematic factory function.

  - 2. First, import the schematics definitions you will need. The Schematics framework offers many utility functions to create and use rules when running a schematic.

    - projects/my-lib/schematics/my-service/index.ts (Imports)

      ```
      import {
        Rule, Tree, SchematicsException,
        apply, url, applyTemplates, move,
        chain, mergeWith
      } from '@angular-devkit/schematics';

      import { strings, normalize, virtualFs, workspaces } from '@angular-devkit/core';
      ```

  - 3. Import the defined schema interface that provides the type information for your schematic's options.

    - projects/my-lib/schematics/my-service/index.ts (Schema Import)

      ```
      import {
        Rule, Tree, SchematicsException,
        apply, url, applyTemplates, move,
        chain, mergeWith
      } from '@angular-devkit/schematics';

      import { strings, normalize, virtualFs, workspaces } from '@angular-devkit/core';

      import { Schema as MyServiceSchema } from './schema';
      ```

  - 4. To build up the generation schematic, start with an empty rule factory.

    - projects/my-lib/schematics/my-service/index.ts (Initial Rule)

      ```
      export function myService(options: MyServiceSchema): Rule {
        return (tree: Tree) => tree;
      }
      ```

    - This rule factory returns the tree without modification. The options are the option values passed through from the `ng generate` command.

#### Define a generation rule

- You now have the framework in place for creating the code that actually modifies the user's application to set it up for the service defined in your library.

- The Angular workspace where the user installed your library contains multiple projects (applications and libraries). The user can specify the project on the command line, or let it default. In either case, your code needs to identify the specific project to which this schematic is being applied, so that you can retrieve information from the project configuration.

- Do this using the `Tree` object that is passed in to the factory function. The `Tree` methods give you access to the complete file tree in your workspace, letting you read and write files during the execution of the schematic.

##### Get the project configuration

- 1. To determine the destination project, use the `workspaces.readWorkspace` method to read the contents of the workspace configuration file, `angular.json`. To use `workspaces.readWorkspace` you need to create a `workspaces.WorkspaceHost` from the `Tree`. Add the following code to your factory function.

  - projects/my-lib/schematics/my-service/index.ts (Schema Import)

    ```
    import {
      Rule, Tree, SchematicsException,
      apply, url, applyTemplates, move,
      chain, mergeWith
    } from '@angular-devkit/schematics';

    import { strings, normalize, virtualFs, workspaces } from '@angular-devkit/core';

    import { Schema as MyServiceSchema } from './schema';

    function createHost(tree: Tree): workspaces.WorkspaceHost {
      return {
        async readFile(path: string): Promise<string> {
          const data = tree.read(path);
          if (!data) {
            throw new SchematicsException('File not found.');
          }
          return virtualFs.fileBufferToString(data);
        },
        async writeFile(path: string, data: string): Promise<void> {
          return tree.overwrite(path, data);
        },
        async isDirectory(path: string): Promise<boolean> {
          return !tree.exists(path) && tree.getDir(path).subfiles.length > 0;
        },
        async isFile(path: string): Promise<boolean> {
          return tree.exists(path);
        },
      };
    }

    export function myService(options: MyServiceSchema): Rule {
      return async (tree: Tree) => {
        const host = createHost(tree);
        const { workspace } = await workspaces.readWorkspace('/', host);

      };
    }
    ```

  - Be sure to check that the context exists and throw the appropriate error.

- 2. Now that you have the project name, use it to retrieve the project-specific configuration information.

  - projects/my-lib/schematics/my-service/index.ts (Project)

    ```
    const project = (options.project != null) ? workspace.projects.get(options.project) : null;
    if (!project) {
      throw new SchematicsException(`Invalid project name: ${options.project}`);
    }

    const projectType = project.extensions.projectType === 'application' ? 'app' : 'lib';
    ```

  - The `workspace.projects` object contains all the project-specific configuration information.

- 3. The `options.path` determines where the schematic template files are moved to once the schematic is applied.

  - The `path` option in the schematic's schema is substituted by default with the current working directory. If the `path` is not defined, use the `sourceRoot` from the project configuration along with the `projectType`.

    - projects/my-lib/schematics/my-service/index.ts (Project Info)
      ```
      if (options.path === undefined) {
        options.path = `${project.sourceRoot}/${projectType}`;
      }
      ```

##### Define the rule

- A `Rule` can use external template files, transform them, and return another `Rule` object with the transformed template. Use the templating to generate any custom files required for your schematic.

  - 1. Add the following code to your factory function.

    - projects/my-lib/schematics/my-service/index.ts (Template transform)
      ```
      const templateSource = apply(url('./files'), [
        applyTemplates({
          classify: strings.classify,
          dasherize: strings.dasherize,
          name: options.name
        }),
        move(normalize(options.path as string))
      ]);
      ```

    | METHODS          | DETAILS                                                                                                                                                                                                                                          |
    | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
    | apply()          | Applies multiple rules to a source and returns the transformed source. It takes 2 arguments, a source and an array of rules.                                                                                                                     |
    | url()            | Reads source files from your filesystem, relative to the schematic.                                                                                                                                                                              |
    | applyTemplates() | Receives an argument of methods and properties you want make available to the schematic template and the schematic filenames. It returns a `Rule`. This is where you define the `classify()` and `dasherize()` methods, and the `name` property. |
    | classify()       | Takes a value and returns the value in title case. For example, if the provided name is `my service`, it is returned as `MyService`.                                                                                                             |
    | dasherize()      | Takes a value and returns the value in dashed and lowercase. For example, if the provided name is `MyService`, it is returned as `my-service`.                                                                                                   |
    | move()           | Moves the provided source files to their destination when the schematic is applied.                                                                                                                                                              |

  - 2. Finally, the rule factory must return a rule.

    - projects/my-lib/schematics/my-service/index.ts (Chain Rule)

      ```
      return chain([
        mergeWith(templateSource)
      ]);
      ```

    - The `chain()` method lets you combine multiple rules into a single rule, so that you can perform multiple operations in a single schematic. Here you are only merging the template rules with any code executed by the schematic.

- See a complete example of the following schematic rule function.

  - projects/my-lib/schematics/my-service/index.ts

    ```
    import {
      Rule, Tree, SchematicsException,
      apply, url, applyTemplates, move,
      chain, mergeWith
    } from '@angular-devkit/schematics';

    import { strings, normalize, virtualFs, workspaces } from '@angular-devkit/core';

    import { Schema as MyServiceSchema } from './schema';

    function createHost(tree: Tree): workspaces.WorkspaceHost {
      return {
        async readFile(path: string): Promise<string> {
          const data = tree.read(path);
          if (!data) {
            throw new SchematicsException('File not found.');
          }
          return virtualFs.fileBufferToString(data);
        },
        async writeFile(path: string, data: string): Promise<void> {
          return tree.overwrite(path, data);
        },
        async isDirectory(path: string): Promise<boolean> {
          return !tree.exists(path) && tree.getDir(path).subfiles.length > 0;
        },
        async isFile(path: string): Promise<boolean> {
          return tree.exists(path);
        },
      };
    }

    export function myService(options: MyServiceSchema): Rule {
      return async (tree: Tree) => {
        const host = createHost(tree);
        const { workspace } = await workspaces.readWorkspace('/', host);


        const project = (options.project != null) ? workspace.projects.get(options.project) : null;
        if (!project) {
          throw new SchematicsException(`Invalid project name: ${options.project}`);
        }

        const projectType = project.extensions.projectType === 'application' ? 'app' : 'lib';

        if (options.path === undefined) {
          options.path = `${project.sourceRoot}/${projectType}`;
        }

        const templateSource = apply(url('./files'), [
          applyTemplates({
            classify: strings.classify,
            dasherize: strings.dasherize,
            name: options.name
          }),
          move(normalize(options.path as string))
        ]);

        return chain([
          mergeWith(templateSource)
        ]);
      };
    }
    ```

#### Running your library schematic

- After you build your library and schematics, you can install the schematics collection to run against your project. The following steps show you how to generate a service using the schematic you created earlier.

##### Build your library and schematics

- From the root of your workspace, run the ng build command for your library.

  ```
  ng build my-lib
  ```

- Then, you change into your library directory to build the schematic

  ```
  cd projects/my-lib
  npm run build
  ```

##### Link the library

- Your library and schematics are packaged and placed in the dist/my-lib folder at the root of your workspace. For running the schematic, you need to link the library into your `node_modules` folder. From the root of your workspace, run the `npm link` command with the path to your distributable library.

  ```
  npm link dist/my-lib
  ```

##### Run the schematic

- Now that your library is installed, run the schematic using the ng generate command.

  ```
  ng generate my-lib:my-service --name my-data
  ```

- In the console, you see that the schematic was run and the my-data.service.ts file was created in your application folder.
  ```
  CREATE src/app/my-data.service.ts (208 bytes)
  ```
