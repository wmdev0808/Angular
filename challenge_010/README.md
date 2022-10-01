# Forms

## Introduction

- Angular provides two different approaches to handling user input through forms: reactive and template-driven. Both capture user input events from the view, validate the user input, create a form model and data model to update, and provide a way to track changes.

### Choosing an approach

- Reactive forms and template-driven forms process and manage form data differently. Each approach offers different advantages.

  | FORMS                 | DETAILS                                                                                                                                                                                                                                                                                                                                                                                                             |
  | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
  | Reactive forms        | Provide direct, explicit access to the underlying form's object model. Compared to template-driven forms, they are more robust: they're more scalable, reusable, and testable. If forms are a key part of your application, or you're already using reactive patterns for building your application, use reactive forms.                                                                                            |
  | Template-driven forms | Rely on directives in the template to create and manipulate the underlying object model. They are useful for adding a simple form to an app, such as an email list signup form. They're straightforward to add to an app, but they don't scale as well as reactive forms. If you have very basic form requirements and logic that can be managed solely in the template, template-driven forms could be a good fit. |

- Key differences
  | |REACTIVE|TEMPLATE-DRIVEN|
  |----|--------|---------------|
  |Setup of form model|Explicit, created in component class|Implicit, created by directives|
  |Data model|Structured and immutable|Unstructured and mutable|
  |Data flow| Synchronous|Asynchronous|
  |Form validation| Functions|Directives|

- Scalability

  - If forms are a central part of your application, scalability is very important. Being able to reuse form models across components is critical.

  - Reactive forms are more scalable than template-driven forms. They provide direct access to the underlying form API, and use synchronous data flow between the view and the data model, which makes creating large-scale forms easier. Reactive forms require less setup for testing, and testing does not require deep understanding of change detection to properly test form updates and validation.

  - Template-driven forms focus on simple scenarios and are not as reusable. They abstract away the underlying form API, and use asynchronous data flow between the view and the data model. The abstraction of template-driven forms also affects testing. Tests are deeply reliant on manual change detection execution to run properly, and require more setup.

- Setup the form model

  - Setup in reactive forms

    ```
    import { Component } from '@angular/core';
    import { FormControl } from '@angular/forms';

    @Component({
      selector: 'app-reactive-favorite-color',
      template: `
        Favorite Color: <input type="text" [formControl]="favoriteColorControl">
      `
    })
    export class FavoriteColorComponent {
      favoriteColorControl = new FormControl('');
    }
    ```

  - Setup in template-driven forms

    ```
    import { Component } from '@angular/core';

    @Component({
      selector: 'app-template-favorite-color',
      template: `
        Favorite Color: <input type="text" [(ngModel)]="favoriteColor">
      `
    })
    export class FavoriteColorComponent {
      favoriteColor = '';
    }
    ```

- Form validation
  |FORMS|DETAILS|
  |-----|-------|
  |Reactive forms| Define custom validators as functions that receive a control to validate |
  |Template-driven forms| Tied to template directives, and must provide custom validator directives that wrap validation functions|

## Reactive forms

- Reactive forms provide a model-driven approach to handling form inputs whose values change over time.
- Overview of reactive forms

  - Reactive forms differ from template-driven forms in distinct ways.

    - Reactive forms provide synchronous access to the data model, immutability with observable operators, and change tracking through observable streams.

    - Template-driven forms let direct access modify data in your template, but are less explicit than reactive forms because they rely on directives embedded in the template, along with mutable data to track changes asynchronously.

