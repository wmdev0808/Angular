# Animations

## Introduction

- Animation provides the illusion of motion: HTML elements change styling over time. Well-designed animations can make your application more fun and straightforward to use, but they aren't just cosmetic. Animations can improve your application and user experience in a number of ways:

- Without animations, web page transitions can seem abrupt and jarring
  Motion greatly enhances the user experience, so animations give users a chance to detect the application's response to their actions
  Good animations intuitively call the user's attention to where it is needed
  Typically, animations involve multiple style transformations over time. An HTML element can move, change color, grow or shrink, fade, or slide off the page. These changes can occur simultaneously or sequentially. You can control the timing of each transformation.

- Angular's animation system is built on CSS functionality, which means you can animate any property that the browser considers animatable. This includes positions, sizes, transforms, colors, borders, and more. The W3C maintains a list of animatable properties on its CSS Transitions page.

### Getting started

#### Step 1: Enabling the animations module

- Import `BrowserAnimationsModule`, which introduces the animation capabilities into your Angular root application module.

  - src/app/app.module.ts

    ```
    import { NgModule } from '@angular/core';
    import { BrowserModule } from '@angular/platform-browser';
    import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

    @NgModule({
      imports: [
        BrowserModule,
        BrowserAnimationsModule
      ],
      declarations: [ ],
      bootstrap: [ ]
    })
    export class AppModule { }
    ```

#### Step 2: Importing animation functions into component files

- If you plan to use specific animation functions in component files, import those functions from `@angular/animations`.

  - src/app/app.component.ts
    ```
    import { Component, HostBinding } from '@angular/core';
    import {
      trigger,
      state,
      style,
      animate,
      transition,
      // ...
    } from '@angular/animations';
    ```

#### Step 3: Adding the animation metadata property

- In the component file, add a metadata property called `animations`: within the `@Component()` decorator. You put the trigger that defines an animation within the `animations` metadata property.

  - src/app/app.component.ts
    ```
    @Component({
      selector: 'app-root',
      templateUrl: 'app.component.html',
      styleUrls: ['app.component.css'],
      animations: [
        // animation triggers go here
      ]
    })
    ```

### Animating a transition

- Let's animate a transition that changes a single HTML element from one state to another. For example, you can specify that a button displays either **Open** or **Closed** based on the user's last action. When the button is in the open state, it's visible and yellow. When it's the closed state, it's translucent and blue.

- In HTML, these attributes are set using ordinary CSS styles such as color and opacity. In Angular, use the `style()` function to specify a set of CSS styles for use with animations. Collect a set of styles in an animation state, and give the state a name, such as `open` or `closed`.

#### Animation state and styles

- Use Angular's `state()` function to define different states to call at the end of each transition. This function takes two arguments: A unique name like `open` or `closed` and a `style()` function.

- Use the `style()` function to define a set of styles to associate with a given state name. You must use _camelCase_ for style attributes that contain dashes, such as `backgroundColor` or wrap them in quotes, such as `'background-color'`.

- Let's see how Angular's `state()` function works with the style⁣­(⁠) function to set CSS style attributes. In this code snippet, multiple style attributes are set at the same time for the state. In the `open` state, the button has a height of 200 pixels, an opacity of 1, and a yellow background color.

  - src/app/open-close.component.ts
    ```
    // ...
    state('open', style({
      height: '200px',
      opacity: 1,
      backgroundColor: 'yellow'
    })),
    ```

- In the following `closed` state, the button has a height of 100 pixels, an opacity of 0.8, and a background color of blue.

  - src/app/open-close.component.ts
    ```
    state('closed', style({
      height: '100px',
      opacity: 0.8,
      backgroundColor: 'blue'
    })),
    ```

#### Transitions and timing

- In Angular, you can set multiple styles without any animation. However, without further refinement, the button instantly transforms with no fade, no shrinkage, or other visible indicator that a change is occurring.

- To make the change less abrupt, you need to define an animation transition to specify the changes that occur between one state and another over a period of time. The `transition()` function accepts two arguments: The first argument accepts an expression that defines the direction between two transition states, and the second argument accepts one or a series of `animate()` steps.

- Use the `animate()` function to define the length, delay, and easing of a transition, and to designate the style function for defining styles while transitions are taking place. Use the `animate()` function to define the `keyframes()` function for multi-step animations. These definitions are placed in the second argument of the `animate()` function.

- Animation metadata: duration, delay, and easing

  - The `animate()` function (second argument of the transition function) accepts the `timings` and `styles` input parameters.

  - The `timings` parameter takes either a number or a string defined in three parts.

    ```
    animate (duration)
    ```

  - Or

    ```
    animate ('duration delay easing')
    ```

  - The first part, duration, is required. The duration can be expressed in milliseconds as a number without quotes, or in seconds with quotes and a time specifier. For example, a duration of a tenth of a second can be expressed as follows:

    - As a plain number, in milliseconds: `100`

    - In a string, as milliseconds: `'100ms'`

    - In a string, as seconds: `'0.1s'`

  - The second argument, `delay`, has the same syntax as duration. For example:

    - Wait for 100ms and then run for 200ms: `'0.2s 100ms'`

  - The third argument, `easing`, controls how the animation accelerates and decelerates during its runtime. For example, `ease-in` causes the animation to begin slowly, and to pick up speed as it progresses.

    - Wait for 100ms, run for 200ms. Use a deceleration curve to start out fast and slowly decelerate to a resting point: `'0.2s 100ms ease-out'`

    - Run for 200ms, with no delay. Use a standard curve to start slow, accelerate in the middle, and then decelerate slowly at the end: `'0.2s ease-in-out'`

    - Start immediately, run for 200ms. Use an acceleration curve to start slow and end at full velocity: `'0.2s ease-in'`

  - This example provides a state transition from `open` to `closed` with a 1-second transition between states.

    - src/app/open-close.component.ts

      ```
      transition('open => closed', [
        animate('1s')
      ]),
      ```

    - In the preceding code snippet, the `=>` operator indicates unidirectional transitions, and `<=>` is bidirectional. Within the transition, `animate()` specifies how long the transition takes. In this case, the state change from `open` to `closed` takes 1 second, expressed here as `1s`.

  - This example adds a state transition from the `closed` state to the `open` state with a 0.5-second transition animation arc.

    - src/app/open-close.component.ts
      ```
      transition('closed => open', [
        animate('0.5s')
      ]),
      ```

