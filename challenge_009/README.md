# RxJS

## Observable

- Observables are lazy Push collections of multiple values. They fill the missing spot in the following table:

  |      | SINGLE   | MULTIPLE   |
  | ---- | -------- | ---------- |
  | Pull | Function | Iterator   |
  | Push | Promise  | Observable |

- **Example**: The following is an Observable that pushes the values 1, 2, 3 immediately (synchronously) when subscribed, and the value 4 after one second has passed since the subscribe call, then completes:

  ```
  import { Observable } from 'rxjs';

  const observable = new Observable((subscriber) => {
    subscriber.next(1);
    subscriber.next(2);
    subscriber.next(3);
    setTimeout(() => {
      subscriber.next(4);
      subscriber.complete();
    }, 1000);
  });
  ```

- To invoke the Observable and see these values, we need to subscribe to it:

  ```
  import { Observable } from 'rxjs';

  const observable = new Observable((subscriber) => {
    subscriber.next(1);
    subscriber.next(2);
    subscriber.next(3);
    setTimeout(() => {
      subscriber.next(4);
      subscriber.complete();
    }, 1000);
  });

  console.log('just before subscribe');
  observable.subscribe({
    next(x) {
      console.log('got value ' + x);
    },
    error(err) {
      console.error('something wrong occurred: ' + err);
    },
    complete() {
      console.log('done');
    },
  });
  console.log('just after subscribe');
  ```

  - Which executes as such on the console:
    ```
    just before subscribe
    got value 1
    got value 2
    got value 3
    just after subscribe
    got value 4
    done
    ```

- Anatomy of an Observable

  - Observables are created using new Observable or a creation operator, are subscribed to with an Observer, execute to deliver next / error / complete notifications to the Observer, and their execution may be disposed. These four aspects are all encoded in an Observable instance, but some of these aspects are related to other types, like Observer and Subscription.

  - Core Observable concerns:

    - Creating Observables
    - Subscribing to Observables
    - Executing the Observable
    - Disposing Observables

  - Creating Observables

    - The Observable constructor takes one argument: the subscribe function.

      ```
      import { Observable } from 'rxjs';

      const observable = new Observable(function subscribe(subscriber) {
        const id = setInterval(() => {
          subscriber.next('hi');
        }, 1000);
      });
      ```

    - Observables can be created with new Observable. Most commonly, observables are created using creation functions, like _of_, _from_, _interval_, etc.

  - Subscribing to Observables

    - The Observable observable in the example can be subscribed to, like this:
      ```
      observable.subscribe((x) => console.log(x));
      ```
    - Subscribing to an Observable is like calling a function, providing callbacks where the data will be delivered to.

  - Executing Observables

    - The code inside new Observable(function subscribe(subscriber) {...}) represents an "Observable execution", a lazy computation that only happens for each Observer that subscribes. The execution produces multiple values over time, either synchronously or asynchronously.

    - There are three types of values an Observable Execution can deliver:

      - "Next" notification: sends a value such as a Number, a String, an Object, etc.
      - "Error" notification: sends a JavaScript Error or exception.
      - "Complete" notification: does not send a value.

    - "Next" notifications are the most important and most common type: they represent actual data being delivered to a subscriber. "Error" and "Complete" notifications may happen only once during the Observable Execution, and there can only be either one of them.

    - These constraints are expressed best in the so-called Observable Grammar or Contract, written as a regular expression:

      ```
      next*(error|complete)?
      ```

    - In an Observable Execution, zero to infinite Next notifications may be delivered. If either an Error or Complete notification is delivered, then nothing else can be delivered afterwards.

  - Disposing Observable Executions

    - Because Observable Executions may be infinite, and it's common for an Observer to want to abort execution in finite time, we need an API for canceling an execution. Since each execution is exclusive to one Observer only, once the Observer is done receiving values, it has to have a way to stop the execution, in order to avoid wasting computation power or memory resources.

    - When observable.subscribe is called, the Observer gets attached to the newly created Observable execution. This call also returns an object, the Subscription:

      ```
      const subscription = observable.subscribe((x) => console.log(x));
      ```

    - The Subscription represents the ongoing execution, and has a minimal API which allows you to cancel that execution.

    - With subscription.unsubscribe() you can cancel the ongoing execution:

      ```
      import { from } from 'rxjs';

      const observable = from([10, 20, 30]);
      const subscription = observable.subscribe((x) => console.log(x));
      // Later:
      subscription.unsubscribe();
      ```

    - When you subscribe, you get back a Subscription, which represents the ongoing execution. Just call unsubscribe() to cancel the execution.

    - Each Observable must define how to dispose resources of that execution when we create the Observable using create(). You can do that by returning a custom unsubscribe function from within function subscribe().

      ```
      import { Observable } from 'rxjs';

      const observable = new Observable(function subscribe(subscriber) {
        // Keep track of the interval resource
        const intervalId = setInterval(() => {
          subscriber.next('hi');
        }, 1000);

        // Provide a way of canceling and disposing the interval resource
        return function unsubscribe() {
          clearInterval(intervalId);
        };
      });
      ```