- Adding a basic form control

  - There are three steps to using form controls.

    1. Register the reactive forms module in your application. This module declares the reactive-form directives that you need to use reactive forms.

    - src/app/app.module.ts (excerpt)

      ```
      import { ReactiveFormsModule } from '@angular/forms';

      @NgModule({
        imports: [
          // other imports ...
          ReactiveFormsModule
        ],
      })
      export class AppModule { }
      ```

    2. Generate a new FormControl instance and save it in the component.

    - src/app/name-editor/name-editor.component.ts

      ```
      import { Component } from '@angular/core';
      import { FormControl } from '@angular/forms';

      @Component({
        selector: 'app-name-editor',
        templateUrl: './name-editor.component.html',
        styleUrls: ['./name-editor.component.css']
      })
      export class NameEditorComponent {
        name = new FormControl('');
      }
      ```

    3. Register the FormControl in the template.

    - src/app/name-editor/name-editor.component.html
      ```
      <label for="name">Name: </label>
      <input id="name" type="text" [formControl]="name">
      ```

  - Replacing a form control value
    - src/app/name-editor/name-editor.component.ts (update value)
      ```
      updateName() {
        this.name.setValue('Nancy');
      }
      ```
    - src/app/name-editor/name-editor.component.html (update value)
      ```
      <button type="button" (click)="updateName()">Update Name</button>
      ```

- Grouping form controls

  - Reactive forms provide two ways of grouping multiple related controls into a single input form.

    | FORM GROUPS | DETAILS                                                                                                                                |
    | ----------- | -------------------------------------------------------------------------------------------------------------------------------------- |
    | Form group  | Defines a form with a fixed set of controls that you can manage together. You can also nest form groups to create more complex forms.  |
    | Form array  | Defines a dynamic form, where you can add and remove controls at run time. You can also nest form arrays to create more complex forms. |

  - To add a form group to the component, take the following steps.

    1. Create a FormGroup instance.

    - src/app/profile-editor/profile-editor.component.ts (form group)

      ```
      import { Component } from '@angular/core';
      import { FormGroup, FormControl } from '@angular/forms';

      @Component({
        selector: 'app-profile-editor',
        templateUrl: './profile-editor.component.html',
        styleUrls: ['./profile-editor.component.css']
      })
      export class ProfileEditorComponent {
        profileForm = new FormGroup({
          firstName: new FormControl(''),
          lastName: new FormControl(''),
        });
      }
      ```

    2. Associate the FormGroup model and view.

    - src/app/profile-editor/profile-editor.component.html (template form group)

      ```
      <form [formGroup]="profileForm">

        <label for="first-name">First Name: </label>
        <input id="first-name" type="text" formControlName="firstName">

        <label for="last-name">Last Name: </label>
        <input id="last-name" type="text" formControlName="lastName">

      </form>
      ```

    3. Save the form data.

    - src/app/profile-editor/profile-editor.component.html (submit event)

      ```
      <form [formGroup]="profileForm" (ngSubmit)="onSubmit()">
      ```

    - src/app/profile-editor/profile-editor.component.ts (submit method)
      ```
      onSubmit() {
        // TODO: Use EventEmitter with form value
        console.warn(this.profileForm.value);
      }
      ```

  - Creating nested form groups

    1. Create a nested group.

    - src/app/profile-editor/profile-editor.component.ts (nested form group)

      ```
      import { Component } from '@angular/core';
      import { FormGroup, FormControl } from '@angular/forms';

      @Component({
        selector: 'app-profile-editor',
        templateUrl: './profile-editor.component.html',
        styleUrls: ['./profile-editor.component.css']
      })
      export class ProfileEditorComponent {
        profileForm = new FormGroup({
          firstName: new FormControl(''),
          lastName: new FormControl(''),
          address: new FormGroup({
            street: new FormControl(''),
            city: new FormControl(''),
            state: new FormControl(''),
            zip: new FormControl('')
          })
        });
      }
      ```

    2. Group the nested form in the template.

    - src/app/profile-editor/profile-editor.component.html (template nested form group)

      ```
      <div formGroupName="address">
        <h2>Address</h2>

        <label for="street">Street: </label>
        <input id="street" type="text" formControlName="street">

        <label for="city">City: </label>
        <input id="city" type="text" formControlName="city">

        <label for="state">State: </label>
        <input id="state" type="text" formControlName="state">

        <label for="zip">Zip Code: </label>
        <input id="zip" type="text" formControlName="zip">
      </div>
      ```

  - Updating parts of the data model

    - There are two ways to update the model value:
      |METHODS|DETAILS|
      |-------|-------|
      |setValue()|Set a new value for an individual control. The setValue() method strictly adheres to the structure of the form group and replaces the entire value for the control.|
      |patchValue()|Replace any properties defined in the object that have changed in the form model.|

    - src/app/profile-editor/profile-editor.component.ts (patch value)
      ```
      updateProfile() {
        this.profileForm.patchValue({
          firstName: 'Nancy',
          address: {
            street: '123 Drew Street'
          }
        });
      }
      ```
    - src/app/profile-editor/profile-editor.component.html (update value)
      ```
      <button type="button" (click)="updateProfile()">Update Profile</button>
      ```

