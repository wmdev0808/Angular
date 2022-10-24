# Change detection & NgZone

## Change detection

### Angular change detection and runtime optimization

- **Change detection** is the process through which Angular checks to see whether your application state has changed, and if any DOM needs to be updated. At a high level, Angular walks your components from top to bottom, looking for changes. Angular runs its change detection mechanism periodically so that changes to the data model are reflected in an application’s view. Change detection can be triggered either manually or through an asynchronous event (for example, a user interaction or an XMLHttpRequest completion).

- Change detection is a highly optimized performant, but it can still cause slowdowns if the application runs it too frequently.

- In this guide, you’ll learn how to control and optimize the change detection mechanism by skipping parts of your application and running change detection only when necessary.

### Resolving Zone pollution

- **Zone.js** is a signaling mechanism that Angular uses to detect when an application state might have changed. It captures asynchronous operations like setTimeout, network requests, and event listeners. Angular schedules change detection based on signals from Zone.js

- There are cases in which scheduled tasks or microtasks don’t make any changes in the data model, which makes running change detection unnecessary. Common examples are:

  - `requestAnimationFrame`, `setTimeout` or `setInterval`
  - Task or microtask scheduling by third-party libraries

- This section covers how to identify such conditions, and how to run code outside the Angular zone to avoid unnecessary change detection calls.

#### Identifying unnecessary change detection calls

