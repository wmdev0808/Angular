# Theming Angular Material

## What is theming?

- Angular Material's theming system lets you customize color, typography, and density styles for components in your application. The theming system is based on Google's [Material Design](https://material.io/design/material-theming/overview.html) specification.

### Sass

- Angular Material's theming APIs are built with [Sass](https://sass-lang.com/).

- You can use Angular Material without Sass by using a pre-built theme, described in Using a `pre-built theme` below. However, using the library's Sass API directly gives you the most control over the styles in your application.

## Palettes

- A **palette** is a collection of colors representing a portion of color space. Each value in this collection is called a **hue**. In Material Design, each hues in a palette has an identifier number. These identifier numbers include 50, and then each 100 value between 100 and 900. The numbers order hues within a palette from lightest to darkest.

- Angular Material represents a palette as a Sass map. This map contains the palette's hues and another nested map of contrast colors for each of the hues. The contrast colors serve as text color when using a hue as a background color.

```
$indigo-palette: (
 50: #e8eaf6,
 100: #c5cae9,
 200: #9fa8da,
 300: #7986cb,
 // ... continues to 900
 contrast: (
   50: rgba(black, 0.87),
   100: rgba(black, 0.87),
   200: rgba(black, 0.87),
   300: white,
   // ... continues to 900
 )
);
```

### Create your own palette

- You can create your own palette by defining a Sass map that matches the structure described in the Palettes section above. The map must define hues for 50 and each hundred between 100 and 900. The map must also define a `contrast` map with contrast colors for each hue.

You can use the [Material Design palette tool](https://material.io/design/color/the-color-system.html#tools-for-picking-colors) to help choose the hues in your palette.

### Predefined palettes

- Angular Material offers predefined palettes based on the 2014 version of the Material Design spec. See the [Material Design 2014 color palettes](https://material.io/archive/guidelines/style/color.html#color-color-palette) for a full list.

- In addition to hues numbered from zero to 900, the 2014 Material Design palettes each include distinct _accent_ hues numbered as `A100`, `A200`, `A400`, and `A700`. Angular Material does not require these hues, but you can use these hues when defining a theme as described in Defining a theme below.

  ```
  @use '@angular/material' as mat;

  $my-palette: mat.$indigo-palette;
  ```

## Themes

- A **theme** is a collection of color, typography, and density options. Each theme includes three palettes that determine component colors:

  - A **primary** palette for the color that appears most frequently throughout your application
  - An **accent**, or _secondary_, palette used to selectively highlight key parts of your UI
  - A **warn**, or _error_, palette used for warnings and error states

- You can include the CSS styles for a theme in your application in one of two ways: by defining a custom theme with Sass, or by importing a pre-built theme CSS file.

### Custom themes with Sass

- A **theme file** is a Sass file that calls Angular Material Sass mixins to output color, typography, and density CSS styles.

#### The `core` mixin

- Angular Material defines a mixin named `core` that includes prerequisite styles for common features used by multiple components, such as ripples. The `core` mixin must be included exactly once for your application, even if you define multiple themes. Including the core mixin multiple times will result in duplicate CSS in your application.

  ```
  @use '@angular/material' as mat;

  @include mat.core();
  ```

#### Defining a theme

- Angular Material represents a theme as a Sass map that contains your color, typography, and density choices.

- Constructing the theme first requires defining your primary and accent palettes, with an optional warn palette. The `define-palette` Sass function accepts a color palette, described in the Palettes section above, as well as four optional hue numbers. These four hues represent, in order: the "default" hue, a "lighter" hue, a "darker" hue, and a "text" hue. Components use these hues to choose the most appropriate color for different parts of themselves.

  ```
  @use '@angular/material' as mat;

  $my-primary: mat.define-palette(mat.$indigo-palette, 500);
  $my-accent: mat.define-palette(mat.$pink-palette, A200, A100, A400);

  // The "warn" palette is optional and defaults to red if not specified.
  $my-warn: mat.define-palette(mat.$red-palette);
  ```

- You can construct a theme by calling either `define-light-theme` or `define-dark-theme` with the result from `define-palette`. The choice of a light versus a dark theme determines the background and foreground colors used throughout the components.

  ```
  @use '@angular/material' as mat;

  $my-primary: mat.define-palette(mat.$indigo-palette, 500);
  $my-accent: mat.define-palette(mat.$pink-palette, A200, A100, A400);

  // The "warn" palette is optional and defaults to red if not specified.
  $my-warn: mat.define-palette(mat.$red-palette);

  $my-theme: mat.define-light-theme((
  color: (
    primary: $my-primary,
    accent: $my-accent,
    warn: $my-warn,
  ),
  typography: mat.define-typography-config(),
  density: 0,
  ));
  ```

#### Applying a theme to components

- The `core-theme` Sass mixin emits prerequisite styles for common features used by multiple components, such as ripples. This mixin must be included once per theme.

Each Angular Material component has a mixin for each color , typography, and density. For example, `MatButton` declares `button-color`, `button-typography`, and `button-density`. Each mixin emits only the styles corresponding to that area of customization.

- Additionally, each component has a "theme" mixin that emits all styles that depend on the theme config. This theme mixin only emits color, typography, or density styles if you provided a corresponding configuration to `define-light-theme` or `define-dark-theme`.

- Apply the styles for each of the components used in your application by including each of their theme Sass mixins.

  ```
  @use '@angular/material' as mat;

  @include mat.core();

  $my-primary: mat.define-palette(mat.$indigo-palette, 500);
  $my-accent: mat.define-palette(mat.$pink-palette, A200, A100, A400);

  $my-theme: mat.define-light-theme((
  color: (
    primary: $my-primary,
    accent: $my-accent,
  ),
  density: 0,
  ));

  // Emit theme-dependent styles for common features used across multiple components.
  @include mat.core-theme($my-theme);

  // Emit styles for MatButton based on `$my-theme`. Because the configuration
  // passed to `define-light-theme` omits typography, `button-theme` will not
  // emit any typography styles.
  @include mat.button-theme($my-theme);

  // Include the theme mixins for other components you use here.
  ```

- As an alternative to listing every component that your application uses, Angular Material offers Sass mixins that includes styles for all components in the library: `all-component-colors`, `all-component-typographies`, `all-component-densitites`, and `all-component-themes`. These mixins behave the same as individual component mixins, except they emit styles for core-theme and all 35+ components in Angular Material. Unless your application uses every single component, this will produce unnecessary CSS.

  ```
  @use '@angular/material' as mat;

  @include mat.core();

  $my-primary: mat.define-palette(mat.$indigo-palette, 500);
  $my-accent: mat.define-palette(mat.$pink-palette, A200, A100, A400);

  $my-theme: mat.define-light-theme((
  color: (
    primary: $my-primary,
    accent: $my-accent,
  ),
  typography: mat.define-typography-config(),
  density: 0,
  ));

  @include mat.all-component-themes($my-theme);
  ```

- To include the emitted styles in your application, add your theme file to the `styles` array of your project's `angular.json` file.

### Using a pre-built theme

- Angular Material includes four pre-built theme CSS files, each with different palettes selected. You can use one of these pre-built themes if you don't want to define a custom theme with Sass.

  | Theme                | Light or dark? | Palettes (primary, accent, warn) |
  | -------------------- | -------------- | -------------------------------- |
  | deeppurple-amber.css | Ligh           | t deep-purple, amber, red        |
  | indigo-pink.css      | Light          | indigo, pink, red                |
  | pink-bluegrey.css    | Dark           | pink, bluegrey, red              |
  | purple-green.css     | Dark           | purple, green, red               |

- These files include the CSS for every component in the library. To include only the CSS for a subset of components, you must use the Sass API detailed in `Defining a theme` above. You can [reference the source code for these pre-built themes](https://github.com/angular/components/blob/main/src/material/core/theming/prebuilt) to see examples of complete theme definitions.

- You can find the pre-built theme files in the "prebuilt-themes" directory of Angular Material's npm package (`@angular/material/prebuilt-themes`). To include the pre-built theme in your application, add your chosen CSS file to the `styles` array of your project's `angular.json` file.

### Defining multiple themes

- Using the Sass API described in `Defining a theme`, you can also define _multiple themes_ by repeating the API calls multiple times. You can do this either in the same theme file or in separate theme files.

#### Multiple themes in one file

- Defining multiple themes in a single file allows you to support multiple themes without having to manage loading of multiple CSS assets. The downside, however, is that your CSS will include more styles than necessary.

- To control which theme applies when, `@include` the mixins only within a context specified via CSS rule declaration. See the [documentation for Sass mixins](https://sass-lang.com/documentation/at-rules/mixin) for further background.

  ```
  @use '@angular/material' as mat;

  @include mat.core();

  // Define a dark theme
  $dark-theme: mat.define-dark-theme((
  color: (
    primary: mat.define-palette(mat.$pink-palette),
    accent: mat.define-palette(mat.$blue-grey-palette),
  ),
    // Only include `typography` and `density` in the default dark theme.
    typography: mat.define-typography-config(),
    density: 0,
  ));

  // Define a light theme
  $light-theme: mat.define-light-theme((
  color: (
    primary: mat.define-palette(mat.$indigo-palette),
    accent: mat.define-palette(mat.$pink-palette),
  ),
  ));

  // Apply the dark theme by default
  @include mat.core-theme($dark-theme);
  @include mat.button-theme($dark-theme);

  // Apply the light theme only when the user prefers light themes.
  @media (prefers-color-scheme: light) {
  // Use the `-color` mixins to only apply color styles without reapplying the same
  // typography and density styles.
  @include mat.core-color($light-theme);
  @include mat.button-color($light-theme);
  }
  ```

#### Multiple themes across separate files

- You can define multiple themes in separate files by creating multiple theme files per `Defining a theme`, adding each of the files to the `styles` of your `angular.json`. However, you must additionally set the `inject` option for each of these files to `false` in order to prevent all the theme files from being loaded at the same time. When setting this property to false, your application becomes responsible for manually loading the desired file. The approach for this loading depends on your application.

### Application background color

- By default, Angular Material does not apply any styles to your DOM outside its own components. If you want to set your application's background color to match the components' theme, you can either:

  - 1. Put your application's main content inside `mat-sidenav-container`, assuming you're using `MatSidenav`, or

  - 2. Apply the `mat-app-background` CSS class to your main content root element (typically `body`).

### Scoping style customizations

- You can use Angular Material's Sass mixins to customize component styles within a specific scope in your application. The CSS rule declaration in which you include a Sass mixin determines its scope. The example below shows how to customize the color of all buttons inside elements marked with the `.my-special-section` CSS class.

  ```
  @use '@angular/material' as mat;

  .my-special-section {
    $special-primary: mat.define-palette(mat.$orange-palette);
    $special-accent: mat.define-palette(mat.$brown-palette);
    $special-theme: mat.define-dark-theme((
      color: (primary: $special-primary, accent: $special-accent),
    ));

    @include mat.button-color($special-theme);
  }
  ```

### Reading hues from palettes

- You can use the `get-color-from-palette` function to get specific hues from a palette by their number identifier. You can also access the contrast color for a particular hue by suffixing the hue's number identifier with `-contrast`.

  ```
  @use '@angular/material' as mat;

  $my-palette: mat.define-palette(mat.$indigo-palette);

  .my-custom-style {
    background: mat.get-color-from-palette($my-palette, 500);
    color: mat.get-color-from-palette($my-palette, '500-contrast');
  }
  ```

- You can also reference colors using the `"default"`, `"lighter"`, `"darker"`, and `"text"` colors passed to `define-palette`.

  ```
  @use '@angular/material' as mat;

  $my-palette: mat.define-palette(mat.$indigo-palette);

  .my-custom-darker-style {
    background: mat.get-color-from-palette($my-palette, 'darker');
    color: mat.get-color-from-palette($my-palette, 'darker-contrast');
  }
  ```

## Customizing density

- Angular Material's density customization is based on the [Material Design density guidelines](https://m2.material.io/design/layout/applying-density.html). This system defines a scale where zero represents the default density. You can decrement the number for _more density_ and increment the number for _less density_.

- The density system is based on a _density scale_. The scale starts with the default density of `0`. Each whole number step down (`-1`, `-2`, etc.) reduces the affected sizes by `4px`, down to the minimum size necessary for a component to render coherently.

- Components that appear in task-based or pop-up contexts, such as `MatDatepicker`, don't change their size via the density system. `The Material Design density guidance` explicitly discourages increasing density for such interactions because they don't compete for space in the application's layout.

- You can apply custom density setting to the entire library or to individual components using their density Sass mixins.

  ```
  // You can set a density setting in your theme to apply to all components.
  $dark-theme: mat.define-dark-theme((
    color: ...,
    typography: ...,
    density: -2,
  ));

  // Or you can selectively apply the Sass mixin to affect only specific parts of your application.
  .the-dense-zone {
    @include mat.button-density(-1);
  }
  ```

## Strong focus indicators

- By default, most components indicate browser focus by changing their background color as described by the Material Design specification. This behavior, however, can fall short of accessibility requirements, such as [WCAG](https://www.w3.org/WAI/standards-guidelines/wcag/glance/), which require a stronger indication of browser focus.

- Angular Material supports rendering highly visible outlines on focused elements. Applications can enable these strong focus indicators via two Sass mixins: `strong-focus-indicators` and `strong-focus-indicators-theme`.

  - The `strong-focus-indicators` mixin emits structural indicator styles for all components. This mixin should be included exactly once in an application, similar to the `core` mixin described above.

  - The `strong-focus-indicators-theme` mixin emits only the indicator's color styles. This mixin should be included once per theme, similar to the theme mixins described above. Additionally, you can use this mixin to change the color of the focus indicators in situations in which the default color would not contrast sufficiently with the background color.

- The following example includes strong focus indicator styles in an application alongside the rest of the custom theme API.

  ```
  @use '@angular/material' as mat;

  @include mat.core();
  @include mat.strong-focus-indicators();

  $my-primary: mat.define-palette(mat.$indigo-palette, 500);
  $my-accent: mat.define-palette(mat.$pink-palette, A200, A100, A400);

  $my-theme: mat.define-light-theme((
    color: (
      primary: $my-primary,
      accent: $my-accent,
    )
  ));

  @include mat.all-component-themes($my-theme);
  @include mat.strong-focus-indicators-theme($my-theme);
  ```

### Customizing strong focus indicators

- You can pass a configuration map to `strong-focus-indicators` to customize the appearance of the indicators. This configuration includes `border-style`, `border-width`, and `border-radius`.

- You also can customize the color of indicators with `strong-focus-indicators-theme`. This mixin accepts either a theme, as described earlier in this guide, or a CSS color value. When providing a theme, the indicators will use the default hue of the primary palette.

- The following example includes strong focus indicator styles with custom settings alongside the rest of the custom theme API.

  ```
  @use '@angular/material' as mat;

  @include mat.core();
  @include mat.strong-focus-indicators((
    border-style: dotted,
    border-width: 4px,
    border-radius: 2px,
  ));

  $my-primary: mat.define-palette(mat.$indigo-palette, 500);
  $my-accent: mat.define-palette(mat.$pink-palette, A200, A100, A400);

  $my-theme: mat.define-light-theme((
    color: (
      primary: $my-primary,
      accent: $my-accent,
    )
  ));

  @include mat.all-component-themes($my-theme);
  @include mat.strong-focus-indicators-theme(purple);
  ```

## Theming and style encapsulation

- Angular Material assumes that, by default, all theme styles are loaded as global CSS. If you want to use [Shadow DOM](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM) in your application, you must load the theme styles within each shadow root that contains an Angular Material component. You can accomplish this by manually loading the CSS in each shadow root, or by using [Constructable Stylesheets](https://developers.google.com/web/updates/2019/02/constructable-stylesheets).

## User preference media queries

- Angular Material does not apply styles based on user preference media queries, such as `prefers-color-scheme` or `prefers-contrast`. Instead, Angular Material's Sass mixins give you the flexibility to apply theme styles to based on the conditions that make the most sense for your users. This may mean using media queries directly or reading a saved user preference.

## Style customization outside the theming system

Angular Material supports customizing color, typography, and density as outlined in this document. Angular strongly discourages, and does not directly support, overriding component CSS outside the theming APIs described above. Component DOM structure and CSS classes are considered private implementation details that may change at any time.

# Theme your own components with Angular Material's theming system

- You can use Angular Material's Sass-based theming system for your own custom components.

## Reading style values from a theme

- As described in the `theming guide`, a theme is a Sass map that contains style values to customize components. Angular Material provides APIs for reading values from this data structure.

### Reading color values

- To read color values from a theme, you can use the `get-color-config` Sass function. This function returns a Sass map containing the theme's primary, accent, and warn palettes, as well as a flag indicating whether dark mode is set.

  ```
  @use 'sass:map';
  @use '@angular/material' as mat;

  $color-config:    mat.get-color-config($theme);
  $primary-palette: map.get($color-config, 'primary');
  $accent-palette:  map.get($color-config, 'accent');
  $warn-palette:    map.get($color-config, 'warn');
  $is-dark-theme:   map.get($color-config, 'is-dark');
  ```

### Reading typography values

- To read typography values from a theme, you can use the `get-typography-config` Sass function.

  ```
  @use '@angular/material' as mat;

  $typography-config: mat.get-typography-config($theme);
  $my-font-family: mat.font-family($typography-config);
  ```

## Separating theme styles

- Angular Material components each have a Sass file that defines mixins for customizing that component's color and typography. For example, `MatButton` has mixins for `button-color` and `button-typography`. Each mixin emits all color and typography styles for that component, respectively.

- You can mirror this structure in your components by defining your own mixins. These mixins should accept an Angular Material theme, from which they can read color and typography values. You can then include these mixins in your application along with Angular Material's own mixins.

## Step-by-step example

- To illustrate participation in Angular Material's theming system, we can look at an example of a custom carousel component. The carousel starts with a single file, `carousel.scss`, that contains structural, color, and typography styles. This file is included in the `styleUrls` of the component.

  ```
  // carousel.scss

  .my-carousel {
    display: flex;
    font-family: serif;
  }

  .my-carousel-button {
    border-radius: 50%;
    color: blue;
  }
  ```

### Step 1: Extract theme-based styles to a separate file

- To change this file to participate in Angular Material's theming system, we split the styles into two files, with the color and typography styles moved into mixins. By convention, the new file name ends with `-theme`. Additionally, the file starts with an underscore (`_`), indicating that this is a Sass partial file. See the [Sass documentation](https://sass-lang.com/guide#topic-4) for more information about partial files.

  ```
  // carousel.scss

  .my-carousel {
    display: flex;
  }

  .my-carousel-button {
    border-radius: 50%;
  }
  ```

  ```
  // _carousel-theme.scss

  @mixin color($theme) {
    .my-carousel-button {
      color: blue;
    }
  }

  @mixin typography($theme) {
    .my-carousel {
      font-family: serif;
    }
  }
  ```

### Step 2: Use values from the theme

- Now that theme theme-based styles reside in mixins, we can extract the values we need from the theme passed into the mixins.

  ```
  // _carousel-theme.scss

  @use 'sass:map';
  @use '@angular/material' as mat;

  @mixin color($theme) {
    // Get the color config from the theme.
    $color-config: mat.get-color-config($theme);

    // Get the primary color palette from the color-config.
    $primary-palette: map.get($color-config, 'primary');

    .my-carousel-button {
      // Read the 500 hue from the primary color palette.
      color: mat.get-color-from-palette($primary-palette, 500);
    }
  }

  @mixin typography($theme) {
    // Get the typography config from the theme.
    $typography-config: mat.get-typography-config($theme);

    .my-carousel {
      font-family: mat.font-family($typography-config);
    }
  }
  ```

### Step 3: Add a theme mixin

- For convenience, we can add a `theme` mixin that includes both color and typography. This theme mixin should only emit the styles for each color and typography, respectively, if they have a config specified.

  ```
  // _carousel-theme.scss

  @use 'sass:map';
  @use '@angular/material' as mat;

  @mixin color($theme) {
    // Get the color config from the theme.
    $color-config: mat.get-color-config($theme);

    // Get the primary color palette from the color-config.
    $primary-palette: map.get($color-config, 'primary');

    .my-carousel-button {
      // Read the 500 hue from the primary color palette.
      color: mat.get-color-from-palette($primary-palette, 500);
    }
  }

  @mixin typography($theme) {
    // Get the typography config from the theme.
    $typography-config: mat.get-typography-config($theme);

    .my-carousel {
      font-family: mat.font-family($typography-config);
    }
  }

  @mixin theme($theme) {
    $color-config: mat.get-color-config($theme);
    @if $color-config != null {
      @include color($theme);
    }

    $typography-config: mat.get-typography-config($theme);
    @if $typography-config != null {
      @include typography($theme);
    }
  }
  ```

### Step 4: Include the theme mixin in your application

- Now that you've defined the carousel component's theme mixin, you can include this mixin along with the other theme mixins in your application.

  ```
  @use '@angular/material' as mat;
  @use './path/to/carousel-theme' as carousel;

  @include mat.core();

  $my-primary: mat.define-palette(mat.$indigo-palette, 500);
  $my-accent: mat.define-palette(mat.$pink-palette, A200, A100, A400);

  $my-theme: mat.define-light-theme((
  color: (
    primary: $my-primary,
    accent: $my-accent,
  ),
  typography: mat.define-typography-config(
      $font-family: serif,
    );
  ));

  @include mat.all-component-themes($my-theme);
  @include carousel.theme($my-theme);
  ```