- Using the FormBuilder service to generate controls

  - Creating form control instances manually can become repetitive when dealing with multiple forms. The `FormBuilder` service provides convenient methods for generating controls.

  - src/app/profile-editor/profile-editor.component.ts (form builder)

    ```
    import { Component } from '@angular/core';
    import { FormBuilder } from '@angular/forms';

    @Component({
      selector: 'app-profile-editor',
      templateUrl: './profile-editor.component.html',
      styleUrls: ['./profile-editor.component.css']
    })
    export class ProfileEditorComponent {
      profileForm = this.fb.group({
        firstName: [''],
        lastName: [''],
        address: this.fb.group({
          street: [''],
          city: [''],
          state: [''],
          zip: ['']
        }),
      });

      constructor(private fb: FormBuilder) { }
    }
    ```

- Validating form input

  - src/app/profile-editor/profile-editor.component.ts

    ```
    import { Validators } from '@angular/forms';

    profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: [''],
      address: this.fb.group({
        street: [''],
        city: [''],
        state: [''],
        zip: ['']
      }),
    });
    ```

  - src/app/profile-editor/profile-editor.component.html (display status)
    ```
    <p>Form Status: {{ profileForm.status }}</p>
    ```

- Creating dynamic forms

  - FormArray is an alternative to FormGroup for managing any number of unnamed controls. As with form group instances, you can dynamically insert and remove controls from form array instances, and the form array instance value and validation status is calculated from its child controls. However, you don't need to define a key for each control by name, so this is a great option if you don't know the number of child values in advance.

  - Import the FormArray class.
    - src/app/profile-editor/profile-editor.component.ts
      ```
      import { FormArray } from '@angular/forms';
      ```
  - Define a FormArray control.
    - src/app/profile-editor/profile-editor.component.ts (aliases form array)
      ```
      profileForm = this.fb.group({
        firstName: ['', Validators.required],
        lastName: [''],
        address: this.fb.group({
          street: [''],
          city: [''],
          state: [''],
          zip: ['']
        }),
        aliases: this.fb.array([
          this.fb.control('')
        ])
      });
      ```
  - Access the FormArray control with a getter method.

    - src/app/profile-editor/profile-editor.component.ts (aliases getter)
      ```
      get aliases() {
        return this.profileForm.get('aliases') as FormArray;
      }
      ```
    - Define a method to dynamically insert an alias control into the alias's form array. The FormArray.push() method inserts the control as a new item in the array.
      - src/app/profile-editor/profile-editor.component.ts (add alias)
        ```
        addAlias() {
          this.aliases.push(this.fb.control(''));
        }
        ```

  - Display the form array in a template.

    - src/app/profile-editor/profile-editor.component.html (aliases form array template)

      ```
      <div formArrayName="aliases">
        <h2>Aliases</h2>
        <button type="button" (click)="addAlias()">+ Add another alias</button>

        <div *ngFor="let alias of aliases.controls; let i=index">
          <!-- The repeated alias template -->
          <label for="alias-{{ i }}">Alias:</label>
          <input id="alias-{{ i }}" type="text" [formControlName]="i">
        </div>
      </div>
      ```