## Observer

- What is an Observer? An Observer is a consumer of values delivered by an Observable. Observers are simply a set of callbacks, one for each type of notification delivered by the Observable: next, error, and complete. The following is an example of a typical Observer object:

  ```
  const observer = {
    next: x => console.log('Observer got a next value: ' + x),
    error: err => console.error('Observer got an error: ' + err),
    complete: () => console.log('Observer got a complete notification'),
  };
  ```

- To use the Observer, provide it to the subscribe of an Observable:

  ```
  observable.subscribe(observer);
  ```

- Observers are just objects with three callbacks, one for each type of notification that an Observable may deliver.

- Observers in RxJS may also be partial. If you don't provide one of the callbacks, the execution of the Observable will still happen normally, except some types of notifications will be ignored, because they don't have a corresponding callback in the Observer.

  ```
  const observer = {
    next: x => console.log('Observer got a next value: ' + x),
    error: err => console.error('Observer got an error: ' + err),
  };
  ```

- When subscribing to an Observable, you may also just provide the next callback as an argument, without being attached to an Observer object, for instance like this:

  ```
  observable.subscribe(x => console.log('Observer got a next value: ' + x));
  ```

## RxJS Operators

- RxJS is mostly useful for its operators, even though the Observable is the foundation. Operators are the essential pieces that allow complex asynchronous code to be easily composed in a declarative manner.

### What are operators?

- Operators are functions. There are two kinds of operators:

  - **Pipeable Operators** are the kind that can be piped to Observables using the syntax observableInstance.pipe(operator()). These include, filter(...), and mergeMap(...). When called, they do not change the existing Observable instance. Instead, they return a new Observable, whose subscription logic is based on the first Observable.

    - A Pipeable Operator is a function that takes an Observable as its input and returns another Observable. It is a pure operation: the previous Observable stays unmodified.

  - **Creation Operators** are the other kind of operator, which can be called as standalone functions to create a new Observable. For example: of(1, 2, 3) creates an observable that will emit 1, 2, and 3, one right after another.

  - **map**

    ```
    import { of, map } from 'rxjs';

    of(1, 2, 3)
      .pipe(map((x) => x * x))
      .subscribe((v) => console.log(`value: ${v}`));

    // Logs:
    // value: 1
    // value: 4
    // value: 9
    ```

  - **first**

    ```
    import { of, first } from 'rxjs';

    of(1, 2, 3)
      .pipe(first())
      .subscribe((v) => console.log(`value: ${v}`));

    // Logs:
    // value: 1
    ```

  - Piping

    - Pipeable operators are functions, so they could be used like ordinary functions: op()(obs) — but in practice, there tend to be many of them convolved together, and quickly become unreadable: op4()(op3()(op2()(op1()(obs)))). For that reason, Observables have a method called .pipe() that accomplishes the same thing while being much easier to read:

    ```
    obs.pipe(op1(), op2(), op3(), op4());
    ```

### Higher-order Observables

