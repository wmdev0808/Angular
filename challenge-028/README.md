# Tutorials

## Setting up NgOptimizedImage

- The `NgOptimizedImage` directive is available for `developer preview`. It's ready for you to try, but it might change before it is stable.

### Import NgOptimizedImage

- You can import `NgOptimizedImage` from the `@angular/common` module. The directive is defined as a `standalone directive`, so components should import it directly.

### Configure an ImageLoader

- A "loader" is a function that generates the [image transformation URL](https://web.dev/image-cdns/#how-image-cdns-use-urls-to-indicate-optimization-options) for a given image file. When appropriate, `NgOptimizedImage` sets the size, format, and image quality transformations for an image.

- `NgOptimizedImage` provides a generic loader as well as loaders for various third-party image services; it also supports writing your own custom loader.

  | LOADER TYPE                            | BEHAVIOR                                                                                                                                                                                                                       |
  | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
  | Generic loader                         | The URL returned by the generic loader will always match the value of `src`. In other words, this loader applies no transformations. Sites that use Angular to serve images are the primary intended use case for this loader. |
  | Loaders for third-party image services | The URL returned by the loaders for third-party image services will follow API conventions used by that particular image service.                                                                                              |
  | Custom loaders                         | A custom loader's behavior is defined by its developer. You should use a custom loader if your image service isn't supported by the loaders that come preconfigured with `NgOptimizedImage`.                                   |

- Based on the image services commonly used with Angular applications, `NgOptimizedImage` provides loaders preconfigured to work with the following image services:

  | IMAGE SERVICE             | ANGULAR API                                                                      | DOCUMENTATION                                                               |
  | ------------------------- | -------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
  | Cloudflare Image Resizing | [provideCloudflareLoader](https://angular.io/api/common/provideCloudflareLoader) | [Documentation](https://developers.cloudflare.com/images/image-resizing/)   |
  | Cloudinary                | [provideCloudinaryLoader](https://angular.io/api/common/provideCloudinaryLoader) | [Documentation](https://cloudinary.com/documentation/resizing_and_cropping) |
  | ImageKit                  | [provideImageKitLoader](https://angular.io/api/common/provideImageKitLoader)     | [Documentation](https://docs.imagekit.io/)                                  |
  | Imgix                     | [provideImgixLoader](https://angular.io/api/common/provideImgixLoader)           | [Documentation](https://docs.imgix.com/)                                    |

- You must configure an image loader to use `NgOptimizedImage`.

- These instructions explain how to set up an image loader for use with the `NgOptimizedImage`.

  - 1. Import the `NgOptimizedImage` directive into the application by adding it to the `imports` section of an `NgModule` or a standalone Component.

    ```
    import { NgOptimizedImage } from '@angular/common';
    // Include NgOptimizedImage in the appropriate NgModule
    @NgModule({
      imports: [
        // ... other imports
        NgOptimizedImage,
      ],
    })

    class AppModule {}
    ```

    ```
    @Component({
      standalone: true,
      imports: [
        // ... other imports
        NgOptimizedImage,
      ],
    })

    class MyStandaloneComponent {}
    ```

  - 2. Configure a loader that you want to use.

    - To use the generic loader: no additional code changes are necessary.

    - To use an existing loader for a **third-party image service**: add the provider factory for your chosen service to the `providers` array. In the example below, the Imgix loader is used:

      ```
      providers: [
        provideImgixLoader('https://my.base.url/'),
      ],
      ```

    - The base URL for your image assets should be passed to the provider factory as an argument. For most sites, this base URL should match one of the following patterns:

      - https://yoursite.yourcdn.com
      - https://subdomain.yoursite.com
      - https://subdomain.yourcdn.com/yoursite

- You can learn more about the base URL structure in the docs of a corresponding CDN provider.

- To use a **custom loader**: provide your loader function as a value for the `IMAGE_LOADER` DI token. In the example below, the custom loader function returns a URL starting with `https://example.com` that includes `src` and `width` as URL parameters.

  ```
  providers: [
    {
      provide: IMAGE_LOADER,
      useValue: (config: ImageLoaderConfig) => {
        return `https://example.com/images?src=${config.src}&width=${config.width}`;
      },
    },
  ],
  ```

- A loader function for the `NgOptimizedImage` directive takes an object with the `ImageLoaderConfig` type (from `@angular/common`) as its argument and returns the absolute URL of the image asset. The `ImageLoaderConfig` object contains the `src` and `width` properties.

- Note: a custom loader must support requesting images at various widths in order for `ngSrcset` to work properly.

## Angular Libraries

### Libraries overview

- Many applications need to solve the same general problems, such as presenting a unified user interface, presenting data, and allowing data entry. Developers can create general solutions for particular domains that can be adapted for re-use in different applications. Such a solution can be built as Angular libraries and these libraries can be published and shared as npm packages.

- An Angular library is an Angular `project` that differs from an application in that it cannot run on its own. A library must be imported and used in an application.

- Libraries extend Angular's base features. For example, to add `reactive forms` to an application, add the library package using `ng add @angular/forms`, then import the `ReactiveFormsModule` from the `@angular/forms` library in your application code. Similarly, adding the `service worker` library to an Angular application is one of the steps for turning an application into a `Progressive Web App (PWA)`. `Angular Material` is an example of a large, general-purpose library that provides sophisticated, reusable, and adaptable UI components.

- Any application developer can use these and other libraries that have been published as npm packages by the Angular team or by third parties. See Using Published Libraries.

#### Creating libraries

- If you have developed features that are suitable for reuse, you can create your own libraries. These libraries can be used locally in your workspace, or you can publish them as `npm packages` to share with other projects or other Angular developers. These packages can be published to the npm registry, a private npm Enterprise registry, or a private package management system that supports npm packages. See `Creating Libraries`.

- Deciding to package features as a library is an architectural decision. It is comparable to deciding whether a feature is a component or a service, or deciding on the scope of a component.

- Packaging features as a library forces the artifacts in the library to be decoupled from the application's business logic. This can help to avoid various bad practices or architecture mistakes that can make it difficult to decouple and reuse code in the future.

- Putting code into a separate library is more complex than simply putting everything in one application. It requires more of an investment in time and thought for managing, maintaining, and updating the library. This complexity can pay off when the library is being used in multiple applications.

- NOTE:
  - Libraries are intended to be used by Angular applications. To add Angular features to non-Angular web applications, use `Angular custom elements`.

### Using published libraries

- When you build your Angular application, take advantage of sophisticated first-party libraries, as well as rich ecosystem of third-party libraries. `Angular Material` is an example of a sophisticated first-party library. For links to the most popular libraries, see [Angular Resources](https://angular.io/resources).

#### Install libraries

- Libraries are published as npm packages, usually together with schematics that integrate them with the Angular CLI. To integrate reusable library code into an application, you need to install the package and import the provided functionality in the location you use it. For most published Angular libraries, use the `ng add <lib_name>` Angular CLI command.

- The ng add Angular CLI command uses a package manager to install the library package and invokes schematics that are included in the package to other scaffolding within the project code. Examples of package managers include `npm` or `yarn`. Additional scaffolding within the project code includes import statements, fonts, and themes.

- A published library typically provides a `README` file or other documentation on how to add that library to your application. For an example, see the `Angular Material` documentation.

##### Library typings

- Typically, library packages include typings in `.d.ts` files; see examples in `node_modules/@angular/material`. If the package of your library does not include typings and your IDE complains, you might need to install the `@types/<lib_name>` package with the library.

  - For example, suppose you have a library named `d3`:
    ```
    npm install d3 --save
    npm install @types/d3 --save-dev
    ```

- Types defined in a `@types/` package for a library installed into the workspace are automatically added to the TypeScript configuration for the project that uses that library. TypeScript looks for types in the `node_modules/@types` directory by default, so you do not have to add each type package individually.

- If a library does not have typings available at `@types/`, you may use it by manually adding typings for it. To do this:

  - 1. Create a `typings.d.ts` file in your `src/` directory. This file is automatically included as global type definition.

  - 2. Add the following code in `src/typings.d.ts`:

    ```
    declare module 'host' {
      export interface Host {
        protocol?: string;
        hostname?: string;
        pathname?: string;
      }
      export function parse(url: string, queryString?: string): Host;
    }
    ```

  - 3. In the component or file that uses the library, add the following code:

    ```
    import * as host from 'host';
    const parsedUrl = host.parse('https://angular.io');
    console.log(parsedUrl.hostname);
    ```

- Define more typings as needed.

#### Updating libraries

- A library is able to be updated by the publisher, and also has individual dependencies which need to be kept current. To check for updates to your installed libraries, use the `ng update` Angular CLI command.

- Use `ng update <lib_name>` Angular CLI command to update individual library versions. The Angular CLI checks the latest published release of the library, and if the latest version is newer than your installed version, downloads it and updates your `package.json` to match the latest version.

- When you update Angular to a new version, you need to make sure that any libraries you are using are current. If libraries have interdependencies, you might have to update them in a particular order. See the [Angular Update Guide](https://update.angular.io/) for help.

#### Adding a library to the runtime global scope

- If a legacy JavaScript library is not imported into an application, you may add it to the runtime global scope and load it as if it was added in a script tag. Configure the Angular CLI to do this at build time using the `scripts` and `styles` options of the build target in the `angular.json` workspace build configuration file.

- For example, to use the Bootstrap 4 library

  - 1. Install the library and the associated dependencies using the npm package manager:

    ```
    npm install jquery --save
    npm install popper.js --save
    npm install bootstrap --save
    ```

  - 2. In the `angular.json` configuration file, add the associated script files to the `scripts` array:

    ```
    "scripts": [
      "node_modules/jquery/dist/jquery.slim.js",
      "node_modules/popper.js/dist/umd/popper.js",
      "node_modules/bootstrap/dist/js/bootstrap.js"
    ],
    ```

  - 3. Add the `bootstrap.css` CSS file to the `styles` array:

    ```
    "styles": [
      "node_modules/bootstrap/dist/css/bootstrap.css",
      "src/styles.css"
    ],
    ```

  - 4. Run or restart the ng serve Angular CLI command to see Bootstrap 4 work in your application.

##### Using runtime-global libraries inside your app

- After you import a library using the "scripts" array, do not import it using an import statement in your TypeScript code. The following code snippet is an example import statement.

  ```
  import * as $ from 'jquery';
  ```

- If you import it using import statements, you have two different copies of the library: one imported as a global library, and one imported as a module. This is especially bad for libraries with plugins, like JQuery, because each copy includes different plugins.

- Instead, run the npm install `@types/jquery` Angular CLI command to download typings for your library and then follow the library installation steps. This gives you access to the global variables exposed by that library.

##### Defining typings for runtime-global libraries

- If the global library you need to use does not have global typings, you can declare them manually as `any` in `src/typings.d.ts`.

  - For example:
    ```
    declare var libraryName: any;
    ```

- Some scripts extend other libraries; for instance with JQuery plugins:

  ```
  $('.test').myPlugin();
  ```

- In this case, the installed `@types/jquery` does not include `myPlugin`, so you need to add an interface in `src/typings.d.ts`. For example:

  ```
  interface JQuery {
    myPlugin(options?: any): any;
  }
  ```

- If you do not add the interface for the script-defined extension, your IDE shows an error:
  ```
  [TS][Error] Property 'myPlugin' does not exist on type 'JQuery'
  ```

### Creating libraries

- This page provides a conceptual overview of how to create and publish new libraries to extend Angular functionality.

- If you find that you need to solve the same problem in more than one application (or want to share your solution with other developers), you have a candidate for a library. A simple example might be a button that sends users to your company website, that would be included in all applications that your company builds.

#### Getting started

- Use the Angular CLI to generate a new library skeleton in a new workspace with the following commands.

  ```
  ng new my-workspace --no-create-application
  cd my-workspace
  ng generate library my-lib
  ```

- NAMING YOUR LIBRARY

  - You should be very careful when choosing the name of your library if you want to publish it later in a public package registry such as npm. See Publishing your library.

  - Avoid using a name that is prefixed with `ng-`, such as `ng-library`. The ng- prefix is a reserved keyword used from the Angular framework and its libraries. The `ngx-` prefix is preferred as a convention used to denote that the library is suitable for use with Angular. It is also an excellent indication to consumers of the registry to differentiate between libraries of different JavaScript frameworks.

- The `ng generate` command creates the `projects/my-lib` folder in your workspace, which contains a component and a service inside an NgModule.

- When you generate a new library, the workspace configuration file, `angular.json`, is updated with a project of type `library`.

  ```
  "projects": {
    …
    "my-lib": {
      "root": "projects/my-lib",
      "sourceRoot": "projects/my-lib/src",
      "projectType": "library",
      "prefix": "lib",
      "architect": {
        "build": {
          "builder": "@angular-devkit/build-angular:ng-packagr",
          …
  ```

- Build, test, and lint the project with CLI commands:

  ```
  ng build my-lib --configuration development
  ng test my-lib
  ng lint my-lib
  ```

- Notice that the configured builder for the project is different from the default builder for application projects. This builder, among other things, ensures that the library is always built with the `AOT compiler`.

- To make library code reusable you must define a public API for it. This "user layer" defines what is available to consumers of your library. A user of your library should be able to access public functionality (such as NgModules, service providers and general utility functions) through a single import path.

- The public API for your library is maintained in the `public-api.ts` file in your library folder. Anything exported from this file is made public when your library is imported into an application. Use an NgModule to expose services and components.

- Your library should supply documentation (typically a README file) for installation and maintenance.

#### Refactoring parts of an application into a library

- To make your solution reusable, you need to adjust it so that it does not depend on application-specific code.

- Here are some things to consider in migrating application functionality to a library.

  - Declarations such as components and pipes should be designed as stateless, meaning they don't rely on or alter external variables. If you do rely on state, you need to evaluate every case and decide whether it is application state or state that the library would manage.

  - Any observables that the components subscribe to internally should be cleaned up and disposed of during the lifecycle of those components

  - Components should expose their interactions through inputs for providing context, and outputs for communicating events to other components

  - Check all internal dependencies.

    - For custom classes or interfaces used in components or service, check whether they depend on additional classes or interfaces that also need to be migrated

    - Similarly, if your library code depends on a service, that service needs to be migrated

    - If your library code or its templates depend on other libraries (such as Angular Material, for instance), you must configure your library with those dependencies

  - Consider how you provide services to client applications.

    - Services should declare their own providers, rather than declaring providers in the NgModule or a component. Declaring a provider makes that service tree-shakable. This practice lets the compiler leave the service out of the bundle if it never gets injected into the application that imports the library. For more about this, see `Tree-shakable providers`.

    - If you register global service providers or share providers across multiple NgModules, use the `forRoot() and forChild() design patterns` provided by the `RouterModule`

    - If your library provides optional services that might not be used by all client applications, support proper tree-shaking for that case by using the `lightweight token design pattern`

#### Integrating with the CLI using code-generation schematics

- A library typically includes reusable code that defines components, services, and other Angular artifacts (pipes, directives) that you import into a project. A library is packaged into an npm package for publishing and sharing. This package can also include `schematics` that provide instructions for generating or transforming code directly in your project, in the same way that the CLI creates a generic new component with ng generate component. A schematic that is packaged with a library can, for example, provide the Angular CLI with the information it needs to generate a component that configures and uses a particular feature, or set of features, defined in that library. One example of this is `Angular Material's navigation schematic` which configures the CDK's `BreakpointObserver` and uses it with Material's `MatSideNav` and `MatToolbar` components.

- Create and include the following kinds of schematics:

  - Include an installation schematic so that `ng add` can add your library to a project

  - Include generation schematics in your library so that `ng generate` can scaffold your defined artifacts (components, services, tests) in a project

  - Include an update schematic so that `ng update` can update your library's dependencies and provide migrations for breaking changes in new releases

- What you include in your library depends on your task. For example, you could define a schematic to create a dropdown that is pre-populated with canned data to show how to add it to an application. If you want a dropdown that would contain different passed-in values each time, your library could define a schematic to create it with a given configuration. Developers could then use `ng generate` to configure an instance for their own application.

- Suppose you want to read a configuration file and then generate a form based on that configuration. If that form needs additional customization by the developer who is using your library, it might work best as a schematic. However, if the form will always be the same and not need much customization by developers, then you could create a dynamic component that takes the configuration and generates the form. In general, the more complex the customization, the more useful the schematic approach.

#### Publishing your library

- Use the Angular CLI and the npm package manager to build and publish your library as an npm package.

- Angular CLI uses a tool called [ng-packagr](https://github.com/ng-packagr/ng-packagr/blob/master/README.md) to create packages from your compiled code that can be published to npm. See `Building libraries with Ivy` for information on the distribution formats supported by ng-packagr and guidance on how to choose the right format for your library.

- You should always build libraries for distribution using the production configuration. This ensures that generated output uses the appropriate optimizations and the correct package format for npm.

  ```
  ng build my-lib
  cd dist/my-lib
  npm publish
  ```

#### Managing assets in a library

- In your Angular library, the distributable can include additional assets like theming files, Sass mixins, or documentation (like a changelog). For more information [copy assets into your library as part of the build](https://github.com/ng-packagr/ng-packagr/blob/master/docs/copy-assets.md) and [embed assets in component styles](https://github.com/ng-packagr/ng-packagr/blob/master/docs/embed-assets-css.md).

- When including additional assets like Sass mixins or pre-compiled CSS. You need to add these manually to the conditional "exports" in the `package.json` of the primary entrypoint.

- `ng-packagr` will merge handwritten "exports" with the auto-generated ones, allowing for library authors to configure additional export subpaths, or custom conditions.

  ```
  "exports": {
    ".": {
      "sass": "./_index.scss",
    },
    "./theming": {
      "sass": "./_theming.scss"
    },
    "./prebuilt-themes/indigo-pink.css": {
      "style": "./prebuilt-themes/indigo-pink.css"
    }
  }
  ```

#### Peer dependencies

- Angular libraries should list any `@angular/*` dependencies the library depends on as peer dependencies. This ensures that when modules ask for Angular, they all get the exact same module. If a library lists `@angular/core` in `dependencies` instead of `peerDependencies`, it might get a different Angular module instead, which would cause your application to break.

#### Using your own library in applications

- You don't have to publish your library to the npm package manager to use it in the same workspace, but you do have to build it first.

- To use your own library in an application:

  - Build the library. You cannot use a library before it is built.

    ```
    ng build my-lib
    ```

  - In your applications, import from the library by name:
    ```
    import { myExport } from 'my-lib';
    ```

##### Building and rebuilding your library

- The build step is important if you haven't published your library as an npm package and then installed the package back into your application from npm. For instance, if you clone your git repository and run `npm install`, your editor shows the `my-lib` imports as missing if you haven't yet built your library.

  - When you import something from a library in an Angular application, Angular looks for a mapping between the library name and a location on disk. When you install a library package, the mapping is in the `node_modules` folder. When you build your own library, it has to find the mapping in your `tsconfig` paths.

  - Generating a library with the Angular CLI automatically adds its path to the `tsconfig` file. The Angular CLI uses the tsconfig paths to tell the build system where to find the library.

  - For more information, see [Path mapping overview](https://www.typescriptlang.org/docs/handbook/module-resolution.html#path-mapping).

- If you find that changes to your library are not reflected in your application, your application is probably using an old build of the library.

- You can rebuild your library whenever you make changes to it, but this extra step takes time. Incremental builds functionality improves the library-development experience. Every time a file is changed a partial build is performed that emits the amended files.

- Incremental builds can be run as a background process in your development environment. To take advantage of this feature add the `--watch` flag to the build command:

  ```
  ng build my-lib --watch
  ```

- The CLI build command uses a different builder and invokes a different build tool for libraries than it does for applications.

  - The build system for applications, `@angular-devkit/build-angular`, is based on `webpack`, and is included in all new Angular CLI projects

  - The build system for libraries is based on `ng-packagr`. It is only added to your dependencies when you add a library using `ng generate library my-lib`.

- The two build systems support different things, and even where they support the same things, they do those things differently. This means that the TypeScript source can result in different JavaScript code in a built library than it would in a built application.

- For this reason, an application that depends on a library should only use TypeScript path mappings that point to the built library. TypeScript path mappings should not point to the library source `.ts` files.

#### Publishing libraries

- There are two distribution formats to use when publishing a library:

  | DISTRIBUTION FORMATS      | DETAILS                                                                                                                                                                                                                                                                                                                                |
  | ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
  | Partial-Ivy (recommended) | Contains portable code that can be consumed by Ivy applications built with any version of Angular from v12 onwards.                                                                                                                                                                                                                    |
  | Full-Ivy                  | Contains private Angular Ivy instructions, which are not guaranteed to work across different versions of Angular. This format requires that the library and application are built with the exact same version of Angular. This format is useful for environments where all library and application code is built directly from source. |

- For publishing to npm use the partial-Ivy format as it is stable between patch versions of Angular.

- Avoid compiling libraries with full-Ivy code if you are publishing to npm because the generated Ivy instructions are not part of Angular's public API, and so might change between patch versions.

#### Ensuring library version compatibility

- The Angular version used to build an application should always be the same or greater than the Angular versions used to build any of its dependent libraries. For example, if you had a library using Angular version 13, the application that depends on that library should use Angular version 13 or later. Angular does not support using an earlier version for the application.

- If you intend to publish your library to npm, compile with partial-Ivy code by setting `"compilationMode": "partial"` in `tsconfig.prod.json`. This partial format is stable between different versions of Angular, so is safe to publish to npm. Code with this format is processed during the application build using the same version of the Angular compiler, ensuring that the application and all of its libraries use a single version of Angular.

- Avoid compiling libraries with full-Ivy code if you are publishing to npm because the generated Ivy instructions are not part of Angular's public API, and so might change between patch versions.

- If you've never published a package in npm before, you must create a user account. Read more in [Publishing npm Packages](https://docs.npmjs.com/getting-started/publishing-npm-packages).

#### Consuming partial-Ivy code outside the Angular CLI

- An application installs many Angular libraries from npm into its `node_modules` directory. However, the code in these libraries cannot be bundled directly along with the built application as it is not fully compiled. To finish compilation, use the Angular linker.

- For applications that don't use the Angular CLI, the linker is available as a Babel plugin. The plugin is to be imported from `@angular/compiler-cli/linker/babel`.

- The Angular linker Babel plugin supports build caching, meaning that libraries only need to be processed by the linker a single time, regardless of other npm operations.

- Example of integrating the plugin into a custom `Webpack` build by registering the linker as a `Babel` plugin using `babel-loader`.

  - webpack.config.mjs

    ```
    import linkerPlugin from '@angular/compiler-cli/linker/babel';

    export default {
      // ...
      module: {
        rules: [
          {
            test: /\.m?js$/,
            use: {
              loader: 'babel-loader',
              options: {
                plugins: [linkerPlugin],
                compact: false,
                cacheDirectory: true,
              }
            }
          }
        ]
      }
      // ...
    }
    ```

- The Angular CLI integrates the linker plugin automatically, so if consumers of your library are using the CLI, they can install Ivy-native libraries from npm without any additional configuration.

### Angular package format

- This document describes the Angular Package Format (APF). APF is an Angular specific specification for the structure and format of npm packages that is used by all first-party Angular packages (`@angular/core`, `@angular/material`, etc.) and most third-party Angular libraries.

- APF enables a package to work seamlessly under most common scenarios that use Angular. Packages that use APF are compatible with the tooling offered by the Angular team as well as wider JavaScript ecosystem. It is recommended that third-party library developers follow the same npm package format.

#### Why specify a package format?

- In today's JavaScript landscape, developers consume packages in many different ways, using many different toolchains (Webpack, rollup, esbuild, etc.). These tools may understand and require different inputs - some tools may be able to process the latest ES language version, while others may benefit from directly consuming an older ES version.

- The Angular distribution format supports all of the commonly used development tools and workflows, and adds emphasis on optimizations that result either in smaller application payload size or faster development iteration cycle (build time).

- Developers can rely on Angular CLI and `ng-packagr` (a build tool Angular CLI uses) to produce packages in the Angular package format. See the Creating Libraries guide for more details.

#### File layout

- The following example shows a simplified version of the `@angular/core` package's file layout, with an explanation for each file in the package.

  - node_modules/@angular/core
    - README.md
    - package.json
    - index.d.ts
    - esm2020
      - core.mjs
      - index.mjs
      - public_api.mjs
      - testing
    - fesm2015
      - core.mjs
      - core.mjs.map
      - testing.mjs
      - testing.mjs.map
    - fesm2020
      - core.mjs
      - core.mjs.map
      - testing.mjs
      - testing.mjs.map
    - testing
      - index.d.ts

- This table describes the file layout under `node_modules/@angular/core` annotated to describe the purpose of files and directories:

- FILES | PURPOSE

  - README.md

    - Package README, used by npmjs web UI.

  - package.json

    - Primary `package.json`, describing the package itself as well as all available entrypoints and code formats. This file contains the "exports" mapping used by runtimes and tools to perform module resolution.

  - index.d.ts

    - Bundled `.d.ts` for the primary entrypoint `@angular/core`.

  - esm2020/
    ─ core.mjs
    ─ index.mjs
    ─ public_api.mjs

    - Tree of `@angular/core` sources in unflattened ES2020 format.

  - esm2020/testing/

    - Tree of the `@angular/core/testing` entrypoint in unflattened ES2020 format.

  - fesm2015/
    ─ core.mjs
    ─ core.mjs.map
    ─ testing.mjs
    ─ testing.mjs.map

    - Code for all entrypoints in a flattened (FESM) ES2015 format, along with source maps.

  - fesm2020/
    ─ core.mjs
    ─ core.mjs.map
    ─ testing.mjs
    ─ testing.mjs.map

    - Code for all entrypoints in flattened (FESM) ES2020 format, along with source maps.

  - testing/

    - Directory representing the "testing" entrypoint.

  - testing/index.d.ts
    - Bundled .d.ts for the @angular/core/testing entrypoint.

#### package.json

- The primary `package.json` contains important package metadata, including the following:

  - It `declares` the package to be in EcmaScript Module (ESM) format

  - It contains an `"exports" field` which defines the available source code formats of all entrypoints

  - It contains `keys` which define the available source code formats of the primary `@angular/core` entrypoint, for tools which do not understand `"exports"`. These keys are considered deprecated, and could be removed as the support for `"exports"` rolls out across the ecosystem.

  - It declares whether the package contains `side effects`

##### ESM declaration

- The top-level `package.json` contains the key:

  ```
  {
    "type": "module"
  }
  ```

- This informs resolvers that code within the package is using EcmaScript Modules as opposed to CommonJS modules.

##### "exports"

- The "exports" field has the following structure:

  ```
  "exports": {
    "./schematics/*": {
      "default": "./schematics/*.js"
    },
    "./package.json": {
      "default": "./package.json"
    },
    ".": {
      "types": "./core.d.ts",
      "esm2020": "./esm2020/core.mjs",
      "es2020": "./fesm2020/core.mjs",
      "es2015": "./fesm2015/core.mjs",
      "node": "./fesm2015/core.mjs",
      "default": "./fesm2020/core.mjs"
    },
    "./testing": {
      "types": "./testing/testing.d.ts",
      "esm2020": "./esm2020/testing/testing.mjs",
      "es2020": "./fesm2020/testing.mjs",
      "es2015": "./fesm2015/testing.mjs",
      "node": "./fesm2015/testing.mjs",
      "default": "./fesm2020/testing.mjs"
    }
  }
  ```

- Of primary interest are the `"."` and the `"./testing"` keys, which define the available code formats for the `@angular/core` primary entrypoint and the `@angular/core/testing` secondary entrypoint, respectively. For each entrypoint, the available formats are:

  | FORMATS                 | DETAILS                                                                                                                              |
  | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
  | Typings (`.d.ts` files) | `.d.ts` files are used by TypeScript when depending on a given package.                                                              |
  | es2020                  | ES2020 code flattened into a single source file.                                                                                     |
  | es2015                  | ES2015 code flattened into a single source file.                                                                                     |
  | esm2020                 | ES2020 code in unflattened source files (this format is included for experimentation - see this discussion of defaults for details). |

- Tooling that is aware of these keys may preferentially select a desirable code format from `"exports"`. The remaining 2 keys control the default behavior of tooling:

  - `"node"` selects flattened ES2015 code when the package is loaded in Node.

    - This format is used due to the requirements of `zone.js`, which does not support native `async/await` ES2017 syntax. Therefore, Node is instructed to use ES2015 code, where `async/await` structures have been downleveled into Promises.

  - `"default"` selects flattened ES2020 code for all other consumers.

- Libraries may want to expose additional static files which are not captured by the exports of the JavaScript-based entry-points such as Sass mixins or pre-compiled CSS.

##### Legacy resolution keys

- In addition to `"exports"`, the `top-level` package.json also defines legacy module resolution keys for resolvers that don't support `"exports"`. For `@angular/core` these are:

  ```
  {
    "fesm2020": "./fesm2020/core.mjs",
    "fesm2015": "./fesm2015/core.mjs",
    "esm2020": "./esm2020/core.mjs",
    "typings": "./core.d.ts",
    "module": "./fesm2015/core.mjs",
    "es2020": "./fesm2020/core.mjs",
  }
  ```

- As shown in the preceding code snippet, a module resolver can use these keys to load a specific code format.

- NOTE:
  - Instead of "default", "module" selects the format both for Node as well as any tooling not configured to use a specific key. As with "node", ES2015 code is selected due to the constraints of ZoneJS.

##### Side effects

- The last function of package.json is to declare whether the package has side effects.

  ```
  {
    "sideEffects": false
  }
  ```

- Most Angular packages should not depend on top-level side effects, and thus should include this declaration.

#### Endpoints and code splitting

- Packages in the Angular Package Format contain one primary entrypoint and zero or more secondary entrypoints (for example, `@angular/common/http`). Entrypoints serve several functions.

  - 1. They define the module specifiers from which users import code (for example, `@angular/core` and `@angular/core/testing`).

    - Users typically perceive these entrypoints as distinct groups of symbols, with different purposes or capability.

    - Specific entrypoints might only be used for special purposes, such as testing. Such APIs can be separated out from the primary entrypoint to reduce the chance of them being used accidentally or incorrectly.

  - 2. They define the granularity at which code can be lazily loaded.

    - Many modern build tools are only capable of "code splitting" (aka lazy loading) at the ES Module level. The Angular Package Format uses primarily a single "flat" ES Module per entry point. This means that most build tooling is not able to split code with a single entry point into multiple output chunks.

- The general rule for APF packages is to use entrypoints for the smallest sets of logically connected code possible. For example, the Angular Material package publishes each logical component or set of components as a separate entrypoint - one for Button, one for Tabs, etc. This allows each Material component to be lazily loaded separately, if desired.

- Not all libraries require such granularity. Most libraries with a single logical purpose should be published as a single entrypoint. `@angular/core` for example uses a single entrypoint for the runtime, because the Angular runtime is generally used as a single entity.

##### Resolution of secondary entry points

- Secondary entrypoints can be resolved via the "exports" field of the `package.json` for the package.

#### README.md

- The README file in the Markdown format that is used to display description of a package on npm and GitHub.

- Example README content of `@angular/core` package:

  ```
  Angular
  =======

  The sources for this package are in the main [Angular](https://github.com/angular/angular) repo.Please file issues and pull requests against that repo.

  License: MIT
  ```

#### Partial compilation

- Libraries in the Angular Package Format must be published in "partial compilation" mode. This is a compilation mode for ngc which produces compiled Angular code that is not tied to a specific Angular runtime version, in contrast to the full compilation used for applications, where the Angular compiler and runtime versions must match exactly.

- To partially compile Angular code, use the compilationMode flag in the `angularCompilerOptions` property of your `tsconfig.json`:

  ```
  {
    …
    "angularCompilerOptions": {
      "compilationMode": "partial",
    }
  }
  ```

- Partially compiled library code is then converted to fully compiled code during the application build process by the Angular CLI.

- If your build pipeline does not use the Angular CLI then refer to the Consuming partial ivy code outside the Angular CLI guide.

#### Optimizations

##### Flattening of ES modules

- The Angular Package Format specifies that code be published in "flattened" ES module format. This significantly reduces the build time of Angular applications as well as download and parse time of the final application bundle. Please check out the excellent post "The cost of small modules" by Nolan Lawson.

- The Angular compiler can generate index ES module files. Tools like Rollup can use these files to generate flattened modules in a Flattened ES Module (FESM) file format.

- FESM is a file format created by flattening all ES Modules accessible from an entrypoint into a single ES Module. It's formed by following all imports from a package and copying that code into a single file while preserving all public ES exports and removing all private imports.

- The abbreviated name, FESM, pronounced phe-som, can be followed by a number such as FESM5 or FESM2015. The number refers to the language level of the JavaScript inside the module. Accordingly a FESM5 file would be ESM+ES5 and include import/export statements and ES5 source code.

- To generate a flattened ES Module index file, use the following configuration options in your tsconfig.json file:

  ```
  {
    "compilerOptions": {
      …
      "module": "esnext",
      "target": "es2020",
      …
    },
    "angularCompilerOptions": {
      …
      "flatModuleOutFile": "my-ui-lib.js",
      "flatModuleId": "my-ui-lib"
    }
  }
  ```

- Once the index file (for example, my-ui-lib.js) is generated by ngc, bundlers and optimizers like Rollup can be used to produce the flattened ESM file.

- **Note about the defaults in package.json**

  - As of webpack v4, the flattening of ES modules optimization should not be necessary for webpack users. It should be possible to get better code-splitting without flattening of modules in webpack. In practice, size regressions can still be seen when using unflattened modules as input for webpack v4. This is why module and es2020 package.json entries still point to FESM files. This issue is being investigated. It is expected to switch the module and es2020 package.json entry points to unflattened files after the size regression issue is resolved. The APF currently includes unflattened ESM2020 code for the purpose of validating such a future change.

##### "sideEffects" flag

- By default, EcmaScript Modules are side-effectful: importing from a module ensures that any code at the top level of that module should run. This is often undesirable, as most side-effectful code in typical modules is not truly side-effectful, but instead only affects specific symbols. If those symbols are not imported and used, it's often desirable to remove them in an optimization process known as tree-shaking, and the side-effectful code can prevent this.

- Build tools such as Webpack support a flag which allows packages to declare that they do not depend on side-effectful code at the top level of their modules, giving the tools more freedom to tree-shake code from the package. The end result of these optimizations should be smaller bundle size and better code distribution in bundle chunks after code-splitting. This optimization can break your code if it contains non-local side-effects - this is however not common in Angular applications and it's usually a sign of bad design. The recommendation is for all packages to claim the side-effect free status by setting the sideEffects property to false, and that developers follow the Angular Style Guide which naturally results in code without non-local side-effects.

##### ES2020 language level

- ES2020 Language level is now the default language level that is consumed by Angular CLI and other tooling. The Angular CLI down-levels the bundle to a language level that is supported by all targeted browsers at application build time.

##### d.ts bundling / type definition flattening

- As of APF v8 it is now preferred to run API Extractor, to bundle TypeScript definitions so that the entire API appears in a single file.

- In prior APF versions each entry point would have a src directory next to the .d.ts entry point and this directory contained individual d.ts files matching the structure of the original source code. While this distribution format is still allowed and supported, it is highly discouraged because it confuses tools like IDEs that then offer incorrect autocompletion, and allows users to depend on deep-import paths which are typically not considered to be public API of a library or a package.

##### Tslib

- As of APF v10, it is recommended to add tslib as a direct dependency of your primary entry-point. This is because the tslib version is tied to the TypeScript version used to compile your library.

#### Examples

- [@angular/core package](https://unpkg.com/browse/@angular/core@13.0.0-rc.0)
- [@angular/material package](https://unpkg.com/browse/@angular/material@13.0.0-rc.0)

#### Definition of terms

- The following terms are used throughout this document intentionally. In this section are the definitions of all of them to provide additional clarity.

##### Package

- The smallest set of files that are published to NPM and installed together, for example @angular/core. This package includes a manifest called package.json, compiled source code, typescript definition files, source maps, metadata, etc. The package is installed with npm install @angular/core.

##### Symbol

- A class, function, constant, or variable contained in a module and optionally made visible to the external world via a module export.

##### Module

- Short for ECMAScript Modules. A file containing statements that import and export symbols. This is identical to the definition of modules in the ECMAScript spec.

##### ESM

- Short for ECMAScript Modules (see above).

##### FESM

- Short for Flattened ES Modules and consists of a file format created by flattening all ES Modules accessible from an entry point into a single ES Module.

##### Module ID

- The identifier of a module used in the import statements (for example, @angular/core). The ID often maps directly to a path on the filesystem, but this is not always the case due to various module resolution strategies.

##### Module specifier

- A module identifier (see above).

##### Module resolution strategy

- Algorithm used to convert Module IDs to paths on the filesystem. Node.js has one that is well specified and widely used, TypeScript supports several module resolution strategies, Closure Compiler has yet another strategy.

##### Module format

- Specification of the module syntax that covers at minimum the syntax for the importing and exporting from a file. Common module formats are CommonJS (CJS, typically used for Node.js applications) or ECMAScript Modules (ESM). The module format indicates only the packaging of the individual modules, but not the JavaScript language features used to make up the module content. Because of this, the Angular team often uses the language level specifier as a suffix to the module format, (for example, ESM+ES2015 specifies that the module is in ESM format and contains code down-leveled to ES2015).

##### Bundle

- An artifact in the form of a single JS file, produced by a build tool (for example, Webpack or Rollup) that contains symbols originating in one or more modules. Bundles are a browser-specific workaround that reduce network strain that would be caused if browsers were to start downloading hundreds if not tens of thousands of files. Node.js typically doesn't use bundles. Common bundle formats are UMD and System.register.

##### Language level

- The language of the code (ES2015 or ES2020). Independent of the module format.

##### Entry point

- A module intended to be imported by the user. It is referenced by a unique module ID and exports the public API referenced by that module ID. An example is @angular/core or @angular/core/testing. Both entry points exist in the @angular/core package, but they export different symbols. A package can have many entry points.

##### Deep import

- A process of retrieving symbols from modules that are not Entry Points. These module IDs are usually considered to be private APIs that can change over the lifetime of the project or while the bundle for the given package is being created.

##### Top-Level import

- An import coming from an entry point. The available top-level imports are what define the public API and are exposed in "@angular/name" modules, such as @angular/core or @angular/common.

##### Tree-shaking

- The process of identifying and removing code not used by an application - also known as dead code elimination. This is a global optimization performed at the application level using tools like Rollup, Closure Compiler, or Terser.

##### AOT compiler

- The Ahead of Time Compiler for Angular.

##### Flattened type definitions

- The bundled TypeScript definitions generated from [API Extractor](https://api-extractor.com/).