- Reactive forms API summary

  - Classes
    |CLASS | DETAILS |
    |------|----------|
    |AbstractControl| The abstract base class for the concrete form control classes FormControl, FormGroup, and FormArray. It provides their common behaviors and properties.|
    |FormControl| Manages the value and validity status of an individual form control. It corresponds to an HTML form control such as `<input>` or `<select>`.|
    |FormGroup| Manages the value and validity state of a group of AbstractControl instances. The group's properties include its child controls. The top-level form in your component is FormGroup.|
    |FormArray| Manages the value and validity state of a numerically indexed array of AbstractControl instances.|
    |FormBuilder| An injectable service that provides factory methods for creating control instances.|

  - Directives
    |DIRECTIVE | DETAILS |
    |-----------|---------|  
    |FormControlDirective| Syncs a standalone FormControl instance to a form control element.|
    |FormControlName| Syncs FormControl in an existing FormGroup instance to a form control element by name.|
    |FormGroupDirective| Syncs an existing FormGroup instance to a DOM element.|
    |FormGroupName| Syncs a nested FormGroup instance to a DOM element.|
    |FormArrayName| Syncs a nested FormArray instance to a DOM element.|

## Strictly typed reactive forms in depth

## Validate form input

- Validating input in template-driven forms

  - template/hero-form-template.component.html (name)

    ```
    <input type="text" id="name" name="name" class="form-control"
      required minlength="4" appForbiddenName="bob"
      [(ngModel)]="hero.name" #name="ngModel">

    <div *ngIf="name.invalid && (name.dirty || name.touched)"
        class="alert">

      <div *ngIf="name.errors?.['required']">
        Name is required.
      </div>
      <div *ngIf="name.errors?.['minlength']">
        Name must be at least 4 characters long.
      </div>
      <div *ngIf="name.errors?.['forbiddenName']">
        Name cannot be Bob.
      </div>

    </div>
    ```

  - To prevent the validator from displaying errors before the user has a chance to edit the form, you should check for either the dirty or touched states in a control.

    - When the user changes the value in the watched field, the control is marked as "dirty"
    - When the user blurs the form control element, the control is marked as "touched"

- Validating input in reactive forms

  - Validator functions
    |VALIDATOR| TYPE DETAILS|
    |---------|--------------|
    |Sync validators| Synchronous functions that take a control instance and immediately return either a set of validation errors or null. Pass these in as the second argument when you instantiate a FormControl.|
    |Async validators| Asynchronous functions that take a control instance and return a Promise or Observable that later emits a set of validation errors or null. Pass these in as the third argument when you instantiate a FormControl.|

    - For performance reasons, Angular only runs async validators if all sync validators pass.

  - Built-in validator functions

    - reactive/hero-form-reactive.component.ts (validator functions)

      ```
      ngOnInit(): void {
        this.heroForm = new FormGroup({
          name: new FormControl(this.hero.name, [
            Validators.required,
            Validators.minLength(4),
            forbiddenNameValidator(/bob/i) // <-- Here's how you pass in the custom validator.
          ]),
          alterEgo: new FormControl(this.hero.alterEgo),
          power: new FormControl(this.hero.power, Validators.required)
        });

      }

      get name() { return this.heroForm.get('name'); }

      get power() { return this.heroForm.get('power'); }
      ```

    - reactive/hero-form-reactive.component.html (name with error msg)

      ```
      <input type="text" id="name" class="form-control"
      formControlName="name" required>

      <div *ngIf="name.invalid && (name.dirty || name.touched)"
          class="alert alert-danger">

        <div *ngIf="name.errors?.['required']">
          Name is required.
        </div>
        <div *ngIf="name.errors?.['minlength']">
          Name must be at least 4 characters long.
        </div>
        <div *ngIf="name.errors?.['forbiddenName']">
          Name cannot be Bob.
        </div>
      </div>
      ```