- NOTE:
  Some additional notes on using styles within `state` and `transition` functions.

  - Use `state()` to define styles that are applied at the end of each transition, they persist after the animation completes

  - Use `transition()` to define intermediate styles, which create the illusion of motion during the animation

  - When animations are disabled, `transition()` styles can be skipped, but `state()` styles can't

  - Include multiple state pairs within the same `transition()` argument:
    ```
    transition( 'on => off, off => void' )
    ```

#### Triggering the animation

- An animation requires a trigger, so that it knows when to start. The `trigger()` function collects the states and transitions, and gives the animation a name, so that you can attach it to the triggering element in the HTML template.

- The `trigger()` function describes the property name to watch for changes. When a change occurs, the trigger initiates the actions included in its definition. These actions can be transitions or other functions, as we'll see later on.

- In this example, we'll name the trigger `openClose`, and attach it to the button element. The trigger describes the open and closed states, and the timings for the two transitions.

- NOTE:
  - Within each `trigger()` function call, an element can only be in one state at any given time. However, it's possible for multiple triggers to be active at once.

#### Defining animations and attaching them to the HTML template

- Animations are defined in the metadata of the component that controls the HTML element to be animated. Put the code that defines your animations under the `animations:` property within the `@Component()` decorator.

  - src/app/open-close.component.ts

    ```
    @Component({
      selector: 'app-open-close',
      animations: [
        trigger('openClose', [
          // ...
          state('open', style({
            height: '200px',
            opacity: 1,
            backgroundColor: 'yellow'
          })),
          state('closed', style({
            height: '100px',
            opacity: 0.8,
            backgroundColor: 'blue'
          })),
          transition('open => closed', [
            animate('1s')
          ]),
          transition('closed => open', [
            animate('0.5s')
          ]),
        ]),
      ],
      templateUrl: 'open-close.component.html',
      styleUrls: ['open-close.component.css']
    })
    export class OpenCloseComponent {
      isOpen = true;

      toggle() {
        this.isOpen = !this.isOpen;
      }

    }
    ```

- When you've defined an animation trigger for a component, attach it to an element in that component's template by wrapping the trigger name in brackets and preceding it with an `@` symbol. Then, you can bind the trigger to a template expression using standard Angular property binding syntax as shown below, where `triggerName` is the name of the trigger, and `expression` evaluates to a defined animation state.

  ```
  <div [@triggerName]="expression">…</div>;
  ```

- The animation is executed or triggered when the expression value changes to a new state.

- The following code snippet binds the trigger to the value of the `isOpen` property.

  - src/app/open-close.component.html

    ```
    <nav>
      <button type="button" (click)="toggle()">Toggle Open/Close</button>
    </nav>

    <div [@openClose]="isOpen ? 'open' : 'closed'" class="open-close-container">
      <p>The box is now {{ isOpen ? 'Open' : 'Closed' }}!</p>
    </div>
    ```

  - In this example, when the `isOpen` expression evaluates to a defined state of `open` or `closed`, it notifies the trigger `openClose` of a state change. Then it's up to the `openClose` code to handle the state change and kick off a state change animation.

- For elements entering or leaving a page (inserted or removed from the DOM), you can make the animations conditional. For example, use \*ngIf with the animation trigger in the HTML template.

- NOTE:

  - In the component file, set the trigger that defines the animations as the value of the `animations:` property in the `@Component()` decorator.

  - In the HTML template file, use the trigger name to attach the defined animations to the HTML element to be animated.

### Animations API summary

- The functional API provided by the `@angular/animations` module provides a domain-specific language (DSL) for creating and controlling animations in Angular applications.

  | FUNCTION NAME  | WHAT IT DOES                                                                                                                                                                                                |
  | -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
  | trigger()      | Kicks off the animation and serves as a container for all other animation function calls. HTML template binds to `triggerName`. Use the first argument to declare a unique trigger name. Uses array syntax. |
  | style()        | Defines one or more CSS styles to use in animations. Controls the visual appearance of HTML elements during animations. Uses object syntax.                                                                 |
  | state()        | Creates a named set of CSS styles that should be applied on successful transition to a given state. The state can then be referenced by name within other animation functions.                              |
  | animate()      | Specifies the timing information for a transition. Optional values for delay and easing. Can contain `style()` calls within.                                                                                |
  | transition()   | Defines the animation sequence between two named states. Uses array syntax.                                                                                                                                 |
  | keyframes()    | Allows a sequential change between styles within a specified time interval. Use within `animate()`. Can include multiple `style()` calls within each keyframe(). Uses array syntax.                         |
  | group()        | Specifies a group of animation steps (inner animations) to be run in parallel. Animation continues only after all inner animation steps have completed. Used within `sequence()` or `transition()`.         |
  | query()        | Finds one or more inner HTML elements within the current element.                                                                                                                                           |
  | sequence()     | Specifies a list of animation steps that are run sequentially, one by one.                                                                                                                                  |
  | stagger()      | Staggers the starting time for animations for multiple elements.                                                                                                                                            |
  | animation()    | Produces a reusable animation that can be invoked from elsewhere. Used together with `useAnimation()`.                                                                                                      |
  | useAnimation() | Activates a reusable animation. Used with `animation()`.                                                                                                                                                    |
  | animateChild() | Allows animations on child components to be run within the same timeframe as the parent.                                                                                                                    |

## Transition and Triggers

- This guide goes into greater depth on special transition states such as `*` (wildcard) and `void`, and shows how these special states are used for elements entering and leaving a view. This chapter also explores multiple animation triggers, animation callbacks, and sequence-based animation using keyframes.

### Predefined states and wildcard matching

- In Angular, transition states can be defined explicitly through the `state()` function, or using the predefined `*` (wildcard) and `void` states.

#### Wildcard state

- An asterisk `*` or _wildcard_ matches any animation state. This is useful for defining transitions that apply regardless of the HTML element's start or end state.

