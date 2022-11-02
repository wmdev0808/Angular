# Reference

## Conceptual reference

## CLI Command Reference

- The Angular CLI is a command-line interface tool that you use to initialize, develop, scaffold, and maintain Angular applications directly from a command shell.

### Installing Angular CLI

- Install the CLI using the npm package manager:
  ```
  npm install -g @angular/cli
  ```

### Basic workflow

- Invoke the tool on the command line through the `ng` executable. Online help is available on the command line. Enter the following to list commands or options for a given command (such as generate) with a short description.

  ```
  ng help
  ng generate --help
  ```

- To create, build, and serve a new, basic Angular project on a development server, go to the parent directory of your new workspace use the following commands:
  ```
  ng new my-first-project
  cd my-first-project
  ng serve
  ```

### Workspaces and project files

- The ng new command creates an Angular workspace folder and generates a new application skeleton. A workspace can contain multiple applications and libraries. The initial application created by the ng new command is at the top level of the workspace. When you generate an additional application or library in a workspace, it goes into a projects/ subfolder.

- A newly generated application contains the source files for a root module, with a root component and template. Each application has a src folder that contains the logic, data, and assets.

- You can edit the generated files directly, or add to and modify them using CLI commands. Use the ng generate command to add new files for additional components and services, and code for new pipes, directives, and so on. Commands such as add and generate, which create or operate on applications and libraries, must be executed from within a workspace or project folder.

#### Workspace and project configuration

- A single workspace configuration file, `angular.json`, is created at the top level of the workspace. This is where you can set per-project defaults for CLI command options, and specify configurations to use when the CLI builds a project for different targets.

- The `ng config` command lets you set and retrieve configuration values from the command line, or you can edit the `angular.json` file directly.

- NOTE:
  - Option names in the configuration file must use `camelCase`, while option names supplied to commands must be dash-case.

### CLI command-language syntax

- Command syntax is shown as follows:

  ```
  ng [optional-arg] [options]
  ```

  - Most commands, and some options, have aliases. Aliases are shown in the syntax statement for each command.

  - Option names are prefixed with a double dash (`--`) characters. Option aliases are prefixed with a single dash (`-`) character. Arguments are not prefixed. For example:

    ```
    ng build my-app -c production
    ```

  - Typically, the name of a generated artifact can be given as an argument to the command or specified with the `--name` option.

  - Arguments and option names must be given in `dash-case`. For example: `--my-option-name`

#### Boolean options

- Boolean options have two forms: `--this-option` sets the flag to `true`, `--no-this-option` sets it to `false`. If neither option is supplied, the flag remains in its default state, as listed in the reference documentation.

#### Array options

- Array options can be provided in two forms: `--option value1 value2` or `--option value1 --option value2`.

#### Relative paths

- Options that specify files can be given as absolute paths, or as paths relative to the current working directory, which is generally either the workspace or project root.

#### Schematics

- The `ng generate` and `ng add` commands take, as an argument, the artifact or library to be generated or added to the current project. In addition to any general options, each artifact or library defines its own options in a schematic. Schematic options are supplied to the command in the same format as immediate command options.

### Command Overview

| COMMAND      | ALIAS | DESCRIPTION                                                                                                 |
| ------------ | ----- | ----------------------------------------------------------------------------------------------------------- |
| add          |       | Adds support for an external library to your project.                                                       |
| analytics    |       | Configures the gathering of Angular CLI usage metrics. See https://angular.io/cli/usage-analytics-gathering |
| build        | b     | Compiles an Angular application or library into an output directory named `dist/` at the given output path. |
| cache        |       | Configure persistent disk cache and retrieve cache statistics.                                              |
| completion   |       | Set up Angular CLI autocompletion for your terminal.                                                        |
| config       |       | Retrieves or sets Angular configuration values in the `angular.json` file for the workspace.                |
| deploy       |       | Invokes the deploy builder for a specified project or for the default project in the workspace.             |
| doc          | d     | Opens the official Angular documentation (angular.io) in a browser, and searches for a given keyword.       |
| e2e          | e     | Builds and serves an Angular application, then runs end-to-end tests.                                       |
| extract-i18n |       | Extracts i18n messages from source code.                                                                    |
| generate     | g     | Generates and/or modifies files based on a schematic.                                                       |
| lint         |       | Runs linting tools on Angular application code in a given project folder.                                   |
| new          | n     | Creates a new Angular workspace.                                                                            |
| run          |       | Runs an Architect target with an optional custom builder configuration defined in your project.             |
| serve        | s     | Builds and serves your application, rebuilding on file changes.                                             |
| test         | t     | Runs unit tests in a project.                                                                               |
| update       |       | Updates your workspace and its dependencies. See https://update.angular.io/.                                |
| version      | v     | Outputs Angular CLI version.                                                                                |

## API reference

### DecimalPipe

- Formats a value according to digit options and locale rules. Locale determines group sizing and separator, decimal point character, and other locale-specific configurations.

  ```
  {{ value_expression | number [ : digitsInfo [ : locale ] ] }}
  ```

#### Exported from

- CommonModule

#### Input value

- value
  - string | number
  - The value to be formatted.

#### Parameters

- digitsInfo

  - string
  - Sets digit and decimal representation. See more.
  - Optional. Default is undefined.

- locale

  - string
  - Specifies what locale format rules to use. See more.
  - Optional. Default is undefined.

#### See also