- Defining custom validators

  - shared/forbidden-name.directive.ts (forbiddenNameValidator)

    ```
    /** A hero's name can't match the given regular expression */
    export function forbiddenNameValidator(nameRe: RegExp): ValidatorFn {
      return (control: AbstractControl): ValidationErrors | null => {
        const forbidden = nameRe.test(control.value);
        return forbidden ? {forbiddenName: {value: control.value}} : null;
      };
    }
    ```

  - Adding custom validators to reactive forms

    - reactive/hero-form-reactive.component.ts (validator functions)
      ```
      this.heroForm = new FormGroup({
        name: new FormControl(this.hero.name, [
          Validators.required,
          Validators.minLength(4),
          forbiddenNameValidator(/bob/i) // <-- Here's how you pass in the custom validator.
        ]),
        alterEgo: new FormControl(this.hero.alterEgo),
        power: new FormControl(this.hero.power, Validators.required)
      });
      ```

  - Adding custom validators to template-driven forms

    - shared/forbidden-name.directive.ts (directive)

      ```
      @Directive({
        selector: '[appForbiddenName]',
        providers: [{provide: NG_VALIDATORS, useExisting: ForbiddenValidatorDirective, multi: true}]
      })
      export class ForbiddenValidatorDirective implements Validator {
        @Input('appForbiddenName') forbiddenName = '';

        validate(control: AbstractControl): ValidationErrors | null {
          return this.forbiddenName ? forbiddenNameValidator(new RegExp(this.forbiddenName, 'i'))(control)
                                    : null;
        }
      }
      ```

    - template/hero-form-template.component.html (forbidden-name-input)
      ```
      <input type="text" id="name" name="name" class="form-control"
      required minlength="4" appForbiddenName="bob"
      [(ngModel)]="hero.name" #name="ngModel">
      ```

  - Control status CSS classes

    - .ng-valid
    - .ng-invalid
    - .ng-pending
    - .ng-pristine
    - .ng-dirty
    - .ng-untouched
    - .ng-touched
    - .ng-submitted (enclosing form element only)

    - forms.css (status classes)

      ```
      .ng-valid[required], .ng-valid.required  {
        border-left: 5px solid #42A948; /* green */
      }

      .ng-invalid:not(form)  {
        border-left: 5px solid #a94442; /* red */
      }

      .alert div {
        background-color: #fed3d3;
        color: #820000;
        padding: 1rem;
        margin-bottom: 1rem;
      }

      .form-group {
        margin-bottom: 1rem;
      }

      label {
        display: block;
        margin-bottom: .5rem;
      }

      select {
        width: 100%;
        padding: .5rem;
      }
      ```

- Cross-field validation

  - A cross-field validator is a custom validator that compares the values of different fields in a form and accepts or rejects them in combination. For example, you might have a form that offers mutually incompatible options, so that if the user can choose A or B, but not both. Some field values might also depend on others; a user might be allowed to choose B only if A is also chosen.

  - Adding cross-validation to reactive forms

    - To add a validator to the FormGroup, pass the new validator in as the second argument on creation.

      ```
      const heroForm = new FormGroup({
        'name': new FormControl(),
        'alterEgo': new FormControl(),
        'power': new FormControl()
      }, { validators: identityRevealedValidator });
      ```

    - The validator code is as follows.

      - shared/identity-revealed.directive.ts

        ```
        /** A hero's name can't match the hero's alter ego */
        export const identityRevealedValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
          const name = control.get('name');
          const alterEgo = control.get('alterEgo');

          return name && alterEgo && name.value === alterEgo.value ? { identityRevealed: true } : null;
        };
        ```

    - To provide better user experience, the template shows an appropriate error message when the form is invalid.

      ```
      <div *ngIf="heroForm.errors?.['identityRevealed'] && (heroForm.touched || heroForm.dirty)" class="cross-validation-error-message alert alert-danger">
        Name cannot match alter ego.
      </div>
      ```

  - Adding cross-validation to template-driven forms

    - For a template-driven form, you must create a directive to wrap the validator function. You provide that directive as the validator using the NG_VALIDATORS token, as shown in the following example.

      - shared/identity-revealed.directive.ts
        ```
        @Directive({
          selector: '[appIdentityRevealed]',
          providers: [{ provide: NG_VALIDATORS, useExisting: IdentityRevealedValidatorDirective, multi: true }]
        })
        export class IdentityRevealedValidatorDirective implements Validator {
          validate(control: AbstractControl): ValidationErrors | null {
            return identityRevealedValidator(control);
          }
        }
        ```

    - You must add the new directive to the HTML template. Because the validator must be registered at the highest level in the form, the following template puts the directive on the form tag.

      - template/hero-form-template.component.html
        <form #heroForm="ngForm" appIdentityRevealed>

    - To provide better user experience, an appropriate error message appears when the form is invalid.
      - template/hero-form-template.component.html
        ```
        <div *ngIf="heroForm.errors?.['identityRevealed'] && (heroForm.touched || heroForm.dirty)" class="cross-validation-error-message alert">
          Name cannot match alter ego.
        </div>
        ```