- You can detect unnecessary change detection calls using Angular DevTools. Often they appear as consecutive bars in the profiler’s timeline with source setTimeout, setInterval, requestAnimationFrame, or an event handler. When you have limited calls within your application of these APIs, the change detection invocation is usually caused by a third-party library.

  ![](https://angular.io/generated/images/guide/change-detection/zone-pollution.png)

  - In the image above, there is a series of change detection calls triggered by event handlers associated with an element. That’s a common challenge when using third-party, non-native Angular components, which do not alter the default behavior of `NgZone`.

#### Run tasks outside NgZone

- In such cases, we can instruct Angular to avoid calling change detection for tasks scheduled by a given piece of code using [NgZone](https://angular.io/guide/zone).

  ```
  import { Component, NgZone, OnInit } from '@angular/core';
  @Component(...)
  class AppComponent implements OnInit {
    constructor(private ngZone: NgZone) {}
    ngOnInit() {
      this.ngZone.runOutsideAngular(() => setInterval(pollForUpdates), 500);
    }
  }
  ```

  - The snippet above instructs Angular that it should execute the `setInterval` call outside the Angular Zone and skip running change detection after `pollForUpdates` runs.

- Third-party libraries commonly trigger unnecessary change detection cycles because they weren't authored with Zone.js in mind. Avoid these extra cycles by calling library APIs outside the Angular zone:

  ```
  import { Component, NgZone, OnInit } from '@angular/core';
  import * as Plotly from 'plotly.js-dist-min';

  @Component(...)
  class AppComponent implements OnInit {
    constructor(private ngZone: NgZone) {}
    ngOnInit() {
      this.ngZone.runOutsideAngular(() => {
        Plotly.newPlot('chart', data);
      });
    }
  }
  ```

  - Running `Plotly.newPlot('chart', data);` within `runOutsideAngular` instructs the framework that it shouldn’t execute change detection after the execution of tasks scheduled by the initialization logic.

    - For example, if `Plotly.newPlot('chart', data)` adds event listeners to a DOM element, Angular will not execute change detection after the execution of their handlers.

### Slow computations

- On every change detection cycle, Angular synchronously:

  - Evaluates all template expressions in all components, unless specified otherwise, based on that each component's detection strategy

  - Executes the `ngDoCheck`, `ngAfterContentChecked`, `ngAfterViewChecked`, and `ngOnChanges` lifecycle hooks. A single slow computation within a template or a lifecycle hook can slow down the entire change detection process because Angular runs the computations sequentially.

#### Identifying slow computations

- You can identify heavy computations with Angular DevTools’ profiler. In the performance timeline, click on a bar to preview a particular change detection cycle. This displays a bar chart, which shows how long the framework spent in change detection for each component. When you click on a component, you can preview how long Angular spent evaluating its template and lifecycle hooks.

  ![](https://angular.io/generated/images/guide/change-detection/slow-computations.png)

  - For example, in the screenshot above, we selected the second change detection cycle after the profiler started where Angular spent over 573 ms. Angular spent most time in the `EmployeeListComponent`. In the details panel, we can see that we spent over 297ms in evaluating the template of the `EmployeeListComponent`.

#### Optimizing slow computations

- There are several techniques to eliminate slow computations:

  - **Optimizing the underlying algorithm**. This is the recommended approach; if you can speed up the algorithm that is causing the problem, you can speed up the entire change detection mechanism.

  - **Caching using pure pipes**. You can move the heavy computation to a pure pipe. Angular will reevaluate a pure pipe only if it detects that its inputs changed, compared to the previous time Angular called it.

  - **Using memoization**. Memoization is a similar technique to pure pipes, with the difference that pure pipes preserve only the last result from the computation where memoization could store multiple results.

  - **Avoid repaints/reflows in lifecycle hooks**. Certain operations cause the browser to either synchronously recalculate the layout of the page or re-render it. Since reflows and repaints are generally slow, we want to avoid performing them in every change detection cycle.

- Pure pipes and memoization have different trade-offs. Pure pipes are an Angular built-in concept compared to memoization, which is a general software engineering practice for caching function results. The memory overhead of memoization could be significant if you invoke the heavy computation frequently with different arguments.

### Skipping component subtrees

- JavaScript, by default, uses mutable data structures that you can reference from multiple different components. Angular runs change detection over your entire component tree to make sure that the most up-to-date state of your data structures is reflected in the DOM.

- Change detection is sufficiently fast for most applications. However, when an application has an especially large component tree, running change detection across the whole application can cause performance issues. You can address this by configuring change detection to only run on a subset of the component tree.

- If you are confident that a part of the application is not affected by a state change, you can use `OnPush` to skip change detection in an entire component subtree.

#### Using OnPush

- OnPush change detection instructs Angular to run change detection for a component subtree only when:

  - The root component of the subtree receives new inputs as the result of a template binding. Angular compares the current and past value of the input with `==`

  - Angular handles an event (_e.g. using event binding, output binding, or `@HostListener`_) in the subtree's root component or any of its children whether they are using OnPush change detection or not.

- You can set the change detection strategy of a component to `OnPush` in the @Component decorator:

  ```
  import { ChangeDetectionStrategy, Component } from '@angular/core';
  @Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
  })
  export class MyComponent {}
  ```

#### Common change detection scenarios

- This section examines several common change detection scenarios to illustrate Angular's behavior.

#### An event is handled by a component with default change detection

- If Angular handles an event within a component without OnPush strategy, the framework executes change detection on the entire component tree. Angular will skip descendant component subtrees with roots using OnPush, which have not received new inputs.

- As an example, if we set the change detection strategy of `MainComponent` to `OnPush` and the user interacts with a component outside the subtree with root `MainComponent`, Angular will check all the green components from the diagram below (`AppComponent`, `HeaderComponent`, `SearchComponent`, `ButtonComponent`) unless `MainComponent` receives new inputs:

  ![](https://angular.io/generated/images/guide/change-detection/event-trigger.svg)

#### An event is handled by a component with OnPush

- If Angular handles an event within a component with OnPush strategy, the framework will execute change detection within the entire component tree. Angular will ignore component subtrees with roots using OnPush, which have not received new inputs and are outside the component which handled the event.

- As an example, if Angular handles an event within `MainComponent`, the framework will run change detection in the entire component tree. Angular will ignore the subtree with root LoginComponent because it has OnPush and the event happened outside of its scope.

#### An event is handled by a descendant of a component with OnPush

- If Angular handles an event in a component with OnPush, the framework will execute change detection in the entire component tree, including the component’s ancestors.

- As an example, in the diagram below, Angular handles an event in `LoginComponent` which uses OnPush. Angular will invoke change detection in the entire component subtree including `MainComponent` (`LoginComponent`’s parent), even though `MainComponent` has `OnPush` as well. Angular checks `MainComponent` as well because `LoginComponent` is part of its view.

  ![](https://angular.io/generated/images/guide/change-detection/leaf-trigger.svg)

#### New inputs to component with OnPush

- Angular will run change detection within a child component with OnPush setting an input property as result of a template binding.

- For example, in the diagram below, `AppComponent` passes a new input to `MainComponent`, which has `OnPush`. Angular will run change detection in `MainComponent` but will not run change detection in `LoginComponent`, which also has `OnPush`, unless it receives new inputs as well.

  ![](https://angular.io/generated/images/guide/change-detection/on-push-input.svg)

#### Edge cases

- **Modifying input properties in TypeScript code**. When you use an API like `@ViewChild` or `@ContentChild` to get a reference to a component in TypeScript and manually modify an `@Input` property, Angular will not automatically run change detection for OnPush components. If you need Angular to run change detection, you can inject `ChangeDetectorRef` in your component and call `changeDetectorRef.markForCheck()` to tell Angular to schedule a change detection.

- **Modifying object references**. In case an input receives a mutable object as value and you modify the object but preserve the reference, Angular will not invoke change detection. That’s the expected behavior because the previous and the current value of the input point to the same reference.

## NgZone

- A zone is an execution context that persists across async tasks. You can think of it as `thread-local storage` for the JavaScript VM. This guide describes how to use Angular's NgZone to automatically detect changes in the component to update HTML.

### Fundamentals of change detection

- To understand the benefits of `NgZone`, it is important to have a clear grasp of what change detection is and how it works.

#### Displaying and updating data in Angular

- src/app/app.component.ts

  ```
  import { Component } from '@angular/core';

  @Component({
    selector: 'app-root',
    template: `
      <h1>{{title}}</h1>
      <h2>My favorite hero is: {{myHero}}</h2>
      `
  })
  export class AppComponent {
    title = 'Tour of Heroes';
    myHero = 'Windstorm';
  }
  ```

- You can also bind DOM events to a method of an Angular component. In such methods, you can also update a property of the Angular component, which updates the corresponding data displayed in the template.

  - src/app/click-me.component.ts

    ```
    @Component({
      selector: 'app-click-me',
      template: `
        <button type="button" (click)="onClickMe()">Click me!</button>
        {{clickMessage}}`
    })
    export class ClickMeComponent {
      clickMessage = '';

      onClickMe() {
        this.clickMessage = 'You are my hero!';
      }
    }
    ```

- In both of the preceding examples, the component's code updates only the property of the component. The HTML is also updated automatically. This guide describes how and when Angular renders the HTML based on the data from the Angular component.

#### Detecting changes with plain JavaScript

- To clarify how changes are detected and values updated, consider the following code written in plain JavaScript.

  ```
  <html>
    <div id="dataDiv"></div>
    <button id="btn">updateData</button>
    <canvas id="canvas"></canvas>
    <script>
      let value = 'initialValue';
      // initial rendering
      detectChange();

      function renderHTML() {
        document.getElementById('dataDiv').innerText = value;
      }

      function detectChange() {
        const currentValue = document.getElementById('dataDiv').innerText;
        if (currentValue !== value) {
          renderHTML();
        }
      }

      // Example 1: update data inside button click event handler
      document.getElementById('btn').addEventListener('click', () => {
        // update value
        value = 'button update value';
        // call detectChange manually
        detectChange();
      });

      // Example 2: HTTP Request
      const xhr = new XMLHttpRequest();
      xhr.addEventListener('load', function() {
        // get response from server
        value = this.responseText;
        // call detectChange manually
        detectChange();
      });
      xhr.open('GET', serverUrl);
      xhr.send();

      // Example 3: setTimeout
      setTimeout(() => {
        // update value inside setTimeout callback
        value = 'timeout update value';
        // call detectChange manually
        detectChange();
      }, 100);

      // Example 4: Promise.then
      Promise.resolve('promise resolved a value').then(v => {
        // update value inside Promise thenCallback
        value = v;
        // call detectChange manually
        detectChange();
      }, 100);

      // Example 5: some other asynchronous APIs
      document.getElementById('canvas').toBlob(blob => {
        // update value when blob data is created from the canvas
        value = `value updated by canvas, size is ${blob.size}`;
        // call detectChange manually
        detectChange();
      });
    </script>
  </html>
  ```

- After you update the data, you need to call `detectChange()` manually to see whether the data changed. If the data changed, you render the HTML to reflect the updated data.

- In Angular, this step is unnecessary. Whenever you update the data, your HTML is updated automatically.

#### When apps update HTML

- To understand how change detection works, first consider when the application needs to update the HTML. Typically, updates occur for one of the following reasons:

  1. Component initialization. For example, when bootstrapping an Angular application, Angular loads the bootstrap component and triggers the `ApplicationRef.tick()` to call change detection and View Rendering.

  2. Event listener. The DOM event listener can update the data in an Angular component and also trigger change detection, as in the following example.

  - src/app/click-me.component.ts

    ```
    @Component({
      selector: 'app-click-me',
      template: `
        <button type="button" (click)="onClickMe()">Click me!</button>
        {{clickMessage}}`
    })
    export class ClickMeComponent {
      clickMessage = '';

      onClickMe() {
        this.clickMessage = 'You are my hero!';
      }
    }
    ```

  3. HTTP Data Request. You can also get data from a server through an HTTP request. For example:

  ```
  @Component({
    selector: 'app-root',
    template: '<div>{{data}}</div>';
  })
  export class AppComponent implements OnInit {
    data = 'initial value';
    serverUrl = 'SERVER_URL';
    constructor(private httpClient: HttpClient) {}

    ngOnInit() {
      this.httpClient.get(this.serverUrl).subscribe(response => {
        // user does not need to trigger change detection manually
        this.data = response.data;
      });
    }
  }
  ```

  4. MacroTasks, such as `setTimeout()` or `setInterval()`. You can also update the data in the callback function of a `macroTask` such as `setTimeout()`. For example:

  ```
  @Component({
    selector: 'app-root',
    template: '<div>{{data}}</div>';
  })
  export class AppComponent implements OnInit {
    data = 'initial value';

    ngOnInit() {
      setTimeout(() => {
        // user does not need to trigger change detection manually
        this.data = 'value updated';
      });
    }
  }
  ```

  5. MicroTasks, such as `Promise.then()`. Other asynchronous APIs return a Promise object (such as `fetch`), so the `then()` callback function can also update the data. For example:

  ```
  @Component({
    selector: 'app-root',
    template: '<div>{{data}}</div>';
  })
  export class AppComponent implements OnInit {
    data = 'initial value';

    ngOnInit() {
      Promise.resolve(1).then(v => {
        // user does not need to trigger change detection manually
        this.data = v;
      });
    }
  }
  ```

  6. Other async operations. Besides `addEventListener()`, `setTimeout()` and `Promise.then()`, there are other operations that can update the data asynchronously. Some examples include `WebSocket.onmessage()` and `Canvas.toBlob()`.

  - The preceding list contains most common scenarios in which the application might change the data. Angular runs change detection whenever it detects that data could have changed. The result of change detection is that the DOM is updated with new data. Angular detects the changes in different ways. For component initialization, Angular calls change detection explicitly. For `asynchronous operations`, Angular uses a zone to detect changes in places where the data could have possibly mutated and it runs change detection automatically.

### Zones and execution contexts

- A zone provides an execution context that persists across async tasks. [Execution Context](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Operators/this) is an abstract concept that holds information about the environment within the current code being executed. Consider the following example:

  ```
    const callback = function() {
      console.log('setTimeout callback context is', this);
    }

    const ctx1 = { name: 'ctx1' };
    const ctx2 = { name: 'ctx2' };

    const func = function() {
      console.log('caller context is', this);
      setTimeout(callback);
    }

    func.apply(ctx1);
    func.apply(ctx2);
  ```

- The value of `this` in the callback of `setTimeout()` might differ depending on when `setTimeout()` is called. Thus, you can lose the context in asynchronous operations.

- A zone provides a new zone context other than `this`, the zone context that persists across asynchronous operations. In the following example, the new zone context is called `zoneThis`.

  ```
  zone.run(() => {
    // now you are in a zone
    expect(zoneThis).toBe(zone);
    setTimeout(function() {
      // the zoneThis context will be the same zone
      // when the setTimeout is scheduled
      expect(zoneThis).toBe(zone);
    });
  });
  ```

  - This new context, `zoneThis`, can be retrieved from the `setTimeout()` callback function, and this context is the same when the `setTimeout()` is scheduled. To get the context, you can call `Zone.current`.
    .

### Zones and async lifecycle hooks

- Zone.js can create contexts that persist across asynchronous operations as well as provide lifecycle hooks for asynchronous operations.

  ```
  const zone = Zone.current.fork({
    name: 'zone',
    onScheduleTask: function(delegate, curr, target, task) {
      console.log('new task is scheduled:', task.type, task.source);
      return delegate.scheduleTask(target, task);
    },
    onInvokeTask: function(delegate, curr, target, task, applyThis, applyArgs) {
      console.log('task will be invoked:', task.type, task.source);
      return delegate.invokeTask(target, task, applyThis, applyArgs);
    },
    onHasTask: function(delegate, curr, target, hasTaskState) {
      console.log('task state changed in the zone:', hasTaskState);
      return delegate.hasTask(target, hasTaskState);
    },
    onInvoke: function(delegate, curr, target, callback, applyThis, applyArgs) {
      console.log('the callback will be invoked:', callback);
      return delegate.invoke(target, callback, applyThis, applyArgs);
    }
  });
  zone.run(() => {
    setTimeout(() => {
      console.log('timeout callback is invoked.');
    });
  });
  ```

- The preceding example creates a zone with several hooks.

- The `onXXXTask` hooks trigger when the status of the task changes. The concept of a _Zone Task_ is comparable to the JavaScript VM Task concept:

  - `macroTask`: such as `setTimeout()`
  - `microTask`: such as `Promise.then()`
  - `eventTask`: such as `element.addEventListener()`

- These hooks trigger under the following circumstances:

  | HOOKS          | DETAILS                                                                                                                                                                                                                                           |
  | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
  | onScheduleTask | Triggers when a new asynchronous task is scheduled, such as when you call `setTimeout()`.                                                                                                                                                         |
  | onInvokeTask   | Triggers when an asynchronous task is about to run, such as when the callback of `setTimeout()` is about to run.                                                                                                                                  |
  | onHasTask      | Triggers when the status of one kind of task inside a zone changes from stable to unstable or from unstable to stable. A status of "stable" means there are no tasks inside the zone, while "unstable" means a new task is scheduled in the zone. |
  | onInvoke       | Triggers when a synchronous function is going to run in the zone.                                                                                                                                                                                 |

- With these hooks, Zone can observe the status of all synchronous and asynchronous operations inside a zone.

  - The preceding example returns the following output:

    ```
    the callback will be invoked: () => {
      setTimeout(() => {
        console.log('timeout callback is invoked.');
      });
    }
    new task is scheduled: macroTask setTimeout
    task state changed in the zone: { microTask: false,
      macroTask: true,
      eventTask: false,
      change: 'macroTask' }
    task will be invoked macroTask: setTimeout
    timeout callback is invoked.
    task state changed in the zone: { microTask: false,
      macroTask: false,
      eventTask: false,
      change: 'macroTask' }
    ```

- All of the functions of `Zone` are provided by a library called `Zone.js`. This library implements those features by intercepting asynchronous APIs through monkey patching. Monkey patching is a technique to add or alter the default behavior of a function at runtime without changing the source code.

### NgZone

- While Zone.js can observe all the states of synchronous and asynchronous operations, Angular additionally provides a service called NgZone. This service creates a zone named `angular` to automatically trigger change detection when the following conditions are satisfied:

  1. When a sync or async function is executed
  2. When there is no `microTask` scheduled

#### NgZone run() and runOutsideOfAngular()

- `Zone` handles most asynchronous APIs such as `setTimeout()`, `Promise.then()`, and `addEventListener()`. For the full list, see the Zone Module document. In those asynchronous APIs, you don't need to trigger change detection manually.

- Some third party APIs are not handled by Zone. In those cases, the `NgZone` service provides a `run()` method that allows you to run a function inside the Angular zone. This function, and all asynchronous operations in that function, triggers change detection automatically at the correct time.

  ```
  export class AppComponent implements OnInit {
    constructor(private ngZone: NgZone) {}
    ngOnInit() {
      // New async API is not handled by Zone, so you need to use ngZone.run()
      // to make the asynchronous operation callback in the Angular zone and
      // trigger change detection automatically.
      someNewAsyncAPI(() => {
        this.ngZone.run(() => {
          // update the data of the component
        });
      });
    }
  }
  ```

- By default, all asynchronous operations are inside the Angular zone, which triggers change detection automatically. Another common case is when you don't want to trigger change detection. In that situation, you can use another `NgZone` method: `runOutsideAngular()`.

  ```
  export class AppComponent implements OnInit {
    constructor(private ngZone: NgZone) {}
    ngOnInit() {
      // You know no data will be updated,
      // so you don't want to trigger change detection in this
      // specified operation. Instead, call ngZone.runOutsideAngular()
      this.ngZone.runOutsideAngular(() => {
        setTimeout(() => {
          // update component data
          // but don't trigger change detection.
        });
      });
    }
  }
  ```

#### Setting up Zone.js

- To make Zone.js available in Angular, you need to import the `zone.js` package. If you are using the Angular CLI, this step is done automatically, and you can see the following line in the `src/polyfills.ts`:

  ```
  /**************************************************************************************************
  * Zone JS is required by default for Angular itself.
  */
  import 'zone.js';  // Included with Angular CLI.
  ```

- Before importing the `zone.js` package, you can set the following configurations:

  - Disabling some asynchronous API monkey patching for better performance. For example, disabling the `requestAnimationFrame()` monkey patch, so the callback of `requestAnimationFrame()` does not trigger change detection. This is useful if, in your application, the callback of the `requestAnimationFrame()` does not update any data.

  - Specify that certain DOM events do not run inside the Angular zone. For example, to prevent a `mousemove` or `scroll` event to trigger change detection

- Several other settings can be changed. To make these changes, you need to create a `zone-flags.ts` file, such as the following.

  ```
  // disable patching requestAnimationFrame
  (window as any).__Zone_disable_requestAnimationFrame = true;

  // disable patching specified eventNames
  (window as any).__zone_symbol__UNPATCHED_EVENTS = ['scroll', 'mousemove'];
  ```

- Next, import `zone-flags` before you import `zone.js` in the `polyfills.ts`:

  ```
  /***************************************************************************************************
  * Zone JS is required by default for Angular.
  */
  import `./zone-flags`;
  import 'zone.js';  // Included with Angular CLI.
  ```

#### NoopZone

- `Zone` helps Angular know when to trigger change detection and let the developers focus on the application development. By default, `Zone` is loaded and works without further configuration. You don't necessarily have to use `Zone` to make Angular work. Instead, you can opt to trigger change detection on your own.

- DISABLING ZONE

  - **Disabling `Zone` requires you to trigger all change detection at the correct timing yourself, which requires comprehensive knowledge of change detection.**

- To remove Zone.js, make the following changes.

  - 1. Remove the `zone.js` import from `polyfills.ts`:

    ```
    /***************************************************************************************************
    * Zone JS is required by default for Angular itself.
    */
    // import 'zone.js';  // Included with Angular CLI.
    ```

  - 2. Bootstrap Angular with the `noop` zone in `src/main.ts`:

    ```
    platformBrowserDynamic().bootstrapModule(AppModule, { ngZone: 'noop' })
    .catch(err => console.error(err));
    ```