- [formatNumber()](https://angular.io/api/common/formatNumber)

#### Usage notes

##### digitsInfo

- The value's decimal representation is specified by the digitsInfo parameter, written in the following format:

  ```
  {minIntegerDigits}.{minFractionDigits}-{maxFractionDigits}
  ```

  - `minIntegerDigits`: The minimum number of integer digits before the decimal point. Default is 1.

  - `minFractionDigits`: The minimum number of digits after the decimal point. Default is 0.

  - `maxFractionDigits`: The maximum number of digits after the decimal point. Default is 3.

- If the formatted value is truncated it will be rounded using the "to-nearest" method:

  ```
  {{3.6 | number: '1.0-0'}}
  <!--will output '4'-->

  {{-3.6 | number:'1.0-0'}}
  <!--will output '-4'-->
  ```

##### locale

- `locale` will format a value according to locale rules. Locale determines group sizing and separator, decimal point character, and other locale-specific configurations.

When not supplied, uses the value of [LOCALE_ID](https://angular.io/api/core/LOCALE_ID), which is `en-US` by default.

##### Example

The following code shows how the pipe transforms values according to various format specifications, where the caller's default locale is `en-US`.

```
@Component({
  selector: 'number-pipe',
  template: `<div>

    <p>
      No specified formatting:
      {{pi | number}}
      <!--output: '3.142'-->
    </p>

    <p>
      With digitsInfo parameter specified:
      {{pi | number:'4.1-5'}}
      <!--output: '0,003.14159'-->
    </p>

    <p>
      With digitsInfo and
      locale parameters specified:
      {{pi | number:'4.1-5':'fr'}}
      <!--output: '0 003,14159'-->
    </p>

  </div>`
})
export class NumberPipeComponent {
  pi: number = 3.14159265359;
}
```

### CurrencyPipe

- Transforms a number to a currency string, formatted according to locale rules that determine group sizing and separator, decimal-point character, and other locale-specific configurations.

  ```
  {{ value_expression | currency [ : currencyCode [ : display [ : digitsInfo [ : locale ] ] ] ] }}
  ```

#### Exported from

- CommonModule

#### Input value

- value
  - string | number
  - The number to be formatted as currency.

#### Parameters

- **currencyCode**

  - string
  - The `ISO 4217` currency code, such as `USD` for the US dollar and `EUR` for the euro. The default currency code can be configured using the `DEFAULT_CURRENCY_CODE` injection token.

  - Optional. Default is `this._defaultCurrencyCode`.

- **display**

  - string | boolean
  - The format for the currency indicator. One of the following:

    - `code`: Show the code (such as USD).

    - `symbol`(default): Show the symbol (such as `$`).

    - `symbol-narrow`: Use the narrow symbol for locales that have two symbols for their currency. For example, the Canadian dollar CAD has the symbol `CA$` and the symbol-narrow `$`. If the locale has no narrow symbol, uses the standard symbol for the locale.

    - String: Use the given string value instead of a code or a symbol. For example, an empty string will suppress the currency & symbol.

    - Boolean (marked deprecated in v5): `true` for symbol and `false` for code.

  - Optional. Default is `'symbol'`.

- **digitsInfo**

  - string

  - Decimal representation options, specified by a string in the following format:
    `{minIntegerDigits}.{minFractionDigits}-{maxFractionDigits}`.

    - `minIntegerDigits`: The minimum number of integer digits before the decimal point. Default is `1`.

    - `minFractionDigits`: The minimum number of digits after the decimal point. Default is `2`.

    - `maxFractionDigits`: The maximum number of digits after the decimal point. Default is `2`. If not provided, the number will be formatted with the proper amount of digits, depending on what the `ISO 4217` specifies. For example, the Canadian dollar has 2 digits, whereas the Chilean peso has none.

  - Optional. Default is `undefined`.

- **locale**

  - string

  - A locale code for the locale format rules to use. When not supplied, uses the value of `LOCALE_ID`, which is `en-US` by default. See `Setting your app locale`.

  - Optional. Default is `undefined`.

#### See also

- [getCurrencySymbol()](https://angular.io/api/common/getCurrencySymbol)

- [formatCurrency()](https://angular.io/api/common/formatCurrency)

#### Description

- **Deprecation notice:**

  - The default currency code is currently always `USD` but this is deprecated from v9.

  - **In v11 the default currency code will be taken from the current locale identified by the `LOCALE_ID` token. See the `i18n guide` for more information.**

  - If you need the previous behavior then set it by creating a `DEFAULT_CURRENCY_CODE` provider in your application NgModule:
    ```
    {provide: DEFAULT_CURRENCY_CODE, useValue: 'USD'}
    ```

#### Usage notes

- The following code shows how the pipe transforms numbers into text strings, according to various format specifications, where the caller's default locale is `en-US`.

  ```
  @Component({
    selector: 'currency-pipe',
    template: `<div>
      <!--output '$0.26'-->
      <p>A: {{a | currency}}</p>

      <!--output 'CA$0.26'-->
      <p>A: {{a | currency:'CAD'}}</p>

      <!--output 'CAD0.26'-->
      <p>A: {{a | currency:'CAD':'code'}}</p>

      <!--output 'CA$0,001.35'-->
      <p>B: {{b | currency:'CAD':'symbol':'4.2-2'}}</p>

      <!--output '$0,001.35'-->
      <p>B: {{b | currency:'CAD':'symbol-narrow':'4.2-2'}}</p>

      <!--output '0 001,35 CA$'-->
      <p>B: {{b | currency:'CAD':'symbol':'4.2-2':'fr'}}</p>

      <!--output 'CLP1' because CLP has no cents-->
      <p>B: {{b | currency:'CLP'}}</p>
    </div>`
  })
  export class CurrencyPipeComponent {
    a: number = 0.259;
    b: number = 1.3495;
  }
  ```

### DatePipe

- Formats a date value according to locale rules.

  ```
  {{ value_expression | date [ : format [ : timezone [ : locale ] ] ] }}
  ```

#### Exported from

- `CommonModule`

#### Input value

- value: string | number | Date

#### Parameters

- **format**

  - string
  - Optional. Default is `'mediumDate'`.

- **timezone**

  - string
  - Optional. Default is `undefined`.

- **locale**
  - string
  - Optional. Default is `undefined`.

#### See also

- [formatDate()](https://angular.io/api/common/formatDate)

#### Description

- `DatePipe` is executed only when it detects a pure change to the input value. A pure change is either a change to a primitive input value (such as `String`, `Number`, `Boolean`, or `Symbol`), or a changed object reference (such as `Date`, `Array`, `Function`, or `Object`).

- Note that mutating a `Date` object does not cause the pipe to be rendered again. To ensure that the pipe is executed, you must create a new `Date` object.

- Only the `en-US` locale data comes with Angular. To localize dates in another language, you must import the corresponding locale data. See the [I18n guide](https://angular.io/guide/i18n-common-format-data-locale) for more information.

- The time zone of the formatted value can be specified either by passing it in as the second parameter of the pipe, or by setting the default through the `DATE_PIPE_DEFAULT_TIMEZONE` injection token. The value that is passed in as the second parameter takes precedence over the one defined using the injection token.

#### Usage notes

- The result of this pipe is not reevaluated when the input is mutated. To avoid the need to reformat the date on every change-detection cycle, treat the date as an immutable object and change the reference when the pipe needs to run again.

##### Pre-defined format options

| Option       | Equivalent to                                  | Examples (given in en-US locale)              |
| ------------ | ---------------------------------------------- | --------------------------------------------- |
| 'short'      | 'M/d/yy, h:mm a'                               | 6/15/15, 9:03 AM                              |
| 'medium'     | 'MMM d, y, h:mm:ss a' Jun 15, 2015, 9:03:01 AM |
| 'long'       | 'MMMM d, y, h:mm:ss a z'                       | June 15, 2015 at 9:03:01 AM GMT+1             |
| 'full'       | 'EEEE, MMMM d, y, h:mm:ss a zzzz'              | Monday, June 15, 2015 at 9:03:01 AM GMT+01:00 |
| 'shortDate'  | 'M/d/yy'                                       | 6/15/15                                       |
| 'mediumDate' | 'MMM d, y'                                     | Jun 15, 2015                                  |
| 'longDate'   | 'MMMM d, y'                                    | June 15, 2015                                 |
| 'fullDate'   | 'EEEE, MMMM d, y'                              | Monday, June 15, 2015                         |
| 'shortTime'  | 'h:mm a'                                       | 9:03 AM                                       |
| 'mediumTime' | 'h:mm:ss a'                                    | 9:03:01 AM                                    |
| 'longTime'   | 'h:mm:ss a z'                                  | 9:03:01 AM GMT+1                              |
| 'fullTime'   | 'h:mm:ss a zzzz'                               | 9:03:01 AM GMT+01:00                          |

##### Custom format options

- You can construct a format string using symbols to specify the components of a date-time value, as described in the following table. Format details depend on the locale. Fields marked with (\*) are only available in the extra data set for the given locale.

  | Field type          | Format      | Description                                                  | Example Value                                              |
  | ------------------- | ----------- | ------------------------------------------------------------ | ---------------------------------------------------------- |
  | Era                 | G, GG & GGG | Abbreviated                                                  | AD                                                         |
  |                     | GGGG        | Wide                                                         | Anno Domini                                                |
  |                     | GGGGG       | Narrow                                                       | A                                                          |
  | Year                | y           | Numeric: minimum digits                                      | 2, 20, 201, 2017, 20173                                    |
  |                     | yy          | Numeric: 2 digits + zero padded                              | 02, 20, 01, 17, 73                                         |
  |                     | yyy         | Numeric: 3 digits + zero padded                              | 002, 020, 201, 2017, 20173                                 |
  |                     | yyyy        | Numeric: 4 digits or more + zero padded                      | 0002, 0020, 0201, 2017, 20173                              |
  | Week-numbering year | Y           | Numeric: minimum digits                                      | 2, 20, 201, 2017, 20173                                    |
  |                     | YY          | Numeric: 2 digits + zero padded                              | 02, 20, 01, 17, 73                                         |
  |                     | YYY         | Numeric: 3 digits + zero padded                              | 002, 020, 201, 2017, 20173                                 |
  |                     | YYYY        | Numeric: 4 digits or more + zero padded                      | 0002, 0020, 0201, 2017, 20173                              |
  | Month               | M           | Numeric: 1 digit                                             | 9, 12                                                      |
  |                     | MM          | Numeric: 2 digits + zero padded                              | 09, 12                                                     |
  |                     | MMM         | Abbreviated                                                  | Sep                                                        |
  |                     | MMMM        | Wide                                                         | September                                                  |
  |                     | MMMMM       | Narrow                                                       | S                                                          |
  | Month standalone    | L           | Numeric: 1 digit                                             | 9, 12                                                      |
  |                     | LL          | Numeric: 2 digits + zero padded                              | 09, 12                                                     |
  |                     | LLL         | Abbreviated                                                  | Sep                                                        |
  |                     | LLLL        | Wide                                                         | September                                                  |
  |                     | LLLLL       | Narrow                                                       | S                                                          |
  | Week of year        | w           | Numeric: minimum digits                                      | 1... 53                                                    |
  |                     | ww          | Numeric: 2 digits + zero padded                              | 01... 53                                                   |
  | Week of month       | W           | Numeric: 1 digit                                             | 1... 5                                                     |
  | Day of month        | d           | Numeric: minimum digits                                      | 1                                                          |
  |                     | dd          | Numeric: 2 digits + zero padded                              | 01                                                         |
  | Week day            | E, EE & EEE | Abbreviated                                                  | Tue                                                        |
  |                     | EEEE        | Wide                                                         | Tuesday                                                    |
  |                     | EEEEE       | Narrow                                                       | T                                                          |
  |                     | EEEEEE      | Short                                                        | Tu                                                         |
  | Week day standalone | c, cc       | Numeric: 1 digit                                             | 2                                                          |
  |                     | ccc         | Abbreviated                                                  | Tue                                                        |
  |                     | cccc        | Wide                                                         | Tuesday                                                    |
  |                     | ccccc       | Narrow                                                       | T                                                          |
  |                     | cccccc      | Short                                                        | Tu                                                         |
  | Period              | a, aa & aaa | Abbreviated                                                  | am/pm or AM/PM                                             |
  |                     | aaaa        | Wide (fallback to `a` when missing)                          | ante meridiem/post meridiem                                |
  |                     | aaaaa       | Narrow                                                       | a/p                                                        |
  | Period\*            | B, BB & BBB | Abbreviated                                                  | mid.                                                       |
  |                     | BBBB        | Wide                                                         | am, pm, midnight, noon, morning, afternoon, evening, night |
  |                     | BBBBB       | Narrow                                                       | md                                                         |
  | Period standalone\* | b, bb & bbb | Abbreviated                                                  | mid.                                                       |
  |                     | bbbb        | Wide                                                         | am, pm, midnight, noon, morning, afternoon, evening, night |
  |                     | bbbbb       | Narrow                                                       | md                                                         |
  | Hour 1-12           | h           | Numeric: minimum digits                                      | 1, 12                                                      |
  |                     | hh          | Numeric: 2 digits + zero padded                              | 01, 12                                                     |
  | Hour 0-23           | H           | Numeric: minimum digits                                      | 0, 23                                                      |
  |                     | HH          | Numeric: 2 digits + zero padded                              | 00, 23                                                     |
  | Minute              | m           | Numeric: minimum digits                                      | 8, 59                                                      |
  |                     | mm          | Numeric: 2 digits + zero padded                              | 08, 59                                                     |
  | Second              | s           | Numeric: minimum digits                                      | 0... 59                                                    |
  |                     | ss          | Numeric: 2 digits + zero padded                              | 00... 59                                                   |
  | Fractional seconds  | S           | Numeric: 1 digit                                             | 0... 9                                                     |
  |                     | SS          | Numeric: 2 digits + zero padded                              | 00... 99                                                   |
  |                     | SSS         | Numeric: 3 digits + zero padded (= milliseconds)             | 000... 999                                                 |
  | Zone                | z, zz & zzz | Short specific non location format (fallback to O)           | GMT-8                                                      |
  |                     | zzzz        | Long specific non location format (fallback to OOOO)         | GMT-08:00                                                  |
  |                     | Z, ZZ & ZZZ | ISO8601 basic format                                         | -0800                                                      |
  |                     | ZZZZ        | Long localized GMT format                                    | GMT-8:00                                                   |
  |                     | ZZZZZ       | ISO8601 extended format + Z indicator for offset 0 (= XXXXX) | -08:00                                                     |
  |                     | O, OO & OOO | Short localized GMT format                                   | GMT-8                                                      |
  |                     | OOOO        | Long localized GMT format                                    | GMT-08:00                                                  |

##### Format examples

- These examples transform a date into various formats, assuming that `dateObj` is a JavaScript Date object for year: 2015, month: 6, day: 15, hour: 21, minute: 43, second: 11, given in the local time for the `en-US` locale.

  ```
  {{ dateObj | date }}               // output is 'Jun 15, 2015'
  {{ dateObj | date:'medium' }}      // output is 'Jun 15, 2015, 9:43:11 PM'
  {{ dateObj | date:'shortTime' }}   // output is '9:43 PM'
  {{ dateObj | date:'mm:ss' }}       // output is '43:11'
  ```

##### Usage example

- The following component uses a date pipe to display the current date in different formats.

  ```
  @Component({
    selector: 'date-pipe',
    template: `<div>
      <p>Today is {{today | date}}</p>
      <p>Or if you prefer, {{today | date:'fullDate'}}</p>
      <p>The time is {{today | date:'h:mm a z'}}</p>
    </div>`
  })
  // Get the current date and time as a date-time value.
  export class DatePipeComponent {
    today: number = Date.now();
  }
  ```

## Error reference

### NG0100: Expression has changed after it was checked

#### Description

- Angular throws an ExpressionChangedAfterItHasBeenCheckedError when an expression value has been changed after change detection has completed. Angular only throws this error in development mode.

- In development mode, Angular performs an additional check after each change detection run, to ensure the bindings haven't changed. This catches errors where the view is left in an inconsistent state. This can occur, for example, if a method or getter returns a different value each time it is called, or if a child component changes values on its parent. If either of these occurs, this is a sign that change detection is not stabilized. Angular throws the error to ensure data is always reflected correctly in the view, which prevents erratic UI behavior or a possible infinite loop.

- This error commonly occurs when you've added template expressions or have begun to implement lifecycle hooks like ngAfterViewInit or ngOnChanges. It is also common when dealing with loading status and asynchronous operations, or when a child component changes its parent bindings.

#### Debugging the error

- The source maps generated by the CLI are very useful when debugging. Navigate up the call stack until you find a template expression where the value displayed in the error has changed.

- Ensure that there are no changes to the bindings in the template after change detection is run. This often means refactoring to use the correct component lifecycle hook for your use case. If the issue exists within ngAfterViewInit, the recommended solution is to use a constructor or ngOnInit to set initial values, or use ngAfterContentInit for other value bindings.

- If you are binding to methods in the view, ensure that the invocation does not update any of the other bindings in the template.

### NG01003: Async validator must return a Promise or Observable

#### Description

- Async validators must return a promise or an observable, and emit/resolve them whether the validation fails or succeeds. In particular, they must implement the `AsyncValidatorFn API`

  ```
  export function isTenAsync(control: AbstractControl):
    Observable<ValidationErrors | null> {
    const v: number = control.value;
    if (v !== 10) {
    // Emit an object with a validation error.
      return of({ 'notTen': true, 'requiredValue': 10 });
    }
    // Emit null, to indicate no error occurred.
    return of(null);
  }
  ```

#### Debugging the error

- Did you mistakenly use a synchronous validator instead of an async validator?

### NG0200: Circular dependency in DI detected while instantiating a provider

#### Description

- A cyclic dependency exists when a `dependency of a service` directly or indirectly depends on the service itself. For example, if UserService depends on EmployeeService, which also depends on UserService. Angular will have to instantiate EmployeeService to create UserService, which depends on UserService, itself.

#### Debugging the error

- Use the call stack to determine where the cyclical dependency exists. You will be able to see if any child dependencies rely on the original file by mapping out the component, module, or service's dependencies, and identifying the loop causing the problem.

- Break this loop (or circle) of dependency to resolve this error. This most commonly means removing or refactoring the dependencies to not be reliant on one another.

### NG0201: No provider for {token} found!

#### Description

- You see this error when you try to inject a service but have not declared a corresponding provider. A provider is a mapping that supplies a value that you can inject into the constructor of a class in your application.

#### Debugging the error

- Work backwards from the object where the error states that a `provider` is missing: `No provider for ${this}!`. This is commonly thrown in `services`, which require non-existing providers.

- To fix the error ensure that your service is registered in the list of providers of an `NgModule` or has the `@Injectable` decorator with a providedIn property at top.

- The most common solution is to add a provider in `@Injectable` using `providedIn`:
  ```
  @Injectable({ providedIn: 'app' })
  ```

### NG0203: `inject()` must be called from an injection context such as a constructor, a factory function, a field initializer, or a function used with `EnvironmentInjector#runInContext`.

#### Description

- You see this error when you try to use the `inject()` function outside of the allowed injection context. The injection context is available during the class creation and initialization. It is also available to functions used with `EnvironmentInjector#runInContext`.

- In practice the `inject()` calls are allowed in a constructor, a constructor parameter and a field initializer:

  ```
  @Injectable({providedIn: 'root'})
  export class Car {
    radio: Radio|undefined;

    // OK: field initializer
    spareTyre = inject(Tyre);

    constructor() {
      // OK: constructor body
      this.radio = inject(Radio);
    }
  }
  ```

- It is also legal to call `inject` from a provider's factory:

  ```
  providers: [
    {provide: Car, useFactory: () => {
      // OK: a class factory
      const engine = inject(Engine);
      return new Car(engine);
    }}
  ]
  ```

- Calls to the `inject()` function outside of the class creation or `runInContext` will result in error. Most notably, calls to `inject()` are disallowed after a class instance was created, in methods (including lifecycle hooks):
  ```
  @Component({ ... })
  export class CarComponent {
    ngOnInit() {
      // ERROR: too late, the component instance was already created
      const engine = inject(Engine);
      engine.start();
    }
  }
  ```

#### Debugging the error

- Work backwards from the stack trace of the error to identify a place where the disallowed call to `inject()` is located.

- To fix the error move the `inject()` call to an allowed place (usually a class constructor or a field initializer).

### NG02200: Cannot find a differ for object in ngFor

#### Description

- `NgFor` could not find an iterable differ for the value passed in. Make sure it's an iterable, like an `Array`.

#### Debugging the error

- When using ngFor in a template, you must use some type of Iterable, like `Array`, `Set`, `Map`, etc. If you're trying to iterate over the keys in an object, you should look at the `KeyValue pipe` instead.

### NG0300: Multiple components match with the same tagname

#### Description

- Two or more components use the same `element selector`. Because there can only be a single component associated with an element, selectors must be unique strings to prevent ambiguity for Angular.

#### Debugging the error

- Use the element name from the error message to search for places where you're using the same selector declaration in your codebase:

  ```
  @Component({
    selector: 'YOUR_STRING',
    …
  })
  ```

- Ensure that each component has a unique CSS selector. This will guarantee that Angular renders the component you expect.

- If you're having trouble finding multiple components with this selector tag name, check for components from imported component libraries, such as Angular Material. Make sure you're following the best practices for your selectors to prevent collisions.

### NG0301: Export not found!

#### Description

- Angular can't find a directive with `{{ PLACEHOLDER }}` export name. The export name is specified in the exportAs property of the directive decorator. This is common when using FormsModule or Material modules in templates and you've forgotten to `import the corresponding modules`.

- This is the runtime equivalent of a common compiler error `NG8003: No directive found with export`.

#### Debugging the error

- Use the export name to trace the templates or modules using this export.

- Ensure that all dependencies are `properly imported and declared in your NgModules`. For example, if the export not found is `ngForm`, we need to import `FormsModule` and declare it in the list of imports in `*.module.ts` to resolve the error.

  ```
  import { FormsModule } from '@angular/forms';

  @NgModule({
    …
    imports: [
      FormsModule,
      …
  ```

- If you recently added an import, you may need to restart your server to see these changes.

### NG0302: Pipe not found!

#### Description

- Angular can't find a pipe with this name.

- The pipe referenced in the template has not been named or declared properly.

- In order for a `pipe` to be used:

  - it must be declared as a part of an `NgModule` (added to the `declarations` array) or marked as standalone (by adding the `standalone: true` flag to the Pipe decorator).

  - it must be imported in an `NgModule` or a standalone component where it is used.

  - the name used in a template must match the name defined in the Pipe decorator.

#### Debugging the error

- Use the pipe name to trace where the pipe is declared and used.

- To resolve this error, ensure that:

  - If the pipe is local to the NgModule, it is uniquely named in the pipe's decorator and declared in the NgModule.
  - If the pipe is standalone or from another NgModule, it is added to the imports field of the current NgModule or standalone component.

- If you recently added an import or declaration, you may need to restart your server to see these changes.

### NG1001: Decorator argument is not an object literal

#### Description

- To make the metadata extraction in the Angular compiler faster, the decorators @NgModule, @Pipe, @Component, @Directive, and @Injectable accept only object literals as arguments.

- This is an intentional change in Ivy, which enforces stricter argument requirements for decorators than View Engine. Ivy requires this approach because it compiles decorators by moving the expressions into other locations in the class output.

#### Debugging the error

- Move all declarations:

  ```
  const moduleDefinition = {…}

  @NgModule(moduleDefinition)
  export class AppModule {
      constructor() {}
  }
  ```

- into the decorator:
  ```
  @NgModule({…})
  export class AppModule {
      constructor() {}
  }
  ```

### NG2003: No suitable injection token for parameter

#### Description

- There is no injection token for a constructor parameter at compile time. `InjectionTokens` are tokens that can be used in a Dependency Injection Provider.

#### Debugging the error

- Look at the parameter that throws the error, and all uses of the class. This error is commonly thrown when a constructor defines parameters with primitive types such as `string`, `number`, `boolean`, and `Object`.

- Use the `@Injectable` method or `@Inject` decorator from `@angular/core` to ensure that the type you are injecting is reified (has a runtime representation). Make sure to add a provider to this decorator so that you do not throw `NG0201: No Provider Found`.

### NG2009: Component selector does not match shadow DOM requirements

#### Description

- The selector of a component using `ViewEncapsulation.ShadowDom` doesn't match the custom element tag name requirements.

- In order for a tag name to be considered a valid custom element name, it has to:

  - Be in lower case.
  - Contain a hyphen.
  - Start with a letter (a-z).

#### Debugging the error

- Rename your component's selector so that it matches the requirements.

  - Before:

    ```
    @Component({
      selector: 'comp',
      encapsulation: ViewEncapsulation.ShadowDom
      …
    })
    ```

  - After:
    ```
    @Component({
      selector: 'app-comp',
      encapsulation: ViewEncapsulation.ShadowDom
      …
    })
    ```

### NG3003: Import cycles would need to be created to compile this component

#### Description

- A component, directive, or pipe that is referenced by this component would require the compiler to add an import that would lead to a cycle of imports. For example, consider a scenario where a `ParentComponent` references a `ChildComponent` in its template:

  - parent.component.ts

    ```
    import { Component } from '@angular/core';

    @Component({selector: 'app-parent', template: '<app-child></app-child>'})
    export class ParentComponent {}
    ```

  - child.component.ts

    ```
    import { Component } from '@angular/core';
    import { ParentComponent } from './parent.component';

    @Component({selector: 'app-child', template: 'The child!'})
    export class ChildComponent {
      constructor(private parent: ParentComponent) {}
    }
    ```

- There is already an import from `child.component.ts` to `parent.component.ts` since the `ChildComponent` references the `ParentComponent` in its constructor.

- NOTE:

  - The parent component's template contains `<child></child>`. The generated code for this template must therefore contain a reference to the `ChildComponent` class. In order to make this reference, the compiler would have to add an import from `parent.component.ts` to `child.component.ts`, which would cause an import cycle:

    ```
    parent.component.ts -> child.component.ts -> parent.component.ts
    ```

##### Remote Scoping

- To avoid adding imports that create cycles, additional code is added to the NgModule class where the component that wires up the dependencies is declared. This is known as "remote scoping".

##### Libraries

- Unfortunately, "remote scoping" code is side-effectful —which prevents tree shaking— and cannot be used in libraries. So when building libraries using the `"compilationMode": "partial"` setting, any component that would require a cyclic import will cause this `NG3003` compiler error to be raised.

#### Debugging the error

- The cycle that would be generated is shown as part of the error message. For example:

  ```
  The component ChildComponent is used in the template but importing it would create a cycle:
  /parent.component.ts -> /child.component.ts -> /parent.component.ts
  ```

- Use this to identify how the referenced component, pipe, or directive has a dependency back to the component being compiled. Here are some ideas for fixing the problem:

  - Try to rearrange your dependencies to avoid the cycle. For example, using an intermediate interface that is stored in an independent file that can be imported to both dependent files without causing an import cycle.

  - Move the classes that reference each other into the same file, to avoid any imports between them.

  - Convert import statements to type-only imports (using `import type` syntax) if the imported declarations are only used as types, as type-only imports do not contribute to cycles.

### NG6100: Setting NgModule.id to module.id is a common anti-pattern

#### Description

- Using `module.id` as an NgModule `id` is a common anti-pattern and is likely not serving a useful purpose in your code.

- NgModules can be declared with an id:

  ```
  @NgModule({
    id: 'my_module'
  })
  export class MyModule {}
  ```

- Declaring an id makes the NgModule available for lookup via the getNgModuleById() operation. This functionality is rarely used, mainly in very specific bundling scenarios when lazily loading NgModules without obtaining direct references to them. In most Angular code, ES dynamic import() (import('./path/to/module')) should be used instead, as this provides a direct reference to the NgModule being loaded without the need for a global registration side effect.

- If you are not using getNgModuleById, you do not need to provide ids for your NgModules. Providing one has a significant drawback: it makes the NgModule non-tree-shakable, which can have an impact on your bundle size.

- In particular, the pattern of specifying id: module.id results from a misunderstanding of @NgModule.id. In earlier versions of Angular, it was sometimes necessary to include the property moduleId: module.id in @Component metadata.

- Using module.id for @NgModule.id likely results from confusion between @Component.moduleId and @NgModule.id. module.id would not typically be useful for getNgModuleById() operations as the id needs to be a well-known string, and module.id is usually opaque to consumers.

#### Debugging the error

- You can remove the `id: module.id` declaration from your NgModules. The compiler ignores this declaration and issues this warning instead.

### NG6999: Invalid @NgModule() metadata

#### Description

- This error represents the import or export of an `@NgModule()` that doesn't have valid metadata.

#### Debugging the error

- The library might have been processed with ngcc. If this is the case, try removing and reinstalling node_modules. This error is likely due to the library being published for Angular Ivy, which cannot be used in this View Engine application. If that is not the case then it might be a View Engine based library that was converted to Ivy by ngcc during a postinstall step.

- Check the peer dependencies to ensure that you're using a compatible version of Angular.

### NG8001: Unknown HTML element or component

#### Description

- One or more elements cannot be resolved during compilation because the element is not defined by the HTML spec, or there is no component or directive with such element selector.
  - This is the compiler equivalent of a common runtime error `NG0304: '${tagName}' is not a known element: ....`

#### Debugging the error

- Use the element name in the error to find the file(s) where the element is being used.

- Check that the name and selector are correct.

- Make sure that the component is correctly imported inside your NgModule or standalone component, by checking its presence in the imports field. If the component is declared in an NgModule (meaning that it is not standalone) make sure that it is exported correctly from it, by checking its presence in the exports field.

- When using custom elements or web components, ensure that you add `CUSTOM_ELEMENTS_SCHEMA` to the application module.

- If this does not resolve the error, check the imported libraries for any recent changes to the exports and properties you are using, and restart your server.

### NG8002: Unknown attribute or input

#### Description

- An attribute or property cannot be resolved during compilation.

- This error arises when attempting to bind to a property that does not exist. Any property binding must correspond to either:

  - A native property on the HTML element, or
  - An `@Input()` property of a component or directive applied to the element.

- The runtime error for this is `NG0304: '${tagName}' is not a known element: &hellip;'`.

#### Debugging the error

- Look at documentation for the specific binding syntax used. This is usually a typo or incorrect import. There may also be a missing direction with property selector 'name' or missing input.

### NG8003: No directive found with export

#### Description

- Angular can't find a directive with `{{ PLACEHOLDER }}` export name. This is common with a missing import or a missing `exportAs` on a directive.

- This is the compiler equivalent of a common runtime error `NG0301: Export Not Found`.

#### Debugging the error

- Use the string name of the export not found to trace the templates or modules using this export.

- Ensure that all dependencies are properly imported and declared in our Modules. For example, if the export not found is `ngForm`, we will need to import `FormsModule` and declare it in our list of imports in \*.module.ts to resolve the missing export error.

  ```
  import { FormsModule } from '@angular/forms';

  @NgModule({
    …
    imports: [
      FormsModule,
      …
  ```

- If you recently added an import, you will need to restart your server to see these changes.

## Extended diagnostic reference

### Extended Diagnostics Overview

- There are many coding patterns that are technically valid to the compiler or runtime, but which may have complex nuances or caveats. These patterns may not have the intended effect expected by a developer, which often leads to bugs. The Angular compiler includes "extended diagnostics" which identify many of these patterns, in order to warn developers about the potential issues and enforce common best practices within a codebase.

#### Diagnostics

- Currently, Angular supports the following extended diagnostics:

  - NG8101 - invalidBananaInBox
  - NG8102 - nullishCoalescingNotNullable

#### Configuration

- Extended diagnostics are warnings by default and do not block compilation. Each diagnostic can be configured as either:

  - warning (default) - The compiler emits the diagnostic as a warning but does not block compilation. The compiler will still exit with status code 0, even if warnings are emitted.
  - error - The compiler emits the diagnostic as an error and fails the compilation. The compiler will exit with a non-zero status code if one or more errors are emitted.
  - suppress - The compiler does not emit the diagnostic at all.

- Check severity can be configured in the project's `tsconfig.json` file:

  ```
  {
    "angularCompilerOptions": {
      "extendedDiagnostics": {
        // The categories to use for specific diagnostics.
        "checks": {
          // Maps check name to its category.
          "invalidBananaInBox": "suppress"
        },

        // The category to use for any diagnostics not listed in `checks` above.
        "defaultCategory": "error"
      }
    }
  }
  ```

- The `checks` field maps the name of individual diagnostics to their associated category. See `Diagnostics` for a complete list of extended diagnostics and the name to use for configuring them.

- The `defaultCategory` field is used for any diagnostics that are not explicitly listed under checks. If not set, such diagnostics will be treated as warning.

- Extended diagnostics will emit when `strictTemplates` is enabled. This is required to allow the compiler to better understand Angular template types and provide accurate and meaningful diagnostics.

#### Semantic Versioning

- The Angular team intends to add or enable new extended diagnostics in minor versions of Angular (see semver). This means that upgrading Angular may show new warnings in your existing codebase. This enables the team to deliver features more quickly and to make extended diagnostics more accessible to developers.

- However, setting `"defaultCategory": "error"` will promote such warnings to hard errors. This can cause a minor version upgrade to introduce compilation errors, which may be seen as a semver non-compliant breaking change. Any new diagnostics can be suppressed or demoted to warnings via the above configuration, so the impact of a new diagnostic should be minimal to projects that treat extended diagnostics as errors by default. Defaulting to error is a very powerful tool; just be aware of this semver caveat when deciding if error is the right default for your project.

#### New Diagnostics

- The Angular team is always open to suggestions about new diagnostics that could be added. Extended diagnostics should generally:

  - Detect a common, non-obvious developer mistake with Angular templates
  - Clearly articulate why this pattern can lead to bugs or unintended behavior
  - Suggest one or more clear solutions
  - Have a low, preferably zero, false-positive rate
  - Apply to the vast majority of Angular applications (not specific to an unofficial library)
  - Improve program correctness or performance (not style, that responsibility falls to a linter)

### NG8101: Invalid Banana-in-Box

#### Description

- This diagnostic detects a backwards "banana-in-box" syntax for two-way bindings.
  ```
  <div ([var])="otherVar"></div>
  ```

#### What's wrong with that?

- As it stands, ([var]) is actually an event binding with the name [var]. The author likely intended this as a two-way binding to a variable named var but, as written, this binding has no effect.

#### What should I do instead?

- Fix the typo. As the name suggests, the banana ( should go inside the box []. In this case:
  ```
  <div [(var)]="otherVar"></div>
  ```

#### Configuration requirements

- `strictTemplates` must be enabled for any extended diagnostic to emit. `invalidBananaInBox` has no additional requirements beyond `strictTemplates`.

#### What if I can't avoid this?

- This diagnostic can be disabled by editing the project's `tsconfig.json` file:
  ```
  {
    "angularCompilerOptions": {
      "extendedDiagnostics": {
        "checks": {
          "invalidBananaInBox": "suppress"
        }
      }
    }
  }
  ```

### NG8102: Nullish coalescing not nullable

#### Description

- This diagnostic detects a useless nullish coalescing operator (`??`) characters in Angular templates. Specifically, it looks for operations where the input is not "nullable", meaning its type does not include `null` or `undefined`. For such values, the right side of the `??` will never be used.

  ```
  import {Component} from '@angular/core';

  @Component({
    // Template displays `foo` if present, falls back to 'bar' if it is `null`
    // or `undefined`.
    template: `{{ foo ?? 'bar' }}`,
    // …
  })
  class MyComponent {
    // `foo` is declared as a `string` which *cannot* be `null` or `undefined`.
    foo: string = 'test';
  }
  ```

#### What's wrong with that?

- Using the nullish coalescing operator with a non-nullable input has no effect and is indicative of a discrepancy between the allowed type of a value and how it is presented in the template. A developer might reasonably assume that the right side of the nullish coalescing operator is displayed in some case, but it will never actually be displayed. This can lead to confusion about the expected output of the program.

#### What should I do instead?

- Update the template and declared type to be in sync. Double-check the type of the input and confirm whether it is actually expected to be nullable.

- If the input should be nullable, add `null` or `undefined` to its type to indicate this.

  ```
  import {Component} from '@angular/core';

  @Component({
    template: `{{ foo ?? 'bar' }}`,
    // …
  })
  class MyComponent {
    // `foo` is now nullable. If it is ever set to `null`, 'bar' will be displayed.
    foo: string | null = 'test';
  }
  ```

- If the input should not be nullable, delete the ?? operator and its right operand, since the value is guaranteed by TypeScript to always be non-nullable.

  ```
  import {Component} from '@angular/core';

  @Component({
    // Template always displays `foo`, which is guaranteed to never be `null` or
    // `undefined`.
    template: `{{ foo }}`,
    // …
  })
  class MyComponent {
    foo: string = 'test';
  }
  ```

#### Configuration requirements

- `strictTemplates` must be enabled for any extended diagnostic to emit. `strictNullChecks` must also be enabled to emit any nullishCoalescingNotNullable diagnostics.

#### What if I can't avoid this?

- This diagnostic can be disabled by editing the project's `tsconfig.json` file:

  ```
  {
    "angularCompilerOptions": {
      "extendedDiagnostics": {
        "checks": {
          "nullishCoalescingNotNullable": "suppress"
        }
      }
    }
  }
  ```

## Example applications

## Angular glossary

- Angular has its own vocabulary. Most Angular terms are common English words or computing terms that have a specific meaning within the Angular system.

- This glossary lists the most prominent terms and a few less familiar ones with unusual or unexpected definitions.

### ahead-of-time (AOT) compilation

- The Angular ahead-of-time (AOT) compiler converts Angular HTML and TypeScript code into efficient JavaScript code during the build phase. The build phase occurs before the browser downloads and runs the rendered code. This is the best compilation mode for production environments, with decreased load time and increased performance compared to just-in-time (JIT) compilation.

- By compiling your application using the ngc command-line tool, you can bootstrap directly to a module factory, so you do not need to include the Angular compiler in your JavaScript bundle.

### Angular element

- An Angular component packaged as a custom element.

### Angular package format (APF)

- An Angular specific specification for layout of npm packages that is used by all first-party Angular packages, and most third-party Angular libraries.

### annotation

- A structure that provides metadata for a class.

### app-shell

- App shell is a way to render a portion of your application using a route at build time. This gives users a meaningful first paint of your application that appears quickly because the browser can render static HTML and CSS without the need to initialize JavaScript. To learn more, see The App Shell Model.

- You can use the Angular CLI to generate an app shell. This can improve the user experience by quickly launching a static rendered page while the browser downloads the full client version and switches to it automatically after the code loads. A static rendered page is a skeleton common to all pages. To learn more, see Service Worker and PWA.

### Architect

- The tool that the Angular CLI uses to perform complex tasks such as compilation and test running, according to a provided configuration. Architect is a shell that runs a builder with a given target configuration. The builder is defined in an npm package.

- In the workspace configuration file, an "architect" section provides configuration options for Architect builders.

- For example, a built-in builder for linting is defined in the package @angular-devkit/build_angular:tslint, which uses the TSLint tool to perform linting, with a configuration specified in a tslint.json file.

- Use the ng run Angular CLI command to invoke a builder by specifying a target configuration associated with that builder. Integrators can add builders to enable tools and workflows to run through the Angular CLI. For example, a custom builder can replace the third-party tools used by the built-in implementations for Angular CLI commands, such as ng build or ng test.

### attribute directive

- A category of directive that can listen to and modify the behavior of other HTML elements, attributes, properties, and components. They are usually represented as HTML attributes, hence the name.

### binding

- Generally, the practice of setting a variable or property to a data value. Within Angular, typically refers to data binding, which coordinates DOM object properties with data object properties.

- Sometimes refers to a dependency-injection binding between a token and a dependency provider.

### bootstrap

- A way to initialize and launch an application or system.

- In Angular, the AppModule root NgModule of an application has a bootstrap property that identifies the top-level components of the application. During the bootstrap process, Angular creates and inserts these components into the index.html host web page. You can bootstrap multiple applications in the same index.html. Each application contains its own components.

### builder

- A function that uses the Architect API to perform a complex process such as build or test. The builder code is defined in an npm package.

- For example, BrowserBuilder runs a webpack build for a browser target and KarmaBuilder starts the Karma server and runs a webpack build for unit tests.

- The ng run Angular CLI command invokes a builder with a specific target configuration. The workspace configuration file, angular.json, contains default configurations for built-in builders.

### case types

- Angular uses capitalization conventions to distinguish the names of various types, as described in the naming guidelines section of the Style Guide. Here is a summary of the case types:
- camelCase

  - Symbols, properties, methods, pipe names, non-component directive selectors, constants.
  - Standard or lower camel case uses lowercase on the first letter of the item.
  - selectedHero

- UpperCamelCase/PascalCase

  - Class names, including classes that define components, interfaces, NgModules, directives, and pipes.
  - Upper camel case uses uppercase on the first letter of the item.
  - HeroComponent

- dash-case/kebab-case

  - Descriptive part of file names, component selectors.
  - app-hero-list

- underscore_case/snake_case

  - Not typically used in Angular.
  - Snake case uses words connected with underscores.
  - convert_link_mode

- UPPER_UNDERSCORE_CASE/UPPER_SNAKE_CASE/SCREAMING_SNAKE_CASE
  - Traditional for constants.
  - This case is acceptable, but camelCase is preferred.
  - Upper snake case uses words in all capital letters connected with underscores.
  - FIX_ME

### change detection

- The mechanism by which the Angular framework synchronizes the state of the UI of an application with the state of the data. The change detector checks the current state of the data model whenever it runs, and maintains it as the previous state to compare on the next iteration.

- As the application logic updates component data, values that are bound to DOM properties in the view can change. The change detector is responsible for updating the view to reflect the current data model. Similarly, the user can interact with the UI, causing events that change the state of the data model. These events can trigger change detection.

- Using the default change-detection strategy, the change detector goes through the view hierarchy on each VM turn to check every data-bound property in the template. In the first phase, it compares the current state of the dependent data with the previous state, and collects changes. In the second phase, it updates the page DOM to reflect any new data values.

- If you set the `OnPush` change-detection strategy, the change detector runs only when explicitly invoked, or when it is triggered by an Input reference change or event handler. This typically improves performance. To learn more, see Optimize the change detection in Angular.

### class decorator

- A decorator that appears immediately before a class definition, which declares the class to be of the given type, and provides metadata suitable to the type.

- The following decorators can declare Angular class types.

  - `@Component()`
  - `@Directive()`
  - `@Pipe()`
  - `@Injectable()`
  - `@NgModule()`

### class field decorator

A decorator statement immediately before a field in a class definition that declares the type of that field. Some examples are `@Input` and `@Output`.

### collection

- In Angular, a set of related schematics collected in an npm package.

### command-line interface (CLI)

- The Angular CLI is a command-line tool for managing the Angular development cycle. Use it to create the initial filesystem scaffolding for a workspace or project, and to run schematics that add and modify code for initial generic versions of various elements. The Angular CLI supports all stages of the development cycle, including building, testing, bundling, and deployment.

- To begin using the Angular CLI for a new project, see Local Environment Setup.
  To learn more about the full capabilities of the Angular CLI, see the Angular CLI command reference.
  See also Schematics CLI.

### component

- A class with the @Component() decorator that associates it with a companion template. Together, the component class and template define a view. A component is a special type of directive. The @Component() decorator extends the @Directive() decorator with template-oriented features.

- An Angular component class is responsible for exposing data and handling most of the display and user-interaction logic of the view through data binding.

- Read more about component classes, templates, and views in Introduction to Angular concepts.

### configuration

- See `workspace configuration`

### content projection

- A way to insert DOM content from outside a component into the view of the component in a designated spot.

- To learn more, see Responding to changes in content.

### custom element

- A web platform feature, currently supported by most browsers and available in other browsers through polyfills. See Browser support.

- The custom element feature extends HTML by allowing you to define a tag whose content is created and controlled by JavaScript code. A custom element is recognized by a browser when it is added to the CustomElementRegistry. A custom element is also referenced as a web component.

- You can use the API to transform an Angular component so that it can be registered with the browser and used in any HTML that you add directly to the DOM within an Angular application. The custom element tag inserts the view of the component, with change-detection and data-binding functionality, into content that would otherwise be displayed without Angular processing. See Angular element. See also dynamic component loading.

### data binding

- A process that allows applications to display data values to a user and respond to user actions. User actions include clicks, touches, keystrokes, and so on.

- In data binding, you declare the relationship between an HTML widget and a data source and let the framework handle the details. Data binding is an alternative to manually pushing application data values into HTML, attaching event listeners, pulling changed values from the screen, and updating application data values.

- Read about the following forms of binding of the Template Syntax in Angular:

  - Interpolation
  - Property binding
  - Event binding
  - Attribute binding
  - Class and style binding
  - Two-way data binding with ngModel

### declarable

- A class that you can add to the declarations list of an NgModule. You can declare components, directives, and pipes, unless they have the standalone flag in their decorators set to true, which makes them standalone. Note: standalone components/directives/pipes are not declarables. More info about standalone classes can be found below.

- Do not declare the following:

  - A class already declared as standalone.
  - A class that is already declared in another NgModule.
  - An array of directives imported from another package. For example, do not declare FORMS_DIRECTIVES from @angular/forms.
  - NgModule classes.
  - Service classes.
  - Non-Angular classes and objects, such as strings, numbers, functions, entity models, configurations, business logic, and helper classes.

- Note that declarables can also be declared as standalone and simply be imported inside other standalone components or existing NgModules, to learn more, see the Standalone components guide.

### decorator | decoration

- A function that modifies a class or property definition. Decorators are an experimental (stage 3) JavaScript language feature. A decorator is also referenced as an annotation. TypeScript adds support for decorators.

- Angular defines decorators that attach metadata to classes or properties so that it knows what those classes or properties mean and how they should work.

- To learn more, see class decorator. See also class field decorator.

### dependency injection (DI)

- A design pattern and mechanism for creating and delivering some parts of an application (dependencies) to other parts of an application that require them.

- In Angular, dependencies are typically services, but they also can be values, such as strings or functions. An injector for an application (created automatically during bootstrap) instantiates dependencies when needed, using a configured provider of the service or value. Learn more in Dependency Injection in Angular.

### DI token

- A lookup token associated with a dependency provider, for use with the dependency injection system.

### directive

- A class that can modify the structure of the DOM or modify attributes in the DOM and component data model. A directive class definition is immediately preceded by a @Directive() decorator that supplies metadata.

- A directive class is usually associated with an HTML element or attribute, and that element or attribute is often referred to as the directive itself. When Angular finds a directive in an HTML template, it creates the matching directive class instance and gives the instance control over that portion of the browser DOM.

- Angular has three categories of directive:

  - Components use @Component() to associate a template with a class. @Component() is an extension of @Directive().

  - Attribute directives modify behavior and appearance of page elements.

  - Structural directives modify the structure of the DOM.

- Angular supplies a number of built-in directives that begin with the ng prefix. You can also create new directives to implement your own functionality. You associate a selector with a custom directive; this extends the template syntax that you can use in your applications. A selector is an HTML tag, such as `<my-directive>`.

- UpperCamelCase, such as NgIf, refers to a directive class. You can use UpperCamelCase when describing properties and directive behavior.

- lowerCamelCase, such as ngIf refers to the attribute name of a directive. You can use lowerCamelCase when describing how to apply the directive to an element in the HTML template.

### domain-specific language (DSL)

- A special-purpose library or API. To learn more, see Domain-specific language. Angular extends TypeScript with domain-specific languages for a number of domains relevant to Angular applications, defined in NgModules such as animations, forms, and routing and navigation.

### dynamic component loading

- A technique for adding a component to the DOM at run time. Requires that you exclude the component from compilation and then connect it to the change-detection and event-handling framework of Angular when you add it to the DOM.

- See also custom element, which provides an easier path with the same result.

### eager loading

- NgModules or components that are loaded on launch are referenced as eager-loaded, to distinguish them from those that are loaded at run time that are referenced as lazy-loaded. See also lazy loading.

### ECMAScript

- The official JavaScript language specification.

- Not all browsers support the latest ECMAScript standard, but you can use a transpiler to write code using the latest features, which will then be transpiled to code that runs on versions that are supported by browsers. An example of a transpiler is TypeScript. To learn more, see Browser Support.

### element

- Angular defines an ElementRef class to wrap render-specific native UI elements. In most cases, this allows you to use Angular templates and data binding to access DOM elements without reference to the native element.

- The documentation generally refers to elements as distinct from DOM elements. Elements are instances of a ElementRef class. DOM elements are able to be accessed directly, if necessary.

- To learn more, see also custom element.

### entry point

- A JavaScript module that is intended to be imported by a user of an npm package. An entry-point module typically re-exports symbols from other internal modules. A package can contain multiple entry points. For example, the @angular/core package has two entry-point modules, which can be imported using the module names @angular/core and @angular/core/testing.

### form control

- An instance of FormControl, which is a fundamental building block for Angular forms. Together with FormGroup and FormArray, tracks the value, validation, and status of a form input element.

- Read more forms in the Introduction to forms in Angular.

### form model

- The "source of truth" for the value and validation status of a form input element at a given point in time. When using reactive forms, the form model is created explicitly in the component class. When using template-driven forms, the form model is implicitly created by directives.

- Learn more about reactive and template-driven forms in the Introduction to forms in Angular.

### form validation

- A check that runs when form values change and reports whether the given values are correct and complete, according to the defined constraints. Reactive forms apply validator functions. Template-driven forms use validator directives.

- To learn more, see Form Validation.

### immutability

- The inability to alter the state of a value after its creation. Reactive forms perform immutable changes in that each change to the data model produces a new data model rather than modifying the existing one. Template-driven forms perform mutable changes with NgModel and two-way data binding to modify the existing data model in place.

### injectable

- An Angular class or other definition that provides a dependency using the dependency injection mechanism. An injectable service class must be marked by the @Injectable() decorator. Other items, such as constant values, can also be injectable.

### injector

- An object in the Angular dependency-injection system that can find a named dependency in its cache or create a dependency using a configured provider. Injectors are created for NgModules automatically as part of the bootstrap process and are inherited through the component hierarchy.

  - An injector provides a singleton instance of a dependency, and can inject this same instance in multiple components.

  - A hierarchy of injectors at the NgModule and component level can provide different instances of a dependency to their own components and child components.

  - You can configure injectors with different providers that can provide different implementations of the same dependency.

- Learn more about the injector hierarchy in Hierarchical Dependency Injectors.

### input

- When defining a directive, the @Input() decorator on a directive property makes that property available as a target of a property binding. Data values flow into an input property from the data source identified in the template expression to the right of the equal sign.

- To learn more, see @Input() and @Output() decorator functions.

### interpolation

- A form of property data binding in which a template expression between double-curly braces renders as text. That text can be concatenated with neighboring text before it is assigned to an element property or displayed between element tags, as in this example.

  ```
  <label>My current hero is {{hero.name}}</label>
  ```

- Read more in the Interpolation guide.

### Ivy

- Ivy is the historical code name for the current [compilation and rendering pipeline](https://blog.angular.io/a-plan-for-version-8-0-and-ivy-b3318dfc19f7) in Angular. It is now the only supported engine, so everything uses Ivy.

### JavaScript

- To learn more, see `ECMAScript`. To learn more, see also `TypeScript`.

### just-in-time (JIT) compilation

- The Angular just-in-time (JIT) compiler converts your Angular HTML and TypeScript code into efficient JavaScript code at run time, as part of bootstrapping.

- JIT compilation is the default (as opposed to AOT compilation) when you run the ng build and ng serve Angular CLI commands, and is a good choice during development. JIT mode is strongly discouraged for production use because it results in large application payloads that hinder the bootstrap performance.

- Compare to ahead-of-time (AOT) compilation.

### lazy loading

- A process that speeds up application load time by splitting the application into multiple bundles and loading them on demand. For example, dependencies can be lazy loaded as needed. The example differs from eager-loaded modules that are required by the root module and are loaded on launch.

- The router makes use of lazy loading to load child views only when the parent view is activated. Similarly, you can build custom elements that can be loaded into an Angular application when needed.

### library

- In Angular, a project that provides functionality that can be included in other Angular applications. A library is not a complete Angular application and cannot run independently.

- To add re-usable Angular functionality to non-Angular web applications, use Angular custom elements.

  - Library developers can use the Angular CLI to generate scaffolding for a new library in an existing workspace, and can publish a library as an npm package.

  - Application developers can use the Angular CLI to add a published library for use with an application in the same workspace.

- See also schematic.

### lifecycle hook

- An interface that allows you to tap into the lifecycle of directives and components as they are created, updated, and destroyed.

- Each interface has a single hook method whose name is the interface name prefixed with ng. For example, the OnInit interface has a hook method named ngOnInit.

- Angular runs these hook methods in the following order:

  |     | HOOK METHOD           | DETAILS                                         |
  | --- | --------------------- | ----------------------------------------------- |
  | 1   | ngOnChanges           | When an input or output binding value changes.  |
  | 2   | ngOnInit              | After the first ngOnChanges.                    |
  | 3   | ngDoCheck             | Developer's custom change detection.            |
  | 4   | ngAfterContentInit    | After component content initialized.            |
  | 5   | ngAfterContentChecked | After every check of component content.         |
  | 6   | ngAfterViewInit       | After the views of a component are initialized. |
  | 7   | ngAfterViewChecked    | After every check of the views of a component.  |
  | 8   | ngOnDestroy           | Just before the directive is destroyed.         |

- To learn more, see Lifecycle Hooks.

### module

- In general, a module collects a block of code dedicated to a single purpose. Angular uses standard JavaScript modules and also defines an Angular module, NgModule.

- In JavaScript, or ECMAScript, each file is a module and all objects defined in the file belong to that module. Objects can be exported, making them public, and public objects can be imported for use by other modules.

- Angular ships as a collection of JavaScript modules. A collection of JavaScript modules are also referenced as a library. Each Angular library name begins with the @angular prefix. Install Angular libraries with the npm package manager and import parts of them with JavaScript import declarations.

- Compare to NgModule.

### ngcc

- Angular compatibility compiler. If you build your application using Ivy, but it depends on libraries that have not been compiled with Ivy, the Angular CLI uses ngcc to automatically update the dependent libraries to use Ivy.

### NgModule

- A class definition preceded by the @NgModule() decorator, which declares and serves as a manifest for a block of code dedicated to an application domain, a workflow, or a closely related set of capabilities.

- Like a JavaScript module, an NgModule can export functionality for use by other NgModules and import public functionality from other NgModules. The metadata for an NgModule class collects components, directives, and pipes that the application uses along with the list of imports and exports. See also declarable.

- NgModules are typically named after the file in which the exported thing is defined. For example, the Angular DatePipe class belongs to a feature module named date_pipe in the file date_pipe.ts. You import them from an Angular scoped package such as @angular/core.

- Every Angular application has a root module. By convention, the class is named AppModule and resides in a file named app.module.ts.

- To learn more, see NgModules.

### npm package

- The npm package manager is used to distribute and load Angular modules and libraries.

- Learn more about how Angular uses Npm Packages.

### ngc

- `ngc` is a Typescript-to-Javascript transpiler that processes Angular decorators, metadata, and templates, and emits JavaScript code. The most recent implementation is internally referred to as `ngtsc` because it is a minimalistic wrapper around the TypeScript compiler `tsc` that adds a transform for processing Angular code.

### observable

- A producer of multiple values, which it pushes to subscribers. Used for asynchronous event handling throughout Angular. You execute an observable by subscribing to it with its subscribe() method, passing callbacks for notifications of new values, errors, or completion.

- Observables can deliver in one the following ways a single value or multiple values of any type to subscribers.

  - Synchronously as a function delivers a value to the requester
  - Scheduled

- A subscriber receives notification of new values as they are produced and notification of either normal completion or error completion.

- Angular uses a third-party library named Reactive Extensions (RxJS). To learn more, see Observables.

### observer

- An object passed to the subscribe() method for an observable. The object defines the callbacks for the subscriber.

### output

- When defining a directive, the @Output{} decorator on a directive property makes that property available as a target of event binding. Events stream out of this property to the receiver identified in the template expression to the right of the equal sign.

- To learn more, see @Input() and @Output() decorator functions.

### pipe

- A class which is preceded by the @Pipe{} decorator and which defines a function that transforms input values to output values for display in a view. Angular defines various pipes, and you can define new pipes.

- To learn more, see Pipes.

### platform

- In Angular terminology, a platform is the context in which an Angular application runs. The most common platform for Angular applications is a web browser, but it can also be an operating system for a mobile device, or a web server.

- Support for the various Angular run-time platforms is provided by the @angular/platform-\* packages. These packages allow applications that make use of @angular/core and @angular/common to execute in different environments by providing implementation for gathering user input and rendering UIs for the given platform. Isolating platform-specific functionality allows the developer to make platform-independent use of the rest of the framework.

  - When running in a web browser, BrowserModule is imported from the platform-browser package, and supports services that simplify security and event processing, and allows applications to access browser-specific features, such as interpreting keyboard input and controlling the title of the document being displayed. All applications running in the browser use the same platform service.

  - When server-side rendering (SSR) is used, the platform-server package provides web server implementations of the DOM, XMLHttpRequest, and other low-level features that do not rely on a browser.

### polyfill

- An npm package that plugs gaps in the JavaScript implementation of a browser. See Browser Support for polyfills that support particular functionality for particular platforms.

### project

- In the Angular CLI, a standalone application or library that can be created or modified by an Angular CLI command.

- A project, as generated by the ng new, contains the set of source files, resources, and configuration files that you need to develop and test the application using the Angular CLI. Projects can also be created with the ng generate application and ng generate library commands.

- To learn more, see Project File Structure.

- The angular.json file configures all projects in a workspace.

### provider

- An object that implements one of the Provider interfaces. A provider object defines how to obtain an injectable dependency associated with a DI token. An injector uses the provider to create a new instance of a dependency for a class that requires it.

- Angular registers its own providers with every injector, for services that Angular defines. You can register your own providers for services that your application needs.

- See also service. See also dependency injection.

- Learn more in Dependency Injection.

### reactive forms

- A framework for building Angular forms through code in a component. The alternative is a template-driven form.

- When using reactive forms:

  - The "source of truth", the form model, is defined in the component class.
  - Validation is set up through validation functions rather than validation directives.
  - Each control is explicitly created in the component class by creating a FormControl instance manually or with FormBuilder.
  - The template input elements do not use ngModel.
  - The associated Angular directives are prefixed with form, such as formControl, formGroup, and formControlName.

- The alternative is a template-driven form. For an introduction and comparison of both forms approaches, see Introduction to Angular Forms.

### resolver

- A class that implements the Resolve interface that you use to produce or retrieve data that is needed before navigation to a requested route can be completed. You may use a function with the same signature as the resolve() method in place of the Resolve interface. Resolvers run after all route guards for a route tree have been executed and have succeeded.

- See an example of using a [resolve guard](https://angular.io/guide/router-tutorial-toh#resolve-pre-fetching-component-data) to retrieve dynamic data.

### route guard

- A method that controls navigation to a requested route in a routing application. Guards determine whether a route can be activated or deactivated, and whether a lazy-loaded module can be loaded.

- Learn more in the Routing and Navigation guide.

### router

- A tool that configures and implements navigation among states and views within an Angular application.

- The Router module is an NgModule that provides the necessary service providers and directives for navigating through application views. A routing component is one that imports the Router module and whose template contains a RouterOutlet element where it can display views produced by the router.

- The router defines navigation among views on a single page, as opposed to navigation among pages. It interprets URL-like links to determine which views to create or destroy, and which components to load or unload. It allows you to take advantage of lazy loading in your Angular applications.

- To learn more, see Routing and Navigation.

### router outlet

- A directive that acts as a placeholder in the template of a routing component. Angular dynamically renders the template based on the current router state.

### routing component

- An Angular component with a RouterOutlet directive in its template that displays views based on router navigations.

- To learn more, see Routing and Navigation.

### rule

- In schematics, a function that operates on a file tree to create, delete, or modify files in a specific manner.

### schematic

- A scaffolding library that defines how to generate or transform a programming project by creating, modifying, refactoring, or moving files and code. A schematic defines rules that operate on a virtual file system referenced as a tree.

- The Angular CLI uses schematics to generate and modify Angular projects and parts of projects.

  - Angular provides a set of schematics for use with the Angular CLI. See the Angular CLI command reference. The ng add Angular CLI command runs schematics as part of adding a library to your project. The ng generate Angular CLI command runs schematics to create applications, libraries, and Angular code constructs.

  - Library developers can create schematics that enable the Angular CLI to add and update their published libraries, and to generate artifacts the library defines. Add these schematics to the npm package that you use to publish and share your library.

- To learn more, see Schematics. To learn more, see also Integrating Libraries with the CLI.

### Schematics CLI

- Schematics come with their own command-line tool. Use Node 6.9 or above to install the Schematics CLI globally.

  ```
  npm install -g @angular-devkit/schematics-cli
  ```

- This installs the `schematics` executable, which you can use to create a new schematics `collection` with an initial named schematic. The collection directory is a workspace for `schematics`. You can also use the schematics command to add a new schematic to an existing collection, or extend an existing schematic.

### scoped package

- A way to group related npm packages. NgModules are delivered within scoped packages whose names begin with the Angular scope name @angular. For example, @angular/core, @angular/common, @angular/forms, and @angular/router.

- Import a scoped package in the same way that you import a normal package.
  - architecture/src/app/app.component.ts (import)
    ```
    import { Component } from '@angular/core';
    ```

### server-side rendering

- A technique that generates static application pages on the server, and can generate and serve those pages in response to requests from browsers. It can also pre-generate pages as HTML files that you serve later.

- This technique can improve performance on mobile and low-powered devices and improve the user experience by showing a static first page quickly while the client-side application is loading. The static version can also make your application more visible to web crawlers.

- You can easily prepare an application for server-side rendering by using the `Angular CLI` to run the `Angular Universal` tool, using the `@nguniversal/express-engine` schematic.

### service

- In Angular, a class with the @Injectable() decorator that encapsulates non-UI logic and code that can be reused across an application. Angular distinguishes components from services to increase modularity and reusability.

- The @Injectable() metadata allows the service class to be used with the dependency injection mechanism. The injectable class is instantiated by a provider. Injectors maintain lists of providers and use them to provide service instances when they are required by components or other services.

- To learn more, see Introduction to Services and Dependency Injection.

### standalone

- A configuration of components, directives, and pipes to indicate that this class can be imported directly without declaring it in any NgModule.

- Standalone components, directives, and pipes differ from non-standalone ones by:

  - having the `standalone` field of their decorator set to `true`.

  - allowing their direct importing without the need to pass through NgModules.

  - specifying their dependencies directly in their decorator.

- To learn more, see the Standalone components guide.

### structural directive

- A category of directive that is responsible for shaping HTML layout by modifying the DOM. Modification of the DOM includes, adding, removing, or manipulating elements and the associated children.

- To learn more, see Structural Directives.

### subscriber

- A function that defines how to obtain or generate values or messages to be published. This function is executed when a consumer runs the `subscribe()` method of an observable.

- The act of subscribing to an observable triggers its execution, associates callbacks with it, and creates a `Subscription` object that lets you unsubscribe.

- The `subscribe()` method takes an observer JavaScript object with up to three callbacks, one for each type of notification that an observable can deliver.

  - The `next` notification sends a value such as a number, a string, or an object.

  - The `error` notification sends a JavaScript Error or exception.

  - The `complete` notification does not send a value, but the handler is run when the method completes. Scheduled values can continue to be returned after the method completes.

### target

- A buildable or runnable subset of a project, configured as an object in the workspace configuration file, and executed by an Architect builder.

- In the angular.json file, each project has an "architect" section that contains targets which configure builders. Some of these targets correspond to Angular CLI command, such as build, serve, test, and lint.

- For example, the Architect builder invoked by the ng build command to compile a project uses a particular build tool, and has a default configuration with values that you can override on the command line. The build target also defines an alternate configuration for a "development" build, which you can invoke with the --configuration development flag on the build command.

- The Architect tool provides a set of builders. The ng new Angular CLI command provides a set of targets for the initial application project. The ng generate application and ng generate library Angular CLI commands provide a set of targets for each new project. These targets, their options and configurations, can be customized to meet the needs of your project. For example, you may want to add a "staging" or "testing" configuration to the "build" target of a project.

- You can also define a custom builder, and add a target to the project configuration that uses your custom builder. You can then run the target using the ng run Angular CLI command.

### template

- Code that defines how to render the view of a component.

- A template combines straight HTML with Angular data-binding syntax, directives, and template expressions (logical constructs). The Angular elements insert or calculate values that modify the HTML elements before the page is displayed. Learn more about Angular template language in the Template Syntax guide.

- A template is associated with a component class through the @Component() decorator. The template code can be provided inline, as the value of the template property, or in a separate HTML file linked through the templateUrl property.

- Additional templates, represented by TemplateRef objects, can define alternative or embedded views, which can be referenced from multiple components.

### template-driven forms

- template-driven forms
  A format for building Angular forms using HTML forms and input elements in the view. The alternative format uses the reactive forms framework.

- When using template-driven forms:

  - The "source of truth" is the template. The validation is defined using attributes on the individual input elements.

  - Two-way binding with ngModel keeps the component model synchronized with the user's entry into the input elements.

  - Behind the scenes, Angular creates a new control for each input element, provided you have set up a `name` attribute and two-way binding for each input.

  - The associated Angular directives are prefixed with `ng` such as `ngForm`, `ngModel`, and `ngModelGroup`.

- The alternative is a reactive form. For an introduction and comparison of both forms approaches, see Introduction to Angular Forms.

### template expression

- A TypeScript-like syntax that Angular evaluates within a data binding.

### template reference variable

- A variable defined in a template that references an instance associated with an element, such as a directive instance, component instance, template as in TemplateRef, or DOM element. After declaring a template reference variable on an element in a template, you can access values from that variable elsewhere within the same template. The following example defines a template reference variable named #phone.

  - src/app/app.component.html
    ```
    <input #phone placeholder="phone number" />
    ```

- To learn more, see Template reference variable.

### template input variable

- A template input variable is a variable you can reference within a single instance of the template. You declare a template input variable using the `let` keyword as in `let customer`.

  ```
  <tr *ngFor="let customer of customers;">
      <td>{{customer.customerNo}}</td>
      <td>{{customer.name}}</td>
      <td>{{customer.address}}</td>
      <td>{{customer.city}}</td>
      <td>{{customer.state}}</td>
      <button (click)="selectedCustomer=customer">Select</button>
  </tr>
  ```

- Read and learn more about template input variables.

### token

- An opaque identifier used for efficient table lookup. In Angular, a `DI token` is used to find `providers` of dependencies in the `dependency injection` system.

### transpile

- The translation process that transforms one version of JavaScript to another version; for example, down-leveling ES2015 to the older ES5 version.

### tree

- In schematics, a virtual file system represented by the Tree class. Schematic rules take a tree object as input, operate on them, and return a new tree object.

### TypeScript

- A programming language based on JavaScript that is notable for its optional typing system. TypeScript provides compile-time type checking and strong tooling support The type checking and tooling support include code completion, refactoring, inline documentation, and intelligent search. Many code editors and IDEs support TypeScript either natively or with plug-ins.

- TypeScript is the preferred language for Angular development. To learn more about TypeScript, see typescriptlang.org.

### TypeScript configuration file

- A file specifies the root files and the compiler options required to compile a TypeScript project. To learn more, see TypeScript configuration.

### unidirectional data flow

- A data flow model where the component tree is always checked for changes in one direction from parent to child, which prevents cycles in the change detection graph.

- In practice, this means that data in Angular flows downward during change detection. A parent component can easily change values in its child components because the parent is checked first. A failure could occur, however, if a child component tries to change a value in its parent during change detection (inverting the expected data flow), because the parent component has already been rendered. In development mode, Angular throws the ExpressionChangedAfterItHasBeenCheckedError error if your application attempts to do this, rather than silently failing to render the new value.

- To avoid this error, a lifecycle hook method that seeks to make such a change should trigger a new change detection run. The new run follows the same direction as before, but succeeds in picking up the new value.

### Universal

- A tool for implementing server-side rendering of an Angular application. When integrated with an app, Universal generates and serves static pages on the server in response to requests from browsers. The initial static page serves as a fast-loading placeholder while the full application is being prepared for normal execution in the browser. To learn more, see Angular Universal: server-side rendering.

### view

- The smallest grouping of display elements that can be created and destroyed together. Angular renders a view under the control of one or more `directives`.

- A `component` class and its associated `template` define a view. A view is specifically represented by a `ViewRef` instance associated with a component. A view that belongs immediately to a component is referenced as a host view. Views are typically collected into `view hierarchies`.

- Properties of elements in a view can change dynamically, in response to user actions; the structure (number and order) of elements in a view cannot. You can change the structure of elements by inserting, moving, or removing nested views within their view containers.

- View hierarchies can be loaded and unloaded dynamically as the user navigates through the application, typically under the control of a `router`.

### View Engine

- A previous compilation and rendering pipeline used by Angular. It has since been replaced by `Ivy` and is no longer in use. View Engine was deprecated in version 9 and removed in version 13.

### view hierarchy

- A tree of related views that can be acted on as a unit. The root view referenced as the host view of a component. A host view is the root of a tree of embedded views, collected in a `ViewContainerRef` view container attached to an anchor element in the hosting component. The view hierarchy is a key part of Angular change detection.

- The view hierarchy does not imply a component hierarchy. Views that are embedded in the context of a particular hierarchy can be host views of other components. Those components can be in the same NgModule as the hosting component, or belong to other NgModules.

### web component

- See custom element.

### workspace

- A collection of Angular projects (that is, applications and libraries) powered by the Angular CLI that are typically co-located in a single source-control repository (such as git).

- The ng new Angular CLI command creates a file system directory (the "workspace root"). In the workspace root, it also creates the workspace configuration file (angular.json) and, by default, an initial application project with the same name.

- Commands that create or operate on applications and libraries (such as add and generate) must be executed from within a workspace directory. To learn more, see Workspace Configuration.

### workspace configuration

- A file named angular.json at the root level of an Angular workspace provides workspace-wide and project-specific configuration defaults for build and development tools that are provided by or integrated with the Angular CLI. To learn more, see Workspace Configuration.

- Additional project-specific configuration files are used by tools, such as package.json for the npm package manager, tsconfig.json for TypeScript transpilation, and tslint.json for TSLint. To learn more, see Workspace and Project File Structure.

### zone

- An execution context for a set of asynchronous tasks. Useful for debugging, profiling, and testing applications that include asynchronous operations such as event processing, promises, and runs to remote servers.

- An Angular application runs in a zone where it can respond to asynchronous events by checking for data changes and updating the information it displays by resolving data bindings.

- A zone client can take action before and after an async operation completes.

- Learn more about zones in this Brian Ford video.

## Angular coding style

### Quick reference

#### Cheat Sheet

- Bootstraping

  - ex:

    ```
    import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

    platformBrowserDynamic().bootstrapModule(AppModule);
    ```

    - Import platformBrowserDynamic from @angular/platform-browser-dynamic.
    - Bootstraps the application, using the root component from the specified NgModule.

- NgModules

  - ex:

    ```
    import { NgModule } from '@angular/core';
    ```

    - Import NgModule from @angular/core.

  - ex:

    ```
    @NgModule({
      declarations: …,
      imports: …,
      exports: …,
      providers: …,
      bootstrap: …
    })
    class MyModule {}
    ```

    - Defines a module that contains components, directives, pipes, and providers.

  - ex:

    ```
    declarations: [
      MyRedComponent,
      MyBlueComponent,
      MyDatePipe
    ]
    ```

    - List of components, directives, and pipes that belong to this module.

  - ex:

    ```
    imports: [
      BrowserModule,
      SomeOtherModule
    ]
    ```

    - List of modules to import into this module. Everything from the imported modules is available to declarations of this module.

  - ex:

    ```
    exports: [
      MyRedComponent,
      MyDatePipe
    ]
    ```

    - List of components, directives, and pipes visible to modules that import this module.

  - ex:

    ```
    providers: [
      MyService,
      { provide: … }
    ]
    ```

    - List of dependency injection providers visible both to the contents of this module and to importers of this module.

  - ex:

    ```
    bootstrap: [MyAppComponent]
    ```

    - List of components to bootstrap when this module is bootstrapped.

- Template syntax

  - ex:

    ```
    <input [value]="firstName">
    ```

    - Binds property `value` to the result of expression `firstName`.

  - ex:

    ```
    <div [attr.role]="myAriaRole">
    ```

    - Binds attribute `role` to the result of expression `myAriaRole`.

  - ex:

    ```
    <div [class.extra-sparkle]="isDelightful">
    ```

    - Binds the presence of the CSS class `extra-sparkle` on the element to the truthiness of the expression `isDelightful`.

  - ex:

    ```
    <div [style.width.px]="mySize">
    ```

    - Binds style property `width` to the result of expression `mySize` in pixels. Units are optional.

  - ex:

    ```
    <button (click)="readRainbow($event)">
    ```

    - Calls method `readRainbow` when a click event is triggered on this button element (or its children) and passes in the event object.

  - ex:

    ```
    <div title="Hello {{ponyName}}">
    ```

    - Binds a property to an interpolated string, for example, "Hello Seabiscuit". Equivalent to:
      ```
      <div [title]="'Hello ' + ponyName">
      ```

  - ex:

    ```
    <p>
      Hello {{ponyName}}
    </p>
    ```

    - Binds text content to an interpolated string, for example, "Hello Seabiscuit".

  - ex:

    ```
    <my-cmp [(title)]="name">
    ```

    - Sets up two-way data binding. Equivalent to:
      ```
      <my-cmp [title]="name" (titleChange)="name=$event">
      ```

  - ex:

    ```
    <video #movieplayer …></video>
    <button (click)="movieplayer.play()">
      Play
    </button>
    ```

    - Creates a local variable `movieplayer` that provides access to the `video` element instance in data-binding and event-binding expressions in the current template.

  - ex:

    ```
    <p *myUnless="myExpression">
      …
    </p>
    ```

    - The asterisk (`*`) character turns the current element into an embedded template. Equivalent to:
      ```
      <ng-template [myUnless]="myExpression">
        <p>
          …
        </p>
      </ng-template>
      ```

  - ex:

    ```
    <p>
      Card No.: {{cardNumber | myCardNumberFormatter}}
    </p>
    ```

    - Transforms the current value of expression `cardNumber` using the pipe called `myCardNumberFormatter`.

  - ex:

    ```
    <p>
      Employer: {{employer?.companyName}}
    </p>
    ```

    - The safe navigation operator (`?`) means that the employer field is optional and if `undefined`, the rest of the expression should be ignored.

  - ex:

    ```
    <svg:rect x="0"
          y="0"
          width="100"
          height="100"/>
    ```

    - An SVG snippet template needs an `svg:` prefix on its root element to disambiguate the SVG element from an HTML component.

  - ex:
    ```
    <svg>
      <rect x="0"
            y="0"
            width="100"
            height="100"/>
    </svg>
    ```
    - An `<svg>` root element is detected as an SVG element automatically, without the prefix.

- BUILT-IN DIRECTIVES

  - ex:

    ```
    import { CommonModule } from '@angular/common';
    ```

    - Import CommonModule from @angular/common.

  - ex:

    ```
    <section *ngIf="showSection">
    ```

    - Removes or recreates a portion of the DOM tree based on the `showSection` expression.

  - ex:

    ```
    <li *ngFor="let item of list">
    ```

    - Turns the `li` element and its contents into a template, and uses that to instantiate a view for each item in list.

  - ex:

    ```
    <div [ngSwitch]="conditionExpression">
      <ng-template [ngSwitchCase]="case1Exp">
        …
      </ng-template>
      <ng-template ngSwitchCase="case2LiteralString">
        …
      </ng-template>
      <ng-template ngSwitchDefault>
        …
      </ng-template>
    </div>
    ```

    - Conditionally swaps the contents of the `div` by selecting one of the embedded templates based on the current value of `conditionExpression`.

  - ex:

    ```
    <div [ngClass]="{'active': isActive,
                 'disabled': isDisabled}">
    ```

    - Binds the presence of CSS classes on the element to the truthiness of the associated map values. The right-hand expression should return `{class-name: true/false}` map.

  - ex:

    ```
    <div [ngStyle]="{'property': 'value'}">
    <div [ngStyle]="dynamicStyles()">
    ```

    - Allows you to assign styles to an HTML element using CSS. You can use CSS directly, as in the first example, or you can call a method from the component.

- FORMS

  - ex:

    ```
    import { FormsModule } from '@angular/forms';
    ```

    - Import FormsModule from @angular/forms.

  - ex:
    ```
    <input [(ngModel)]="userName">
    ```
    - Provides two-way data-binding, parsing, and validation for form controls.

- CLASS DECORATORS

  - ex:

    ```
    import { Directive, … } from '@angular/core';
    ```

    - Import `Directive, &hellip;` from @angular/core';.

  - ex:

    ```
    @Component({…})
    class MyComponent() {}
    ```

    - Declares that a class is a component and provides metadata about the component.

  - ex:

    ```
    @Directive({…})
    class MyDirective() {}
    ```

    - Declares that a class is a directive and provides metadata about the directive.

  - ex:

    ```
    @Pipe({…})
    class MyPipe() {}
    ```

    - Declares that a class is a pipe and provides metadata about the pipe.

  - ex:
    ```
    @Injectable()
    class MyService() {}
    ```
    - Declares that a class can be provided and injected by other classes. Without this decorator, the compiler won't generate enough metadata to allow the class to be created properly when it's injected somewhere.

- DIRECTIVE CONFIGURATION

  - ex:

    ```
    @Directive({
      property1: value1,
      …
    })
    ```

    - Add `property1` property with `value1` value to Directive.

  - ex:

    ```
    selector: '.cool-button:not(a)'
    ```

    - Specifies a CSS selector that identifies this directive within a template. Supported selectors include `element`, `[attribute]`, `.class`, and `:not()`.
    - Does not support parent-child relationship selectors.

  - ex:

    ```
    providers: [
      MyService,
      { provide: … }
    ]
    ```

    - List of dependency injection providers for this directive and its children.

- COMPONENT CONFIGURATION

  - @COMPONENT EXTENDS @DIRECTIVE, SO THE @DIRECTIVE CONFIGURATION APPLIES TO COMPONENTS AS WELL

  - ex:

    ```
    moduleId: module.id
    ```

    - If set, the `templateUrl` and `styleUrl` are resolved relative to the component.

  - ex:

    ```
    viewProviders: [MyService, { provide: … }]
    ```

    - List of dependency injection providers scoped to this component's view.

  - ex:

    ```
    template: 'Hello {{name}}'
    templateUrl: 'my-component.html'
    ```

    - Inline template or external template URL of the component's view.

  - ex:
    ```
    styles: ['.primary {color: red}']
    styleUrls: ['my-component.css']
    ```

- CLASS FIELD DECORATORS FOR DIRECTIVES AND COMPONENTS

  - ex:

    ```
    import { Input, … } from '@angular/core';
    ```

    - Import `Input, ...` from `@angular/core`.

  - ex:

    ```
    @Input() myProperty;
    ```

    - Declares an input property that you can update using property binding (example: `<my-cmp [myProperty]="someExpression">`).

  - ex:

    ```
    @Output() myEvent = new EventEmitter();
    ```

    - Declares an output property that fires events that you can subscribe to with an event binding (example: `<my-cmp (myEvent)="doSomething()">`).

  - ex:

    ```
    @HostBinding('class.valid') isValid;
    ```

    - Binds a host element property (here, the CSS class `valid`) to a directive/component property (`isValid`).

  - ex:

    ```
    @HostListener('click', ['$event']) onClick(e) {…}
    ```

    - Subscribes to a host element event (`click`) with a directive/component method (`onClick`), optionally passing an argument (`$event`).

  - ex:

    ```
    @ContentChild(myPredicate) myChildComponent;
    ```

    - Binds the first result of the component content query (`myPredicate`) to a property (`myChildComponent`) of the class.

  - ex:

    ```
    @ContentChildren(myPredicate) myChildComponents;
    ```

    - Binds the results of the component content query (`myPredicate`) to a property (`myChildComponents`) of the class.

  - ex:

    ```
    @ViewChild(myPredicate) myChildComponent;
    ```

    - Binds the first result of the component view query (`myPredicate`) to a property (`myChildComponent`) of the class. Not available for directives.

  - ex:

    ```
    @ViewChildren(myPredicate) myChildComponents;
    ```

    - Binds the results of the component view query (`myPredicate`) to a property (`myChildComponents`) of the class. Not available for directives.

- DIRECTIVE AND COMPONENT CHANGE DETECTION AND LIFECYCLE HOOKS (IMPLEMENTED AS CLASS METHODS)

  - ex:

    ```
    constructor(myService: MyService, …) { … }
    ```

    - Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.

  - ex:

    ```
    ngOnChanges(changeRecord) { … }
    ```

    - Called after every change to input properties and before processing content or child views.

  - ex:

    ```
    ngOnInit() { … }
    ```

    - Called after the constructor, initializing input properties, and the first call to `ngOnChanges`.

  - ex:

    ```
    ngDoCheck() { … }
    ```

    - Called every time that the input properties of a component or a directive are checked. Use it to extend change detection by performing a custom check.

  - ex:

    ```
    ngAfterContentInit() { … }
    ```

    - Called after `ngOnInit` when the component's or directive's content has been initialized.

  - ex:

    ```
    ngAfterContentChecked() { … }
    ```

    - Called after every check of the component's or directive's content.

  - ex:

    ```
    ngAfterViewInit() { … }
    ```

    - Called after `ngAfterContentInit` when the component's views and child views / the view that a directive is in has been initialized.

  - ex:

    ```
    ngAfterViewChecked() { … }
    ```

    - Called after every check of the component's views and child views / the view that a directive is in.

  - ex:
    ```
    ngOnDestroy() { … }
    ```
    - Called once, before the instance is destroyed.

- DEPENDENCY INJECTION CONFIGURATION

  - ex:

    ```
    { provide: MyService, useClass: MyMockService }
    ```

    - Sets or overrides the provider for `MyService` to the `MyMockService` class.

  - ex:

    ```
    { provide: MyService, useFactory: myFactory }
    ```

    - Sets or overrides the provider for `MyService` to the `myFactory` factory function.

  - ex:

    ```
    { provide: MyValue, useValue: 41 }
    ```

    - Sets or overrides the provider for `MyValue` to the value `41`.

- ROUTING AND NAVIGATION

  - ex:

    ```
    import { Routes, RouterModule, … } from '@angular/router';
    ```

    - Import `Routes, RouterModule, ...` from `@angular/router`.

  - ex:

    ```
    const routes: Routes = [
      { path: '', component: HomeComponent },
      { path: 'path/:routeParam', component: MyComponent },
      { path: 'staticPath', component: … },
      { path: '**', component: … },
      { path: 'oldPath', redirectTo: '/staticPath' },
      { path: …, component: …, data: { message: 'Custom' } }
    ]);

    const routing = RouterModule.forRoot(routes);
    ```

    - Configures routes for the application. Supports static, parameterized, redirect, and wildcard routes. Also supports custom route data and resolve.

  - ex:

    ```
    <router-outlet></router-outlet>
    <router-outlet name="aux"></router-outlet>
    ```

    - Marks the location to load the component of the active route.

  - ex:

    ```
    <a routerLink="/path">
    <a [routerLink]="[ '/path', routeParam ]">
    <a [routerLink]="[ '/path', { matrixParam: 'value' } ]">
    <a [routerLink]="[ '/path' ]" [queryParams]="{ page: 1 }">
    <a [routerLink]="[ '/path' ]" fragment="anchor">
    ```

    - Creates a link to a different view based on a route instruction consisting of a route path, required and optional parameters, query parameters, and a fragment. To navigate to a root route, use the `/` prefix; for a child route, use the `./` prefix; for a sibling or parent, use the ../ prefix.

  - ex:

    ```
    <a [routerLink]="[ '/path' ]" routerLinkActive="active">
    ```

    - The provided classes are added to the element when the `routerLink` becomes the current active route.

  - ex:

    ```
    <a [routerLink]="[ '/path' ]" routerLinkActive="active" ariaCurrentWhenActive="page">
    ```

    - The provided classes and `aria-current` attribute are added to the element when the routerLink becomes the current active route.

  - ex:

    ```
    class CanActivateGuard implements CanActivate {
      canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
      ): Observable<boolean|UrlTree>|Promise<boolean|UrlTree>|boolean|UrlTree { … }
    }

    { path: …, canActivate: [CanActivateGuard] }
    ```

    - An interface for defining a class that the router should call first to determine if it should activate this component. Should return a `boolean|UrlTree` or an Observable/Promise that resolves to a `boolean|UrlTree`.

  - ex:

    ```
    class CanDeactivateGuard implements CanDeactivate<T> {
      canDeactivate(
        component: T,
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
      ): Observable<boolean|UrlTree>|Promise<boolean|UrlTree>|boolean|UrlTree { … }
    }

    { path: …, canDeactivate: [CanDeactivateGuard] }
    ```

    - An interface for defining a class that the router should call first to determine if it should deactivate this component after a navigation. Should return a `boolean|UrlTree` or an Observable/Promise that resolves to a `boolean|UrlTree`.

  - ex:

    ```
    class CanActivateChildGuard implements CanActivateChild {
      canActivateChild(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
      ): Observable<boolean|UrlTree>|Promise<boolean|UrlTree>|boolean|UrlTree { … }
    }

    { path: …, canActivateChild: [CanActivateGuard], children: … }
    ```

    - An interface for defining a class that the router should call first to determine if it should activate the child route. Should return a `boolean|UrlTree` or an Observable/Promise that resolves to a `boolean|UrlTree`.

  - ex:

    ```
    class ResolveGuard implements Resolve<T> {
    resolve(
      route: ActivatedRouteSnapshot,
      state: RouterStateSnapshot
    ): Observable<any>
    ```

    - `Promise<any>`

  - ex:

    ```
    class CanLoadGuard implements CanLoad {
      canLoad(
        route: Route
      ): Observable<boolean|UrlTree>|Promise<boolean|UrlTree>|boolean|UrlTree { … }
    }

    { path: …, canLoad: [CanLoadGuard], loadChildren: … }
    ```

    - An interface for defining a class that the router should call first to check if the lazy loaded module should be loaded. Should return a `boolean|UrlTree` or an Observable/Promise that resolves to a `boolean|UrlTree`.

### Coding style guide

- Looking for an opinionated guide to Angular syntax, conventions, and application structure? Step right in. This style guide presents preferred conventions and, as importantly, explains why.

### Style vocabulary

- Each guideline describes either a good or bad practice, and all have a consistent presentation.

- The wording of each guideline indicates how strong the recommendation is.

- **Do** is one that should always be followed. Always might be a bit too strong of a word. Guidelines that literally should always be followed are extremely rare. On the other hand, you need a really unusual case for breaking a Do guideline.

- **Consider** guidelines should generally be followed. If you fully understand the meaning behind the guideline and have a good reason to deviate, then do so. Aim to be consistent.

- **Avoid** indicates something you should almost never do. Code examples to avoid have an unmistakable red header.

- **Why?**
  - Gives reasons for following the previous recommendations.

### File structure conventions

- Some code examples display a file that has one or more similarly named companion files. For example, `hero.component.ts` and `hero.component.html`.

- The guideline uses the shortcut `hero.component.ts|html|css|spec` to represent those various files. Using this shortcut makes this guide's file structures easier to read and more terse.

### Single responsibility

- Apply the [single responsibility principle (SRP)](https://wikipedia.org/wiki/Single_responsibility_principle) to all components, services, and other symbols. This helps make the application cleaner, easier to read and maintain, and more testable.

#### Rule of One

##### Style 01-01

- **Do** define one thing, such as a service or component, per file.

- **Consider** limiting files to 400 lines of code.

- **Why?**

  - One component per file makes it far easier to read, maintain, and avoid collisions with teams in source control.

- **Why?**

  - One component per file avoids hidden bugs that often arise when combining components in a file where they may share variables, create unwanted closures, or unwanted coupling with dependencies.

- **Why?**

  - A single component can be the default export for its file which facilitates lazy loading with the router.

  - The key is to make the code more reusable, easier to read, and less mistake-prone.

- The following negative example defines the `AppComponent`, bootstraps the app, defines the `Hero` model object, and loads heroes from the server all in the same file. _Don't do this_.

  - app/heroes/hero.component.ts

    ```
    /* avoid */
    import { Component, NgModule, OnInit } from '@angular/core';
    import { BrowserModule } from '@angular/platform-browser';
    import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

    interface Hero {
      id: number;
      name: string;
    }

    @Component({
      selector: 'app-root',
      template: `
          <h1>{{title}}</h1>
          <pre>{{heroes | json}}</pre>
        `,
      styleUrls: ['app/app.component.css']
    })
    class AppComponent implements OnInit {
      title = 'Tour of Heroes';

      heroes: Hero[] = [];

      ngOnInit() {
        getHeroes().then(heroes => (this.heroes = heroes));
      }
    }

    @NgModule({
      imports: [BrowserModule],
      declarations: [AppComponent],
      exports: [AppComponent],
      bootstrap: [AppComponent]
    })
    export class AppModule {}

    platformBrowserDynamic().bootstrapModule(AppModule);

    const HEROES: Hero[] = [
      { id: 1, name: 'Bombasto' },
      { id: 2, name: 'Tornado' },
      { id: 3, name: 'Magneta' }
    ];

    function getHeroes(): Promise<Hero[]> {
      return Promise.resolve(HEROES); // TODO: get hero data from the server;
    }
    ```

- It is a better practice to redistribute the component and its supporting classes into their own, dedicated files.

  - main.ts

    ```
    import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

    import { AppModule } from './app/app.module';

    platformBrowserDynamic().bootstrapModule(AppModule);
    ```

  - app/app.module.ts

    ```
    import { NgModule } from '@angular/core';
    import { BrowserModule } from '@angular/platform-browser';
    import { RouterModule } from '@angular/router';

    import { AppComponent } from './app.component';
    import { HeroesComponent } from './heroes/heroes.component';

    @NgModule({
      imports: [
        BrowserModule,
      ],
      declarations: [
        AppComponent,
        HeroesComponent
      ],
      exports: [ AppComponent ],
      bootstrap: [ AppComponent ]
    })
    export class AppModule { }
    ```

  - app/app.component.ts

    ```
    import { Component } from '@angular/core';

    import { HeroService } from './heroes';

    @Component({
      selector: 'toh-app',
      template: `
          <toh-heroes></toh-heroes>
        `,
      styleUrls: ['./app.component.css'],
      providers: [HeroService]
    })
    export class AppComponent {}
    ```

  - app/heroes/heroes.component.ts

    ```
    import { Component, OnInit } from '@angular/core';

    import { Hero, HeroService } from './shared';

    @Component({
      selector: 'toh-heroes',
      template: `
          <pre>{{heroes | json}}</pre>
        `
    })
    export class HeroesComponent implements OnInit {
      heroes: Hero[] = [];

      constructor(private heroService: HeroService) {}

      ngOnInit() {
        this.heroService.getHeroes()
          .then(heroes => this.heroes = heroes);
      }
    }
    ```

  - app/heroes/shared/hero.service.ts

    ```
    import { Injectable } from '@angular/core';

    import { HEROES } from './mock-heroes';

    @Injectable()
    export class HeroService {
      getHeroes() {
        return Promise.resolve(HEROES);
      }
    }
    ```

  - app/heroes/shared/hero.model.ts

    ```
    export interface Hero {
      id: number;
      name: string;
    }
    ```

  - app/heroes/shared/mock-heroes.ts

    ```
    import { Hero } from './hero.model';

    export const HEROES: Hero[] = [
      { id: 1, name: 'Bombasto' },
      { id: 2, name: 'Tornado' },
      { id: 3, name: 'Magneta' }
    ];
    ```

- As the application grows, this rule becomes even more important.

#### Small functions

##### Style 01-02

- Do define small functions

- Consider limiting to no more than 75 lines.

- Why?

  - Small functions are easier to test, especially when they do one thing and serve one purpose.

- Why?

  - Small functions promote reuse.

- Why?

  - Small functions are easier to read.

- Why?

  - Small functions are easier to maintain.

- Why?
  - Small functions help avoid hidden bugs that come with large functions that share variables with external scope, create unwanted closures, or unwanted coupling with dependencies.

### Naming

Naming conventions are hugely important to maintainability and readability. This guide recommends naming conventions for the file name and the symbol name.

#### General Naming Guidelines

##### Style 02-01

- Do use consistent names for all symbols.

- Do follow a pattern that describes the symbol's feature then its type. The recommended pattern is `feature.type.ts`.

- Why?

  - Naming conventions help provide a consistent way to find content at a glance. Consistency within the project is vital. Consistency with a team is important. Consistency across a company provides tremendous efficiency.

- Why?

  - The naming conventions should help find desired code faster and make it easier to understand.

- Why?
  - Names of folders and files should clearly convey their intent. For example, `app/heroes/hero-list.component.ts` may contain a component that manages a list of heroes.

#### Separate file names with dots and dashes

##### Style 02-02

- Do use dashes to separate words in the descriptive name.

- Do use dots to separate the descriptive name from the type.

- Do use consistent type names for all components following a pattern that describes the component's feature then its type. A recommended pattern is `feature.type.ts`.

- Do use conventional type names including `.service`, `.component`, `.pipe`, `.module`, and `.directive`. Invent additional type names if you must but take care not to create too many.

- Why?

  - Type names provide a consistent way to quickly identify what is in the file.

- Why?

  - Type names make it easy to find a specific file type using an editor or IDE's fuzzy search techniques.

- Why?

  - Unabbreviated type names such as `.service` are descriptive and unambiguous. Abbreviations such as `.srv`, `.svc`, and `.serv` can be confusing.

- Why?
  - Type names provide pattern matching for any automated tasks.

#### Symbols and file names

##### Style 02-03

- Do use consistent names for all assets named after what they represent.

- Do use upper camel case for class names.

- Do match the name of the symbol to the name of the file.

- Do append the symbol name with the conventional suffix (such as `Component`, `Directive`, `Module`, `Pipe`, or `Service`) for a thing of that type.

- Do give the filename the conventional suffix (such as `.component.ts`, `.directive.ts`, `.module.ts`, `.pipe.ts`, or `.service.ts`) for a file of that type.

- Why?

  - Consistent conventions make it easy to quickly identify and reference assets of different types.

- SYMBOL NAME | FILE NAME

  - ex:

    ```
    @Component({ … })
    export class AppComponent { }
    ```

    - app.component.ts

  - ex:

    ```
    @Component({ … })
    export class HeroesComponent { }
    ```

    - heroes.component.ts

  - ex:

    ```
    @Component({ … })
    export class HeroListComponent { }
    ```

    - hero-list.component.ts

  - ex:

    ```
    @Component({ … })
    export class HeroDetailComponent { }
    ```

    - hero-detail.component.ts

  - ex:

    ```
    @Directive({ … })
    export class ValidationDirective { }
    ```

    - validation.directive.ts

  - ex:

    ```
    @NgModule({ … })
    export class AppModule
    ```

    - app.module.ts

  - ex:
    ```
    @Pipe({ name: 'initCaps' })
    export class InitCapsPipe implements PipeTransform { }
    ```
    - init-caps.pipe.ts
  - ex:
    ```
    @Injectable()
    export class UserProfileService { }
    ```
    - user-profile.service.ts

#### Service names

##### Style 02-04

- Do use consistent names for all services named after their feature.

- Do suffix a service class name with `Service`. For example, something that gets data or heroes should be called a `DataService` or a `HeroService`.

- A few terms are unambiguously services. They typically indicate agency by ending in "-er". You may prefer to name a service that logs messages `Logger` rather than `LoggerService`. Decide if this exception is agreeable in your project. As always, strive for consistency.

- Why?

  - Provides a consistent way to quickly identify and reference services.

- Why?

  - Clear service names such as `Logger` do not require a suffix.

- Why?

  - Service names such as `Credit` are nouns and require a suffix and should be named with a suffix when it is not obvious if it is a service or something else.

- SYMBOL NAME | FILE NAME
  - ex:
    ```
    @Injectable()
    export class HeroDataService { }
    ```
    - hero-data.service.ts
  - ex:
    ```
    @Injectable()
    export class CreditService { }
    ```
    - credit.service.ts
  - ex:
    ```
    @Injectable()
    export class Logger { }
    ```
    - logger.service.ts

#### Bootstrapping

##### Style 02-05

- Do put bootstrapping and platform logic for the application in a file named `main.ts`.

- Do include error handling in the bootstrapping logic.

- Avoid putting application logic in `main.ts`. Instead, consider placing it in a component or service.

- Why?

  - Follows a consistent convention for the startup logic of an app.

- Why?

  - Follows a familiar convention from other technology platforms.

- main.ts

  ```
  import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

  import { AppModule } from './app/app.module';

  platformBrowserDynamic().bootstrapModule(AppModule)
    .then(success => console.log(`Bootstrap success`))
    .catch(err => console.error(err));
  ```

#### Component selectors

##### Style 05-02

- Do use dashed-case or kebab-case for naming the element selectors of components.

- Why?

  - Keeps the element names consistent with the specification for [Custom Elements](https://www.w3.org/TR/custom-elements)

- app/heroes/shared/hero-button/hero-button.component.ts

  ```
  /* avoid */

  @Component({
    selector: 'tohHeroButton',
    templateUrl: './hero-button.component.html'
  })
  export class HeroButtonComponent {}
  ```

- app/heroes/shared/hero-button/hero-button.component.ts

  ```
  @Component({
    selector: 'toh-hero-button',
    templateUrl: './hero-button.component.html'
  })
  export class HeroButtonComponent {}
  ```

- app/app.component.html
  ```
  <toh-hero-button></toh-hero-button>
  ```

#### Component custom prefix

##### Style 02-07

- Do use a hyphenated, lowercase element selector value; for example, `admin-users`.

- Do use a custom prefix for a component selector. For example, the prefix `toh` represents Tour of Heroes and the prefix `admin` represents an admin feature area.

- Do use a prefix that identifies the feature area or the application itself.

- Why?

  - Prevents element name collisions with components in other applications and with native HTML elements.

- Why?

  - Makes it easier to promote and share the component in other applications.

- Why?

  - Components are easy to identify in the DOM.

- app/heroes/hero.component.ts

  ```
  /* avoid */

  // HeroComponent is in the Tour of Heroes feature
  @Component({
    selector: 'hero'
  })
  export class HeroComponent {}
  ```

- app/users/users.component.ts

  ```
  /* avoid */

  // UsersComponent is in an Admin feature
  @Component({
    selector: 'users'
  })
  export class UsersComponent {}
  ```

- app/heroes/hero.component.ts

  ```
  @Component({
    selector: 'toh-hero'
  })
  export class HeroComponent {}
  ```

- app/users/users.component.ts
  ```
  @Component({
    selector: 'admin-users'
  })
  export class UsersComponent {}
  ```

#### Directive selectors

##### Style 02-06

- Do Use lower camel case for naming the selectors of directives.

- Why?

  - Keeps the names of the properties defined in the directives that are bound to the view consistent with the attribute names.

- Why?
  - The Angular HTML parser is case-sensitive and recognizes lower camel case.

#### Directive custom prefix

##### Style 02-08

- Do use a custom prefix for the selector of directives (for example, the prefix `toh` from Tour of Heroes).

- Do spell non-element selectors in lower camel case unless the selector is meant to match a native HTML attribute.

- Don't prefix a directive name with ng because that prefix is reserved for Angular and using it could cause bugs that are difficult to diagnose.

- Why?

  - Prevents name collisions.

- Why?

  - Directives are easily identified.

- app/shared/validate.directive.ts

  ```
  /* avoid */

  @Directive({
    selector: '[validate]'
  })
  export class ValidateDirective {}
  ```

- app/shared/validate.directive.ts
  ```
  @Directive({
    selector: '[tohValidate]'
  })
  export class ValidateDirective {}
  ```

#### Pipe names

##### Style 02-09

- Do use consistent names for all pipes, named after their feature. The pipe class name should use `UpperCamelCase` (the general convention for class names), and the corresponding `name` string should use _lowerCamelCase_. The `name` string cannot use hyphens ("dash-case" or "kebab-case").

- Why?

  - Provides a consistent way to quickly identify and reference pipes.

- SYMBOL NAME | FILE NAME

  - ex:

    ```
    @Pipe({ name: 'ellipsis' })
    export class EllipsisPipe implements PipeTransform { }
    ```

    - ellipsis.pipe.ts

  - ex:
    ```
    @Pipe({ name: 'initCaps' })
    export class InitCapsPipe implements PipeTransform { }
    ```
    - init-caps.pipe.ts

#### Unit test file names

##### Style 02-10

- Do name test specification files the same as the component they test.

- Do name test specification files with a suffix of `.spec`.

- Why?

  - Provides a consistent way to quickly identify tests.

- Why?

  - Provides pattern matching for `karma` or other test runners.

- TEST TYPE | FILE NAMES
  - Components
    - heroes.component.spec.ts
    - hero-list.component.spec.ts
    - hero-detail.component.spec.ts
  - Services
    - logger.service.spec.ts
    - hero.service.spec.ts
    - filter-text.service.spec.ts
  - Pipes
    - ellipsis.pipe.spec.ts
    - init-caps.pipe.spec.ts

#### End-to-End (E2E) test file names

##### Style 02-11

- Do name end-to-end test specification files after the feature they test with a suffix of `.e2e-spec`.

- Why?

  - Provides a consistent way to quickly identify end-to-end tests.

- Why?

  - Provides pattern matching for test runners and build automation.

- TEST TYPE | FILE NAMES

  - End-to-End Tests
    - app.e2e-spec.ts
    - heroes.e2e-spec.ts

#### Angular NgModule names

##### Style 02-12

- Do append the symbol name with the suffix `Module`.

- Do give the file name the `.module.ts` extension.

- Do name the module after the feature and folder it resides in.

- Why?

  - Provides a consistent way to quickly identify and reference modules.

- Why?

  - Upper camel case is conventional for identifying objects that can be instantiated using a constructor.

- Why?

  - Easily identifies the module as the root of the same named feature.

- Do suffix a `RoutingModule` class name with `RoutingModule`.

- Do end the filename of a `RoutingModule` with `-routing.module.ts`.

- Why?

  - A `RoutingModule` is a module dedicated exclusively to configuring the Angular router. A consistent class and file name convention make these modules easy to spot and verify.

- SYMBOL NAME | FILE NAME

  - ex:

    ```
    @NgModule({ … })
    export class AppModule { }
    ```

    - app.module.ts

  - ex:

    ```
    @NgModule({ … })
    export class HeroesModule { }
    ```

    - heroes.module.ts

  - ex:
    ```
    @NgModule({ … })
    export class VillainsModule { }
    ```
    - villains.module.ts
  - ex:

    ```
    @NgModule({ … })
    export class AppRoutingModule { }
    ```

    - app-routing.module.ts

  - ex:
    ```
    @NgModule({ … })
    export class HeroesRoutingModule { }
    ```
    - heroes-routing.module.ts

### Application structure and NgModules

- Have a near-term view of implementation and a long-term vision. Start small but keep in mind where the application is heading.

- All of the application's code goes in a folder named `src`. All feature areas are in their own folder, with their own NgModule.

- All content is one asset per file. Each component, service, and pipe is in its own file. All third party vendor scripts are stored in another folder and not in the `src` folder. You didn't write them and you don't want them cluttering `src`. Use the naming conventions for files in this guide.

#### LIFT

##### Style 04-01

- Do structure the application such that you can **L**ocate code quickly, **I**dentify the code at a glance, keep the **F**lattest structure you can, and **T**ry to be DRY.

- Do define the structure to follow these four basic guidelines, listed in order of importance.

- Why?
  - LIFT provides a consistent structure that scales well, is modular, and makes it easier to increase developer efficiency by finding code quickly. To confirm your intuition about a particular structure, ask: _Can I quickly open and start work in all of the related files for this feature?_

#### Locate

##### Style 04-02

- Do make locating code intuitive and fast.

- Why?
  - To work efficiently you must be able to find files quickly, especially when you do not know (or do not remember) the file names. Keeping related files near each other in an intuitive location saves time. A descriptive folder structure makes a world of difference to you and the people who come after you.

#### Identify

##### Style 04-03

- Do name the file such that you instantly know what it contains and represents.

- Do be descriptive with file names and keep the contents of the file to exactly one component.

- Avoid files with multiple components, multiple services, or a mixture.

- Why?

  - Spend less time hunting and pecking for code, and become more efficient. Longer file names are far better than short-but-obscure abbreviated names.

- It may be advantageous to deviate from the one-thing-per-file rule when you have a set of small, closely-related features that are better discovered and understood in a single file than as multiple files. Be wary of this loophole.

#### Flat

##### Style 04-04

- Do keep a flat folder structure as long as possible.

- Consider creating sub-folders when a folder reaches seven or more files.

- Consider configuring the IDE to hide distracting, irrelevant files such as generated `.js` and `.js.map` files.

- Why?

  - No one wants to search for a file through seven levels of folders. A flat structure is easy to scan.

- On the other hand, psychologists believe that humans start to struggle when the number of adjacent interesting things exceeds nine. So when a folder has ten or more files, it may be time to create subfolders.

- Base your decision on your comfort level. Use a flatter structure until there is an obvious value to creating a new folder.

#### T-DRY (Try to be DRY)

##### Style 04-05

- Do be DRY (Don't Repeat Yourself).

- Avoid being so DRY that you sacrifice readability.

- Why?
  - Being DRY is important, but not crucial if it sacrifices the other elements of LIFT. That's why it's called T-DRY. For example, it's redundant to name a template `hero-view.component.html` because with the `.html` extension, it is obviously a view. But if something is not obvious or departs from a convention, then spell it out.

#### Overall structural guidelines

##### Style 04-06

- Do start small but keep in mind where the application is heading down the road.

- Do have a near term view of implementation and a long term vision.

- Do put all of the application's code in a folder named `src`.

- Consider creating a folder for a component when it has multiple accompanying files (`.ts`, `.html`, `.css`, and `.spec`).

- Why?

  - Helps keep the application structure small and easy to maintain in the early stages, while being easy to evolve as the application grows.

- Why?

  - Components often have four files (for example, `*.html`, `*.css`, `*.ts`, and `*.spec.ts`) and can clutter a folder quickly.

- Here is a compliant folder and file structure:

  ```
  <project root>
    src
      app
        core
          exception.service.ts|spec.ts
          user-profile.service.ts|spec.ts
        heroes
          hero
            hero.component.ts|html|css|spec.ts
          hero-list
            hero-list.component.ts|html|css|spec.ts
          shared
            hero-button.component.ts|html|css|spec.ts
            hero.model.ts
            hero.service.ts|spec.ts
          heroes.component.ts|html|css|spec.ts
          heroes.module.ts
          heroes-routing.module.ts
        shared
          shared.module.ts
          init-caps.pipe.ts|spec.ts
          filter-text.component.ts|spec.ts
          filter-text.service.ts|spec.ts
        villains
          villain
            …
          villain-list
            …
          shared
            …
          villains.component.ts|html|css|spec.ts
          villains.module.ts
          villains-routing.module.ts
        app.component.ts|html|css|spec.ts
        app.module.ts
        app-routing.module.ts

      main.ts
      index.html
      …

    node_modules/…
    …
  ```

- While components in dedicated folders are widely preferred, another option for small applications is to keep components flat (not in a dedicated folder). This adds up to four files to the existing folder, but also reduces the folder nesting. Whatever you choose, be consistent.

#### Folders-by-feature structure

##### Style 04-07

- Do create folders named for the feature area they represent.

- Why?

  - A developer can locate the code and identify what each file represents at a glance. The structure is as flat as it can be and there are no repetitive or redundant names.

- Why?

  - The LIFT guidelines are all covered.

- Why?

  - Helps reduce the application from becoming cluttered through organizing the content and keeping them aligned with the LIFT guidelines.

- Why?

  - When there are a lot of files, for example 10+, locating them is easier with a consistent folder structure and more difficult in a flat structure.

- Do create an NgModule for each feature area.

- Why?

  - NgModules make it easy to lazy load routable features.

- Why?

  - NgModules make it easier to isolate, test, and reuse features.

- For more information, refer to this folder and file structure example.

#### App root module

##### Style 04-08

- Do create an NgModule in the application's root folder, for example, in `/src/app`.

- Why?

  - Every application requires at least one root NgModule.

- Consider naming the root module `app.module.ts`.

- Why?

  - Makes it easier to locate and identify the root module.

- app/app.module.ts

  ```
  import { NgModule } from '@angular/core';
  import { BrowserModule } from '@angular/platform-browser';

  import { AppComponent } from './app.component';
  import { HeroesComponent } from './heroes/heroes.component';

  @NgModule({
    imports: [
      BrowserModule,
    ],
    declarations: [
      AppComponent,
      HeroesComponent
    ],
    exports: [ AppComponent ]
  })
  export class AppModule {}
  ```

#### Feature modules

##### Style 04-09

- Do create an NgModule for all distinct features in an application; for example, a `Heroes` feature.

- Do place the feature module in the same named folder as the feature area; for example, in `app/heroes`.

- Do name the feature module file reflecting the name of the feature area and folder; for example, `app/heroes/heroes.module.ts`.

- Do name the feature module symbol reflecting the name of the feature area, folder, and file; for example, `app/heroes/heroes.module.ts` defines `HeroesModule`.

- Why?

  - A feature module can expose or hide its implementation from other modules.

- Why?

  - A feature module identifies distinct sets of related components that comprise the feature area.

- Why?
  A feature module can easily be routed to both eagerly and lazily.

- Why?

  - A feature module defines clear boundaries between specific functionality and other application features.

- Why?

  - A feature module helps clarify and make it easier to assign development responsibilities to different teams.

- Why?
  - A feature module can easily be isolated for testing.

#### Shared feature module

##### Style 04-10

- Do create a feature module named `SharedModule` in a `shared` folder; for example, `app/shared/shared.module.ts` defines `SharedModule`.

- Do declare components, directives, and pipes in a shared module when those items will be re-used and referenced by the components declared in other feature modules.

- Consider using the name `SharedModule` when the contents of a shared module are referenced across the entire application.

- Consider not providing services in shared modules. Services are usually singletons that are provided once for the entire application or in a particular feature module. There are exceptions, however. For example, in the sample code that follows, notice that the `SharedModule` provides `FilterTextService`. This is acceptable here because the service is stateless;that is, the consumers of the service aren't impacted by new instances.

- Do import all modules required by the assets in the `SharedModule`; for example, `CommonModule` and `FormsModule`.

- Why?

  - `SharedModule` will contain components, directives, and pipes that may need features from another common module; for example, `ngFor` in `CommonModule`.

- Do declare all components, directives, and pipes in the `SharedModule`.

- Do export all symbols from the `SharedModule` that other feature modules need to use.

- Why?

  - `SharedModule` exists to make commonly used components, directives, and pipes available for use in the templates of components in many other modules.

- Avoid specifying app-wide singleton providers in a SharedModule. Intentional singletons are OK. Take care.

- Why?

  - A lazy loaded feature module that imports that shared module will make its own copy of the service and likely have undesirable results.

- Why?

  - You don't want each module to have its own separate instance of singleton services. Yet there is a real danger of that happening if the `SharedModule` provides a service.

  ```
  src
    app
      shared
        shared.module.ts
        init-caps.pipe.ts|spec.ts
        filter-text.component.ts|spec.ts
        filter-text.service.ts|spec.ts
      app.component.ts|html|css|spec.ts
      app.module.ts
      app-routing.module.ts
    main.ts
    index.html
  …
  ```

- app/shared/shared.module.ts

  ```
  import { NgModule } from '@angular/core';
  import { CommonModule } from '@angular/common';
  import { FormsModule } from '@angular/forms';

  import { FilterTextComponent } from './filter-text/filter-text.component';
  import { FilterTextService } from './filter-text/filter-text.service';
  import { InitCapsPipe } from './init-caps.pipe';

  @NgModule({
    imports: [CommonModule, FormsModule],
    declarations: [
      FilterTextComponent,
      InitCapsPipe
    ],
    providers: [FilterTextService],
    exports: [
      CommonModule,
      FormsModule,
      FilterTextComponent,
      InitCapsPipe
    ]
  })
  export class SharedModule { }
  ```

- app/shared/init-caps.pipe.ts

  ```
  import { Pipe, PipeTransform } from '@angular/core';

  @Pipe({ name: 'initCaps' })
  export class InitCapsPipe implements PipeTransform {
    transform = (value: string) => value;
  }
  ```

- app/shared/filter-text/filter-text.component.ts

  ```
  import { Component, EventEmitter, Output } from '@angular/core';

  @Component({
    selector: 'toh-filter-text',
    template: '<input type="text" id="filterText" [(ngModel)]="filter" (keyup)="filterChanged($event)" />'
  })
  export class FilterTextComponent {
    @Output() changed: EventEmitter<string>;

    filter = '';

    constructor() {
      this.changed = new EventEmitter<string>();
    }

    clear() {
      this.filter = '';
    }

    filterChanged(event: any) {
      event.preventDefault();
      console.log(`Filter Changed: ${this.filter}`);
      this.changed.emit(this.filter);
    }
  }
  ```

- app/shared/filter-text/filter-text.service.ts

  ```
  import { Injectable } from '@angular/core';

  @Injectable()
  export class FilterTextService {
    constructor() {
      console.log('Created an instance of FilterTextService');
    }

    filter(data: string, props: Array<string>, originalList: Array<any>) {
      let filteredList: any[];
      if (data && props && originalList) {
        data = data.toLowerCase();
        const filtered = originalList.filter(item => {
          let match = false;
          for (const prop of props) {
            if (item[prop].toString().toLowerCase().indexOf(data) > -1) {
              match = true;
              break;
            }
          }
          return match;
        });
        filteredList = filtered;
      } else {
        filteredList = originalList;
      }
      return filteredList;
    }
  }
  ```

- app/heroes/heroes.component.ts

  ```
  import { Component } from '@angular/core';

  import { FilterTextService } from '../shared/filter-text/filter-text.service';

  @Component({
    selector: 'toh-heroes',
    templateUrl: './heroes.component.html'
  })
  export class HeroesComponent {

    heroes = [
      { id: 1, name: 'Windstorm' },
      { id: 2, name: 'Bombasto' },
      { id: 3, name: 'Magneta' },
      { id: 4, name: 'Tornado' }
    ];

    filteredHeroes = this.heroes;

    constructor(private filterService: FilterTextService) { }

    filterChanged(searchText: string) {
      this.filteredHeroes = this.filterService.filter(searchText, ['id', 'name'], this.heroes);
    }
  }
  ```

- app/heroes/heroes.component.html
  ```
  <div>This is heroes component</div>
  <ul>
    <li *ngFor="let hero of filteredHeroes">
      {{hero.name}}
    </li>
  </ul>
  <toh-filter-text (changed)="filterChanged($event)"></toh-filter-text>
  ```

#### Lazy Loaded folders

##### Style 04-11

- A distinct application feature or workflow may be lazy loaded or loaded on demand rather than when the application starts.

- Do put the contents of lazy loaded features in a lazy loaded folder. A typical lazy loaded folder contains a routing component, its child components, and their related assets and modules.

- Why?
  - The folder makes it easy to identify and isolate the feature content.

#### Never directly import lazy loaded folders

##### Style 04-12

- Avoid allowing modules in sibling and parent folders to directly import a module in a lazy loaded feature.

- Why?
  - Directly importing and using a module will load it immediately when the intention is to load it on demand.

#### Do not add filtering and sorting logic to pipes

##### Style 04-13

- Avoid adding filtering or sorting logic into custom pipes.

- Do pre-compute the filtering and sorting logic in components or services before binding the model in templates.

- Why?
  - Filtering and especially sorting are expensive operations. As Angular can call pipe methods many times per second, sorting and filtering operations can degrade the user experience severely for even moderately-sized lists.

### Components

#### Components as elements

##### Style 05-03

- Consider giving components an _element_ selector, as opposed to _attribute_ or _class_ selectors.

- Why?

  - Components have templates containing HTML and optional Angular template syntax. They display content. Developers place components on the page as they would native HTML elements and web components.

- Why?

  - It is easier to recognize that a symbol is a component by looking at the template's html.

- There are a few cases where you give a component an attribute, such as when you want to augment a built-in element. For example, `Material Design` uses this technique with `<button mat-button>`. However, you wouldn't use this technique on a custom element.

  - app/heroes/hero-button/hero-button.component.ts

    ```
    /* avoid */

    @Component({
      selector: '[tohHeroButton]',
      templateUrl: './hero-button.component.html'
    })
    export class HeroButtonComponent {}
    ```

  - app/app.component.html

    ```
    <!-- avoid -->

    <div tohHeroButton></div>
    ```

  - app/heroes/shared/hero-button/hero-button.component.ts

    ```
    @Component({
      selector: 'toh-hero-button',
      templateUrl: './hero-button.component.html'
    })
    export class HeroButtonComponent {}
    ```

  - app/app.component.html
    ```
    <toh-hero-button></toh-hero-button>
    ```

#### Extract templates and styles to their own files

##### Style 05-04

- Do extract templates and styles into a separate file, when more than 3 lines.

- Do name the template file `[component-name].component.html`, where [component-name] is the component name.

- Do name the style file `[component-name].component.css`, where [component-name] is the component name.

- Do specify component-relative URLs, prefixed with `./`.

- Why?

  - Large, inline templates and styles obscure the component's purpose and implementation, reducing readability and maintainability.

- Why?

  - In most editors, syntax hints and code snippets aren't available when developing inline templates and styles. The Angular TypeScript Language Service (forthcoming) promises to overcome this deficiency for HTML templates in those editors that support it; it won't help with CSS styles.

- Why?
- A component relative URL requires no change when you move the component files, as long as the files stay together.

- Why?

  - The `./` prefix is standard syntax for relative URLs; don't depend on Angular's current ability to do without that prefix.

- app/heroes/heroes.component.ts

  ```
  /* avoid */

  @Component({
    selector: 'toh-heroes',
    template: `
      <div>
        <h2>My Heroes</h2>
        <ul class="heroes">
          <li *ngFor="let hero of heroes | async" (click)="selectedHero=hero">
            <span class="badge">{{hero.id}}</span> {{hero.name}}
          </li>
        </ul>
        <div *ngIf="selectedHero">
          <h2>{{selectedHero.name | uppercase}} is my hero</h2>
        </div>
      </div>
    `,
    styles: [`
      .heroes {
        margin: 0 0 2em 0;
        list-style-type: none;
        padding: 0;
        width: 15em;
      }
      .heroes li {
        cursor: pointer;
        position: relative;
        left: 0;
        background-color: #EEE;
        margin: .5em;
        padding: .3em 0;
        height: 1.6em;
        border-radius: 4px;
      }
      .heroes .badge {
        display: inline-block;
        font-size: small;
        color: white;
        padding: 0.8em 0.7em 0 0.7em;
        background-color: #607D8B;
        line-height: 1em;
        position: relative;
        left: -1px;
        top: -4px;
        height: 1.8em;
        margin-right: .8em;
        border-radius: 4px 0 0 4px;
      }
    `]
  })
  export class HeroesComponent {
    heroes: Observable<Hero[]>;
    selectedHero!: Hero;

    constructor(private heroService: HeroService) {
      this.heroes = this.heroService.getHeroes();
    }
  }
  ```

- Solution:

  - app/heroes/heroes.component.ts

    ```
    @Component({
      selector: 'toh-heroes',
      templateUrl: './heroes.component.html',
      styleUrls:  ['./heroes.component.css']
    })
    export class HeroesComponent {
      heroes: Observable<Hero[]>;
      selectedHero!: Hero;

      constructor(private heroService: HeroService) {
        this.heroes = this.heroService.getHeroes();
      }
    }
    ```

  - app/heroes/heroes.component.html

    ```
    <div>
      <h2>My Heroes</h2>
      <ul class="heroes">
        <li *ngFor="let hero of heroes | async">
          <button type="button" (click)="selectedHero=hero">
            <span class="badge">{{hero.id}}</span>
            <span class="name">{{hero.name}}</span>
          </button>
        </li>
      </ul>
      <div *ngIf="selectedHero">
        <h2>{{selectedHero.name | uppercase}} is my hero</h2>
      </div>
    </div>
    ```

  - app/heroes/heroes.component.css

    ```
    .heroes {
      margin: 0 0 2em 0;
      list-style-type: none;
      padding: 0;
      width: 15em;
    }

    .heroes li {
      display: flex;
    }

    .heroes button {
      flex: 1;
      cursor: pointer;
      position: relative;
      left: 0;
      background-color: #EEE;
      margin: .5em;
      padding: 0;
      border-radius: 4px;
      display: flex;
      align-items: stretch;
      height: 1.8em;
    }

    .heroes button:hover {
      color: #2c3a41;
      background-color: #e6e6e6;
      left: .1em;
    }

    .heroes button:active {
      background-color: #525252;
      color: #fafafa;
    }

    .heroes button.selected {
      background-color: black;
      color: white;
    }

    .heroes button.selected:hover {
      background-color: #505050;
      color: white;
    }

    .heroes button.selected:active {
      background-color: black;
      color: white;
    }

    .heroes .badge {
      display: inline-block;
      font-size: small;
      color: white;
      padding: 0.8em 0.7em 0 0.7em;
      background-color: #405061;
      line-height: 1em;
      margin-right: .8em;
      border-radius: 4px 0 0 4px;
    }

    .heroes .name {
      align-self: center;
    }
    ```

#### Decorate input and output properties

##### Style 05-12

- Do use the `@Input()` and `@Output()` class decorators instead of the inputs and outputs properties of the `@Directive` and `@Component` metadata:

- Consider placing `@Input()` or `@Output()` on the same line as the property it decorates.

- Why?

  - It is easier and more readable to identify which properties in a class are inputs or outputs.

- Why?

  - If you ever need to rename the property or event name associated with @Input() or @Output(), you can modify it in a single place.

- Why?

  - The metadata declaration attached to the directive is shorter and thus more readable.

- Why?

  - Placing the decorator on the same line usually makes for shorter code and still easily identifies the property as an input or output. Put it on the line above when doing so is clearly more readable.

- app/heroes/shared/hero-button/hero-button.component.ts

  ```
  /* avoid */

  @Component({
    selector: 'toh-hero-button',
    template: `<button type="button"></button>`,
    inputs: [
      'label'
    ],
    outputs: [
      'heroChange'
    ]
  })
  export class HeroButtonComponent {
    heroChange = new EventEmitter<any>();
    label: string;
  }
  ```

- Solution:
  - app/heroes/shared/hero-button/hero-button.component.ts
    ```
    @Component({
      selector: 'toh-hero-button',
      template: `<button type="button">{{label}}</button>`
    })
    export class HeroButtonComponent {
      @Output() heroChange = new EventEmitter<any>();
      @Input() label = '';
    }
    ```

#### Avoid aliasing inputs and outputs

##### Style 05-13

- Avoid input and output aliases except when it serves an important purpose.

- Why?
- Two names for the same property (one private, one public) is inherently confusing.

- Why?
- You should use an alias when the directive name is also an input property, and the directive name doesn't describe the property.

- app/heroes/shared/hero-button/hero-button.component.ts

  ```
  /* avoid pointless aliasing */

  @Component({
    selector: 'toh-hero-button',
    template: `<button type="button">{{label}}</button>`
  })
  export class HeroButtonComponent {
    // Pointless aliases
    @Output('heroChangeEvent') heroChange = new EventEmitter<any>();
    @Input('labelAttribute') label: string;
  }
  ```

- app/app.component.html

  ```
  <!-- avoid -->

  <toh-hero-button labelAttribute="OK" (changeEvent)="doSomething()">
  </toh-hero-button>
  ```

- Solution:

  - app/heroes/shared/hero-button/hero-button.component.ts

    ```
    @Component({
      selector: 'toh-hero-button',
      template: `<button type="button" >{{label}}</button>`
    })
    export class HeroButtonComponent {
      // No aliases
      @Output() heroChange = new EventEmitter<any>();
      @Input() label = '';
    }
    ```

  - app/heroes/shared/hero-button/hero-highlight.directive.ts

    ```
    import { Directive, ElementRef, Input, OnChanges } from '@angular/core';

    @Directive({ selector: '[heroHighlight]' })
    export class HeroHighlightDirective implements OnChanges {

      // Aliased because `color` is a better property name than `heroHighlight`
      @Input('heroHighlight') color = '';

      constructor(private el: ElementRef) {}

      ngOnChanges() {
        this.el.nativeElement.style.backgroundColor = this.color || 'yellow';
      }
    }
    ```

  - app/app.component.html

    ```
    <toh-hero-button label="OK" (change)="doSomething()">
    </toh-hero-button>

    <!-- `heroHighlight` is both the directive name and the data-bound aliased property name -->
    <h3 heroHighlight="skyblue">The Great Bombasto</h3>
    ```

#### Member sequence

##### Style 05-14

- Do place properties up top followed by methods.

- Do place private members after public members, alphabetized.

- Why?

  - Placing members in a consistent sequence makes it easy to read and helps instantly identify which members of the component serve which purpose.

- app/shared/toast/toast.component.ts

  ```
  /* avoid */

  export class ToastComponent implements OnInit {

    private defaults = {
      title: '',
      message: 'May the Force be with you'
    };
    message: string;
    title: string;
    private toastElement: any;

    ngOnInit() {
      this.toastElement = document.getElementById('toh-toast');
    }

    // private methods
    private hide() {
      this.toastElement.style.opacity = 0;
      window.setTimeout(() => this.toastElement.style.zIndex = 0, 400);
    }

    activate(message = this.defaults.message, title = this.defaults.title) {
      this.title = title;
      this.message = message;
      this.show();
    }

    private show() {
      console.log(this.message);
      this.toastElement.style.opacity = 1;
      this.toastElement.style.zIndex = 9999;

      window.setTimeout(() => this.hide(), 2500);
    }
  }
  ```

- Solution:

  - app/shared/toast/toast.component.ts

    ```
    export class ToastComponent implements OnInit {
      // public properties
      message = '';
      title = '';

      // private fields
      private defaults = {
        title: '',
        message: 'May the Force be with you'
      };
      private toastElement: any;

      // public methods
      activate(message = this.defaults.message, title = this.defaults.title) {
        this.title = title;
        this.message = message;
        this.show();
      }

      ngOnInit() {
        this.toastElement = document.getElementById('toh-toast');
      }

      // private methods
      private hide() {
        this.toastElement.style.opacity = 0;
        window.setTimeout(() => this.toastElement.style.zIndex = 0, 400);
      }

      private show() {
        console.log(this.message);
        this.toastElement.style.opacity = 1;
        this.toastElement.style.zIndex = 9999;
        window.setTimeout(() => this.hide(), 2500);
      }
    }
    ```

#### Delegate complex component logic to services

##### Style 05-15

- Do limit logic in a component to only that required for the view. All other logic should be delegated to services.

- Do move reusable logic to services and keep components simple and focused on their intended purpose.

- Why?

  - Logic may be reused by multiple components when placed within a service and exposed as a function.

- Why?

  - Logic in a service can more easily be isolated in a unit test, while the calling logic in the component can be easily mocked.

- Why?

  - Removes dependencies and hides implementation details from the component.

- Why?

  - Keeps the component slim, trim, and focused.

- app/heroes/hero-list/hero-list.component.ts

  ```
  /* avoid */

  import { OnInit } from '@angular/core';
  import { HttpClient } from '@angular/common/http';

  import { Observable } from 'rxjs';
  import { catchError, finalize } from 'rxjs/operators';

  import { Hero } from '../shared/hero.model';

  const heroesUrl = 'http://angular.io';

  export class HeroListComponent implements OnInit {
    heroes: Hero[];
    constructor(private http: HttpClient) {}
    getHeroes() {
      this.heroes = [];
      this.http.get(heroesUrl).pipe(
        catchError(this.catchBadResponse),
        finalize(() => this.hideSpinner())
      ).subscribe((heroes: Hero[]) => this.heroes = heroes);
    }
    ngOnInit() {
      this.getHeroes();
    }

    private catchBadResponse(err: any, source: Observable<any>) {
      // log and handle the exception
      return new Observable();
    }

    private hideSpinner() {
      // hide the spinner
    }
  }
  ```

- Solution:

  - app/heroes/hero-list/hero-list.component.ts

    ```
    import { Component, OnInit } from '@angular/core';

    import { Hero, HeroService } from '../shared';

    @Component({
      selector: 'toh-hero-list',
      template: `...`
    })
    export class HeroListComponent implements OnInit {
      heroes: Hero[] = [];
      constructor(private heroService: HeroService) {}
      getHeroes() {
        this.heroes = [];
        this.heroService.getHeroes()
          .subscribe(heroes => this.heroes = heroes);
      }
      ngOnInit() {
        this.getHeroes();
      }
    }
    ```

#### Don't prefix output properties

##### Style 05-16

- Do name events without the prefix `on`.

- Do name event handler methods with the prefix `on` followed by the event name.

- Why?

  - This is consistent with built-in events such as button clicks.

- Why?

  - Angular allows for an alternative syntax `on-*`. If the event itself was prefixed with `on` this would result in an on-onEvent binding expression.

- app/heroes/hero.component.ts

  ```
  /* avoid */

  @Component({
    selector: 'toh-hero',
    template: `...`
  })
  export class HeroComponent {
    @Output() onSavedTheDay = new EventEmitter<boolean>();
  }
  ```

- app/app.component.html

  ```
  <!-- avoid -->

  <toh-hero (onSavedTheDay)="onSavedTheDay($event)"></toh-hero>
  ```

- Solution:

  - app/heroes/hero.component.ts

    ```
    export class HeroComponent {
      @Output() savedTheDay = new EventEmitter<boolean>();
    }
    ```

  - app/app.component.html

    ```
    <toh-hero (savedTheDay)="onSavedTheDay($event)"></toh-hero>
    ```

#### Put presentation logic in the component class

##### Style 05-17

- Do put presentation logic in the component class, and not in the template.

- Why?

  - Logic will be contained in one place (the component class) instead of being spread in two places.

- Why?

  - Keeping the component's presentation logic in the class instead of the template improves testability, maintainability, and reusability.

- app/heroes/hero-list/hero-list.component.ts

  ```
  /* avoid */

  @Component({
    selector: 'toh-hero-list',
    template: `
      <section>
        Our list of heroes:
        <toh-hero *ngFor="let hero of heroes" [hero]="hero">
        </toh-hero>
        Total powers: {{totalPowers}}<br>
        Average power: {{totalPowers / heroes.length}}
      </section>
    `
  })
  export class HeroListComponent {
    heroes: Hero[];
    totalPowers: number;
  }
  ```

- Solutions:

  - app/heroes/hero-list/hero-list.component.ts

    ```
    @Component({
      selector: 'toh-hero-list',
      template: `
        <section>
          Our list of heroes:
          <toh-hero *ngFor="let hero of heroes" [hero]="hero">
          </toh-hero>
          Total powers: {{totalPowers}}<br>
          Average power: {{avgPower}}
        </section>
      `
    })
    export class HeroListComponent {
      heroes: Hero[];
      totalPowers = 0;

      get avgPower() {
        return this.totalPowers / this.heroes.length;
      }
    }
    ```

#### Initialize inputs

##### Style 05-18

- TypeScript's `--strictPropertyInitialization` compiler option ensures that a class initializes its properties during construction. When enabled, this option causes the TypeScript compiler to report an error if the class does not set a value to any property that is not explicitly marked as optional.

- By design, Angular treats all `@Input` properties as optional. When possible, you should satisfy `--strictPropertyInitialization` by providing a default value.

- app/heroes/hero/hero.component.ts

  ```
  @Component({
    selector: 'toh-hero',
    template: `...`
  })
  export class HeroComponent {
    @Input() id = 'default_id';
  }
  ```

- If the property is hard to construct a default value for, use `?` to explicitly mark the property as optional.

  - app/heroes/hero/hero.component.ts

    ```
    @Component({
      selector: 'toh-hero',
      template: `...`
    })
    export class HeroComponent {
      @Input() id?: string;

      process() {
        if (this.id) {
          // ...
        }
      }
    }
    ```

- You may want to have a required `@Input` field, meaning all your component users are required to pass that attribute. In such cases, use a default value. Just suppressing the TypeScript error with `!` is insufficient and should be avoided because it will prevent the type checker ensure the input value is provided.

  - app/heroes/hero/hero.component.ts
    ```
    @Component({
      selector: 'toh-hero',
      template: `...`
    })
    export class HeroComponent {
      // The exclamation mark suppresses errors that a property is
      // not initialized.
      // Ignoring this enforcement can prevent the type checker
      // from finding potential issues.
      @Input() id!: string;
    }
    ```

### Directives

#### Use directives to enhance an element

##### Style 06-01

- Do use attribute directives when you have presentation logic without a template.

- Why?

  - Attribute directives don't have an associated template.

- Why?

  - An element may have more than one attribute directive applied.

- app/shared/highlight.directive.ts

  ```
  @Directive({
    selector: '[tohHighlight]'
  })
  export class HighlightDirective {
    @HostListener('mouseover') onMouseEnter() {
      // do highlight work
    }
  }
  ```

- app/app.component.html
  ```
  <div tohHighlight>Bombasta</div>
  ```

#### HostListener/HostBinding decorators versus host metadata

##### Style 06-03

- Consider preferring the `@HostListener` and `@HostBinding` to the `host` property of the `@Directive` and `@Component` decorators.

- Do be consistent in your choice.

- Why?

  - The property associated with `@HostBinding` or the method associated with `@HostListener` can be modified only in a single place —in the directive's class. If you use the host metadata property, you must modify both the property/method declaration in the directive's class and the metadata in the decorator associated with the directive.

- app/shared/validator.directive.ts

  ```
  import { Directive, HostBinding, HostListener } from '@angular/core';

  @Directive({
    selector: '[tohValidator]'
  })
  export class ValidatorDirective {
    @HostBinding('attr.role') role = 'button';
    @HostListener('mouseenter') onMouseEnter() {
      // do work
    }
  }
  ```

- Compare with the less preferred `host` metadata alternative.

- Why?

  - The host metadata is only one term to remember and doesn't require extra ES imports.

- app/shared/validator2.directive.ts

  ```
  import { Directive } from '@angular/core';

  @Directive({
    selector: '[tohValidator2]',
    host: {
      '[attr.role]': 'role',
      '(mouseenter)': 'onMouseEnter()'
    }
  })
  export class Validator2Directive {
    role = 'button';
    onMouseEnter() {
      // do work
    }
  }
  ```

### Services

#### Services are singletons

##### Style 07-01

- Do use services as singletons within the same injector. Use them for sharing data and functionality.

- Why?

  - Services are ideal for sharing methods across a feature area or an app.

- Why?

  - Services are ideal for sharing stateful in-memory data.

- app/heroes/shared/hero.service.ts

  ```
  export class HeroService {
    constructor(private http: HttpClient) { }

    getHeroes() {
      return this.http.get<Hero[]>('api/heroes');
    }
  }
  ```

#### Single responsibility

##### Style 07-02

- Do create services with a single responsibility that is encapsulated by its context.

- Do create a new service once the service begins to exceed that singular purpose.

- Why?

  - When a service has multiple responsibilities, it becomes difficult to test.

- Why?
  When a service has multiple responsibilities, every component or service that injects it now carries the weight of them all.

#### Providing a service

##### Style 07-03

- Do provide a service with the application root injector in the `@Injectable` decorator of the service.

- Why?

  - The Angular injector is hierarchical.

- Why?

  - When you provide the service to a root injector, that instance of the service is shared and available in every class that needs the service. This is ideal when a service is sharing methods or state.

- Why?

  - When you register a service in the `@Injectable` decorator of the service, optimization tools such as those used by the Angular CLI's production builds can perform tree shaking and remove services that aren't used by your app.

- Why?

  - This is not ideal when two different components need different instances of a service. In this scenario it would be better to provide the service at the component level that needs the new and separate instance.

- src/app/treeshaking/service.ts
  ```
  @Injectable({
    providedIn: 'root',
  })
  export class Service {
  }
  ```

#### Use the @Injectable() class decorator

##### Style 07-04

- Do use the `@Injectable()` class decorator instead of the `@Inject` parameter decorator when using types as tokens for the dependencies of a service.

- Why?

  - The Angular Dependency Injection (DI) mechanism resolves a service's own dependencies based on the declared types of that service's constructor parameters.

- Why?

  - When a service accepts only dependencies associated with type tokens, the `@Injectable()` syntax is much less verbose compared to using `@Inject()` on each individual constructor parameter.

- app/heroes/shared/hero-arena.service.ts

  ```
  /* avoid */

  export class HeroArena {
    constructor(
        @Inject(HeroService) private heroService: HeroService,
        @Inject(HttpClient) private http: HttpClient) {}
  }
  ```

- Solutions:
  - app/heroes/shared/hero-arena.service.ts
    ```
    @Injectable()
    export class HeroArena {
      constructor(
        private heroService: HeroService,
        private http: HttpClient) {}
    }
    ```

### Data Services

#### Talk to the server through a service

##### Style 08-01

- Do refactor logic for making data operations and interacting with data to a service.

- Do make data services responsible for XHR calls, local storage, stashing in memory, or any other data operations.

- Why?
  The component's responsibility is for the presentation and gathering of information for the view. It should not care how it gets the data, just that it knows who to ask for it. Separating the data services moves the logic on how to get it to the data service, and lets the component be simpler and more focused on the view.

- Why?

  - This makes it easier to test (mock or real) the data calls when testing a component that uses a data service.

- Why?

  - The details of data management, such as headers, HTTP methods, caching, error handling, and retry logic, are irrelevant to components and other data consumers.

- A data service encapsulates these details. It's easier to evolve these details inside the service without affecting its consumers. And it's easier to test the consumers with mock service implementations.

### Lifecycle hooks

- Use Lifecycle hooks to tap into important events exposed by Angular.

#### Implement lifecycle hook interfaces

##### Style 09-01

- Do implement the lifecycle hook interfaces.

- Why?

  - Lifecycle interfaces prescribe typed method signatures. Use those signatures to flag spelling and syntax mistakes.

- app/heroes/shared/hero-button/hero-button.component.ts

  ```
  /* avoid */

  @Component({
    selector: 'toh-hero-button',
    template: `<button type="button">OK</button>`
  })
  export class HeroButtonComponent {
    onInit() { // misspelled
      console.log('The component is initialized');
    }
  }
  ```

- Solution:
  - app/heroes/shared/hero-button/hero-button.component.ts
    ```
    @Component({
      selector: 'toh-hero-button',
      template: `<button type="button">OK</button>`
    })
    export class HeroButtonComponent implements OnInit {
      ngOnInit() {
        console.log('The component is initialized');
      }
    }
    ```

### Appendix

- Useful tools and tips for Angular.

#### File templates and snippets

##### Style A-02

- Do use file templates or snippets to help follow consistent styles and patterns. Here are templates and/or snippets for some of the web development editors and IDEs.

- Consider using [snippets](https://marketplace.visualstudio.com/items?itemName=johnpapa.Angular2) for Visual Studio Code that follow these styles and guidelines.

  ![](https://marketplace.visualstudio.com/items?itemName=johnpapa.Angular2)

- Consider using [snippets] for Atom that follow these styles and guidelines.

- Consider using [snippets] for Sublime Text that follow these styles and guidelines.

- Consider using [snippets] for Vim that follow these styles and guidelines.