- Creating asynchronous validators

  - Asynchronous validators implement the `AsyncValidatorFn` and `AsyncValidator` interfaces. These are very similar to their synchronous counterparts, with the following differences.

    - The `validate()` functions must return a Promise or an observable,
    - The observable returned must be finite, meaning it must complete at some point. To convert an infinite observable into a finite one, pipe the observable through a filtering operator such as `first`, `last`, `take`, or `takeUntil`.

  - Asynchronous validation happens after the synchronous validation, and is performed only if the synchronous validation is successful.

  - After asynchronous validation begins, the form control enters a pending state. Inspect the control's pending property and use it to give visual feedback about the ongoing validation operation.

  - A common UI pattern is to show a spinner while the async validation is being performed. The following example shows how to achieve this in a template-driven form.

    ```
    <input [(ngModel)]="name" #model="ngModel" appSomeAsyncValidator>
    <app-spinner *ngIf="model.pending"></app-spinner>
    ```

  - Implementing a custom async validator

    ```
    @Injectable({ providedIn: 'root' })
    export class UniqueAlterEgoValidator implements AsyncValidator {
      constructor(private heroesService: HeroesService) {}

      validate(
        control: AbstractControl
      ): Observable<ValidationErrors | null> {
        return this.heroesService.isAlterEgoTaken(control.value).pipe(
          map(isTaken => (isTaken ? { uniqueAlterEgo: true } : null)),
          catchError(() => of(null))
        );
      }
    }
    ```

  - Adding async validators to reactive forms

    - To use an async validator in reactive forms, begin by injecting the validator into the constructor of the component class.

      ```
      constructor(private alterEgoValidator: UniqueAlterEgoValidator) {}
      ```

    - Then, pass the validator function directly to the FormControl to apply it.
      ```
      const alterEgoControl = new FormControl('', {
        asyncValidators: [this.alterEgoValidator.validate.bind(this.alterEgoValidator)],
        updateOn: 'blur'
      });
      ```

  - Adding async validators to template-driven forms

    - To use an async validator in template-driven forms, create a new directive and register the NG_ASYNC_VALIDATORS provider on it.

      ```
      @Directive({
        selector: '[appUniqueAlterEgo]',
        providers: [
          {
            provide: NG_ASYNC_VALIDATORS,
            useExisting: forwardRef(() => UniqueAlterEgoValidatorDirective),
            multi: true
          }
        ]
      })
      export class UniqueAlterEgoValidatorDirective implements AsyncValidator {
        constructor(private validator: UniqueAlterEgoValidator) {}

        validate(
          control: AbstractControl
        ): Observable<ValidationErrors | null> {
          return this.validator.validate(control);
        }
      }
      ```

    - Then, as with synchronous validators, add the directive's selector to an input to activate it.
      - template/hero-form-template.component.html (unique-alter-ego-input)
        ```
        <input type="text"
          id="alterEgo"
          name="alterEgo"
          #alterEgo="ngModel"
          [(ngModel)]="hero.alterEgo"
          [ngModelOptions]="{ updateOn: 'blur' }"
          appUniqueAlterEgo>
        ```

  - Optimizing performance of async validators

    - By default, all validators run after every form value change. With synchronous validators, this does not normally have a noticeable impact on application performance. Async validators, however, commonly perform some kind of HTTP request to validate the control. Dispatching an HTTP request after every keystroke could put a strain on the backend API, and should be avoided if possible.

    - You can delay updating the form validity by changing the updateOn property from change (default) to submit or blur.

      - With template-driven forms, set the property in the template.

        ```
        <input [(ngModel)]="name" [ngModelOptions]="{updateOn: 'blur'}">
        ```

      - With reactive forms, set the property in the FormControl instance.
        ```
        new FormControl('', {updateOn: 'blur'});
        ```

- Interaction with native HTML form validation
  - By default, Angular disables native HTML form validation by adding the `novalidate` attribute on the enclosing `<form>` and uses directives to match these attributes with validator functions in the framework.
  - If you want to use native validation in combination with Angular-based validation, you can re-enable it with the `ngNativeValidate` directive.

