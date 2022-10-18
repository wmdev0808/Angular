# Service Workers & PWA

## Introduction

- Adding a service worker to an Angular application is one of the steps for turning an application into a [Progressive Web App](https://web.dev/progressive-web-apps/) (also known as a PWA).

- At its simplest, a service worker is a script that runs in the web browser and manages caching for an application.

- Service workers function as a network proxy. They intercept all outgoing HTTP requests made by the application and can choose how to respond to them. For example, they can query a local cache and deliver a cached response if one is available. Proxying isn't limited to requests made through programmatic APIs, such as fetch; it also includes resources referenced in HTML and even the initial request to index.html. Service worker-based caching is thus completely programmable and doesn't rely on server-specified caching headers.

- Unlike the other scripts that make up an application, such as the Angular application bundle, the service worker is preserved after the user closes the tab. The next time that browser loads the application, the service worker loads first, and can intercept every request for resources to load the application. If the service worker is designed to do so, it can completely satisfy the loading of the application, without the need for the network.

- Even across a fast reliable network, round-trip delays can introduce significant latency when loading the application. Using a service worker to reduce dependency on the network can significantly improve the user experience.

### Service workers in Angular

- Starting with version 5.0.0, Angular ships with a service worker implementation. Angular developers can take advantage of this service worker and benefit from the increased reliability and performance it provides, without needing to code against low-level APIs.

- Angular's service worker is designed to optimize the end user experience of using an application over a slow or unreliable network connection, while also minimizing the risks of serving outdated content.

- To achieve this, the Angular service worker follows these guidelines:

  - Caching an application is like installing a native application. The application is cached as one unit, and all files update together.

  - A running application continues to run with the same version of all files. It does not suddenly start receiving cached files from a newer version, which are likely incompatible.

  - When users refresh the application, they see the latest fully cached version. New tabs load the latest cached code.

  - Updates happen in the background, relatively quickly after changes are published. The previous version of the application is served until an update is installed and ready.

  - The service worker conserves bandwidth when possible. Resources are only downloaded if they've changed.

- To support these behaviors, the Angular service worker loads a manifest file from the server. The file, called `ngsw.json` (not to be confused with the [web app manifest](https://developer.mozilla.org/docs/Web/Manifest)), describes the resources to cache and includes hashes of every file's contents. When an update to the application is deployed, the contents of the manifest change, informing the service worker that a new version of the application should be downloaded and cached. This manifest is generated from a CLI-generated configuration file called `ngsw-config.json`.

- Installing the Angular service worker is as straightforward as including an `NgModule`. In addition to registering the Angular service worker with the browser, this also makes a few services available for injection which interact with the service worker and can be used to control it. For example, an application can ask to be notified when a new update becomes available, or an application can ask the service worker to check the server for available updates.

### Prerequisites

- To make use of all the features of Angular service workers, use the latest versions of Angular and the Angular CLI.

- For service workers to be registered, the application must be accessed over HTTPS, not HTTP. Browsers ignore service workers on pages that are served over an insecure connection. The reason is that service workers are quite powerful, so extra care is needed to ensure the service worker script has not been tampered with.

- There is one exception to this rule: to make local development more straightforward, browsers do not require a secure connection when accessing an application on localhost.

#### Browser support

- To benefit from the Angular service worker, your application must run in a web browser that supports service workers in general. Currently, service workers are supported in the latest versions of Chrome, Firefox, Edge, Safari, Opera, UC Browser (Android version) and Samsung Internet. Browsers like IE and Opera Mini do not support service workers.

- If the user is accessing your application with a browser that does not support service workers, the service worker is not registered and related behavior such as offline cache management and push notifications does not happen. More specifically:

  - The browser does not download the service worker script and the `ngsw.json` manifest file

  - Active attempts to interact with the service worker, such as calling `SwUpdate.checkForUpdate()`, return rejected promises

  - The observable events of related services, such as `SwUpdate.available`, are not triggered

- It is highly recommended that you ensure that your application works even without service worker support in the browser. Although an unsupported browser ignores service worker caching, it still reports errors if the application attempts to interact with the service worker. For example, calling `SwUpdate.checkForUpdate()` returns rejected promises. To avoid such an error, check whether the Angular service worker is enabled using `SwUpdate.isEnabled`.

## Getting started

### Adding a service worker to your project

- CLI command

  ```
  ng add @angular/pwa --project <project-name>
  ```

  - The preceding command completes the following actions:

    1. Adds the `@angular/service-worker` package to your project.

    2. Enables service worker build support in the CLI.

    3. Imports and registers the service worker in the application module.

    4. Updates the `index.html` file:

    - Includes a link to add the `manifest.webmanifest` file
    - Adds a meta tag for `theme-color`

    5. Installs icon files to support the installed Progressive Web App (PWA).

    6. Creates the service worker configuration file called `ngsw-config.json`, which specifies the caching behaviors and other settings.

  - Now, build the project:

    ```
    ng build
    ```

    - The CLI project is now set up to use the Angular service worker.

### Service worker in action: a tour

#### Serving with http-server

- Because ng serve does not work with service workers, you must use a separate HTTP server to test your project locally. Use any HTTP server. The following example uses the [http-server](https://www.npmjs.com/package/http-server) package from npm. To reduce the possibility of conflicts and avoid serving stale content, test on a dedicated port and disable caching.

- To serve the directory containing your web files with `http-server`, run the following command:

  ```
  http-server -p 8080 -c-1 dist/<project-name>
  ```

#### Initial load

- With the server running, point your browser at `http://localhost:8080`. Your application should load normally.

- TIP:

  - When testing Angular service workers, it's a good idea to use an incognito or private window in your browser to ensure the service worker doesn't end up reading from a previous leftover state, which can cause unexpected behavior.

- NOTE:
  - If you are not using HTTPS, the service worker will only be registered when accessing the application on `localhost`.

#### Simulating a network issue

- To simulate a network issue, disable network interaction for your application.

- In Chrome:

  1. Select Tools > Developer Tools (from the Chrome menu located in the top right corner).

  2. Go to the Network tab.

  3. Select Offline in the Throttling dropdown menu.

- Now the application has no access to network interaction.

- For applications that do not use the Angular service worker, refreshing now would display Chrome's Internet disconnected page that says "There is no Internet connection".

- With the addition of an Angular service worker, the application behavior changes. On a refresh, the page loads normally.

- Look at the Network tab to verify that the service worker is active.

  - NOTE:
    - Under the "Size" column, the requests state is (ServiceWorker). This means that the resources are not being loaded from the network. Instead, they are being loaded from the service worker's cache.

#### What's being cached?

- Notice that all of the files the browser needs to render this application are cached. The ngsw-config.json boilerplate configuration is set up to cache the specific resources used by the CLI:

  - index.html
  - favicon.ico
  - Build artifacts (JS and CSS bundles)
  - Anything under assets
  - Images and fonts directly under the configured outputPath (by default `./dist/<project-name>/`) or resourcesOutputPath. See ng build for more information about these options.

- Pay attention to two key points:

  - The generated `ngsw-config.json` includes a limited list of cacheable fonts and images extensions. In some cases, you might want to modify the glob pattern to suit your needs.

  - If `resourcesOutputPath` or `assets` paths are modified after the generation of configuration file, you need to change the paths manually in `ngsw-config.json`.

#### Making changes to your application

- Now that you've seen how service workers cache your application, the next step is understanding how updates work. Make a change to the application, and watch the service worker install the update:

  1. If you're testing in an incognito window, open a second blank tab. This keeps the incognito and the cache state alive during your test.

  2. Close the application tab, but not the window. This should also close the Developer Tools.

  3. Shut down `http-server`.

  4. Open `src/app/app.component.html` for editing.

  5. Change the text `Welcome to {{title}}!` to `Bienvenue à {{title}}!`.

  6. Build and run the server again:

  ```
  ng build
  http-server -p 8080 -c-1 dist/<project-name>
  ```

#### Updating your application in the browser

- Now look at how the browser and service worker handle the updated application.

  1. Open `http://localhost:8080` again in the same window. What happens?

  - What went wrong? Nothing, actually. The Angular service worker is doing its job and serving the version of the application that it has installed, even though there is an update available. In the interest of speed, the service worker doesn't wait to check for updates before it serves the application that it has cached.

  - Look at the http-server logs to see the service worker requesting /ngsw.json. This is how the service worker checks for updates.

  2. Refresh the page.

  - The service worker installed the updated version of your application in the background, and the next time the page is loaded or reloaded, the service worker switches to the latest version.

## App shell

- Application shell is a way to render a portion of your application using a route at build time. It can improve the user experience by quickly launching a static rendered page (a skeleton common to all pages) while the browser downloads the full client version and switches to it automatically after the code loads.

- This gives users a meaningful first paint of your application that appears quickly because the browser can render the HTML and CSS without the need to initialize any JavaScript.

- Learn more in [The App Shell Model](https://developers.google.com/web/fundamentals/architecture/app-shell)

### Step 1: Prepare the application

- Do this with the following Angular CLI command:

  ```
  ng new my-app --routing
  ```

  - For an existing application, you have to manually add the `RouterModule` and defining a `<router-outlet>` within your application.

### Step 2: Create the application shell

- Use the Angular CLI to automatically create the application shell.

  ```
  ng generate app-shell
  ```

- After running this command you can see that the angular.json configuration file has been updated to add two new targets, with a few other changes.
  ```
  "server": {
    "builder": "@angular-devkit/build-angular:server",
    "defaultConfiguration": "production",
    "options": {
      "outputPath": "dist/my-app/server",
      "main": "src/main.server.ts",
      "tsConfig": "tsconfig.server.json"
    },
    "configurations": {
      "development": {
        "outputHashing": "none",
      },
      "production": {
        "outputHashing": "media",
        "fileReplacements": [
          {
            "replace": "src/environments/environment.ts",
            "with": "src/environments/environment.prod.ts"
          }
        ],
        "sourceMap": false,
        "optimization": true
      }
    }
  },
  "app-shell": {
    "builder": "@angular-devkit/build-angular:app-shell",
    "defaultConfiguration": "production",
    "options": {
      "route": "shell"
    },
    "configurations": {
      "development": {
        "browserTarget": "my-app:build:development",
        "serverTarget": "my-app:server:development",
      },
      "production": {
        "browserTarget": "my-app:build:production",
        "serverTarget": "my-app:server:production"
      }
    }
  }
  ```

### Step 3: Verify the application is built with the shell content

- Use the Angular CLI to build the `app-shell` target.

  ```
  ng run my-app:app-shell:development
  ```

- Or to use the production configuration.

  ```
  ng run my-app:app-shell:production
  ```

- To verify the build output, open `dist/my-app/browser/index.html`. Look for default text app-shell works! to show that the application shell route was rendered as part of the output.

## Service worker communication

- Importing `ServiceWorkerModule` into your `AppModule` doesn't just register the service worker, it also provides a few services you can use to interact with the service worker and control the caching of your application.

### SwUpdate service

- The `SwUpdate` service gives you access to events that indicate when the service worker discovers and installs an available update for your application.

- The SwUpdate service supports three separate operations:

  - Get notified when an updated version is detected on the server, installed and ready to be used locally or when an installation fails
  - Ask the service worker to check the server for new updates
  - Ask the service worker to activate the latest version of the application for the current tab

#### Version updates

- The `versionUpdates` is an Observable property of `SwUpdate` and emits four event types:

  | EVENT TYPES                    | DETAILS                                                                                                                                                                     |
  | ------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
  | VersionDetectedEvent           | Emitted when the service worker has detected a new version of the app on the server and is about to start downloading it.                                                   |
  | NoNewVersionDetectedEvent      | Emitted when the service worker has checked the version of the app on the server and did not find a new version.                                                            |
  | VersionReadyEvent              | Emitted when a new version of the app is available to be activated by clients. It may be used to notify the user of an available update or prompt them to refresh the page. |
  | VersionInstallationFailedEvent | Emitted when the installation of a new version failed. It may be used for logging/monitoring purposes.                                                                      |

- log-update.service.ts

  ```
  @Injectable()
  export class LogUpdateService {

    constructor(updates: SwUpdate) {
      updates.versionUpdates.subscribe(evt => {
        switch (evt.type) {
          case 'VERSION_DETECTED':
            console.log(`Downloading new app version: ${evt.version.hash}`);
            break;
          case 'VERSION_READY':
            console.log(`Current app version: ${evt.currentVersion.hash}`);
            console.log(`New app version ready for use: ${evt.latestVersion.hash}`);
            break;
          case 'VERSION_INSTALLATION_FAILED':
            console.log(`Failed to install app version '${evt.version.hash}': ${evt.error}`);
            break;
        }
      });
    }
  }
  ```

#### Checking for updates

- It's possible to ask the service worker to check if any updates have been deployed to the server. The service worker checks for updates during initialization and on each navigation request —that is, when the user navigates from a different address to your application. However, you might choose to manually check for updates if you have a site that changes frequently or want updates to happen on a schedule.

- Do this with the `checkForUpdate()` method:

  - check-for-update.service.ts

    ```
    import { ApplicationRef, Injectable } from '@angular/core';
    import { SwUpdate } from '@angular/service-worker';
    import { concat, interval } from 'rxjs';
    import { first } from 'rxjs/operators';

    @Injectable()
    export class CheckForUpdateService {

      constructor(appRef: ApplicationRef, updates: SwUpdate) {
        // Allow the app to stabilize first, before starting
        // polling for updates with `interval()`.
        const appIsStable$ = appRef.isStable.pipe(first(isStable => isStable === true));
        const everySixHours$ = interval(6 * 60 * 60 * 1000);
        const everySixHoursOnceAppIsStable$ = concat(appIsStable$, everySixHours$);

        everySixHoursOnceAppIsStable$.subscribe(async () => {
          try {
            const updateFound = await updates.checkForUpdate();
            console.log(updateFound ? 'A new version is available.' : 'Already on the latest version.');
          } catch (err) {
            console.error('Failed to check for updates:', err);
          }
        });
      }
    }
    ```

  - This method returns a `Promise<boolean>` which indicates if an update is available for activation. The check might fail, which will cause a rejection of the `Promise`.

  - In order to avoid negatively affecting the initial rendering of the page, `ServiceWorkerModule` waits for up to 30 seconds by default for the application to stabilize, before registering the ServiceWorker script. Constantly polling for updates, for example, with `setInterval()` or RxJS' `interval()`, prevents the application from stabilizing and the ServiceWorker script is not registered with the browser until the 30 seconds upper limit is reached.

    - NOTE:
      - This is true for any kind of polling done by your application.

- Avoid that delay by waiting for the application to stabilize first, before starting to poll for updates, as shown in the preceding example. Alternatively, you might want to define a different registration strategy for the ServiceWorker.

#### Updating to the latest version

- You can update an existing tab to the latest version by reloading the page as soon as a new version is ready. To avoid disrupting the user's progress, it is generally a good idea to prompt the user and let them confirm that it is OK to reload the page and update to the latest version:

  - prompt-update.service.ts

    ```
    @Injectable()
    export class PromptUpdateService {

      constructor(swUpdate: SwUpdate) {
        swUpdate.versionUpdates
            .pipe(filter((evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY'))
            .subscribe(evt => {
              if (promptUser(evt)) {
                // Reload the page to update to the latest version.
                document.location.reload();
              }
            });
      }

    }
    ```

- Calling `SwUpdate#activateUpdate()` updates a tab to the latest version without reloading the page, but this could break the application.

  - Updating without reloading can create a version mismatch between the `application shell` and other page resources, such as `lazy-loaded chunks`, whose filenames may change between versions.

  - You should only use `activateUpdate()`, if you are certain it is safe for your specific use case.

#### Handling an unrecoverable state

- In some cases, the version of the application used by the service worker to serve a client might be in a broken state that cannot be recovered from without a full page reload.

- For example, imagine the following scenario:

  - A user opens the application for the first time and the service worker caches the latest version of the application. Assume the application's cached assets include `index.html`, `main.<main-hash-1>.js` and `lazy-chunk.<lazy-hash-1>.js`.

  - The user closes the application and does not open it for a while.

  - After some time, a new version of the application is deployed to the server. This newer version includes the files `index.html`, `main.<main-hash-2>.js` and `lazy-chunk.<lazy-hash-2>.js`.

    - NOTE:

      - The hashes are different now, because the content of the files changed.

    - The old version is no longer available on the server.

  - In the meantime, the user's browser decides to evict `lazy-chunk.<lazy-hash-1>.js` from its cache. Browsers might decide to evict specific (or all) resources from a cache in order to reclaim disk space.

  - The user opens the application again. The service worker serves the latest version known to it at this point, namely the old version (`index.html` and `main.<main-hash-1>.js`).

  - At some later point, the application requests the lazy bundle, `lazy-chunk.<lazy-hash-1>.js`.

  - The service worker is unable to find the asset in the cache (remember that the browser evicted it). Nor is it able to retrieve it from the server (because the server now only has `lazy-chunk.<lazy-hash-2>.js` from the newer version).

- In the preceding scenario, the service worker is not able to serve an asset that would normally be cached. That particular application version is broken and there is no way to fix the state of the client without reloading the page. In such cases, the service worker notifies the client by sending an `UnrecoverableStateEvent` event. Subscribe to `SwUpdate#unrecoverable` to be notified and handle these errors.

  - handle-unrecoverable-state.service.ts
    ```
    @Injectable()
    export class HandleUnrecoverableStateService {
      constructor(updates: SwUpdate) {
        updates.unrecoverable.subscribe(event => {
          notifyUser(
            'An error occurred that we cannot recover from:\n' +
            event.reason +
            '\n\nPlease reload the page.'
          );
        });
      }
    }
    ```

## Service worker notifications

- Push notifications are a compelling way to engage users. Through the power of service workers, notifications can be delivered to a device even when your application is not in focus.

- The Angular service worker enables the display of push notifications and the handling of notification click events.

  - When using the Angular service worker, push notification interactions are handled using the `SwPush` service. To learn more about the browser APIs involved see [Push API](https://developer.mozilla.org/docs/Web/API/Push_API) and [Using the Notifications API](https://developer.mozilla.org/docs/Web/API/Notifications_API/Using_the_Notifications_API).

### Notification payload

- Invoke push notifications by pushing a message with a valid payload. See [SwPush](https://angular.io/api/service-worker/SwPush) for guidance.

  - In Chrome, you can test push notifications without a backend. Open Devtools -> Application -> Service Workers and use the Push input to send a JSON notification payload.

### Notification click handling

- The default behavior for the `notificationclick` event is to close the notification and notify `SwPush.notificationClicks`.

- You can specify an additional operation to be executed on `notificationclick` by adding an `onActionClick` property to the `data` object, and providing a `default` entry. This is especially useful for when there are no open clients when a notification is clicked.

  ```
  {
    "notification": {
      "title": "New Notification!",
      "data": {
        "onActionClick": {
          "default": {"operation": "openWindow", "url": "foo"}
        }
      }
    }
  }
  ```

#### Operations

- The Angular service worker supports the following operations:
  |OPERATIONS| DETAILS|
  |----------|---------|
  |openWindow| Opens a new tab at the specified URL.|
  |focusLastFocusedOrOpen| Focuses the last focused client. If there is no client open, then it opens a new tab at the specified URL.|
  |navigateLastFocusedOrOpen| Focuses the last focused client and navigates it to the specified URL. If there is no client open, then it opens a new tab at the specified URL.|
  |sendRequest| Send a simple GET request to the specified URL.|

- Note:
  - URLs are resolved relative to the service worker's registration scope.
  - If an `onActionClick` item does not define a `url`, then the service worker's registration scope is used.

#### Actions

- Actions offer a way to customize how the user can interact with a notification.

- Using the `actions` property, you can define a set of available actions. Each action is represented as an action button that the user can click to interact with the notification.

- In addition, using the `onActionClick` property on the `data` object, you can tie each action to an operation to be performed when the corresponding action button is clicked:

  ```
  {
    "notification": {
      "title": "New Notification!",
      "actions": [
        {"action": "foo", "title": "Open new tab"},
        {"action": "bar", "title": "Focus last"},
        {"action": "baz", "title": "Navigate last"},
        {"action": "qux", "title": "Send request in the background"}
        {"action": "other", "title": "Just notify existing clients"}
      ],
      "data": {
        "onActionClick": {
          "default": {"operation": "openWindow"},
          "foo": {"operation": "openWindow", "url": "/absolute/path"},
          "bar": {"operation": "focusLastFocusedOrOpen", "url": "relative/path"},
          "baz": {"operation": "navigateLastFocusedOrOpen", "url": "https://other.domain.com/"},
          "qux": {"operation": "sendRequest", "url": "https://yet.another.domain.com/"}
        }
      }
    }
  }
  ```

- If an action does not have a corresponding `onActionClick` entry, then the notification is closed and `SwPush.notificationClicks` is notified on existing clients.

## Service worker in production

### Service worker and caching of application resources

- Imagine the Angular service worker as a forward cache or a Content Delivery Network (CDN) edge that is installed in the end user's web browser. The service worker responds to requests made by the Angular application for resources or data from a local cache, without needing to wait for the network. Like any cache, it has rules for how content is expired and updated.

#### Application versions

- In the context of an Angular service worker, a "version" is a collection of resources that represent a specific build of the Angular application. Whenever a new build of the application is deployed, the service worker treats that build as a new version of the application. This is true even if only a single file is updated. At any given time, the service worker might have multiple versions of the application in its cache and it might be serving them simultaneously. For more information, see the Application tabs section.

- To preserve application integrity, the Angular service worker groups all files into a version together. The files grouped into a version usually include HTML, JS, and CSS files. Grouping of these files is essential for integrity because HTML, JS, and CSS files frequently refer to each other and depend on specific content. For example, an index.html file might have a `<script>` tag that references bundle.js and it might attempt to call a function startApp() from within that script. Any time this version of index.html is served, the corresponding bundle.js must be served with it. For example, assume that the startApp() function is renamed to runApp() in both files. In this scenario, it is not valid to serve the old index.html, which calls startApp(), along with the new bundle, which defines runApp().

- This file integrity is especially important when lazy loading modules. A JS bundle might reference many lazy chunks, and the filenames of the lazy chunks are unique to the particular build of the application. If a running application at version X attempts to load a lazy chunk, but the server has already updated to version X + 1, the lazy loading operation fails.

- The version identifier of the application is determined by the contents of all resources, and it changes if any of them change. In practice, the version is determined by the contents of the ngsw.json file, which includes hashes for all known content. If any of the cached files change, the file's hash changes in ngsw.json. This change causes the Angular service worker to treat the active set of files as a new version.

- The build process creates the manifest file, `ngsw.json`, using information from `ngsw-config.json`.

- With the versioning behavior of the Angular service worker, an application server can ensure that the Angular application always has a consistent set of files.

##### Update checks

- Every time the user opens or refreshes the application, the Angular service worker checks for updates to the application by looking for updates to the `ngsw.json` manifest. If an update is found, it is downloaded and cached automatically, and is served the next time the application is loaded.

#### Resource integrity

- One of the potential side effects of long caching is inadvertently caching a resource that's not valid. In a normal HTTP cache, a hard refresh or the cache expiring limits the negative effects of caching a file that's not valid. A service worker ignores such constraints and effectively long-caches the entire application. It's important that the service worker gets the correct content, so it keeps hashes of the resources to maintain their integrity.

##### Hashed content

- To ensure resource integrity, the Angular service worker validates the hashes of all resources for which it has a hash. For an application created with the Angular CLI, this is everything in the dist directory covered by the user's src/ngsw-config.json configuration.

- If a particular file fails validation, the Angular service worker attempts to re-fetch the content using a "cache-busting" URL parameter to prevent browser or intermediate caching. If that content also fails validation, the service worker considers the entire version of the application to not be valid and stops serving the application. If necessary, the service worker enters a safe mode where requests fall back on the network. The service worker doesn't use its cache if there's a high risk of serving content that is broken, outdated, or not valid.

- Hash mismatches can occur for a variety of reasons:

  - Caching layers between the origin server and the end user could serve stale content
  - A non-atomic deployment could result in the Angular service worker having visibility of partially updated content
  - Errors during the build process could result in updated resources without `ngsw.json` being updated. The reverse could also happen resulting in an updated `ngsw.json` without updated resources.

##### Unhashed content

-The only resources that have hashes in the ngsw.json manifest are resources that were present in the dist directory at the time the manifest was built. Other resources, especially those loaded from CDNs, have content that is unknown at build time or are updated more frequently than the application is deployed.

- If the Angular service worker does not have a hash to verify a resource is valid, it still caches its contents. At the same time, it honors the HTTP caching headers by using a policy of stale while revalidate. The Angular service worker continues to serve a resource even after its HTTP caching headers indicate that it is no longer valid. At the same time, it attempts to refresh the expired resource in the background. This way, broken unhashed resources do not remain in the cache beyond their configured lifetimes.

#### Application tabs

- It can be problematic for an application if the version of resources it's receiving changes suddenly or without warning. See the Application versions section for a description of such issues.

- The Angular service worker provides a guarantee: a running application continues to run the same version of the application. If another instance of the application is opened in a new web browser tab, then the most current version of the application is served. As a result, that new tab can be running a different version of the application than the original tab.

  - IMPORTANT:
    - This guarantee is stronger than that provided by the normal web deployment model. Without a service worker, there is no guarantee that lazily loaded code is from the same version as the application's initial code.

- The Angular service worker might change the version of a running application under error conditions such as:

  - The current version becomes non-valid due to a failed hash
  - An unrelated error causes the service worker to enter safe mode and deactivates it temporarily

- The Angular service worker cleans up application versions when no tab is using them.

- Other reasons the Angular service worker might change the version of a running application are normal events:

  - The page is reloaded/refreshed
  - The page requests an update be immediately activated using the SwUpdate service

#### Service worker updates

- The Angular service worker is a small script that runs in web browsers. From time to time, the service worker is updated with bug fixes and feature improvements.

- The Angular service worker is downloaded when the application is first opened and when the application is accessed after a period of inactivity. If the service worker changes, it's updated in the background.

- Most updates to the Angular service worker are transparent to the application. The old caches are still valid and content is still served normally. Occasionally, a bug fix or feature in the Angular service worker might require the invalidation of old caches. In this case, the service worker transparently refreshes the application from the network.

#### Bypassing the service worker

- In some cases, you might want to bypass the service worker entirely and let the browser handle the request. An example is when you rely on a feature that is currently not supported in service workers, such as reporting progress on uploaded files.

- To bypass the service worker, set `ngsw-bypass` as a request header, or as a query parameter. The value of the header or query parameter is ignored and can be empty or omitted.

#### Service worker requests when the server can't be reached

- The service worker processes all requests unless the service worker is explicitly bypassed. The service worker either returns a cached response or sends the request to the server, depending on the state and configuration of the cache. The service worker only caches responses to non-mutating requests, such as GET and HEAD.

- If the service worker receives an error from the server or it doesn't receive a response, it returns an error status that indicates the result of the call. For example, if the service worker doesn't receive a response, it creates a 504 Gateway Timeout status to return. The 504 status in this example could be returned because the server is offline or the client is disconnected.

### Debugging the Angular service worker

- Occasionally, it might be necessary to examine the Angular service worker in a running state to investigate issues or whether it's operating as designed. Browsers provide built-in tools for debugging service workers and the Angular service worker itself includes useful debugging features.

#### Locating and analyzing debugging information

- The Angular service worker exposes debugging information under the `ngsw/` virtual directory. Currently, the single exposed URL is `ngsw/state`.

##### Driver state

##### Latest manifest hash

##### Last update check

##### Version

##### Idle task queue

##### Debug log

#### Developer tools

- Browsers such as Chrome provide developer tools for interacting with service workers. Such tools can be powerful when used properly, but there are a few things to keep in mind.

  - When using developer tools, the service worker is kept running in the background and never restarts. This can cause behavior with Dev Tools open to differ from behavior a user might experience.

  - If you look in the Cache Storage viewer, the cache is frequently out of date. Right-click the Cache Storage title and refresh the caches.

  - Stopping and starting the service worker in the Service Worker pane checks for updates

### Service worker safety

- Bugs or broken configurations could cause the Angular service worker to act in unexpected ways. If this happens, the Angular service worker contains several failsafe mechanisms in case an administrator needs to deactivate the service worker quickly.

#### Fail-safe

- To deactivate the service worker, rename the `ngsw.json` file or delete it. When the service worker's request for `ngsw.json` returns a `404`, then the service worker removes all its caches and de-registers itself, essentially self-destructing.

#### Safety worker

- A small script, `safety-worker.js`, is also included in the `@angular/service-worker` NPM package. When loaded, it un-registers itself from the browser and removes the service worker caches. This script can be used as a last resort to get rid of unwanted service workers already installed on client pages.

- IMPORTANT:

  - You cannot register this worker directly, as old clients with cached state might not see a new `index.html` which installs the different worker script.

- Instead, you must serve the contents of `safety-worker.js` at the URL of the Service Worker script you are trying to unregister. You must continue to do so until you are certain all users have successfully unregistered the old worker. For most sites, this means that you should serve the safety worker at the old Service Worker URL forever. This script can be used to deactivate `@angular/service-worker` and remove the corresponding caches. It also removes any other Service Workers which might have been served in the past on your site.

#### Changing your application's location

- IMPORTANT:

  - Service workers don't work behind redirect. You might have already encountered the error `The script resource is behind a redirect, which is disallowed`.

- This can be a problem if you have to change your application's location. If you set up a redirect from the old location, such as example.com, to the new location, www.example.com in this example, the worker stops working. Also, the redirect won't even trigger for users who are loading the site entirely from Service Worker. The old worker, which was registered at example.com, tries to update and sends a request to the old location example.com. This request is redirected to the new location www.example.com and creates the error: The script resource is behind a redirect, which is disallowed.

- To remedy this, you might need to deactivate the old worker using one of the preceding techniques: `Fail-safe` or `Safety Worker`.

## Service worker configuration

### Prerequisites

- The `ngsw-config.json` configuration file specifies which files and data URLs the Angular service worker should cache and how it should update the cached files and data. The Angular CLI processes the configuration file during ng build. Manually, process it with the `ngsw-config` tool (where `<project-name>` is the name of the project being built):

  ```
  ./node_modules/.bin/ngsw-config ./dist/<project-name> ./ngsw-config.json [/base/href]
  ```

- The configuration file uses the JSON format. All file paths must begin with /, which corresponds to the deployment directory —usually `dist/<project-name>` in CLI projects.

- Unless otherwise commented, patterns use a `limited*` glob format that internally will be converted into regex:

  | GLOB FORMATS | DETAILS                                                                                                       |
  | ------------ | ------------------------------------------------------------------------------------------------------------- |
  | \*\*         | Matches 0 or more path segments                                                                               |
  | \*           | Matches 0 or more characters excluding /                                                                      |
  | ?            | Matches exactly one character excluding /                                                                     |
  | !            | prefix Marks the pattern as being negative, meaning that only files that don't match the pattern are included |

- Example patterns:

  | PATTERNS     | DETAILS                               |
  | ------------ | ------------------------------------- |
  | `/**/*.html` | Specifies all HTML files              |
  | `/*.html`    | Specifies only HTML files in the root |
  | `!/**/*.map` | Exclude all sourcemaps                |

### Service worker configuration properties

#### appData

- This section enables you to pass any data you want that describes this particular version of the application. The `SwUpdate` service includes that data in the update notifications. Many applications use this section to provide additional information for the display of UI popups, notifying users of the available update.

#### index

- Specifies the file that serves as the index page to satisfy navigation requests. Usually this is `/index.html`.

#### assetGroups

- Assets are resources that are part of the application version that update along with the application. They can include resources loaded from the page's origin as well as third-party resources loaded from CDNs and other external URLs. As not all such external URLs might be known at build time, URL patterns can be matched.

  - For the service worker to handle resources that are loaded from different origins, make sure that [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) is correctly configured on each origin's server.

- This field contains an array of asset groups, each of which defines a set of asset resources and the policy by which they are cached.

  ```
  {
    "assetGroups": [
      {
        …
      },
      {
        …
      }
    ]
  }
  ```

- When the ServiceWorker handles a request, it checks asset groups in the order in which they appear in ngsw-config.json. The first asset group that matches the requested resource handles the request.

  - It is recommended that you put the more specific asset groups higher in the list. For example, an asset group that matches /foo.js should appear before one that matches \*.js.

- Each asset group specifies both a group of resources and a policy that governs them. This policy determines when the resources are fetched and what happens when changes are detected.

  - Asset groups follow the Typescript interface shown here:
    ```
    interface AssetGroup {
      name: string;
      installMode?: 'prefetch' | 'lazy';
      updateMode?: 'prefetch' | 'lazy';
      resources: {
        files?: string[];
        urls?: string[];
      };
      cacheQueryOptions?: {
        ignoreSearch?: boolean;
      };
    }
    ```

- Each `AssetGroup` is defined by the following asset group properties.

  - name

    - A name is mandatory. It identifies this particular group of assets between versions of the configuration.

  - installMode

    - The installMode determines how these resources are initially cached. The installMode can be either of two

    | VALUES   | DETAILS                                                                                                                                                                                                                                                                                                                                                                                       |
    | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
    | prefetch | Tells the Angular service worker to fetch every single listed resource while it's caching the current version of the application. This is bandwidth-intensive but ensures resources are available whenever they're requested, even if the browser is currently offline.                                                                                                                       |
    | lazy     | Does not cache any of the resources up front. Instead, the Angular service worker only caches resources for which it receives requests. This is an on-demand caching mode. Resources that are never requested are not cached. This is useful for things like images at different resolutions, so the service worker only caches the correct assets for the particular screen and orientation. |

    - Defaults to prefetch.

  - updateMode

    - For resources already in the cache, the updateMode determines the caching behavior when a new version of the application is discovered. Any resources in the group that have changed since the previous version are updated in accordance with updateMode.

    | VALUES   | DETAILS                                                                                                                                                                                                                          |
    | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
    | prefetch | Tells the service worker to download and cache the changed resources immediately.                                                                                                                                                |
    | lazy     | Tells the service worker to not cache those resources. Instead, it treats them as unrequested and waits until they're requested again before updating them. An updateMode of lazy is only valid if the installMode is also lazy. |

    - Defaults to the value `installMode` is set to.

  - resources

    - This section describes the resources to cache, broken up into the following groups:

      | RESOURCE GROUPS | DETAILS                                                                                                                                                                                                                                                                                                                                                                                          |
      | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
      | files           | Lists patterns that match files in the distribution directory. These can be single files or glob-like patterns that match a number of files.                                                                                                                                                                                                                                                     |
      | urls            | Includes both URLs and URL patterns that are matched at runtime. These resources are not fetched directly and do not have content hashes, but they are cached according to their HTTP headers. This is most useful for CDNs such as the Google Fonts service. (Negative glob patterns are not supported and ? will be matched literally; that is, it will not match any character other than ?.) |

  - cacheQueryOptions

    - These options are used to modify the matching behavior of requests. They are passed to the browsers Cache#match function. See [MDN](https://developer.mozilla.org/docs/Web/API/Cache/match) for details. Currently, only the following options are supported:

      | OPTIONS      | DETAILS                                     |
      | ------------ | ------------------------------------------- |
      | ignoreSearch | Ignore query parameters. Defaults to false. |

#### dataGroups

- Unlike asset resources, data requests are not versioned along with the application. They're cached according to manually-configured policies that are more useful for situations such as API requests and other data dependencies.

- This field contains an array of data groups, each of which defines a set of data resources and the policy by which they are cached.

  ```
  {
    "dataGroups": [
      {
        …
      },
      {
        …
      }
    ]
  }
  ```

- When the ServiceWorker handles a request, it checks data groups in the order in which they appear in ngsw-config.json. The first data group that matches the requested resource handles the request.

  - It is recommended that you put the more specific data groups higher in the list. For example, a data group that matches /api/foo.json should appear before one that matches /api/\*.json.

- Data groups follow this Typescript interface:

  ```
  export interface DataGroup {
    name: string;
    urls: string[];
    version?: number;
    cacheConfig: {
      maxSize: number;
      maxAge: string;
      timeout?: string;
      strategy?: 'freshness' | 'performance';
    };
    cacheQueryOptions?: {
      ignoreSearch?: boolean;
    };
  }
  ```

- Each DataGroup is defined by the following data group properties.

  - name

    - Similar to assetGroups, every data group has a name which uniquely identifies it.

  - urls

    - A list of URL patterns. URLs that match these patterns are cached according to this data group's policy. Only non-mutating requests (GET and HEAD) are cached.
      - Negative glob patterns are not supported
      - ? is matched literally; that is, it matches only the character ?

  - version

    - Occasionally APIs change formats in a way that is not backward-compatible. A new version of the application might not be compatible with the old API format and thus might not be compatible with existing cached resources from that API.

    - version provides a mechanism to indicate that the resources being cached have been updated in a backwards-incompatible way, and that the old cache entries —those from previous versions— should be discarded.

    - version is an integer field and defaults to 1.

  - cacheConfig

    - The following properties define the policy by which matching requests are cached.

      - maxSize

        - Required
        - The maximum number of entries, or responses, in the cache. Open-ended caches can grow in unbounded ways and eventually exceed storage quotas, calling for eviction.

      - maxAge

        - Required
        - The maxAge parameter indicates how long responses are allowed to remain in the cache before being considered invalid and evicted. maxAge is a duration string, using the following unit suffixes:
          |SUFFIXES| DETAILS|
          |--------|--------|
          |d| Days|
          |h| Hours|
          |m |Minutes|
          |s| Seconds|
          |u| Milliseconds|

        - For example, the string 3d12h caches content for up to three and a half days.

      - timeout

        - This duration string specifies the network timeout. The network timeout is how long the Angular service worker waits for the network to respond before using a cached response, if configured to do so. timeout is a duration string, using the following unit suffixes:
          - the same as above
        - For example, the string 5s30u translates to five seconds and 30 milliseconds of network timeout.

      - strategy

        - The Angular service worker can use either of two caching strategies for data resources.

          | CACHING STRATEGIES | DETAILS                                                                                                                                                                                                                                                                                                                                                 |
          | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
          | performance        | The default, optimizes for responses that are as fast as possible. If a resource exists in the cache, the cached version is used, and no network request is made. This allows for some staleness, depending on the maxAge, in exchange for better performance. This is suitable for resources that don't change often; for example, user avatar images. |
          | freshness          | Optimizes for currency of data, preferentially fetching requested data from the network. Only if the network times out, according to timeout, does the request fall back to the cache. This is useful for resources that change frequently; for example, account balances.                                                                              |

        - You can also emulate a third strategy, [staleWhileRevalidate](https://developers.google.com/web/fundamentals/instant-and-offline/offline-cookbook/#stale-while-revalidate), which returns cached data if it is available, but also fetches fresh data from the network in the background for next time. To use this strategy set strategy to `freshness` and `timeout` to `0u` in `cacheConfig`.

          - This essentially does the following:

            1. Try to fetch from the network first.
            2. If the network request does not complete immediately, that is after a timeout of 0 ms, ignore the cache age and fall back to the cached value.
            3. Once the network request completes, update the cache for future requests.
            4. If the resource does not exist in the cache, wait for the network request anyway.

      - cacheOpaqueResponses

        - Whether the Angular service worker should cache opaque responses or not.
        - If not specified, the default value depends on the data group's configured strategy:

          | STRATEGIES                             | DETAILS                                                                                                                                                                                                                                                                                                                 |
          | -------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
          | Groups with the `freshness` strategy   | The default value is true and the service worker caches opaque responses. These groups will request the data every time and only fall back to the cached response when offline or on a slow network. Therefore, it doesn't matter if the service worker caches an error response.                                       |
          | Groups with the `performance` strategy | The default value is false and the service worker doesn't cache opaque responses. These groups would continue to return a cached response until maxAge expires, even if the error was due to a temporary network or server issue. Therefore, it would be problematic for the service worker to cache an error response. |

        - COMMENT ON OPAQUE RESPONSES

          - In case you are not familiar, an opaque response is a special type of response returned when requesting a resource that is on a different origin which doesn't return CORS headers. One of the characteristics of an opaque response is that the service worker is not allowed to read its status, meaning it can't check if the request was successful or not. See Introduction to fetch() for more details.

          - If you are not able to implement CORS —for example, if you don't control the origin— prefer using the freshness strategy for resources that result in opaque responses.

      - cacheQueryOptions
        - See assetGroups for details.

#### navigationUrls

- This optional section enables you to specify a custom list of URLs that will be redirected to the index file.

##### Handling navigation requests

- The ServiceWorker redirects navigation requests that don't match any `asset` or `data` group to the specified index file. A request is considered to be a navigation request if:
  - Its method is GET
  - Its mode is navigation
  - It accepts a text/html response as determined by the value of the Accept header
  - Its URL matches the following criteria:
    - The URL must not contain a file extension (that is, a .) in the last path segment
    - The URL must not contain \_\_

##### Matching navigation request URLs

- While these default criteria are fine in most cases, it is sometimes desirable to configure different rules. For example, you might want to ignore specific routes, such as those that are not part of the Angular app, and pass them through to the server.

- This field contains an array of URLs and glob-like URL patterns that are matched at runtime. It can contain both negative patterns (that is, patterns starting with !) and non-negative patterns and URLs.

- Only requests whose URLs match any of the non-negative URLs/patterns and none of the negative ones are considered navigation requests. The URL query is ignored when matching.

- If the field is omitted, it defaults to:
  ```
  [
    '/**',           // Include all URLs.
    '!/**/*.*',      // Exclude URLs to files.
    '!/**/*__*',     // Exclude URLs containing `__` in the last segment.
    '!/**/*__*/**',  // Exclude URLs containing `__` in any other segment.
  ]
  ```

#### navigationRequestStrategy

- This optional property enables you to configure how the service worker handles navigation requests:

  ```
  {
    "navigationRequestStrategy": "freshness"
  }
  ```

  - Possible values

    - 'performance'

      - The default setting. Serves the specified `index file`, which is typically cached.

    - 'freshness'
      - Passes the requests through to the network and falls back to the performance behavior when offline. This value is useful when the server redirects the navigation requests elsewhere using a 3xx HTTP redirect status code. Reasons for using this value include:
        - Redirecting to an authentication website when authentication is not handled by the application
        - Redirecting specific URLs to avoid breaking existing links/bookmarks after a website redesign
        - Redirecting to a different website, such as a server-status page, while a page is temporarily down

  - The freshness strategy usually results in more requests sent to the server, which can increase response latency. It is recommended that you use the default performance strategy whenever possible.