- For example, a transition of `open => *` applies when the element's state changes from `open` to anything else.

  ![](https://angular.io/generated/images/guide/animations/wildcard-state-500.png)

- The following is another code sample using the wildcard state together with the previous example using the `open` and `closed` states. Instead of defining each state-to-state transition pair, any transition to `closed` takes 1 second, and any transition to `open` takes 0.5 seconds.

  - src/app/open-close.component.ts
    ```
    animations: [
      trigger('openClose', [
        // ...
        state('open', style({
          height: '200px',
          opacity: 1,
          backgroundColor: 'yellow'
        })),
        state('closed', style({
          height: '100px',
          opacity: 0.8,
          backgroundColor: 'blue'
        })),
        transition('* => closed', [
          animate('1s')
        ]),
        transition('* => open', [
          animate('0.5s')
        ]),
      ]),
    ],
    ```

- Use a double arrow syntax to specify state-to-state transitions in both directions.
  - src/app/open-close.component.ts
    ```
    transition('open <=> closed', [
      animate('0.5s')
    ]),
    ```

#### Using wildcard state with multiple transition states

- In the two-state button example, the wildcard isn't that useful because there are only two possible states, `open` and `closed`. In general, use wildcard states when an element in one particular state has multiple potential states that it can change to. If the button can change from `open` to either `closed` or something like `inProgress`, using a wildcard state could reduce the amount of coding needed.

  ![](https://angular.io/generated/images/guide/animations/wildcard-3-states.png)

  - src/app/open-close.component.ts

    ```
    animations: [
      trigger('openClose', [
        // ...
        state('open', style({
          height: '200px',
          opacity: 1,
          backgroundColor: 'yellow'
        })),
        state('closed', style({
          height: '100px',
          opacity: 0.8,
          backgroundColor: 'blue'
        })),
        transition('open => closed', [
          animate('1s')
        ]),
        transition('closed => open', [
          animate('0.5s')
        ]),
        transition('* => closed', [
          animate('1s')
        ]),
        transition('* => open', [
          animate('0.5s')
        ]),
        transition('open <=> closed', [
          animate('0.5s')
        ]),
        transition ('* => open', [
          animate ('1s',
            style ({ opacity: '*' }),
          ),
        ]),
        transition('* => *', [
          animate('1s')
        ]),
    ```

  - The `* => *` transition applies when any change between two states takes place.

  - Transitions are matched in the order in which they are defined. Thus, you can apply other transitions on top of the `* => *` (any-to-any) transition. For example, define style changes or animations that would apply just to `open => closed`, or just to `closed => open`, and then use `* => *` as a fallback for state pairings that aren't otherwise called out.

  - To do this, list the more specific transitions before `* => *`.

#### Using wildcards with styles

- Use the wildcard `*` with a style to tell the animation to use whatever the current style value is, and animate with that. Wildcard is a fallback value that's used if the state being animated isn't declared within the trigger.

  - src/app/open-close.component.ts
    ```
    transition ('* => open', [
      animate ('1s',
        style ({ opacity: '*' }),
      ),
    ]),
    ```

#### Void state

- Use the `void` state to configure transitions for an element that is entering or leaving a page.

#### Combining wildcard and void states

- Combine wildcard and void states in a transition to trigger animations that enter and leave the page:

  - A transition of `* => void` applies when the element leaves a view, regardless of what state it was in before it left

  - A transition of `void => *` applies when the element enters a view, regardless of what state it assumes when entering

  - The wildcard state `*` matches to any state, including `void`

### Animating entering and leaving a view

- Add a new behavior:

  - When you add a hero to the list of heroes, it appears to fly onto the page from the left

  - When you remove a hero from the list, it appears to fly out to the right

  - src/app/hero-list-enter-leave.component.ts

    ```
    animations: [
      trigger('flyInOut', [
        state('in', style({ transform: 'translateX(0)' })),
        transition('void => *', [
          style({ transform: 'translateX(-100%)' }),
          animate(100)
        ]),
        transition('* => void', [
          animate(100, style({ transform: 'translateX(100%)' }))
        ])
      ])
    ]
    ```

  - In the preceding code, you applied the void state when the HTML element isn't attached to a view.

#### :enter and :leave aliases

- `:enter` and `:leave` are aliases for the `void => *` and `* => void` transitions. These aliases are used by several animation functions.
  ```
  transition ( ':enter', [ … ] );  // alias for void => *
  transition ( ':leave', [ … ] );  // alias for * => void
  ```
- It's harder to target an element that is entering a view because it isn't in the DOM yet. So, use the aliases `:enter` and `:leave` to target HTML elements that are inserted or removed from a view.

- Use of *ngIf and *ngFor with :enter and :leave

  - The `:enter` transition runs when any `*ngIf` or `*ngFor` views are placed on the page, and `:leave` runs when those views are removed from the page.

  - NOTE:

    - Entering/leaving behaviors can sometime be confusing. As a rule of thumb consider that any element being added to the DOM by Angular passes via the `:enter` transition, but only elements being directly removed from the DOM by Angular pass via the `:leave` transition (For example, an element's view is removed from the DOM because its parent is being removed from the DOM or the app's route has changed, then the element will not pass via the `:leave` transition).

  - This example has a special trigger for the enter and leave animation called `myInsertRemoveTrigger`. The HTML template contains the following code.

    - src/app/insert-remove.component.html
      ```
      <div @myInsertRemoveTrigger *ngIf="isShown" class="insert-remove-container">
        <p>The box is inserted</p>
      </div>
      ```

  - In the component file, the `:enter` transition sets an initial opacity of 0, and then animates it to change that opacity to 1 as the element is inserted into the view.

    - src/app/insert-remove.component.ts

      ```
      trigger('myInsertRemoveTrigger', [
        transition(':enter', [
          style({ opacity: 0 }),
          animate('100ms', style({ opacity: 1 })),
        ]),
        transition(':leave', [
          animate('100ms', style({ opacity: 0 }))
        ])
      ]),
      ```

    - Note that this example doesn't need to use `state()`.

#### :increment and :decrement in transitions

- The `transition()` function takes additional selector values, `:increment` and `:decrement`. Use these to kick off a transition when a numeric value has increased or decreased in value.

  - src/app/hero-list-page.component.ts
    ```
    trigger('filterAnimation', [
      transition(':enter, * => 0, * => -1', []),
      transition(':increment', [
        query(':enter', [
          style({ opacity: 0, width: 0 }),
          stagger(50, [
            animate('300ms ease-out', style({ opacity: 1, width: '*' })),
          ]),
        ], { optional: true })
      ]),
      transition(':decrement', [
        query(':leave', [
          stagger(50, [
            animate('300ms ease-out', style({ opacity: 0, width: 0 })),
          ]),
        ])
      ]),
    ]),
    ```

### Boolean values in transitions

- If a trigger contains a boolean value as a binding value, then this value can be matched using a `transition()` expression that compares `true` and `false`, or `1` and `0`.

  - src/app/open-close.component.html

    ```
    <div [@openClose]="isOpen ? true : false" class="open-close-container">
    </div>
    ```

  - In the code snippet above, the HTML template binds a `<div>` element to a trigger named `openClose` with a status expression of `isOpen`, and with possible values of `true` and `false`. This pattern is an alternative to the practice of creating two named states like `open` and `close`.

- In the component code, inside the `@Component` metadata under the `animations:` property, when the state evaluates to `true` (meaning "open" here), the associated HTML element's height is a wildcard style or default. In this case, the animation uses whatever height the element already had before the animation started. When the element is "closed", the element gets animated to a height of 0, which makes it invisible.

  - src/app/open-close.component.ts
    ```
    animations: [
      trigger('openClose', [
        state('true', style({ height: '*' })),
        state('false', style({ height: '0px' })),
        transition('false <=> true', animate(500))
      ])
    ],
    ```

### Multiple animation triggers

- You can define more than one animation trigger for a component. Attach animation triggers to different elements, and the parent-child relationships among the elements affect how and when the animations run.

#### Parent-child animations

- Each time an animation is triggered in Angular, the parent animation always gets priority and child animations are blocked. For a child animation to run, the parent animation must query each of the elements containing child animations and then let the animations run using the `animateChild()` function.

- Disabling an animation on an HTML element

  - A special animation control binding called `@.disabled` can be placed on an HTML element to disable animations on that element, as well as any nested elements. When true, the `@.disabled` binding prevents all animations from rendering.

  - src/app/open-close.component.html

    ```
    <div [@.disabled]="isDisabled">
      <div [@childAnimation]="isOpen ? 'open' : 'closed'"
        class="open-close-container">
        <p>The box is now {{ isOpen ? 'Open' : 'Closed' }}!</p>
      </div>
    </div>
    ```

  - src/app/open-close.component.ts

    ```
    @Component({
      animations: [
        trigger('childAnimation', [
          // ...
        ]),
      ],
    })
    export class OpenCloseChildComponent {
      isDisabled = false;
      isOpen = false;
    }
    ```

  - When the `@.disabled` binding is true, the `@childAnimation` trigger doesn't kick off.

  - When an element within an HTML template has animations disabled using the `@.disabled` host binding, animations are disabled on all inner elements as well. You can't selectively disable multiple animations on a single element.

  - However, selective child animations can still be run on a disabled parent in one of the following ways:

    - A parent animation can use the `query()` function to collect inner elements located in disabled areas of the HTML template. Those elements can still animate.

    - A child animation can be queried by a parent and then later animated with the `animateChild()` function

- Disabling all animations

  - To disable all animations for an Angular app, place the `@.disabled` host binding on the topmost Angular component.

    - src/app/app.component.ts
      ```
      @Component({
        selector: 'app-root',
        templateUrl: 'app.component.html',
        styleUrls: ['app.component.css'],
        animations: [
          slideInAnimation
        ]
      })
      export class AppComponent {
        @HostBinding('@.disabled')
        public animationsDisabled = false;
      }
      ```

  - NOTE:
    - Disabling animations application-wide is useful during end-to-end (E2E) testing.

### Animation callbacks

- The animation `trigger()` function emits callbacks when it starts and when it finishes. The following example features a component that contains an `openClose` trigger.

  - src/app/open-close.component.ts
    ```
    @Component({
      selector: 'app-open-close',
      animations: [
        trigger('openClose', [
          // ...
        ]),
      ],
      templateUrl: 'open-close.component.html',
      styleUrls: ['open-close.component.css']
    })
    export class OpenCloseComponent {
      onAnimationEvent(event: AnimationEvent) {
      }
    }
    ```

- In the HTML template, the animation event is passed back via `$event`, as `@triggerName.start` and `@triggerName.done`, where `triggerName` is the name of the trigger being used. In this example, the trigger `openClose` appears as follows.

  - src/app/open-close.component.html
    ```
    <div [@openClose]="isOpen ? 'open' : 'closed'"
        (@openClose.start)="onAnimationEvent($event)"
        (@openClose.done)="onAnimationEvent($event)"
        class="open-close-container">
    </div>
    ```

- A potential use for animation callbacks could be to cover for a slow API call, such as a database lookup. For example, you could set up the InProgress button to have its own looping animation where it pulsates or does some other visual motion while the backend system operation finishes.

- Then, another animation can be called when the current animation finishes. For example, the button goes from the `inProgress` state to the `closed` state when the API call is completed.

- An animation can influence an end user to perceive the operation as faster, even when it isn't. Thus, a simple animation can be a cost-effective way to keep users happy, rather than seeking to improve the speed of a server call and having to compensate for circumstances beyond your control, such as an unreliable network connection.

- Callbacks can serve as a debugging tool, for example in conjunction with `console.warn()` to view the application's progress in a browser's Developer JavaScript Console. The following code snippet creates console log output for the original example, a button with the two states of open and closed.

  - src/app/open-close.component.ts

    ```
    export class OpenCloseComponent {
      onAnimationEvent(event: AnimationEvent) {
        // openClose is trigger name in this example
        console.warn(`Animation Trigger: ${event.triggerName}`);

        // phaseName is "start" or "done"
        console.warn(`Phase: ${event.phaseName}`);

        // in our example, totalTime is 1000 (number of milliseconds in a second)
        console.warn(`Total time: ${event.totalTime}`);

        // in our example, fromState is either "open" or "closed"
        console.warn(`From: ${event.fromState}`);

        // in our example, toState either "open" or "closed"
        console.warn(`To: ${event.toState}`);

        // the HTML element itself, the button in this case
        console.warn(`Element: ${event.element}`);
      }
    }
    ```

### Keyframes

- The previous section features a simple two-state transition. Let's now create an animation with multiple steps run in sequence using _keyframes_.

- Angular's `keyframe()` function is similar to keyframes in CSS. Keyframes allow several style changes within a single timing segment. For example, the button, instead of fading, could change color several times over a single 2-second timespan.

  ![](https://angular.io/generated/images/guide/animations/keyframes-500.png)

- The code for this color change might look like this.
  - src/app/status-slider.component.ts
    ```
    transition('* => active', [
      animate('2s', keyframes([
        style({ backgroundColor: 'blue' }),
        style({ backgroundColor: 'red' }),
        style({ backgroundColor: 'orange' })
      ]))
    ```

#### Offset

- Keyframes include an offset that defines the point in the animation where each style change occurs. Offsets are relative measures from zero to one, marking the beginning and end of the animation, respectively and should be applied to each of the keyframe's steps if used at least once.

- Defining offsets for keyframes is optional. If you omit them, evenly spaced offsets are automatically assigned. For example, three keyframes without predefined offsets receive offsets of 0, 0.5, and 1. Specifying an offset of 0.8 for the middle transition in the preceding example might look like this.

  ![](https://angular.io/generated/images/guide/animations/keyframes-offset-500.png)

  - The code with offsets specified would be as follows.
    - src/app/status-slider.component.ts
      ```
      transition('* => active', [
        animate('2s', keyframes([
          style({ backgroundColor: 'blue', offset: 0}),
          style({ backgroundColor: 'red', offset: 0.8}),
          style({ backgroundColor: '#754600', offset: 1.0})
        ])),
      ]),
      transition('* => inactive', [
        animate('2s', keyframes([
          style({ backgroundColor: '#754600', offset: 0}),
          style({ backgroundColor: 'red', offset: 0.2}),
          style({ backgroundColor: 'blue', offset: 1.0})
        ]))
      ]),
      ```

- You can combine keyframes with `duration`, `delay`, and `easing` within a single animation.

#### Keyframes with a pulsation

- Use keyframes to create a pulse effect in your animations by defining styles at specific offset throughout the animation.

- Here's an example of using keyframes to create a pulse effect:

  - The original open and closed states, with the original changes in height, color, and opacity, occurring over a timeframe of 1 second

  - A keyframes sequence inserted in the middle that causes the button to appear to pulsate irregularly over the course of that same 1-second timeframe

  ![](https://angular.io/generated/images/guide/animations/keyframes-pulsation.png)

  - The code snippet for this animation might look like this.
    - src/app/open-close.component.ts
      ```
      trigger('openClose', [
        state('open', style({
          height: '200px',
          opacity: 1,
          backgroundColor: 'yellow'
        })),
        state('close', style({
          height: '100px',
          opacity: 0.5,
          backgroundColor: 'green'
        })),
        // ...
        transition('* => *', [
          animate('1s', keyframes ( [
            style({ opacity: 0.1, offset: 0.1 }),
            style({ opacity: 0.6, offset: 0.2 }),
            style({ opacity: 1,   offset: 0.5 }),
            style({ opacity: 0.2, offset: 0.7 })
          ]))
        ])
      ])
      ```

#### Animatable properties and units

- Angular animations support builds on top of web animations, so you can animate any property that the browser considers animatable. This includes positions, sizes, transforms, colors, borders, and more. The W3C maintains a list of animatable properties on its [CSS Transitions](https://www.w3.org/TR/css-transitions-1) page.

- For properties with a numeric value, define a unit by providing the value as a string, in quotes, with the appropriate suffix:

  - 50 pixels: '50px'

  - Relative font size: '3em'

  - Percentage: '100%'

- You can also provide the value as a number (thus not providing a unit), in such cases Angular assumes a default unit of pixels, or px. Expressing 50 pixels as 50 is the same as saying '50px'.

- NOTE:
  - The string "50" would instead be considered invalid).

#### Automatic property calculation with wildcards

- Sometimes you don't know the value of a dimensional style property until runtime. For example, elements often have widths and heights that depend on their content or the screen size. These properties are often challenging to animate using CSS.

- In these cases, you can use a special wildcard \* property value under style(), so that the value of that particular style property is computed at runtime and then plugged into the animation.

- The following example has a trigger called shrinkOut, used when an HTML element leaves the page. The animation takes whatever height the element has before it leaves, and animates from that height to zero.

  - src/app/hero-list-auto.component.ts
    ```
    animations: [
      trigger('shrinkOut', [
        state('in', style({ height: '*' })),
        transition('* => void', [
          style({ height: '*' }),
          animate(250, style({ height: 0 }))
        ])
      ])
    ]
    ```

#### Keyframes summary

- The `keyframes()` function in Angular allows you to specify multiple interim styles within a single transition, with an optional `offset` to define the point in the animation where each style change should occur.

More on Angular animations

## Complex Sequences

- So far, we've learned simple animations of single HTML elements. Angular also lets you animate coordinated sequences, such as an entire grid or list of elements as they enter and leave a page. You can choose to run multiple animations in parallel, or run discrete animations sequentially, one following another.

- The functions that control complex animation sequences are:

  | FUNCTIONS  | DETAILS                                                        |
  | ---------- | -------------------------------------------------------------- |
  | query()    | Finds one or more inner HTML elements.                         |
  | stagger()  | Applies a cascading delay to animations for multiple elements. |
  | group()    | Runs multiple animation steps in parallel.                     |
  | sequence() | Runs animation steps one after another.                        |

### The query() function

- Most complex animations rely on the `query()` function to find child elements and apply animations to them, basic examples of such are:

  | EXAMPLES                               | DETAILS                                                                                                                                                                                             |
  | -------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
  | `query()` followed by `animate()`      | Used to query simple HTML elements and directly apply animations to them.                                                                                                                           |
  | `query()` followed by `animateChild()` | Used to query child elements, which themselves have animations metadata applied to them and trigger such animation (which would be otherwise be blocked by the current/parent element's animation). |

- The first argument of `query()` is a [css selector](https://developer.mozilla.org/docs/Web/CSS/CSS_Selectors) string which can also contain the following Angular-specific tokens:

  | TOKENS           | DETAILS                                      |
  | ---------------- | -------------------------------------------- |
  | :enter :leave    | For entering/leaving elements.               |
  | :animating       | For elements currently animating.            |
  | @\* @triggerName | For elements with any—or a specific—trigger. |
  | :self            | The animating element itself.                |

- ENTERING AND LEAVING ELEMENTS
  - Not all child elements are actually considered as entering/leaving; this can, at times, be counterintuitive and confusing. Please see the [query api docs](https://angular.io/api/animations/query#entering-and-leaving-elements) for more information.

### Animate multiple elements using query() and stagger() functions

- After having queried child elements via `query()`, the `stagger()` function lets you define a timing gap between each queried item that is animated and thus animates elements with a delay between them.

- The following example demonstrates how to use the `query()` and `stagger()` functions to animate a list (of heroes) adding each in sequence, with a slight delay, from top to bottom.

  - Use `query()` to look for an element entering the page that meets certain criteria

  - For each of these elements, use `style()` to set the same initial style for the element. Make it transparent and use transform to move it out of position so that it can slide into place.

  - Use `stagger()` to delay each animation by 30 milliseconds

  - Animate each element on screen for 0.5 seconds using a custom-defined easing curve, simultaneously fading it in and un-transforming it

  - src/app/hero-list-page.component.ts
    ```
    animations: [
      trigger('pageAnimations', [
        transition(':enter', [
          query('.hero', [
            style({opacity: 0, transform: 'translateY(-100px)'}),
            stagger(30, [
              animate('500ms cubic-bezier(0.35, 0, 0.25, 1)',
              style({ opacity: 1, transform: 'none' }))
            ])
          ])
        ])
      ]),
    ```

### Parallel animation using group() function

- You've seen how to add a delay between each successive animation. But you might also want to configure animations that happen in parallel. For example, you might want to animate two CSS properties of the same element but use a different `easing` function for each one. For this, you can use the animation `group()` function.

- NOTE:

  - The `group()` function is used to group animation steps, rather than animated elements.

- The following example uses `group()`s on both :enter and :leave for two different timing configurations, thus applying two independent animations to the same element in parallel.

  - src/app/hero-list-groups.component.ts (excerpt)
    ```
    animations: [
      trigger('flyInOut', [
        state('in', style({
          width: '*',
          transform: 'translateX(0)', opacity: 1
        })),
        transition(':enter', [
          style({ width: 10, transform: 'translateX(50px)', opacity: 0 }),
          group([
            animate('0.3s 0.1s ease', style({
              transform: 'translateX(0)',
              width: '*'
            })),
            animate('0.3s ease', style({
              opacity: 1
            }))
          ])
        ]),
        transition(':leave', [
          group([
            animate('0.3s ease', style({
              transform: 'translateX(50px)',
              width: 10
            })),
            animate('0.3s 0.2s ease', style({
              opacity: 0
            }))
          ])
        ])
      ])
    ]
    ```

### Sequential vs. parallel animations

- Complex animations can have many things happening at once. But what if you want to create an animation involving several animations happening one after the other? Earlier you used `group()` to run multiple animations all at the same time, in parallel.

- A second function called `sequence()` lets you run those same animations one after the other. Within sequence(), the animation steps consist of either `style()` or `animate()` function calls.

  - Use `style()` to apply the provided styling data immediately.
  - Use `animate()` to apply styling data over a given time interval.

### Filter animation example

- Take a look at another animation on the live example page. Under the Filter/Stagger tab, enter some text into the Search Heroes text box, such as `Magnet` or `tornado`.

- The filter works in real time as you type. Elements leave the page as you type each new letter and the filter gets progressively stricter. The heroes list gradually re-enters the page as you delete each letter in the filter box.

- The HTML template contains a trigger called `filterAnimation`.

  - src/app/hero-list-page.component.html

    ```
    <label for="search">Search heroes: </label>
    <input type="text" id="search" #criteria
          (input)="updateCriteria(criteria.value)"
          placeholder="Search heroes">

    <ul class="heroes" [@filterAnimation]="heroesTotal">
      <li *ngFor="let hero of heroes" class="hero">
        <div class="inner">
          <span class="badge">{{ hero.id }}</span>
          <span class="name">{{ hero.name }}</span>
        </div>
      </li>
    </ul>
    ```

- The `filterAnimation` in the component's decorator contains three transitions.

  - src/app/hero-list-page.component.ts

    ```
    @Component({
      animations: [
        trigger('filterAnimation', [
          transition(':enter, * => 0, * => -1', []),
          transition(':increment', [
            query(':enter', [
              style({ opacity: 0, width: 0 }),
              stagger(50, [
                animate('300ms ease-out', style({ opacity: 1, width: '*' })),
              ]),
            ], { optional: true })
          ]),
          transition(':decrement', [
            query(':leave', [
              stagger(50, [
                animate('300ms ease-out', style({ opacity: 0, width: 0 })),
              ]),
            ])
          ]),
        ]),
      ]
    })
    export class HeroListPageComponent implements OnInit {
      heroesTotal = -1;

      get heroes() { return this._heroes; }
      private _heroes: Hero[] = [];

      ngOnInit() {
        this._heroes = HEROES;
      }

      updateCriteria(criteria: string) {
        criteria = criteria ? criteria.trim() : '';

        this._heroes = HEROES.filter(hero => hero.name.toLowerCase().includes(criteria.toLowerCase()));
        const newTotal = this.heroes.length;

        if (this.heroesTotal !== newTotal) {
          this.heroesTotal = newTotal;
        } else if (!criteria) {
          this.heroesTotal = -1;
        }
      }
    }
    ```

  - The code in this example performs the following tasks:

    - Skips animations when the user first opens or navigates to this page (the filter animation narrows what is already there, so it only works on elements that already exist in the DOM)

    - Filters heroes based on the search input's value

  - For each change:

    - Hides an element leaving the DOM by setting its opacity and width to 0

    - Animates an element entering the DOM over 300 milliseconds. During the animation, the element assumes its default width and opacity.

    - If there are multiple elements entering or leaving the DOM, staggers each animation starting at the top of the page, with a 50-millisecond delay between each element

### Animating the items of a reordering list

- Although Angular animates correctly `*ngFor` list items out of the box, it will not be able to do so if their ordering changes. This is because it will lose track of which element is which, resulting in broken animations. The only way to help Angular keep track of such elements is by assigning a `TrackByFunction` to the `NgForOf` directive. This makes sure that Angular always knows which element is which, thus allowing it to apply the correct animations to the correct elements all the time.

  - IMPORTANT:
    - If you need to animate the items of an `*ngFor` list and there is a possibility that the order of such items will change during runtime, always use a `TrackByFunction`.

### Animations and Component View Encapsulation

- Angular animations are based on the components DOM structure and do not directly take `View Encapsulation` into account, this means that components using `ViewEncapsulation.Emulated` behave exactly as if they were using `ViewEncapsulation.None` (`ViewEncapsulation.ShadowDom` behaves differently as we'll discuss shortly).

- For example if the `query()` function (which you'll see more of in the rest of the Animations guide) were to be applied at the top of a tree of components using the emulated view encapsulation, such query would be able to identify (and thus animate) DOM elements on any depth of the tree.

- On the other hand the `ViewEncapsulation.ShadowDom` changes the component's DOM structure by "hiding" DOM elements inside [ShadowRoot](https://developer.mozilla.org/en-US/docs/Web/API/ShadowRoot) elements. Such DOM manipulations do prevent some of the animations implementation to work properly since it relies on simple DOM structures and doesn't take `ShadowRoot` elements into account. Therefore it is advised to avoid applying animations to views incorporating components using the ShadowDom view encapsulation.

### Animation sequence summary

- Angular functions for animating multiple elements start with `query()` to find inner elements; for example, gathering all images within a `<div>`. The remaining functions, `stagger()`, `group()`, and `sequence()`, apply cascades or let you control how multiple animation steps are applied.

## Reusable Animations

- To create a reusable animation, use the `animation()` function to define an animation in a separate .ts file and declare this animation definition as a const export variable. You can then import and reuse this animation in any of your application components using the `useAnimation()` function.

- src/app/animations.ts

  ```
  import { animation, style, animate, trigger, transition, useAnimation } from '@angular/animations';

  export const transitionAnimation = animation([
    style({
      height: '{{ height }}',
      opacity: '{{ opacity }}',
      backgroundColor: '{{ backgroundColor }}'
    }),
    animate('{{ time }}')
  ]);
  ```

  - NOTE:
    - The `height`, `opacity`, `backgroundColor`, and time inputs are replaced during runtime.

- You can also export a part of an animation. For example, the following snippet exports the animation `trigger`.

  - src/app/animations.1.ts
    ```
    import { animation, style, animate, trigger, transition, useAnimation } from '@angular/animations';
    export const triggerAnimation = trigger('openClose', [
      transition('open => closed', [
        useAnimation(transitionAnimation, {
          params: {
            height: 0,
            opacity: 1,
            backgroundColor: 'red',
            time: '1s'
          }
        })
      ])
    ]);
    ```

- From this point, you can import reusable animation variables in your component class. For example, the following code snippet imports the `transitionAnimation` variable and uses it via the `useAnimation()` function.

  - src/app/open-close.component.ts

    ```
    import { Component } from '@angular/core';
    import { transition, trigger, useAnimation } from '@angular/animations';
    import { transitionAnimation } from './animations';

    @Component({
      selector: 'app-open-close-reusable',
      animations: [
        trigger('openClose', [
          transition('open => closed', [
            useAnimation(transitionAnimation, {
              params: {
                height: 0,
                opacity: 1,
                backgroundColor: 'red',
                time: '1s'
              }
            })
          ])
        ])
      ],
      templateUrl: 'open-close.component.html',
      styleUrls: ['open-close.component.css']
    })
    ```

## Route transition animations

### Prerequisites

- Routing enables users to navigate between different routes in an application. When a user navigates from one route to another, the Angular router maps the URL path to a relevant component and displays its view. Animating this route transition can greatly enhance the user experience.

- The Angular router comes with high-level animation functions that let you animate the transitions between views when a route changes. To produce an animation sequence when switching between routes, you need to define nested animation sequences. Start with the top-level component that hosts the view, and nest additional animations in the components that host the embedded views.

- To enable routing transition animation, do the following:

  1. Import the routing module into the application and create a routing configuration that defines the possible routes.
  2. Add a router outlet to tell the Angular router where to place the activated components in the DOM.
  3. Define the animation.

- Illustrate a router transition animation by navigating between two routes, _Home_ and _About_ associated with the `HomeComponent` and `AboutComponent` views respectively. Both of these component views are children of the top-most view, hosted by `AppComponent`. We'll implement a router transition animation that slides in the new view to the right and slides out the old view when the user navigates between the two routes.

  ![](https://angular.io/generated/images/guide/animations/route-animation.gif)

### Route configuration

- To begin, configure a set of routes using methods available in the `RouterModule` class. This route configuration tells the router how to navigate.

- Use the `RouterModule.forRoot` method to define a set of routes. Also, add `RouterModule` to the `imports` array of the main module, `AppModule`.

- NOTE:

  - Use the `RouterModule.forRoot` method in the root module, `AppModule`, to register top-level application routes and providers. For feature modules, call the `RouterModule.forChild` method instead.

- The following configuration defines the possible routes for the application.

  - src/app/app.module.ts

    ```
    import { NgModule } from '@angular/core';
    import { BrowserModule } from '@angular/platform-browser';
    import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
    import { RouterModule } from '@angular/router';
    import { AppComponent } from './app.component';
    import { OpenCloseComponent } from './open-close.component';
    import { OpenClosePageComponent } from './open-close-page.component';
    import { OpenCloseChildComponent } from './open-close.component.4';
    import { ToggleAnimationsPageComponent } from './toggle-animations-page.component';
    import { StatusSliderComponent } from './status-slider.component';
    import { StatusSliderPageComponent } from './status-slider-page.component';
    import { HeroListPageComponent } from './hero-list-page.component';
    import { HeroListGroupPageComponent } from './hero-list-group-page.component';
    import { HeroListGroupsComponent } from './hero-list-groups.component';
    import { HeroListEnterLeavePageComponent } from './hero-list-enter-leave-page.component';
    import { HeroListEnterLeaveComponent } from './hero-list-enter-leave.component';
    import { HeroListAutoCalcPageComponent } from './hero-list-auto-page.component';
    import { HeroListAutoComponent } from './hero-list-auto.component';
    import { HomeComponent } from './home.component';
    import { AboutComponent } from './about.component';
    import { InsertRemoveComponent } from './insert-remove.component';
    import { QueryingComponent } from './querying.component';


    @NgModule({
      imports: [
        BrowserModule,
        BrowserAnimationsModule,
        RouterModule.forRoot([
          { path: '', pathMatch: 'full', redirectTo: '/enter-leave' },
          {
            path: 'open-close',
            component: OpenClosePageComponent,
            data: { animation: 'openClosePage' }
          },
          {
            path: 'status',
            component: StatusSliderPageComponent,
            data: { animation: 'statusPage' }
          },
          {
            path: 'toggle',
            component: ToggleAnimationsPageComponent,
            data: { animation: 'togglePage' }
          },
          {
            path: 'heroes',
            component: HeroListPageComponent,
            data: { animation: 'filterPage' }
          },
          {
            path: 'hero-groups',
            component: HeroListGroupPageComponent,
            data: { animation: 'heroGroupPage' }
          },
          {
            path: 'enter-leave',
            component: HeroListEnterLeavePageComponent,
            data: { animation: 'enterLeavePage' }
          },
          {
            path: 'auto',
            component: HeroListAutoCalcPageComponent,
            data: { animation: 'autoPage' }
          },
          {
            path: 'insert-remove',
            component: InsertRemoveComponent,
            data: { animation: 'insertRemovePage' }
          },
          {
            path: 'querying',
            component: QueryingComponent,
            data: { animation: 'queryingPage' }
          },
          {
            path: 'home',
            component: HomeComponent,
            data: { animation: 'HomePage' }
          },
          {
            path: 'about',
            component: AboutComponent,
            data: { animation: 'AboutPage' }
          },
        ])
      ],
    ```

  - The home and about paths are associated with the HomeComponent and AboutComponent views. The route configuration tells the Angular router to instantiate the HomeComponent and AboutComponent views when the navigation matches the corresponding path.

  - In addition to `path` and `component`, the `data` property of each route defines the key animation-specific configuration associated with a route. The `data` property value is passed into `AppComponent` when the route changes. You can also pass additional data in route configuration that is consumed within the animation. The `data` property value has to match the transitions defined in the routeAnimation trigger, which we'll define shortly.

  - NOTE:
    - The `data` property names that you use can be arbitrary. For example, the name _animation_ used in the preceding example is an arbitrary choice.

### Router outlet

- After configuring the routes, add a `<router-outlet>` inside the root AppComponent template. The `<router-outlet>` directive tells the Angular router where to render the views when matched with a route.

- The `ChildrenOutletContexts` holds information about outlets and activated routes. We can use the `data` property of each `Route` to animate our routing transitions.

  - src/app/app.component.html
    ```
    <div [@routeAnimations]="getRouteAnimationData()">
      <router-outlet></router-outlet>
    </div>
    ```

- `AppComponent` defines a method that can detect when a view changes. The method assigns an animation state value to the animation trigger (`@routeAnimation`) based on the route configuration data property value. Here's an example of an `AppComponent` method that detects when a route change happens.

  - src/app/app.component.ts

    ```
    constructor(private contexts: ChildrenOutletContexts) {}

    getRouteAnimationData() {
      return this.contexts.getContext('primary')?.route?.snapshot?.data?.['animation'];
    }
    ```

  - Here, the `getRouteAnimationData()` method takes the value of the outlet and returns a string that represents the state of the animation based on the custom data of the current active route. Use this data to control which transition to execute for each route.

### Animation definition

- Animations can be defined directly inside your components. For this example you are defining the animations in a separate file, which lets us re-use the animations.

- The following code snippet defines a reusable animation named `slideInAnimation`.

  - src/app/animations.ts

    ```
    export const slideInAnimation =
      trigger('routeAnimations', [
        transition('HomePage <=> AboutPage', [
          style({ position: 'relative' }),
          query(':enter, :leave', [
            style({
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%'
            })
          ]),
          query(':enter', [
            style({ left: '-100%' })
          ]),
          query(':leave', animateChild()),
          group([
            query(':leave', [
              animate('300ms ease-out', style({ left: '100%' }))
            ]),
            query(':enter', [
              animate('300ms ease-out', style({ left: '0%' }))
            ]),
          ]),
        ]),
        transition('* <=> *', [
          style({ position: 'relative' }),
          query(':enter, :leave', [
            style({
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%'
            })
          ]),
          query(':enter', [
            style({ left: '-100%' })
          ]),
          query(':leave', animateChild()),
          group([
            query(':leave', [
              animate('200ms ease-out', style({ left: '100%', opacity: 0 }))
            ]),
            query(':enter', [
              animate('300ms ease-out', style({ left: '0%' }))
            ]),
            query('@*', animateChild())
          ]),
        ])
      ]);
    ```

  - The animation definition performs the following tasks:
    - Defines two transitions (a single `trigger` can define multiple states and transitions)
    - Adjusts the styles of the host and child views to control their relative positions during the transition
    - Uses `query()` to determine which child view is entering and which is leaving the host view

- A route change activates the animation trigger, and a transition matching the state change is applied.

- NOTE:

  - The transition states must match the data property value defined in the route configuration.

- Make the animation definition available in your application by adding the reusable animation (`slideInAnimation`) to the `animations` metadata of the `AppComponent`.

  - src/app/app.component.ts
    ```
    @Component({
      selector: 'app-root',
      templateUrl: 'app.component.html',
      styleUrls: ['app.component.css'],
      animations: [
        slideInAnimation
      ]
    })
    ```

#### Styling the host and child components

- During a transition, a new view is inserted directly after the old one and both elements appear on screen at the same time. To prevent this behavior, update the host view to use relative positioning. Then, update the removed and inserted child views to use absolute positioning. Adding these styles to the views animates the containers in place and prevents one view from affecting the position of the other on the page.

  - src/app/animations.ts (excerpt)
    ```
    trigger('routeAnimations', [
      transition('HomePage <=> AboutPage', [
        style({ position: 'relative' }),
        query(':enter, :leave', [
          style({
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%'
          })
        ]),
    ```

#### Querying the view containers

- Use the `query()` method to find and animate elements within the current host component. The `query(":enter")` statement returns the view that is being inserted, and `query(":leave")` returns the view that is being removed.

- Assume that you are routing from the _Home => About_.

  - src/app/animations.ts (excerpt)

    ```
    query(':enter', [
        style({ left: '-100%' })
      ]),
      query(':leave', animateChild()),
      group([
        query(':leave', [
          animate('300ms ease-out', style({ left: '100%' }))
        ]),
        query(':enter', [
          animate('300ms ease-out', style({ left: '0%' }))
        ]),
      ]),
    ]),
    transition('* <=> *', [
      style({ position: 'relative' }),
      query(':enter, :leave', [
        style({
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%'
        })
      ]),
      query(':enter', [
        style({ left: '-100%' })
      ]),
      query(':leave', animateChild()),
      group([
        query(':leave', [
          animate('200ms ease-out', style({ left: '100%', opacity: 0 }))
        ]),
        query(':enter', [
          animate('300ms ease-out', style({ left: '0%' }))
        ]),
        query('@*', animateChild())
      ]),
    ])
    ```

  - The animation code does the following after styling the views:

    1. `query(':enter', style({ left: '-100%' }))` matches the view that is added and hides the newly added view by positioning it to the far left.

    2. Calls `animateChild()` on the view that is leaving, to run its child animations.

    3. Uses `group()` function to make the inner animations run in parallel.

    4. Within the `group()` function:

    a. Queries the view that is removed and animates it to slide far to the right.

    b. Slides in the new view by animating the view with an easing function and duration.

    This animation results in the about view sliding in from the left.

    5. Calls the `animateChild()` method on the new view to run its child animations after the main animation completes.