## Building dynamic forms

- Many forms, such as questionnaires, can be very similar to one another in format and intent. To make it faster and easier to generate different versions of such a form, you can create a dynamic form template based on metadata that describes the business object model. Then, use the template to generate new forms automatically, according to changes in the data model.

- The technique is particularly useful when you have a type of form whose content must change frequently to meet rapidly changing business and regulatory requirements. A typical use-case is a questionnaire. You might need to get input from users in different contexts. The format and style of the forms a user sees should remain constant, while the actual questions you need to ask vary with the context.

### Enable reactive forms for your project

- Dynamic forms are based on reactive forms. To give the application access reactive forms directives, the `root module` imports `ReactiveFormsModule` from the `@angular/forms` library.

### Create a form object model

- A dynamic form requires an object model that can describe all scenarios needed by the form functionality. The example hero-application form is a set of questions —that is, each control in the form must ask a question and accept an answer.

  - src/app/question-base.ts

    ```
    export class QuestionBase<T> {
      value: T|undefined;
      key: string;
      label: string;
      required: boolean;
      order: number;
      controlType: string;
      type: string;
      options: {key: string, value: string}[];

      constructor(options: {
          value?: T;
          key?: string;
          label?: string;
          required?: boolean;
          order?: number;
          controlType?: string;
          type?: string;
          options?: {key: string, value: string}[];
        } = {}) {
        this.value = options.value;
        this.key = options.key || '';
        this.label = options.label || '';
        this.required = !!options.required;
        this.order = options.order === undefined ? 1 : options.order;
        this.controlType = options.controlType || '';
        this.type = options.type || '';
        this.options = options.options || [];
      }
    }
    ```

- Define control classes

  - `TextboxQuestion` control type

    - Presents a question and lets users enter input.
    - src/app/question-textbox.ts

      ```
      import { QuestionBase } from './question-base';

      export class TextboxQuestion extends QuestionBase<string> {
        override controlType = 'textbox';
      }
      ```

    - The TextboxQuestion control type is represented in a form template using an `<input>` element. The type attribute of the element is defined based on the type field specified in the options argument (for example text, email, url).

  - `DropdownQuestion` control type

    - Presents a list of choices in a select box.
    - src/app/question-dropdown.ts

      ```
      import { QuestionBase } from './question-base';

      export class DropdownQuestion extends QuestionBase<string> {
        override controlType = 'dropdown';
      }
      ```

- Compose form groups

  - A dynamic form uses a service to create grouped sets of input controls, based on the form model.
  - The following `QuestionControlService` collects a set of `FormGroup` instances that consume the metadata from the question model. You can specify default values and validation rules.

  - src/app/question-control.service.ts

    ```
    import { Injectable } from '@angular/core';
    import { FormControl, FormGroup, Validators } from '@angular/forms';

    import { QuestionBase } from './question-base';

    @Injectable()
    export class QuestionControlService {
      constructor() { }

      toFormGroup(questions: QuestionBase<string>[] ) {
        const group: any = {};

        questions.forEach(question => {
          group[question.key] = question.required ? new FormControl(question.value || '', Validators.required)
                                                  : new FormControl(question.value || '');
        });
        return new FormGroup(group);
      }
    }
    ```

### Compose dynamic form contents

- The dynamic form itself is represented by a container component, which you add in a later step. Each question is represented in the form component's template by an `<app-question>` tag, which matches an instance of DynamicFormQuestionComponent.

- dynamic-form-question.component.ts

  ```
  import { Component, Input } from '@angular/core';
  import { FormGroup } from '@angular/forms';

  import { QuestionBase } from './question-base';

  @Component({
    selector: 'app-question',
    templateUrl: './dynamic-form-question.component.html'
  })
  export class DynamicFormQuestionComponent {
    @Input() question!: QuestionBase<string>;
    @Input() form!: FormGroup;
    get isValid() { return this.form.controls[this.question.key].valid; }
  }
  ```

