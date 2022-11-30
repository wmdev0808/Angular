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

# Customizing Typography

## What is typography?

- Typography is a way of arranging type to make text legible, readable, and appealing when displayed. Angular Material's `theming system` supports customizing the typography settings for the library's components. Additionally, Angular Material provides APIs for applying typography styles to elements in your own application.

- Angular Material's theming APIs are built with [Sass](https://sass-lang.com/). This document assumes familiarity with CSS and Sass basics, including variables, functions, and mixins.

## Including font assets

- Angular Material's typography APIs lets you specify any font-face. The default font-face value is configured to [Google's Roboto font](https://fonts.google.com/share?selection.family=Roboto:wght@300;400;500) with the 300, 400, and 500 font-weight styles. To use Roboto, your application must load the font, which is not included with Angular Material. The easiest way to load Roboto, or any other custom font, is by using Google Fonts. The following snippet can be placed in your application's `<head>` to load Roboto from Google Fonts.

  ```
  <link rel="preconnect" href="https://fonts.gstatic.com">
  <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500&display=swap" rel="stylesheet">
  ```

- See [Getting Started with the Google Fonts API](https://developers.google.com/fonts/docs/getting_started) for more about using Google Fonts. Also note that, by default, [the Angular CLI inlines assets from Google Fonts to reduce render-blocking requests](https://angular.io/guide/workspace-config#fonts-optimization-options).

## Typography levels

- A **typography level** is a collection of typographic styles that corresponds to a specific part of an application's structure, such as a header. Each level includes styles for font family, font weight, font size, and letter spacing. Angular Material uses the [typography levels from the 2018 version of the Material Design specification](https://m2.material.io/design/typography/the-type-system.html#type-scale), outlined in the table below.

  | Name       | Description                                                          |
  | ---------- | -------------------------------------------------------------------- |
  | headline-1 | One-off header, usually at the top of the page (e.g. a hero header). |
  | headline-2 | One-off header, usually at the top of the page (e.g. a hero header). |
  | headline-3 | One-off header, usually at the top of the page (e.g. a hero header). |
  | headline-4 | One-off header, usually at the top of the page (e.g. a hero header). |
  | headline-5 | Section heading corresponding to the `<h1>` tag.                     |
  | headline-6 | Section heading corresponding to the `<h2>` tag.                     |
  | subtitle-1 | Section heading corresponding to the `<h3>` tag.                     |
  | subtitle-2 | Section heading corresponding to the `<h4>` tag.                     |
  | body-1     | Base body text.                                                      |
  | body-2     | Bolder body text.                                                    |
  | caption    | Smaller body and hint text.                                          |
  | button     | Buttons and anchors.                                                 |

### Define a level

- You can define a typography level with the `define-typography-level` Sass function. This function accepts, in order, CSS values for `font-size`, `line-height`, `font-weight`, `font-family`, and `letter-spacing`. You can also specify the parameters by name, as demonstrated in the example below.

  ```
  @use '@angular/material' as mat;

  $my-custom-level: mat.define-typography-level(
    $font-family: Roboto,
    $font-weight: 400,
    $font-size: 1rem,
    $line-height: 1,
    $letter-spacing: normal,
  );
  ```

## Typography config

- A **typography config** is a collection of all typography levels. Angular Material represents this config as a Sass map. This map contains the styles for each level, keyed by name. You can create a typography config with the `define-typography-config` Sass function. Every parameter for `define-typography-config` is optional; the styles for a level will default to Material Design's baseline if unspecified.

  ```
  @use '@angular/material' as mat;

  $my-custom-typography-config: mat.define-typography-config(
    $headline-1: mat.define-typography-level(112px, 112px, 300, $letter-spacing: -0.05em),
    $headline-2: mat.define-typography-level(56px, 56px, 400, $letter-spacing: -0.02em),
    $headline-3: mat.define-typography-level(45px, 48px, 400, $letter-spacing: -0.005em),
    $headline-4: mat.define-typography-level(34px, 40px, 400),
    $headline-5: mat.define-typography-level(24px, 32px, 400),
    // ...
  );
  ```

### Typography configs and theming

- You can provide a typography config when defining a theme to customize typographic styles.

- The following example shows a typical theme definition and a "kids theme" that only applies when the `".kids-theme"` CSS class is present. You can see the theming guide for `more guidance on defining multiple themes`.

  ```
  @use '@angular/material' as mat;

  @include mat.core();

  $my-primary: mat.define-palette(mat.$indigo-palette, 500);
  $my-accent: mat.define-palette(mat.$pink-palette, A200, A100, A400);
  $my-typography: mat.define-typography-config();

  $my-theme: mat.define-light-theme((
  color: (
    primary: $my-primary,
    accent: $my-accent,
  ),
    typography: $my-typography,
  ));

  @include mat.all-component-themes($my-theme);

  .kids-theme {
    $kids-primary: mat.define-palette(mat.$cyan-palette);
    $kids-accent: mat.define-palette(mat.$yellow-palette);

    // Typography config based on the default, but using "Comic Sans" as the
    // default font family for all levels.
    $kids-typography: mat.define-typography-config(
      $font-family: 'Comic Sans',
    );

    $kids-theme: mat.define-light-theme((
    color: (
      primary: $my-primary,
      accent: $my-accent,
    ),
    typography: $kids-typography,
    ));

    @include mat.all-component-themes($kids-theme);
  }
  ```

- Each component also has a `typography` mixin that emits only the typography styles for that component, based on a provided typography config. The following example demonstrates applying typography styles only for the button component.

  ```
  @use '@angular/material' as mat;

  $kids-typography: mat.define-typography-config(
    // Specify "Comic Sans" as the default font family for all levels.
    $font-family: 'Comic Sans',
  );

  // Now we have sweet buttons with Comic Sans.
  @include mat.button-typography($kids-typography);
  ```

## Using typography styles in your application

- In addition to styles shared between components, the `core` mixin includes CSS classes for styling your application. These CSS classes correspond to the typography levels in your typography config. This mixin also emits styles for native header elements scoped within the `.mat-typography` CSS class. The table below lists the CSS classes emitted and the native elements styled.

  | CSS class                           | Level name | Native elements |
  | ----------------------------------- | ---------- | --------------- |
  | .mat-headline-1                     | headline-1 | None            |
  | .mat-headline-2                     | headline-2 | None            |
  | .mat-headline-3                     | headline-3 | None            |
  | .mat-headline-4                     | headline-4 | None            |
  | .mat-h1 or .mat-headline-5          | headline-5 | `<h1>`          |
  | .mat-h2 or .mat-headline-6          | headline-6 | `<h2>`          |
  | .mat-h3 or .mat-subtitle-1          | subtitle-1 | `<h3>`          |
  | .mat-h4 or .mat-body-1              | body-1     | `<h4>`          |
  | .mat-h5                             | None       | `<h5>`          |
  | .mat-h6                             | None       | `<h6>`          |
  | .mat-body or .mat-body-2            | body-2     | Body text       |
  | .mat-body-strong or .mat-subtitle-2 | subtitle-2 | None            |
  | .mat-small or .mat-caption          | caption    | None            |

- In addition to the typographic styles, these style rules also include a `margin-bottom` for headers and paragraphs. For `body` styles, text is styled within the provided CSS selector.

- The `.mat-h5` and `.mat-h6` styles don't directly correspond to a specific Material Design typography level.
  The `.mat-h5` style uses the `body-2` level with the font-size scaled down by `0.83`. The `.mat-h6` style uses the `body-2` level with the font-size scaled down by `0.67`.

- The `button` and `input` typography levels do not map to CSS classes.

- You can also manually emit the CSS rules for these CSS classes and native elements by calling the `typography-hierarchy` mixin. This mixin accepts a typography config and a CSS selector under which the styles are scopes (defaulting to `.mat-typography`).

- The following example demonstrates usage of the typography styles emitted by the `core` mixin.

  ```
  <body>
    <!-- This header will *not* be styled because it is outside `.mat-typography` -->
    <h1>Top header</h1>

    <!-- This paragraph will be styled as `body-1` via the `.mat-body` CSS class applied -->
    <p class="mat-body">Introductory text</p>

    <div class="mat-typography">
      <!-- This header will be styled as `title` because it is inside `.mat-typography` -->
      <h2>Inner header</h2>

      <!-- This paragraph will be styled as `body-1` because it is inside `.mat-typography` -->
      <p>Some inner text</p>
    </div>
  </body>
  ```

### Reading typography values from a config

- You can read typography style values from a typography config via the following Sass functions. Each accepts a typography config and a level.

  | Function       | Example usage                          |
  | -------------- | -------------------------------------- |
  | font-size      | mat.font-size($config, 'body-1');      |
  | font-family    | mat.font-family($config, 'body-1');    |
  | font-weight    | mat.font-weight($config, 'body-1');    |
  | line-height    | mat.line-height($config, 'body-1');    |
  | letter-spacing | mat.letter-spacing($config, 'body-1'); |

- Additionally, you can use the `typography-level` Sass mixin to directly emit the CSS styles for a given typography level.

  ```
  @use '@angular/material' as mat;

  // Use the default configuration.
  $my-typography: mat.define-typography-config();

  .some-class-name {
    @include mat.typography-level($my-typography, 'body-1');
  }
  ```

# Customizing Angular Material component styles

- Angular Material supports customizing component styles via Sass API as described in the theming guide. This document provides guidance on defining custom CSS rules that directly style Angular Material components.

## Targeting custom styles

### Component host elements

- For any Angular Material component, you can safely define custom CSS for a component's host element that affect the positioning or layout of that component, such as `margin`, `position`, `top`, `left`, `transform`, and `z-index`. You should apply such styles by defining a custom CSS class and applying that class to the component's host element.

- Avoid defining custom styles that would affect the size or internal layout of the component, such as `padding`, `height`, `width`, or `overflow`. You can specify `display: none` to hide a component, but avoid specifying any other `display` value. Overriding these properties can break components in unexpected ways as the internal styles change between releases.

### Internal component elements

- Avoid any custom styles or overrides on internal elements within a Angular Material components. The DOM structure and CSS classes applied for each component may change at any time, causing custom styles to break.

## Applying styles to Angular Material components

- While Angular Material does not support defining custom styles or CSS overrides on components' internal elements, you might choose to do this anyway. There are three points to consider while customizing styles for Angular Material components: view encapsulation, CSS specificity, and rendering location.

### View encapsulation

- By default, Angular scopes component styles to exclusively affect that component's view. This means that the styles you author affect only the elements directly within your component template. Encapsulated styles do _not_ affect elements that are children of other components within your template. You can read more about view encapsulation in the [Angular documentation](https://angular.io/guide/component-styles#view-encapsulation). You may also wish to review [_The State of CSS in Angular_](https://blog.angular.io/the-state-of-css-in-angular-4a52d4bd2700) on the Angular blog.

#### Bypassing encapsulation

- Angular Material disables style encapsulation for all components in the library. However, the default style encapsulation in your own components still prevents custom styles from leaking into Angular Material components.

- If your component enables view encapsulation, your component styles will only affect the elements explicitly defined in your template. To affect descendants of components used in your template, you can use one of the following approaches:

  1. Define custom styles in a global stylesheet declared in the `styles` array of your `angular.json` configuration file.
  2. Disable view encapsulation for your component. This approach effectively turns your component styles into global CSS.

  3. Apply the deprecated `::ng-deep` pseudo-class to a CSS rule. Any CSS rule with `::ng-deep` becomes a global style. [See the Angular documentation](https://angular.io/guide/component-styles#deprecated-deep--and-ng-deep) for more on `::ng-deep`.

- All of these approaches involve creating global CSS that isn't affected by style encapsulation. Global CSS affects all elements in your application. Global CSS class names may collide with class names defined by components. Global CSS is often a source of hard-to-diagnose bugs and is generally difficult to maintain.

### CSS specificity

- Each CSS declaration has a level of specificity based on the type and number of selectors used. More specific styles take precedence over less specific styles. Angular Material generally attempts to use the least specific selectors possible. However, Angular Material may change component style specificity at any time, making custom overrides brittle and prone to breaking.

- You can read more about specificity and how it is calculated on the [MDN web docs](https://developer.mozilla.org/en-US/docs/Web/CSS/Specificity).

### Rendering location

- Some Angular Material components render elements that are not direct DOM descendants of the component's host element. In particular, overlay-based components such as `MatDialog`, `MatMenu`, `MatTooltip`, etc. render into an overlay container element directly on the document body. Because these components render elements outside of your application's components, component-specific styles will not apply to these elements. You can define styles for these elements as global styles.

#### Styling overlay components

- Overlay-based components have a panelClass property, or similar, that let you target the overlay pane. The following example shows how to add an `outline` style with `MatDialog`.

  ```
  // Add this to your global stylesheet after including theme mixins.
  .my-outlined-dialog {
    outline: 2px solid purple;
  }
  ```

  ```
  this.dialog.open(MyDialogComponent, {panelClass: 'my-outlined-dialog'})
  ```

- You should always apply an application-specific prefix to global CSS classes to avoid naming collisions.

# Creating a custom form field control

- It is possible to create custom form field controls that can be used inside `<mat-form-field>`. This can be useful if you need to create a component that shares a lot of common behavior with a form field, but adds some additional logic.

- For example in this guide we'll learn how to create a custom input for inputting US telephone numbers and hook it up to work with `<mat-form-field>`. Here is what we'll build by the end of this guide:

- In order to learn how to build custom form field controls, let's start with a simple input component that we want to work inside the form field. For example, a phone number input that segments the parts of the number into their own inputs. (Note: this is not intended to be a robust component, just a starting point for us to learn.)

  ```
  class MyTel {
    constructor(public area: string, public exchange: string, public subscriber: string) {}
  }

  @Component({
    selector: 'example-tel-input',
    template: `
      <div role="group" [formGroup]="parts">
        <input class="area" formControlName="area" maxlength="3">
        <span>&ndash;</span>
        <input class="exchange" formControlName="exchange" maxlength="3">
        <span>&ndash;</span>
        <input class="subscriber" formControlName="subscriber" maxlength="4">
      </div>
    `,
    styles: [`
      div {
        display: flex;
      }
      input {
        border: none;
        background: none;
        padding: 0;
        outline: none;
        font: inherit;
        text-align: center;
        color: currentColor;
      }
    `],
  })
  export class MyTelInput {
    parts: FormGroup;

    @Input()
    get value(): MyTel | null {
      let n = this.parts.value;
      if (n.area.length == 3 && n.exchange.length == 3 && n.subscriber.length == 4) {
        return new MyTel(n.area, n.exchange, n.subscriber);
      }
      return null;
    }
    set value(tel: MyTel | null) {
      tel = tel || new MyTel('', '', '');
      this.parts.setValue({area: tel.area, exchange: tel.exchange, subscriber: tel.subscriber});
    }

    constructor(fb: FormBuilder) {
      this.parts =  fb.group({
        'area': '',
        'exchange': '',
        'subscriber': '',
      });
    }
  }
  ```

## Providing our component as a MatFormFieldControl

- The first step is to provide our new component as an implementation of the `MatFormFieldControl` interface that the `<mat-form-field>` knows how to work with. To do this, we will have our class implement `MatFormFieldControl`. Since this is a generic interface, we'll need to include a type parameter indicating the type of data our control will work with, in this case `MyTel`. We then add a provider to our component so that the form field will be able to inject it as a `MatFormFieldControl`.

  ```
  @Component({
    ...
    providers: [{provide: MatFormFieldControl, useExisting: MyTelInput}],
  })
  export class MyTelInput implements MatFormFieldControl<MyTel> {
    ...
  }
  ```

- This sets up our component, so it can work with `<mat-form-field>`, but now we need to implement the various methods and properties declared by the interface we just implemented. To learn more about the `MatFormFieldControl` interface, see the [form field API documentation](https://material.angular.io/components/form-field/api).

### Implementing the methods and properties of MatFormFieldControl

- **value**

  - This property allows someone to set or get the value of our control. Its type should be the same type we used for the type parameter when we implemented `MatFormFieldControl`. Since our component already has a value property, we don't need to do anything for this one.

- **stateChanges**

  - Because the `<mat-form-field>` uses the `OnPush` change detection strategy, we need to let it know when something happens in the form field control that may require the form field to run change detection. We do this via the `stateChanges` property. So far the only thing the form field needs to know about is when the value changes. We'll need to emit on the `stateChanges` stream when that happens, and as we continue flushing out these properties we'll likely find more places we need to emit. We should also make sure to complete `stateChanges` when our component is destroyed.

    ```
    stateChanges = new Subject<void>();

    set value(tel: MyTel | null) {
      ...
      this.stateChanges.next();
    }

    ngOnDestroy() {
      this.stateChanges.complete();
    }
    ```

- **id**

  - This property should return the ID of an element in the component's template that we want the `<mat-form-field>` to associate all of its labels and hints with. In this case, we'll use the host element and just generate a unique ID for it.

    ```
    static nextId = 0;

    @HostBinding() id = `example-tel-input-${MyTelInput.nextId++}`;
    ```

- **placeholder**

  - This property allows us to tell the `<mat-form-field>` what to use as a placeholder. In this example, we'll do the same thing as `matInput` and `<mat-select>` and allow the user to specify it via an `@Input()`. Since the value of the placeholder may change over time, we need to make sure to trigger change detection in the parent form field by emitting on the `stateChanges` stream when the placeholder changes.

    ```
    @Input()
    get placeholder() {
      return this._placeholder;
    }
    set placeholder(plh) {
      this._placeholder = plh;
      this.stateChanges.next();
    }
    private _placeholder: string;
    ```

- **ngControl**

  - This property allows the form field control to specify the `@angular/forms` control that is bound to this component. Since we haven't set up our component to act as a `ControlValueAccessor`, we'll just set this to `null` in our component.

    ```
    ngControl: NgControl = null;
    ```

  - It is likely you will want to implement `ControlValueAccessor` so that your component can work with `formControl` and `ngModel`. If you do implement `ControlValueAccessor` you will need to get a reference to the `NgControl` associated with your control and make it publicly available.

  - The easy way is to add it as a public property to your constructor and let dependency injection handle it:

    ```
    constructor(
      ...,
      @Optional() @Self() public ngControl: NgControl,
      ...,
    ) { }
    ```

  - Note that if your component implements `ControlValueAccessor`, it may already be set up to provide `NG_VALUE_ACCESSOR` (in the `providers` part of the component's decorator, or possibly in a module declaration). If so, you may get a _cannot instantiate cyclic dependency_ error.

    - To resolve this, remove the `NG_VALUE_ACCESSOR` provider and instead set the value accessor directly:

      ```
      @Component({
        ...,
        providers: [
          ...,
          // Remove this.
          // {
          //   provide: NG_VALUE_ACCESSOR,
          //   useExisting: forwardRef(() => MatFormFieldControl),
          //   multi: true,
          // },
        ],
      })
      export class MyTelInput implements MatFormFieldControl<MyTel>, ControlValueAccessor {
        constructor(
          ...,
          @Optional() @Self() public ngControl: NgControl,
          ...,
        ) {

          // Replace the provider from above with this.
          if (this.ngControl != null) {
            // Setting the value accessor directly (instead of using
            // the providers) to avoid running into a circular import.
            this.ngControl.valueAccessor = this;
          }
        }
      }
      ```

    - For additional information about `ControlValueAccessor` see the [API docs](https://angular.io/api/forms/ControlValueAccessor).

- **focused**

  - This property indicates whether the form field control should be considered to be in a focused state. When it is in a focused state, the form field is displayed with a solid color underline. For the purposes of our component, we want to consider it focused if any of the part inputs are focused. We can use the `focusin` and `focusout` events to easily check this. We also need to remember to emit on the `stateChanges` when the focused stated changes stream so change detection can happen.

  - In addition to updating the focused state, we use the `focusin` and `focusout` methods to update the internal touched state of our component, which we'll use to determine the error state.

    ```
    focused = false;

    onFocusIn(event: FocusEvent) {
      if (!this.focused) {
        this.focused = true;
        this.stateChanges.next();
      }
    }

    onFocusOut(event: FocusEvent) {
      if (!this._elementRef.nativeElement.contains(event.relatedTarget as Element)) {
        this.touched = true;
        this.focused = false;
        this.onTouched();
        this.stateChanges.next();
      }
    }
    ```

- **empty**

  - This property indicates whether the form field control is empty. For our control, we'll consider it empty if all the parts are empty.

    ```
    get empty() {
      let n = this.parts.value;
      return !n.area && !n.exchange && !n.subscriber;
    }
    ```

- **shouldLabelFloat**

  - This property is used to indicate whether the label should be in the floating position. We'll use the same logic as matInput and float the placeholder when the input is focused or non-empty. Since the placeholder will be overlapping our control when it's not floating, we should hide the – characters when it's not floating.

    ```
    @HostBinding('class.floating')
    get shouldLabelFloat() {
      return this.focused || !this.empty;
    }
    ```

    ```
    span {
      opacity: 0;
      transition: opacity 200ms;
    }
    :host.floating span {
      opacity: 1;
    }
    ```

- **required**

  - This property is used to indicate whether the input is required. `<mat-form-field>` uses this information to add a required indicator to the placeholder. Again, we'll want to make sure we run change detection if the required state changes.

    ```
    @Input()
    get required() {
      return this._required;
    }
    set required(req) {
      this._required = coerceBooleanProperty(req);
      this.stateChanges.next();
    }
    private _required = false;
    ```

- **disabled**

  - This property tells the form field when it should be in the disabled state. In addition to reporting the right state to the form field, we need to set the disabled state on the individual inputs that make up our component.

    ```
    @Input()
    get disabled(): boolean { return this._disabled; }
    set disabled(value: boolean) {
      this._disabled = coerceBooleanProperty(value);
      this._disabled ? this.parts.disable() : this.parts.enable();
      this.stateChanges.next();
    }
    private _disabled = false;
    ```

- **errorState**

  - This property indicates whether the associated `NgControl` is in an error state. In this example, we show an error if the input is invalid and our component has been touched.

    ```
    get errorState(): boolean {
      return this.parts.invalid && this.touched;
    }
    ```

- **controlType**

  - This property allows us to specify a unique string for the type of control in form field. The `<mat-form-field>` will add a class based on this type that can be used to easily apply special styles to a `<mat-form-field>` that contains a specific type of control. In this example we'll use `example-tel-input` as our control type which will result in the form field adding the class `mat-form-field-type-example-tel-input`.

    ```
    controlType = 'example-tel-input';
    ```

- **setDescribedByIds(ids: string[])**

  - This method is used by the `<mat-form-field>` to set element ids that should be used for the `aria-describedby` attribute of your control. The ids are controlled through the form field as hints or errors are conditionally displayed and should be reflected in the control's `aria-describedby` attribute for an improved accessibility experience.

  - The `setDescribedByIds` method is invoked whenever the control's state changes. Custom controls need to implement this method and update the `aria-describedby` attribute based on the specified element ids. Below is an example that shows how this can be achieved.

  - Note that the method by default will not respect element ids that have been set manually on the control element through the `aria-describedby` attribute. To ensure that your control does not accidentally override existing element ids specified by consumers of your control, create an input called `userAriaDescribedby` like followed:

    ```
    @Input('aria-describedby') userAriaDescribedBy: string;
    ```

  - The form field will then pick up the user specified `aria-describedby` ids and merge them with ids for hints or errors whenever `setDescribedByIds` is invoked.

    ```
    setDescribedByIds(ids: string[]) {
      const controlElement = this._elementRef.nativeElement
        .querySelector('.example-tel-input-container')!;
      controlElement.setAttribute('aria-describedby', ids.join(' '));
    }
    ```

- **onContainerClick(event: MouseEvent)**

  - This method will be called when the form field is clicked on. It allows your component to hook in and handle that click however it wants. The method has one parameter, the `MouseEvent` for the click. In our case we'll just focus the first `<input>` if the user isn't about to click an `<input>` anyways.

    ```
    onContainerClick(event: MouseEvent) {
      if ((event.target as Element).tagName.toLowerCase() != 'input') {
        this._elementRef.nativeElement.querySelector('input').focus();
      }
    }
    ```

### Improving accessibility

- Our custom form field control consists of multiple inputs that describe segments of a phone number. For accessibility purposes, we put those inputs as part of a `div` element with `role="group"`. This ensures that screen reader users can tell that all those inputs belong together.

- One significant piece of information is missing for screen reader users though. They won't be able to tell what this input group represents. To improve this, we should add a label for the group element using either `aria-label` or `aria-labelledby`.

- It's recommended to link the group to the label that is displayed as part of the parent `<mat-form-field>`. This ensures that explicitly specified labels (using `<mat-label>`) are actually used for labelling the control.

- In our concrete example, we add an attribute binding for `aria-labelledby` and bind it to the label element id provided by the parent `<mat-form-field>`.

  ```
  export class MyTelInput implements MatFormFieldControl<MyTel> {
    ...

    constructor(...
                @Optional() public parentFormField: MatFormField) {
  ```

  ```
  @Component({
  selector: 'example-tel-input',
  template: `
    <div role="group" [formGroup]="parts"
         [attr.aria-describedby]="describedBy"
         [attr.aria-labelledby]="parentFormField?.getLabelId()">
  ```

### Trying it out

- Now that we've fully implemented the interface, we're ready to try our component out! All we need to do is place it inside a `<mat-form-field>`

  ```
  <mat-form-field>
    <example-tel-input></example-tel-input>
  </mat-form-field>
  ```

- We also get all the features that come with `<mat-form-field>` such as floating placeholder, prefix, suffix, hints, and errors (if we've given the form field an NgControl and correctly report the error state).

  ```
  <mat-form-field>
    <example-tel-input placeholder="Phone number" required></example-tel-input>
    <mat-icon matPrefix>phone</mat-icon>
    <mat-hint>Include area code</mat-hint>
  </mat-form-field>
  ```

# Applying Elevation

- [The Material Design specification](https://material.io/design/environment/elevation.html) gives guidance on expressing elevation on UI elements by adding shadows. Angular Material provides CSS classes and Sass mixins for adding these shadows.

## Elevation CSS classes

- The `core-theme` Sass mixin, described in the theming guide, emits CSS classes for applying elevation. These classes follow the pattern `mat-elevation-z#`, where `#` is the elevation number you want, from 0 to 24. These predefined classes use the CSS box-shadow settings defined by the Material Design specification.

- You can dynamically change elevation on an element by swapping elevation CSS classes.

  ```
  <div [class.mat-elevation-z2]="!isActive" [class.mat-elevation-z8]="isActive"></div>
  ```

## Elevation Sass mixins

- In addition to the predefined CSS classes, you can apply elevation styles using the `elevation` Sass mixin. This mixin accepts a `$zValue` and an optional `$color`. The `$zValue` is a number from 0 to 24, representing the semantic elevation of the element, that controls the intensity of the box-shadow. You can use the `$color` parameter to further customize the shadow appearance.

  ```
  @use '@angular/material' as mat;

  .my-class-with-default-shadow {
    // Adds a shadow for elevation level 2 with default color and full opacity:
    @include mat.elevation(2);
  }

  .my-class-with-custom-shadow {
    // Adds a shadow for elevation level 2 with color #e91e63 and 80% of the default opacity:
    @include mat.elevation(2, #e91e63, 0.8);
  }
  ```

### Overridable elevation

- When authoring a component, you may want to specify a default elevation that the component consumer can override. You can accomplish this by using the `overridable-elevation` Sass mixin. This behaves identically to the `elevation` mixin, except that the styles only apply when the element does not have a CSS class matching the pattern `mat-elevation-z#`, as described in `Elevation CSS classes` above.

### Animating elevation

- You can use the `elevation-transition` mixin to add a transition when elevation changes.

  ```
  @use '@angular/material' as mat;

  .my-class {
    @include mat.elevation-transition();
    @include mat.elevation(2);

    &:active {
      @include mat.elevation(8);
    }
  }
  ```

# Creating a custom stepper using the CDK stepper

- The [CDK stepper](https://material.angular.io/cdk/stepper/overview) allows to build a custom stepper which you can completely style yourself without any specific Material Design styling.

- In this guide, we'll learn how we can build our own custom stepper using the CDK stepper.

## Create our custom stepper component

- We need to create a new Angular component which extends `CdkStepper`:

  - custom-stepper.component.ts

    ```
    @Component({
      selector: "app-custom-stepper",
      templateUrl: "./custom-stepper.component.html",
      styleUrls: ["./custom-stepper.component.css"],
      // This custom stepper provides itself as CdkStepper so that it can be recognized
      // by other components.
      providers: [{ provide: CdkStepper, useExisting: CustomStepperComponent }]
    })
    export class CustomStepperComponent extends CdkStepper {
      onClick(index: number): void {
        this.selectedIndex = index;
      }
    }
    ```

  - After we've extended our component class from `CdkStepper` we can now access different properties from this class like `linear`, `selectedIndex` and `steps` which are defined in the [API documentation](https://material.angular.io/cdk/stepper/api#CdkStepper).

- This is the HTML template of our custom stepper component:

  - custom-stepper.component.html

    ```
    <section class="container">
      <header><h2>Step {{selectedIndex + 1}}/{{steps.length}}</h2></header>

      <div [style.display]="selected ? 'block' : 'none'">
        <!-- Content from the CdkStep is projected here -->
        <ng-container [ngTemplateOutlet]="selected.content"></ng-container>
      </div>

      <footer class="step-navigation-bar">
        <button class="nav-button" cdkStepperPrevious>&larr;</button>
        <button
          class="step"
          *ngFor="let step of steps; let i = index;"
          [ngClass]="{'active': selectedIndex === i}"
          (click)="onClick(i)"
        >
          Step {{i + 1}}
        </button>
        <button class="nav-button" cdkStepperNext>&rarr;</button>
      </footer>
    </section>
    ```

- In the `app.component.css` file we can now style the stepper however we want:

  - custom-stepper.component.css

    ```
    .example-container {
      border: 1px solid black;
      padding: 10px;
      margin: 10px;
    }

    .example-step-navigation-bar {
      display: flex;
      justify-content: flex-start;
      margin-top: 10px;
    }

    .example-active {
      color: blue;
    }

    .example-step {
      background: transparent;
      border: 0;
      margin: 0 10px;
      padding: 10px;
      color: black;
    }

    .example-step.example-active {
      color: blue;
      border-bottom: 1px solid blue;
    }

    .example-nav-button {
      background: transparent;
      border: 0;
    }
    ```

## Using our new custom stepper component

- Now we are ready to use our new custom stepper component and fill it with steps. Therefore, we can, for example, add it to our `app.component.html` and define some steps:

  - app.component.html

    ```
    <app-custom-stepper>
      <cdk-step><p>This is any content of "Step 1"</p></cdk-step>
      <cdk-step><p>This is any content of "Step 2"</p></cdk-step>
    </app-custom-stepper>
    ```

  - As you can see in this example, each step needs to be wrapped inside a `<cdk-step>` tag.

- If you want to iterate over your steps and use your own custom component you can do it, for example, this way:

  ```
  <app-custom-stepper>
    <cdk-step *ngFor="let step of mySteps; let stepIndex = index">
      <my-step-component [step]="step"></my-step-component>
    </cdk-step>
  </app-custom-stepper>
  ```

## Linear mode

- The above example allows the user to freely navigate between all steps. The `CdkStepper` additionally provides the linear mode which requires the user to complete previous steps before proceeding.

- A simple example without using forms could look this way:

  - app.component.html

    ```
    <app-custom-stepper linear>
      <cdk-step editable="false" [completed]="completed">
        <input type="text" name="a" value="Cannot proceed to next step" />
        <button (click)="completeStep()">Complete step</button>
      </cdk-step>
      <cdk-step editable="false">
        <input type="text" name="b" value="b" />
      </cdk-step>
    </app-custom-stepper>
    ```

  - app.component.ts

    ```
    export class AppComponent {
      completed = false;

      completeStep(): void {
        this.completed = true;
      }
    }
    ```

# Using Angular Material's component harnesses in your tests

- The Angular CDK provides code for creating component test harnesses. A component harness is a class that lets a test interact with a component via a supported API. Each harness's API interacts with a component the same way a user would. By using the harness API, a test insulates itself against updates to the internals of a component, such as changing its DOM structure. The idea for component harnesses comes from the [PageObject](https://martinfowler.com/bliki/PageObject.html) pattern commonly used for integration testing.

- Angular Material offers test harnesses for many of its components. The Angular team strongly encourages developers to use these harnesses for testing to avoid creating brittle tests that rely on a component's internals.

- This guide discusses the advantages of using component test harnesses and shows how to use them.

## Benefits of component test harnesses

- There are two primary benefits to using the Angular Material component harnesses in your tests:

  - 1. Harnesses make tests easier to read and understand with straightforward APIs.

  - 2. Harnesses make tests more robust and less likely to break when updating Angular Material.

## Which kinds of tests can use harnesses?

- The Angular CDK's component harnesses are designed to work in multiple different test environments. Support currently includes Angular's Testbed environment in Karma unit tests and Selenium WebDriver end-to-end (e2e) tests. You can also support additional environments by creating custom extensions of the CDK's `HarnessEnvironment` and `TestElement` classes.

## Getting started

- The foundation for all test harnesses lives in `@angular/cdk/testing`. Start by importing either `TestbedHarnessEnvironment` or `SeleniumWebDriverHarnessEnvironment` based on whether you're writing a unit test or an e2e test. From the `HarnessEnvironment`, you can get a `HarnessLoader` instance, which you will use to load Angular Material component harnesses. For example, if we're writing unit tests for a `UserProfile` component, the code might look like this:

  ```
  import {HarnessLoader} from '@angular/cdk/testing';
  import {TestbedHarnessEnvironment} from '@angular/cdk/testing/testbed';

  let loader: HarnessLoader;

  describe('my-component', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({imports: [MyModule], declarations: [UserProfile]})
          .compileComponents();
      fixture = TestBed.createComponent(UserProfile);
      loader = TestbedHarnessEnvironment.loader(fixture);
    });
  }
  ```

- This code creates a fixture for `UserProfile` and then creates a `HarnessLoader` for that fixture. The `HarnessLoader` can then locate Angular Material components inside `UserProfile` and create harnesses for them. Note that `HarnessLoader` and `TestbedHarnessEnvironment` are loaded from different paths.

  - `@angular/cdk/testing` contains symbols that are shared regardless of the environment your tests are in.

  - `@angular/cdk/testing/testbed` contains symbols that are used only in Karma tests.
  - `@angular/cdk/testing/selenium-webdriver` (not shown above) contains symbols that are used only in Selenium WebDriver tests.

## Loading an Angular Material harness

- The `HarnessLoader` provides two methods that can be used to load harnesses, `getHarness` and `getAllHarnesses`. The `getHarness` method gets a harness for the first instance of the matching component, while `getAllHarnesses` gets a list of harnesses, one for each instance of the corresponding component. For example, suppose `UserProfile` contains three `MatButton` instances. We could load harnesses for them as follows:

  ```
  import {MatButtonHarness} from '@angular/material/button/testing';

  ...

  it('should work', async () => {
    const buttons = await loader.getAllHarnesses(MatButtonHarness); // length: 3
    const firstButton = await loader.getHarness(MatButtonHarness); // === buttons[0]
  });
  ```

  - Notice the example code uses async and await syntax. All component harness APIs are asynchronous and return Promise objects. Because of this, the Angular team recommends using the [ES2017 async/await syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) with your tests.

  - The example above retrieves all button harnesses and uses an array index to get the harness for a specific button. However, if the number or order of buttons changes, this test will break. You can write a less brittle test by instead asking for only a subset of harnesses inside `UserProfile`.

- You can load harnesses for a sub-section of the DOM within `UserProfile` with the `getChildLoader` method on `HarnessLoader`. For example, say that we know `UserProfile` has a div, `<div class="footer">`, and we want the button inside that specific `<div>`. We can accomplish this with the following code:

  ```
  it('should work', async () => {
    const footerLoader = await loader.getChildLoader('.footer');
    const footerButton = await footerLoader.getHarness(MatButtonHarness);
  });
  ```

- You can also use the static `with` method implemented on all Angular Material component harnesses. This method creates a `HarnessPredicate`, an object that filters loaded harnesses based on the provided constraints. The particular constraint options vary depending on the harness class, but all harnesses support at least:

  - `selector` - CSS selector that the component must match (in addition to its host selector, such as [mat-button])

  - `ancestor` - CSS selector for a some ancestor element above the component in the DOM

  - In addition to these standard options, `MatButtonHarness` also supports

    - `text` - String text or regular expressions that matches the text content of the button

- Using this method we could locate buttons as follows in our test:

  ```
  it('should work', async () => {
    // Harness for mat-button whose id is 'more-info'.
    const info = await loader.getHarness(MatButtonHarness.with({selector: '#more-info'}));
    // Harness for mat-button whose text is 'Cancel'.
    const cancel = await loader.getHarness(MatButtonHarness.with({text: 'Cancel'}));
    // Harness for mat-button with class 'confirm' and whose text is either 'Ok' or 'Okay'.
    const okButton = await loader.getHarness(
        MatButtonHarness.with({selector: '.confirm', text: /^(Ok|Okay)$/}));
  });
  ```

## Using a harness to interact with an Angular Material component

- The Angular Material component harnesses generally expose methods to either perform actions that a real user could perform or to inspect component state that a real user might perceive. For example, `MatButtonHarness` has methods to click, focus, and blur the `mat-button`, as well as methods to get the text of the button and its disabled state. Because `MatButton` is a very simple component, these harness methods might not seem very different from working directly with the DOM. However, more complex harnesses like `MatSelectHarness` have methods like `open` and `isOpen` which capture more knowledge about the component's internals.

- A test using the `MatButtonHarness` to interact with a `mat-button` might look like the following:

  ```
  it('should mark confirmed when ok button clicked', async () => {
    const okButton = await loader.getHarness(MatButtonHarness.with({selector: '.confirm'});
    expect(fixture.componentInstance.confirmed).toBe(false);
    expect(await okButton.isDisabled()).toBe(false);
    await okButton.click();
    expect(fixture.componentInstance.confirmed).toBe(true);
  });
  ```

  - Note that the code above does not call `fixture.detectChanges()`, something you commonly see in unit tests. The CDK's component harnesses automatically invoke change detection after performing actions and before reading state. The harness also automatically waits for the fixture to be stable, which will cause the test to wait for `setTimeout`, `Promise`, etc.

## Comparison with and without component harnesses

- Consider an `<issue-report-selector>` component that you want to test. It allows a user to choose an issue type and display the necessary form create report for that issue type. You need a test to verify that when the user chooses an issue type the proper report displays. First consider what the test might look like without using component harnesses:

  ```
  describe('issue-report-selector', () => {
    let fixture: ComponentFixture<IssueReportSelector>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [IssueReportSelectorModule],
        declarations: [IssueReportSelector],
      }).compileComponents();

      fixture = TestBed.createComponent(IssueReportSelector);
      fixture.detectChanges();
    });

    it('should switch to bug report template', async () => {
      expect(fixture.debugElement.query('bug-report-form')).toBeNull();
      const selectTrigger = fixture.debugElement.query(By.css('.mat-select-trigger'));
      selectTrigger.triggerEventHandler('click', {});
      fixture.detectChanges();
      await fixture.whenStable();
      const options = document.querySelectorAll('.mat-select-panel mat-option');
      options[1].click(); // Click the second option, "Bug".
      fixture.detectChanges();
      await fixture.whenStable();
      expect(fixture.debugElement.query('bug-report-form')).not.toBeNull();
    });
  });
  ```

- The same test, using the Angular Material component harnesses might look like the following:

  ```
  describe('issue-report-selector', () => {
    let fixture: ComponentFixture<IssueReportSelector>;
    let loader: HarnessLoader;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [IssueReportSelectorModule],
        declarations: [IssueReportSelector],
      }).compileComponents();

      fixture = TestBed.createComponent(IssueReportSelector);
      fixture.detectChanges();
      loader = TestbedHarnessEnvironment.loader(fixture);
    });

    it('should switch to bug report template', async () => {
      expect(fixture.debugElement.query('bug-report-form')).toBeNull();
      const select = await loader.getHarness(MatSelectHarness);
      await select.open();
      const bugOption = await select.getOption({text: 'Bug'});
      await bugOption.click();
      expect(fixture.debugElement.query('bug-report-form')).not.toBeNull();
    });
  });
  ```

### Tests that are easier to read and understand

- The code above shows that adopting the harnesses in tests can make them easier to understand. Specifically in this example, it makes the "open the mat-select" logic more obvious. An unfamiliar reader may not know what clicking on `.mat-select-trigger `does, but `await select.open()` is self-explanatory.

- The harnesses also make clear which option should be selected. Without the harness, you need a comment that explains what `options[1]` means. With `MatSelectHarness`, however, the filter API makes the code self-documenting.

- Finally, the repeated calls to `detectChanges` and `whenStable()` can obfuscate the underlying intent of the test. By using the harness APIs, you eliminate these calls, making the test more concise.

### Tests that are more robust

- Notice that the test without harnesses directly uses CSS selectors to query elements within `<mat-select>`, such as `.mat-select-trigger`. If the internal DOM of `<mat-select>` changes, these queries may stop working. While the Angular team tries to minimize this type of change, some features and bug fixes ultimately require restructuring the DOM. By using the Angular Material harnesses, you avoid depending on internal DOM structure directly.

- In addition to DOM structure, component asynchronicity often offers a challenge when updating components. If a component changes between synchronous and asynchronous, downstream unit tests may break due to expectations around timing. Tests then require the addition or removal of some arcane combination of `whenStable`, `flushMicroTasks`, `tick`, or `detectChanges`. Component harnesses, however, avoid this problem by normalizing the asynchronicity of all component behaviors with all asynchronous APIs. When a test uses these harnesses, changes to asynchronicity become far more manageable.

- Both DOM structure and asynchronicity are _implementation details_ of Angular Material's components. When tests depend on the implementation details, they become a common source of failures due to library changes. Angular CDK's test harnesses makes component library updates easier for both application authors and the Angular team, as the Angular team only has to update the harness once for everyone.

#