- Observables most commonly emit ordinary values like strings and numbers, but surprisingly often, it is necessary to handle Observables of Observables, so-called higher-order Observables. For example, imagine you had an Observable emitting strings that were the URLs of files you wanted to see. The code might look like this:

  ```
  const fileObservable = urlObservable.pipe(map((url) => http.get(url)));
  ```

- How do you work with a higher-order Observable?

  - Typically, by flattening: by (somehow) converting a higher-order Observable into an ordinary Observable. For example:

    ```
    const fileObservable = urlObservable.pipe(
      map((url) => http.get(url)),
      concatAll()
    );
    ```

  - Flattening operators(called join operators):

    - **concatAll()**

      - The concatAll() operator subscribes to each "inner" Observable that comes out of the "outer" Observable, and copies all the emitted values until that Observable completes, and goes on to the next one. All of the values are in that way concatenated.

    - **mergeAll()** — subscribes to each inner Observable as it arrives, then emits each value as it arrives

    - **switchAll()** — subscribes to the first inner Observable when it arrives, and emits each value as it arrives, but when the next inner Observable arrives, unsubscribes to the previous one, and subscribes to the new one.

    - **exhaustAll()** — subscribes to the first inner Observable when it arrives, and emits each value as it arrives, discarding all newly arriving inner Observables until that first one completes, then waits for the next inner Observable.

  - Just as many array libraries combine map() and flat() (or flatten()) into a single flatMap(), there are mapping equivalents of all the RxJS flattening operators concatMap(), mergeMap(), switchMap(), and exhaustMap().

## Subject

- What is a Subject?

  - An RxJS Subject is a special type of Observable that allows values to be multicasted to many Observers. While plain Observables are unicast (each subscribed Observer owns an independent execution of the Observable), Subjects are multicast.

  - A Subject is like an Observable, but can multicast to many Observers. Subjects are like EventEmitters: they maintain a registry of many listeners.

- Every Subject is an Observable.

  - Given a Subject, you can subscribe to it, providing an Observer, which will start receiving values normally. From the perspective of the Observer, it cannot tell whether the Observable execution is coming from a plain unicast Observable or a Subject.

  - Internally to the Subject, subscribe does not invoke a new execution that delivers values. It simply registers the given Observer in a list of Observers, similarly to how addListener usually works in other libraries and languages.

- Every Subject is an Observer.

  - It is an object with the methods next(v), error(e), and complete(). To feed a new value to the Subject, just call next(theValue), and it will be multicasted to the Observers registered to listen to the Subject.

- Example:

  ```
  import { Subject } from 'rxjs';

  const subject = new Subject<number>();

  subject.subscribe({
    next: (v) => console.log(`observerA: ${v}`),
  });
  subject.subscribe({
    next: (v) => console.log(`observerB: ${v}`),
  });

  subject.next(1);
  subject.next(2);

  // Logs:
  // observerA: 1
  // observerB: 1
  // observerA: 2
  // observerB: 2
  ```

  - Since a Subject is an Observer, this also means you may provide a Subject as the argument to the subscribe of any Observable, like the example below shows:

    ```
    import { Subject, from } from 'rxjs';

    const subject = new Subject<number>();

    subject.subscribe({
      next: (v) => console.log(`observerA: ${v}`),
    });
    subject.subscribe({
      next: (v) => console.log(`observerB: ${v}`),
    });

    const observable = from([1, 2, 3]);

    observable.subscribe(subject); // You can subscribe providing a Subject

    // Logs:
    // observerA: 1
    // observerB: 1
    // observerA: 2
    // observerB: 2
    // observerA: 3
    // observerB: 3
    ```

- With the approach above, we essentially just converted a unicast Observable execution to multicast, through the Subject. This demonstrates how Subjects are the only way of making any Observable execution be shared to multiple Observers.

  - There are also a few specializations of the Subject type: **BehaviorSubject**, **ReplaySubject**, and **AsyncSubject**.

### BehaviorSubject

- One of the variants of Subjects is the BehaviorSubject, which has a notion of "the current value". It stores the latest value emitted to its consumers, and whenever a new Observer subscribes, it will immediately receive the "current value" from the BehaviorSubject.