- dynamic-form-question.component.html

  ```
  <div [formGroup]="form">
    <label [attr.for]="question.key">{{question.label}}</label>

    <div [ngSwitch]="question.controlType">

      <input *ngSwitchCase="'textbox'" [formControlName]="question.key"
              [id]="question.key" [type]="question.type">

      <select [id]="question.key" *ngSwitchCase="'dropdown'" [formControlName]="question.key">
        <option *ngFor="let opt of question.options" [value]="opt.key">{{opt.value}}</option>
      </select>

    </div>

    <div class="errorMessage" *ngIf="!isValid">{{question.label}} is required</div>
  </div>
  ```

- Supply data

  - Another service is needed to supply a specific set of questions from which to build an individual form.

  - src/app/question.service.ts

    ```
    import { Injectable } from '@angular/core';

    import { DropdownQuestion } from './question-dropdown';
    import { QuestionBase } from './question-base';
    import { TextboxQuestion } from './question-textbox';
    import { of } from 'rxjs';

    @Injectable()
    export class QuestionService {

      // TODO: get from a remote source of question metadata
      getQuestions() {

        const questions: QuestionBase<string>[] = [

          new DropdownQuestion({
            key: 'brave',
            label: 'Bravery Rating',
            options: [
              {key: 'solid',  value: 'Solid'},
              {key: 'great',  value: 'Great'},
              {key: 'good',   value: 'Good'},
              {key: 'unproven', value: 'Unproven'}
            ],
            order: 3
          }),

          new TextboxQuestion({
            key: 'firstName',
            label: 'First name',
            value: 'Bombasto',
            required: true,
            order: 1
          }),

          new TextboxQuestion({
            key: 'emailAddress',
            label: 'Email',
            type: 'email',
            order: 2
          })
        ];

        return of(questions.sort((a, b) => a.order - b.order));
      }
    }
    ```

### Create a dynamic form template

- dynamic-form.component.ts

  ```
  import { Component, Input, OnInit } from '@angular/core';
  import { FormGroup } from '@angular/forms';

  import { QuestionBase } from './question-base';
  import { QuestionControlService } from './question-control.service';

  @Component({
    selector: 'app-dynamic-form',
    templateUrl: './dynamic-form.component.html',
    providers: [ QuestionControlService ]
  })
  export class DynamicFormComponent implements OnInit {

    @Input() questions: QuestionBase<string>[] | null = [];
    form!: FormGroup;
    payLoad = '';

    constructor(private qcs: QuestionControlService) {}

    ngOnInit() {
      this.form = this.qcs.toFormGroup(this.questions as QuestionBase<string>[]);
    }

    onSubmit() {
      this.payLoad = JSON.stringify(this.form.getRawValue());
    }
  }
  ```

- dynamic-form.component.html

  ```
  <div>
    <form (ngSubmit)="onSubmit()" [formGroup]="form">

      <div *ngFor="let question of questions" class="form-row">
        <app-question [question]="question" [form]="form"></app-question>
      </div>

      <div class="form-row">
        <button type="submit" [disabled]="!form.valid">Save</button>
      </div>
    </form>

    <div *ngIf="payLoad" class="form-row">
      <strong>Saved the following values</strong><br>{{payLoad}}
    </div>
  </div>
  ```

- Display the form

  - app.component.ts

    ```
    import { Component } from '@angular/core';

    import { QuestionService } from './question.service';
    import { QuestionBase } from './question-base';
    import { Observable } from 'rxjs';

    @Component({
      selector: 'app-root',
      template: `
        <div>
          <h2>Job Application for Heroes</h2>
          <app-dynamic-form [questions]="questions$ | async"></app-dynamic-form>
        </div>
      `,
      providers:  [QuestionService]
    })
    export class AppComponent {
      questions$: Observable<QuestionBase<any>[]>;

      constructor(service: QuestionService) {
        this.questions$ = service.getQuestions();
      }
    }
    ```

- Ensuring valid data

  - The form template uses dynamic data binding of metadata to render the form without making any hardcoded assumptions about specific questions. It adds both control metadata and validation criteria dynamically.

  - To ensure valid input, the Save button is disabled until the form is in a valid state. When the form is valid, click Save and the application renders the current form values as JSON.
