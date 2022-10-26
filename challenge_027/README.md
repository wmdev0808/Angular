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

## DevTools

## Schematics