- BehaviorSubjects are useful for representing "values over time". For instance, an event stream of birthdays is a Subject, but the stream of a person's age would be a BehaviorSubject.

  ```
  import { BehaviorSubject } from 'rxjs';
  const subject = new BehaviorSubject(0); // 0 is the initial value

  subject.subscribe({
    next: (v) => console.log(`observerA: ${v}`),
  });

  subject.next(1);
  subject.next(2);

  subject.subscribe({
    next: (v) => console.log(`observerB: ${v}`),
  });

  subject.next(3);

  // Logs
  // observerA: 0
  // observerA: 1
  // observerA: 2
  // observerB: 2
  // observerA: 3
  // observerB: 3
  ```

### ReplaySubject

- A ReplaySubject is similar to a BehaviorSubject in that it can send old values to new subscribers, but it can also record a part of the Observable execution.

- A ReplaySubject records multiple values from the Observable execution and replays them to new subscribers.

- When creating a ReplaySubject, you can specify how many values to replay:

  ```
  import { ReplaySubject } from 'rxjs';
  const subject = new ReplaySubject(3); // buffer 3 values for new subscribers

  subject.subscribe({
    next: (v) => console.log(`observerA: ${v}`),
  });

  subject.next(1);
  subject.next(2);
  subject.next(3);
  subject.next(4);

  subject.subscribe({
    next: (v) => console.log(`observerB: ${v}`),
  });

  subject.next(5);

  // Logs:
  // observerA: 1
  // observerA: 2
  // observerA: 3
  // observerA: 4
  // observerB: 2
  // observerB: 3
  // observerB: 4
  // observerA: 5
  // observerB: 5
  ```

- You can also specify a window time in milliseconds, besides of the buffer size, to determine how old the recorded values can be. In the following example we use a large buffer size of 100, but a window time parameter of just 500 milliseconds.

  ```
  import { ReplaySubject } from 'rxjs';
  const subject = new ReplaySubject(100, 500 /* windowTime */);

  subject.subscribe({
    next: (v) => console.log(`observerA: ${v}`),
  });

  let i = 1;
  setInterval(() => subject.next(i++), 200);

  setTimeout(() => {
    subject.subscribe({
      next: (v) => console.log(`observerB: ${v}`),
    });
  }, 1000);

  // Logs
  // observerA: 1
  // observerA: 2
  // observerA: 3
  // observerA: 4
  // observerA: 5
  // observerB: 3
  // observerB: 4
  // observerB: 5
  // observerA: 6
  // observerB: 6
  // ...
  ```

### AsyncSubject

- The AsyncSubject is a variant where only the last value of the Observable execution is sent to its observers, and only when the execution completes.

  ```
  import { AsyncSubject } from 'rxjs';
  const subject = new AsyncSubject();

  subject.subscribe({
    next: (v) => console.log(`observerA: ${v}`),
  });

  subject.next(1);
  subject.next(2);
  subject.next(3);
  subject.next(4);

  subject.subscribe({
    next: (v) => console.log(`observerB: ${v}`),
  });

  subject.next(5);
  subject.complete();

  // Logs:
  // observerA: 5
  // observerB: 5
  ```

- The AsyncSubject is similar to the last() operator, in that it waits for the complete notification in order to deliver a single value.

### Void subject

- Sometimes the emitted value doesn't matter as much as the fact that a value was emitted.

  - For instance, the code below signals that one second has passed.
    ```
    const subject = new Subject<string>();
    setTimeout(() => subject.next('dummy'), 1000);
    ```
  - Passing a dummy value this way is clumsy and can confuse users.

- By declaring a void subject, you signal that the value is irrelevant. Only the event itself matters.

  ```
  const subject = new Subject<void>();
  setTimeout(() => subject.next(), 1000);
  ```

- A complete example with context is shown below:

  ```
  import { Subject } from 'rxjs';

  const subject = new Subject(); // Shorthand for Subject<void>

  subject.subscribe({
    next: () => console.log('One second has passed'),
  });

  setTimeout(() => subject.next(), 1000);
  ```
