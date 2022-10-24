# Internationalization

## Overview

- _Internationalization_, sometimes referenced as i18n, is the process of designing and preparing your project for use in different locales around the world. _Localization_ is the process of building versions of your project for different locales. The localization process includes the following actions.

  - Extract text for translation into different languages
  - Format data for a specific locale

- A _locale_ identifies a region in which people speak a particular language or language variant. Possible regions includes countries and geographical regions. A locale determines the formatting and parsing of the following details.

  - Measurement units including date and time, numbers, and currencies
  - Translated names including time zones, languages, and countries

## Common internationalization tasks

### Overview

- Use the following Angular tasks to internationalize your project.

  - Use built-in pipes to display dates, numbers, percentages, and currencies in a local format.
  - Mark text in component templates for translation.
  - Mark plural forms of expressions for translation.
  - Mark alternate text for translation.

- After you prepare your project for an international audience, use the Angular CLI to localize your project. Complete the following tasks to localize your project.

  - Use the CLI to extract marked text to a source language file.
  - Make a copy of the source language file for each language, and send all of translation files to a translator or service.
  - Use the CLI to merge the finished translation files when you build your project for one or more locales.

### Add the localize package

- To take advantage of the localization features of Angular, use the `Angular CLI` to add the `@angular/localize` package to your project.

- To add the `@angular/localize package`, use the following command to update the `package.json` and `polyfills.ts` files in your project.

  ```
  ng add @angular/localize
  ```

- If `@angular/localize` is not installed and you try to build a localized version of your project, the `Angular CLI` generates an error.

### Refer to locales by ID

- Angular uses the Unicode _locale identifier_ (Unicode locale ID) to find the correct locale data for internationalization of text strings.

- UNICODE LOCALE ID

  - A locale ID conforms to the [Unicode Common Locale Data Repository (CLDR) core specification](https://cldr.unicode.org/development/core-specification). For more information about locale IDs, see [Unicode Language and Locale Identifiers](https://cldr.unicode.org/development/core-specification#h.vgyyng33o798).

  - CLDR and Angular use [BCP 47 tags](https://www.rfc-editor.org/info/bcp47) as the base for the locale ID

- A locale ID specifies the language, country, and an optional code for further variants or subdivisions. A locale ID consists of the language identifier, a hyphen (-) character, and the locale extension.

  ```
  {language_id}-{locale_extension}
  ```

  - To accurately translate your Angular project, you must decide which languages and locales you are targeting for internationalization.

  - Many countries share the same language, but differ in usage. The differences include grammar, punctuation, formats for currency, decimal numbers, dates, and so on.

- For the examples in this guide, use the following languages and locales.

  | LANGUAGE | LOCALE                   | UNICODE LOCALE ID |
  | -------- | ------------------------ | ----------------- |
  | English  | Canada                   | en-CA             |
  | English  | United States of America | en-US             |
  | French   | Canada                   | fr-CA             |
  | French   | France                   | fr-FR             |

  - For a list of language codes, see [ISO 639-2](https://www.loc.gov/standards/iso639-2).

### Set the source locale ID

- Use the Angular CLI to set the source language in which you are writing the component template and code.

- By default, Angular uses `en-US` as the source locale of your project.

- To change the source locale of your project for the build, complete the following actions.

  - Open the `angular.json` workspace build configuration file.
  - Change the source locale in the `sourceLocale` field.

### Format data based on locale

- Angular provides the following built-in data transformation pipes. The data transformation pipes use the `LOCALE_ID` token to format data based on rules of each locale.

  | DATA TRANSFORMATION PIPE | DETAILS                                           |
  | ------------------------ | ------------------------------------------------- |
  | DatePipe                 | Formats a date value.                             |
  | CurrencyPipe             | Transforms a number into a currency string.       |
  | DecimalPipe              | Transforms a number into a decimal number string. |
  | PercentPipe              | Transforms a number into a percentage string.     |

#### Use DatePipe to display the current date

- To display the current date in the format for the current locale, use the following format for the `DatePipe`.

  ```
  {{ today | date }}
  ```

#### Override current locale for CurrencyPipe

- Add the `locale` parameter to the pipe to override the current value of `LOCALE_ID` token.

- To force the currency to use American English (`en-US`), use the following format for the `CurrencyPipe`

  ```
  {{ amount | currency : 'en-US' }}
  ```

- NOTE:
  - The locale specified for the `CurrencyPipe` overrides the global `LOCALE_ID` token of your application.

### Prepare component for translation

- To prepare your project for translation, complete the following actions.

  - Use the `i18n` attribute to mark text in component templates
  - Use the `i18n-` attribute to mark attribute text strings in component templates
  - Use the `$localize` tagged message string to mark text strings in component code

#### Mark text in component template

- In a component template, the i18n metadata is the value of the `i18n` attribute.

  ```
  <element i18n="{i18n_metadata}">{string_to_translate}</element>
  ```

- Use the `i18n` attribute to mark a static text message in your component templates for translation. Place it on every element tag that contains fixed text you want to translate.

  - The `i18n` attribute is a custom attribute that the Angular tools and compilers recognize.

##### i18n example

- The following `<h1>` tag displays a simple English language greeting, "Hello i18n!".

  - src/app/app.component.html
    ```
    <h1>Hello i18n!</h1>
    ```

- To mark the greeting for translation, add the `i18n` attribute to the `<h1>` tag.

  - src/app/app.component.html
    ```
    <h1 i18n>Hello i18n!</h1>
    ```

##### Translate inline text without HTML element

- Use the `<ng-container>` element to associate a translation behavior for specific text without changing the way text is displayed.

  - Each HTML element creates a new DOM element. To avoid creating a new DOM element, wrap the text in an `<ng-container>` element. The following example shows the `<ng-container>` element transformed into a non-displayed HTML comment.

    ```
    <ng-container i18n>I don't output any element</ng-container>
    ```

#### Mark element attributes for translations

- In a component template, the i18n metadata is the value of the `i18n-{attribute_name}` attribute.

  ```
  <element i18n-{attribute_name}="{i18n_metadata}" {attribute_name}="{attribute_value}" />
  ```

- The attributes of HTML elements include text that should be translated along with the rest of the displayed text in the component template.

- Use `i18n-{attribute_name}` with any attribute of any element and replace `{attribute_name}` with the name of the attribute. Use the following syntax to assign a meaning, description, and custom ID.

  ```
  i18n-{attribute_name}="{meaning}|{description}@@{id}"
  ```

##### i18n-title example

- To translate the title of an image, review this example. The following example displays an image with a `title` attribute.

  - src/app/app.component.html
    ```
    <img [src]="logo" title="Angular logo" alt="Angular logo">
    ```

- To mark the title attribute for translation, complete the following action.

  - 1. Add the `i18n-title` attribute

    - The following example displays how to mark the `title` attribute on the `img` tag by adding `i18n-title`.

      - src/app/app.component.html
        ```
        <img [src]="logo" i18n-title title="Angular logo" alt="Angular logo"/>
        ```

#### Mark text in component code

- In component code, the translation source text and the metadata are surrounded by backtick (`) characters.

- Use the `$localize` tagged message string to mark a string in your code for translation.

  ```
  $localize `string_to_translate`;
  ```

- The i18n metadata is surrounded by colon (:) characters and prepends the translation source text.

  ```
  $localize `:{i18n_metadata}:string_to_translate`
  ```

##### Include interpolated text

- Include `interpolations` in a `$localize` tagged message string.

  ```
  $localize `string_to_translate ${variable_name}`;
  ```

##### Name the interpolation placeholder

```
$localize `string_to_translate ${variable_name}:placeholder_name:`;
```

#### i18n metadata for translation

```
{meaning}|{description}@@{custom_id}
```

- The following parameters provide context and additional information to reduce confusion for your translator.

  | METADATA PARAMETER | DETAILS                                                               |
  | ------------------ | --------------------------------------------------------------------- |
  | Custom ID          | Provide a custom identifier                                           |
  | Description        | Provide additional information or context                             |
  | Meaning            | Provide the meaning or intent of the text within the specific context |

##### Add helpful descriptions and meanings

- To translate a text message accurately, provide additional information or context for the translator.

  - Add a _description_ of the text message as the value of the `i18n` attribute or `$localize` tagged message string.

  - The following example shows the value of the `i18n` attribute.
    - src/app/app.component.html
      ```
      <h1 i18n="An introduction header for this sample">Hello i18n!</h1>
      ```
  - The following example shows the value of the `$localize` tagged message string with a description.

    ```
    $localize `:An introduction header for this sample:Hello i18n!`;
    ```

  - The translator may also need to know the meaning or intent of the text message within this particular application context, in order to translate it the same way as other text with the same meaning. Start the `i18n` attribute value with the meaning and separate it from the description with the `|` character: `{meaning}|{description}`.

- h1 example

  - For example, you may want to specify that the `<h1>` tag is a site header that you need translated the same way, whether it is used as a header or referenced in another section of text.

  - The following example shows how to specify that the `<h1> `tag must be translated as a header or referenced elsewhere.

    - src/app/app.component.html
      ```
      <h1 i18n="site header|An introduction header for this sample">Hello i18n!</h1>
      ```
    - The result is any text marked with `site header`, as the meaning is translated exactly the same way.

  - The following code example shows the value of the `$localize` tagged message string with a meaning and a description.
    ```
    $localize `:site header|An introduction header for this sample:Hello i18n!`;
    ```

- HOW MEANINGS CONTROL TEXT EXTRACTION AND MERGES

  - The Angular extraction tool generates a translation unit entry for each `i18n` attribute in a template. The Angular extraction tool assigns each translation unit a unique ID based on the meaning and description.

  - The same text elements with different meanings are extracted with different IDs. For example, if the word "right" uses the following two definitions in two different locations, the word is translated differently and merged back into the application as different translation entries.

    - `correct` as in "you are right"
    - `direction` as in "turn right"

  - If the same text elements meet the following conditions, the text elements are extracted only once and use the same ID.

    - Same meaning or definition
    - Different descriptions

  - That one translation entry is merged back into the application wherever the same text elements appear.

#### ICU expressions

- ICU expressions help you mark alternate text in component templates to meet conditions. An ICU expression includes a component property, an ICU clause, and the case statements surrounded by open curly brace (`{`) and close curly brace (`}`) characters.

  ```
  { component_property, icu_clause, case_statements }
  ```

- The component property defines the variable An ICU clause defines the type of conditional text.

  | ICU CLAUSE | DETAILS                                                             |
  | ---------- | ------------------------------------------------------------------- |
  | plural     | Mark the use of plural numbers                                      |
  | select     | Mark choices for alternate text based on your defined string values |

- To simplify translation, use International Components for Unicode clauses (ICU clauses) with regular expressions.

##### Mark plurals

- Different languages have different pluralization rules that increase the difficulty of translation. Because other locales express cardinality differently, you may need to set pluralization categories that do not align with English. Use the plural clause to mark expressions that may not be meaningful if translated word-for-word.

  ```
  { component_property, plural, pluralization_categories }
  ```

- After the pluralization category, enter the default text (English) surrounded by open curly brace (`{`) and close curly brace (`}`) characters.

  ```
  pluralization_category { }
  ```

- The following pluralization categories are available for English and may change based on the locale.

  | PLURALIZATION CATEGORY | DETAILS                    | EXAMPLE              |
  | ---------------------- | -------------------------- | -------------------- |
  | zero                   | Quantity is zero           | =0 { }<br />zero { } |
  | one                    | Quantity is 1              | =1 { }<br /> one { } |
  | two                    | Quantity is 2              | =2 { }<br /> two { } |
  | few                    | Quantity is 2 or more      | few { }              |
  | many                   | Quantity is a large number | many { }             |
  | other                  | The default quantity       | other { }            |

- If none of the pluralization categories match, Angular uses `other` to match the standard fallback for a missing category.

  ```
  other { default_quantity }
  ```

- BACKGROUND: LOCALES MAY NOT SUPPORT SOME PLURALIZATION CATEGORIES

  - Many locales don't support some of the pluralization categories. The default locale (`en-US`) uses a very simple `plural()` function that doesn't support the `few` pluralization category. Another locale with a simple `plural()` function is `es`. The following code example shows the `en-US plural()` function.

    ```
    function plural(n: number): number {
      let i = Math.floor(Math.abs(n)), v = n.toString().replace(/^[^.]*\.?/, '').length;
      if (i === 1 && v === 0) return 1;
      return 5;
    }
    ```

  - The `plural()` function only returns 1 (`one`) or 5 (`other`). The `few` category never matches.

- minutes example

  - If you want to display the following phrase in English, where `x` is a number.

    ```
    updated x minutes ago
    ```

  - And you also want to display the following phrases based on the cardinality of `x`.

    ```
    updated just now
    ```

    ```
    updated one minute ago
    ```

  - Use HTML markup and `interpolations`. The following code example shows how to use the `plural` clause to express the previous three situations in a `<span>` element.

    - src/app/app.component.html

      ```
      <span i18n>Updated {minutes, plural, =0 {just now} =1 {one minute ago} other {{{minutes}} minutes ago}}</span>
      ```

    - Review the following details in the previous code example.
      |PARAMETERS| DETAILS|
      |----------|---------|
      |`minutes`| The first parameter specifies the component property is `minutes` and determines the number of minutes.|
      |`plural`| The second parameter specifies the ICU clause is `plural`.|
      |`=0 {just now}`| For zero minutes, the pluralization category is `=0`. The value is `just now`.|
      |`=1 {one minute}`| For one minute, the pluralization category is `=1`. The value is `one minute`.|
      |`other {{{minutes}} minutes ago}`| For any unmatched cardinality, the default pluralization category is `other`. The value is `{{minutes}} minutes ago`.

      - `{{minutes}}` is an interpolation.

##### Mark alternates and nested expressions

- The `select` clause marks choices for alternate text based on your defined string values.

  ```
  { component_property, select, selection_categories }
  ```

- Translate all of the alternates to display alternate text based on the value of a variable.

- After the selection category, enter the text (English) surrounded by open curly brace (`{`) and close curly brace (`}`) characters.

  ```
  selection_category { text }
  ```

- Different locales have different grammatical constructions that increase the difficulty of translation. Use HTML markup. If none of the selection categories match, Angular uses `other` to match the standard fallback for a missing category.

  ```
  other { default_value }
  ```

- gender example

  - If you want to display the following phrase in English.
    ```
    The author is other
    ```
  - And you also want to display the following phrases based on the `gender` property of the component.

    ```
    The author is female
    ```

    ```
    The author is male
    ```

  - The following code example shows how to bind the `gender` property of the component and use the `select` clause to express the previous three situations in a `<span>` element.

    - The `gender` property binds the outputs to each of following string values.
      |VALUE| ENGLISH VALUE|
      |-----|--------------|
      |female| female|
      |male| male|
      |other| other|

    - The `select` clause maps the values to the appropriate translations. The following code example shows `gender` property used with the `select` clause.
      - src/app/app.component.html
        ```
        <span i18n>The author is {gender, select, male {male} female {female} other {other}}</span>
        ```

- gender and minutes example
  - Combine different clauses together, such as the `plural` and `select` clauses. The following code example shows nested clauses based on the `gender` and `minutes` examples.
    - src/app/app.component.html
      ```
      <span i18n>Updated: {minutes, plural,
        =0 {just now}
        =1 {one minute ago}
        other {{{minutes}} minutes ago by {gender, select, male {male} female {female} other {other}}}}
      </span>
      ```

### Work with translation files

- After you prepare a component for translation, use the `extract-i18n` Angular CLI command to extract the marked text in the component into a _source language_ file.

- The marked text includes text marked with `i18n`, attributes marked with `i18n-attribute`, and text tagged with `$localize` as described in `Prepare templates for translations`.

- Complete the following steps to create and update translation files for your project.

  - 1. Extract the source language file.
    - a. Optionally, change the location, format, and name.
  - 2. Copy the source language file to create a translation file for each language.
  - 3. Translate each translation file.
  - 4. Translate plurals and alternate expressions separately.
    - Translate plurals.
    - Translate alternate expressions.
    - Translate nested expressions.

#### Extract the source language file

- To extract the source language file, complete the following actions.

  1. Open a terminal window.

  2. Change to the root directory of your project.

  3. Run the following CLI command.

  ```
  ng extract-i18n
  ```

  - The `extract-i18n` command creates a source language file named `messages.xlf` in the root directory of your project. For more information about the XML Localization Interchange File Format (XLIFF, version 1.2), see [XLIFF](https://en.wikipedia.org/wiki/XLIFF).

  - Use the following `extract-i18n` command options to change the source language file location, format, and file name.

    | COMMAND OPTION | DETAILS                              |
    | -------------- | ------------------------------------ |
    | --format       | Set the format of the output file    |
    | --out-file     | Set the name of the output file      |
    | --output-path  | Set the path of the output directory |

##### Change the source language file location

- To create a file in the `src/locale` directory, specify the output path as an option.
  - extract-i18n --output-path example
    ```
    ng extract-i18n --output-path src/locale
    ```

##### Change the source language file format

- The extract-i18n command creates files in the following translation formats.
  |TRANSLATION FORMAT| DETAILS| FILE EXTENSION|
  |------------------|---------|----------------|
  |ARB| Application Resource Bundle| .arb|
  |JSON| JavaScript Object Notation| .json|
  |XLIFF 1.2| XML Localization Interchange File Format, version 1.2| .xlf|
  |XLIFF 2| XML Localization Interchange File Format, version 2| .xlf|
  |XMB| XML Message Bundle| .xmb (.xtb)|

- pecify the translation format explicitly with the `--format` command option.

  - The XMB format generates `.xmb` source language files, but uses `.xtb` translation files.

- extract-i18n --format example
  ```
  ng extract-i18n --format=xlf
  ng extract-i18n --format=xlf2
  ng extract-i18n --format=xmb
  ng extract-i18n --format=json
  ng extract-i18n --format=arb
  ```

##### Change the source language file name

- To change the name of the source language file generated by the extraction tool, use the `--out-file` command option.
  ```
  ng extract-i18n --out-file source.xlf
  ```

#### Create a translation file for each language

- To create a translation file for a locale or language, complete the following actions.

  - 1. Extract the source language file.

  - 2. Make a copy of the source language file to create a _translation_ file for each language.

  - 3. Rename the _translation_ file to add the locale.
    ```
    messages.xlf --> message.{locale}.xlf
    ```
  - 4. Create a new directory at your project root named `locale`.
    ```
    src/locale
    ```
  - 5. Move the _translation_ file to the new directory.

  - 6. Send the _translation_ file to your translator.
  - 7. Repeat the above steps for each language you want to add to your application.

- extract-i18n example for French

  - For example, to create a French translation file, complete the following actions.

    1. Run the `extract-i18n` command.
    2. Make a copy of the `messages.xlf` source language file.
    3. Rename the copy to `messages.fr.xlf` for the French language (`fr`) translation.
    4. Move the `fr` translation file to the `src/locale` directory.
    5. Send the `fr` translation file to the translator.

#### Translate each translation file

- Unless you are fluent in the language and have the time to edit translations, you will likely complete the following steps.

  - 1. Send each translation file to a translator.
  - 2. The translator uses an XLIFF file editor complete the following actions.
    - a. Create the translation.
    - b. Edit the translation.

##### Translation process example for French

- To demonstrate the process, review the messages.fr.xlf file in the Example Angular Internationalization application. The Example Angular Internationalization application includes a French translation for you to edit without a special XLIFF editor or knowledge of French.

- The following actions describe the translation process for French.

  - 1. Open `messages.fr.xlf` and find the first `<trans-unit>` element. This is a _translation unit_, also known as a _text node_, that represents the translation of the `<h1>` greeting tag that was previously marked with the `i18n` attribute.

    - src/locale/messages.fr.xlf (`<trans-unit>`)
      ```
      <trans-unit id="introductionHeader" datatype="html">
        <source>Hello i18n!</source>
        <note priority="1" from="description">An introduction header for this sample</note>
        <note priority="1" from="meaning">User welcome</note>
      </trans-unit>
      ```
      - The `id="introductionHeader"` is a `custom ID`, but without the `@@` prefix required in the source HTML.

  - 2. Duplicate the `<source>... </source>` element in the text node, rename it to `target`, and then replace the content with the French text.

    - src/locale/messages.fr.xlf (`<trans-unit>`, after translation)
      ```
      <trans-unit id="introductionHeader" datatype="html">
        <source>Hello i18n!</source>
        <target>Bonjour i18n !</target>
        <note priority="1" from="description">An introduction header for this sample</note>
        <note priority="1" from="meaning">User welcome</note>
      </trans-unit>
      ```
      - In a more complex translation, the information and context in the `description and meaning elements` help you choose the right words for translation.

  - 3. Translate the other text nodes. The following example displays the way to translate.
    - src/locale/messages.fr.xlf (`<trans-unit>`)
      ```
      <trans-unit id="ba0cc104d3d69bf669f97b8d96a4c5d8d9559aa3" datatype="html">
        <source>I don&apos;t output any element</source>
        <target>Je n'affiche aucun élément</target>
      </trans-unit>
      <trans-unit id="701174153757adf13e7c24a248c8a873ac9f5193" datatype="html">
        <source>Angular logo</source>
        <target>Logo d'Angular</target>
      </trans-unit>
      ```
      - Don't change the IDs for translation units. Each `id` attribute is generated by Angular and depends on the content of the component text and the assigned meaning. If you change either the text or the meaning, then the `id` attribute changes. For more about managing text updates and IDs, see [custom IDs](https://angular.io/guide/i18n-optional-manage-marked-text).

#### Translate plurals

- Add or remove plural cases as needed for each language.

##### minute plural example

- To translate a `plural`, translate the ICU format match values.

  - `just now`
  - `one minute ago`
  - `<x id="INTERPOLATION" equiv-text="{{minutes}}"/> minutes ago`

- The following example displays the way to translate.
  - src/locale/messages.fr.xlf (`<trans-unit>`)
    ```
    <trans-unit id="5a134dee893586d02bffc9611056b9cadf9abfad" datatype="html">
      <source>{VAR_PLURAL, plural, =0 {just now} =1 {one minute ago} other {<x id="INTERPOLATION" equiv-text="{{minutes}}"/> minutes ago} }</source>
      <target>{VAR_PLURAL, plural, =0 {à l'instant} =1 {il y a une minute} other {il y a <x id="INTERPOLATION" equiv-text="{{minutes}}"/> minutes} }</target>
    </trans-unit>
    ```

#### Translate alternate expressions

- Angular also extracts alternate `select` ICU expressions as separate translation units.

##### gender select example

- The following example displays a `select` ICU expression in the component template.
  - src/app/app.component.html
    ```
    <span i18n>The author is {gender, select, male {male} female {female} other {other}}</span>
    ```
- In this example, Angular extracts the expression into two translation units. The first contains the text outside of the `select` clause, and uses a placeholder for `select` (`<x id="ICU">`):

  - src/locale/messages.fr.xlf (`<trans-unit>`)
    ```
    <trans-unit id="f99f34ac9bd4606345071bd813858dec29f3b7d1" datatype="html">
      <source>The author is <x id="ICU" equiv-text="{gender, select, male {...} female {...} other {...}}"/></source>
      <target>L'auteur est <x id="ICU" equiv-text="{gender, select, male {...} female {...} other {...}}"/></target>
    </trans-unit>
    ```
  - When you translate the text, move the placeholder if necessary, but don't remove it. If you remove the placeholder, the ICU expression is removed from your translated application.

- The following example displays the second translation unit that contains the `select` clause.

  - src/locale/messages.fr.xlf (`<trans-unit>`)
    ```
    <trans-unit id="eff74b75ab7364b6fa888f1cbfae901aaaf02295" datatype="html">
      <source>{VAR_SELECT, select, male {male} female {female} other {other} }</source>
      <target>{VAR_SELECT, select, male {un homme} female {une femme} other {autre} }</target>
    </trans-unit>
    ```

- The following example displays both translation units after translation is complete.
  - src/locale/messages.fr.xlf (`<trans-unit>`)
    ```
    <trans-unit id="f99f34ac9bd4606345071bd813858dec29f3b7d1" datatype="html">
      <source>The author is <x id="ICU" equiv-text="{gender, select, male {...} female {...} other {...}}"/></source>
      <target>L'auteur est <x id="ICU" equiv-text="{gender, select, male {...} female {...} other {...}}"/></target>
    </trans-unit>
    <trans-unit id="eff74b75ab7364b6fa888f1cbfae901aaaf02295" datatype="html">
      <source>{VAR_SELECT, select, male {male} female {female} other {other} }</source>
      <target>{VAR_SELECT, select, male {un homme} female {une femme} other {autre} }</target>
    </trans-unit>
    ```

#### Translate nested expressions

- Angular treats a nested expression in the same manner as an alternate expression. Angular extracts the expression into two translation units.

##### Nested plural example

- The following example displays the first translation unit that contains the text outside of the nested expression.

  - src/locale/messages.fr.xlf (`<trans-unit>`)
    ```
    <trans-unit id="972cb0cf3e442f7b1c00d7dab168ac08d6bdf20c" datatype="html">
      <source>Updated: <x id="ICU" equiv-text="{minutes, plural, =0 {...} =1 {...} other {...}}"/></source>
      <target>Mis à jour: <x id="ICU" equiv-text="{minutes, plural, =0 {...} =1 {...} other {...}}"/></target>
    </trans-unit>
    ```

- The following example displays the second translation unit that contains the complete nested expression.
  - src/locale/messages.fr.xlf (`<trans-unit>`)
    ```
    <trans-unit id="7151c2e67748b726f0864fc443861d45df21d706" datatype="html">
      <source>{VAR_PLURAL, plural, =0 {just now} =1 {one minute ago} other {<x id="INTERPOLATION" equiv-text="{{minutes}}"/> minutes ago by {VAR_SELECT, select, male {male} female {female} other {other} }} }</source>
      <target>{VAR_PLURAL, plural, =0 {à l'instant} =1 {il y a une minute} other {il y a <x id="INTERPOLATION" equiv-text="{{minutes}}"/> minutes par {VAR_SELECT, select, male {un homme} female {une femme} other {autre} }} }</target>
    </trans-unit>
    ```
- The following example displays both translation units after translating.
  - src/locale/messages.fr.xlf (`<trans-unit>`)
    ```
    <trans-unit id="972cb0cf3e442f7b1c00d7dab168ac08d6bdf20c" datatype="html">
      <source>Updated: <x id="ICU" equiv-text="{minutes, plural, =0 {...} =1 {...} other {...}}"/></source>
      <target>Mis à jour: <x id="ICU" equiv-text="{minutes, plural, =0 {...} =1 {...} other {...}}"/></target>
    </trans-unit>
    <trans-unit id="7151c2e67748b726f0864fc443861d45df21d706" datatype="html">
      <source>{VAR_PLURAL, plural, =0 {just now} =1 {one minute ago} other {<x id="INTERPOLATION" equiv-text="{{minutes}}"/> minutes ago by {VAR_SELECT, select, male {male} female {female} other {other} }} }</source>
      <target>{VAR_PLURAL, plural, =0 {à l'instant} =1 {il y a une minute} other {il y a <x id="INTERPOLATION" equiv-text="{{minutes}}"/> minutes par {VAR_SELECT, select, male {un homme} female {une femme} other {autre} }} }</target>
    </trans-unit>
    ```

### Merge translations into the app

- To merge the completed translations into your project, complete the following actions

  1. Use the `Angular CLI` to build a copy of the distributable files of your project
  2. Use the `"localize"` option to replace all of the i18n messages with the valid translations and build a localized variant application. A variant application is a complete a copy of the distributable files of your application translated for a single locale.

- After you merge the translations, serve each distributable copy of the application using server-side language detection or different subdirectories.

  - For more information about how to serve each distributable copy of the application, see `deploying multiple locales`.

- For a compile-time translation of the application, the build process uses `ahead-of-time (AOT) compilation` to produce a small, fast, ready-to-run application.

- To build a separate distributable copy of the application for each locale, `define the locales in the build configuration` in the `angular.json` workspace build configuration file of your project.

  - This method shortens the build process by removing the requirement to perform a full application build for each locale.

- To `generate application variants for each locale`, use the `"localize"` option in the `angular.json` workspace build configuration file. Also, to `build from the command line`, use the `build Angular CLI` command with the `--localize` option.
  - Optionally, `apply specific build options for just one locale` for a custom locale configuration.

#### Define locales in the build configuration

- Use the `i18n` project option in the `angular.json` workspace build configuration file of your project to define locales for a project.

- The following sub-options identify the source language and tell the compiler where to find supported translations for the project.

  | SUBOPTION    | DETAILS                                                                  |
  | ------------ | ------------------------------------------------------------------------ |
  | sourceLocale | The locale you use within the application source code (en-US by default) |
  | locales      | A map of locale identifiers to translation files                         |

##### angular.json for en-US and fr example

- For example, the following excerpt of an `angular.json` workspace build configuration file sets the source locale to `en-US` and provides the path to the French (`fr`) locale translation file.
  - anglar.json
    ```
    "projects": {
        "angular.io-example": {
          // ...
          "i18n": {
            "sourceLocale": "en-US",
            "locales": {
              "fr": {
                "translation": "src/locale/messages.fr.xlf",
                // ...
              }
            }
          },
          "architect": {
            // ...
          }
        }
      }
    }
    ```

#### Generate application variants for each locale

- To use your locale definition in the build configuration, use the `"localize"` option in the `angular.json` workspace build configuration file to tell the CLI which locales to generate for the build configuration.

  - Set `"localize`" to `true` for all the locales previously defined in the build configuration.
  - Set `"localize"` to an array of a subset of the previously defined locale identifiers to build only those locale versions.
  - Set `"localize"` to `false` to disable localization and not generate any locale-specific versions.

- NOTE:

  - `Ahead-of-time (AOT) compilation` is required to localize component templates.
  - If you changed this setting, set `"aot"` to `true` in order to use AOT.

- Due to the deployment complexities of i18n and the need to minimize rebuild time, the development server only supports localizing a single locale at a time. If you set the "localize" option to true, define more than one locale, and use ng serve; then an error occurs. If you want to develop against a specific locale, set the `"localize"` option to a specific locale. For example, for French (`fr`), specify `"localize": ["fr"]`.

- The CLI loads and registers the locale data, places each generated version in a locale-specific directory to keep it separate from other locale versions, and puts the directories within the configured outputPath for the project. For each application variant the lang attribute of the html element is set to the locale. The CLI also adjusts the HTML base HREF for each version of the application by adding the locale to the configured baseHref.

- Set the "localize" property as a shared configuration to effectively inherit for all the configurations. Also, set the property to override other configurations.

##### angular.json include all locales from build example

- The following example displays the "localize" option set to true in the angular.json workspace build configuration file, so that all locales defined in the build configuration are built.
  - angular.json
    ```
    "build": {
      "builder": "@angular-devkit/build-angular:browser",
      "options": {
        "localize": true,
        // ...
      },
    ```

#### Build from the command line

- Also, use the `--localize` option with the `ng build` command and your existing production configuration. The CLI builds all locales defined in the build configuration. If you set the locales in build configuration, it is similar to when you set the `"localize"` option to `true`.

  ```
  ng build --localize
  ```

#### Apply specific build options for just one locale

- To apply specific build options to only one locale, specify a single locale to create a custom locale-specific configuration.
  - Use the Angular CLI development server (ng serve) with only a single locale.

##### build for French example

- The following example displays a custom locale-specific configuration using a single locale.

  - angular.json
    ```
    "build": {
        // ...
        "configurations": {
          // ...
          "fr": {
            "localize": ["fr"]
          }
        },
        // ...
      },
      "serve": {
        "builder": "@angular-devkit/build-angular:dev-server",
        "configurations": {
          // ...
          "fr": {
            "browserTarget": "angular.io-example:build:development,fr"
          }
        },
        // ...
      },
      // ...
    }
    ```

- Pass this configuration to the `ng serve` or `ng build` commands. The following code example displays how to serve the French language file.

  ```
  ng serve --configuration=fr
  ```

- For production builds, use configuration composition to run both configurations.

  ```
  ng build --configuration=production,fr
  ```

  - angular.json
    ```
    "architect": {
      "build": {
        "builder": "@angular-devkit/build-angular:browser",
        "options": {
          // ...
        },
        "configurations": {
          // ...
          "fr": {
            "localize": ["fr"]
          }
        },
        // ...
      },
      "serve": {
        "builder": "@angular-devkit/build-angular:dev-server",
        "configurations": {
          "production": {
            "browserTarget": "angular.io-example:build:production"
          },
          // ...
          "fr": {
            "browserTarget": "angular.io-example:build:development,fr"
          }
        },
        // ...
      },
      // ...
    }
    ```

#### Report missing translations

- When a translation is missing, the build succeeds but generates a warning such as Missing translation for message "{translation_text}". To configure the level of warning that is generated by the Angular compiler, specify one of the following levels.

  | WARNING LEVEL | DETAILS                                              | OUTPUT                                               |
  | ------------- | ---------------------------------------------------- | ---------------------------------------------------- |
  | error         | Throw an error and the build fails                   | n/a                                                  |
  | ignore        | Do nothing                                           | n/a                                                  |
  | warning       | Displays the default warning in the console or shell | Missing translation for message "{translation_text}" |

- Specify the warning level in the `options` section for the build target of your `angular.json` workspace build configuration file.

##### angular.json error warning example

- The following example displays how to set the warning level to error.

  - angular.json
    ```
    "build": {
      "builder": "@angular-devkit/build-angular:browser",
      "options": {
        // ...
        "i18nMissingTranslation": "error"
      },
    ```

- Note:

  - When you compile your Angular project into an Angular application, the instances of the i18n attribute are replaced with instances of the $localize tagged message string. This means that your Angular application is translated after compilation. This also means that you can create localized versions of your Angular application without re-compiling your entire Angular project for each locale.

  - When you translate your Angular application, the translation transformation replaces and reorders the parts (static strings and expressions) of the template literal string with strings from a collection of translations. For more information, see $localize.

  - tldr;
    - Compile once, then translate for each locale.

### Deploy multiple locales

- If myapp is the directory that contains the distributable files of your project, you typically make different versions available for different locales in locale directories. For example, your French version is located in the myapp/fr directory and the Spanish version is located in the myapp/es directory.

- The HTML base tag with the href attribute specifies the base URI, or URL, for relative links. If you set the "localize" option in angular.json workspace build configuration file to true or to an array of locale IDs, the CLI adjusts the base href for each version of the application. To adjust the base href for each version of the application, the CLI adds the locale to the configured "baseHref". Specify the "baseHref" for each locale in your angular.json workspace build configuration file. The following example displays "baseHref" set to an empty string.

- angular.json

  ```
  "projects": {
      "angular.io-example": {
        // ...
        "i18n": {
          "sourceLocale": "en-US",
          "locales": {
            "fr": {
              "translation": "src/locale/messages.fr.xlf",
              "baseHref": ""
            }
          }
        },
        "architect": {
          // ...
        }
      }
    }
    // ...
  }
  ```

- Also, to declare the base href at compile time, use the CLI `--baseHref` option with ng build.

#### Configure a server

- Typical deployment of multiple languages serve each language from a different subdirectory. Users are redirected to the preferred language defined in the browser using the Accept-Language HTTP header. If the user has not defined a preferred language, or if the preferred language is not available, then the server falls back to the default language. To change the language, change your current location to another subdirectory. The change of subdirectory often occurs using a menu implemented in the application.

##### Nginx example

- The following example displays an Nginx configuration.

  ```
  http {
      # Browser preferred language detection (does NOT require
      # AcceptLanguageModule)
      map $http_accept_language $accept_language {
          ~*^de de;
          ~*^fr fr;
          ~*^en en;
      }
      # ...
  }

  server {
      listen 80;
      server_name localhost;
      root /www/data;

      # Fallback to default language if no preference defined by browser
      if ($accept_language ~ "^$") {
          set $accept_language "fr";
      }

      # Redirect "/" to Angular application in the preferred language of the browser
      rewrite ^/$ /$accept_language permanent;

      # Everything under the Angular application is always redirected to Angular in the
      # correct language
      location ~ ^/(fr|de|en) {
          try_files $uri /$1/index.html?$args;
      }
      # ...
  }
  ```

##### Apache example

- The following example displays an Apache configuration.

  ```
  <VirtualHost *:80>
      ServerName localhost
      DocumentRoot /www/data
      <Directory "/www/data">
          RewriteEngine on
          RewriteBase /
          RewriteRule ^../index\.html$ - [L]

          RewriteCond %{REQUEST_FILENAME} !-f
          RewriteCond %{REQUEST_FILENAME} !-d
          RewriteRule (..) $1/index.html [L]

          RewriteCond %{HTTP:Accept-Language} ^de [NC]
          RewriteRule ^$ /de/ [R]

          RewriteCond %{HTTP:Accept-Language} ^en [NC]
          RewriteRule ^$ /en/ [R]

          RewriteCond %{HTTP:Accept-Language} !^en [NC]
          RewriteCond %{HTTP:Accept-Language} !^de [NC]
          RewriteRule ^$ /fr/ [R]
      </Directory>
  </VirtualHost>
  ```

## Example Angular Application

## Optional internationalization practices

### Overview

- The following optional topics help you manually configure the internationalization settings of your application. The optional practices are meant for advanced or custom Angular applications.

### Set the runtime locale manually

- The initial installation of Angular already contains locale data for English in the United States (`en-US`). The `Angular CLI` automatically includes the locale data and sets the `LOCALE_ID` value when you use the `--localize` option with ng build command.

- To manually set the runtime locale of an application to one other than the automatic value, complete the following actions.

  1. Search for the Unicode locale ID in the language-locale combination in the
     `@angular/common/locales/` directory.
  2. Set the `LOCALE_ID` token.

- The following example sets the value of `LOCALE_ID` to `fr` for French.

  - src/app/app.module.ts

    ```
    import { LOCALE_ID, NgModule } from '@angular/core';
    import { BrowserModule } from '@angular/platform-browser';

    import { AppComponent } from '../src/app/app.component';

    @NgModule({
      imports: [ BrowserModule ],
      declarations: [ AppComponent ],
      providers: [ { provide: LOCALE_ID, useValue: 'fr' } ],
      bootstrap: [ AppComponent ]
    })
    export class AppModule { }
    ```

### Import global variants of the locale data

- The `Angular CLI` automatically includes locale data if you run the `ng build` command with the `--localize` option.

  ```
  ng build --localize
  ```

- The `@angular/common` package on npm contains the locale data files. Global variants of the locale data are available in `@angular/common/locales/global`.

#### import example for French

- The following example imports the global variants for French (`fr`).
  - src/app/app.module.ts
    ```
    import '@angular/common/locales/global/fr';
    ```

### Manage marked text with custom IDs

- The Angular extractor generates a file with a translation unit entry each of the following instances.

  - Each `i18n` attribute in a component template
  - Each `$localize` tagged message string in component code

- As described in `How meanings control text extraction and merges`, Angular assigns each translation unit a unique ID.

- The following example displays translation units with unique IDs.

  - messages.fr.xlf.html
    ```
    <trans-unit id="ba0cc104d3d69bf669f97b8d96a4c5d8d9559aa3" datatype="html">
    ```

- When you change the translatable text, the extractor generates a new ID for that translation unit. In most cases, changes in the source text also require a change to the translation. Therefore, using a new ID keeps the text change in sync with translations.

- However, some translation systems require a specific form or syntax for the ID. To address the requirement, use a custom ID to mark text. Most developers don't need to use a custom ID. If you want to use a unique syntax to convey additional metadata, use a custom ID. Additional metadata may include the library, component, or area of the application in which the text appears.

- To specify a custom ID in the i18n attribute or $localize tagged message string, use the @@ prefix. The following example defines the introductionHeader custom ID in a heading element.

  - app/app.component.html
    ```
    <h1 i18n="@@introductionHeader">Hello i18n!</h1>
    ```

- The following example defines the `introductionHeader` custom ID for a variable.
  ```
  variableText1 = $localize `:@@introductionHeader:Hello i18n!`;
  ```
- When you specify a custom ID, the extractor generates a translation unit with the custom ID.
  - messages.fr.xlf.html
    ```
    <trans-unit id="introductionHeader" datatype="html">
    ```
- If you change the text, the extractor does not change the ID. As a result, you don't have to take the extra step to update the translation. The drawback of using custom IDs is that if you change the text, your translation may be out-of-sync with the newly changed source text.

#### Use a custom ID with a description

- Use a custom ID in combination with a description and a meaning to further help the translator.

- The following example includes a description, followed by the custom ID.

  - app/app.component.html
    ```
    <h1 i18n="An introduction header for this sample@@introductionHeader">Hello i18n!</h1>
    ```

- The following example defines the `introductionHeader` custom ID and description for a variable.

  ```
  variableText2 = $localize `:An introduction header for this sample@@introductionHeader:Hello i18n!`;
  ```

- The following example adds a meaning.
  - app/app.component.html
    ```
    <h1 i18n="site header|An introduction header for this sample@@introductionHeader">Hello i18n!</h1>
    ```

#### Define unique custom IDs

- Be sure to define custom IDs that are unique. If you use the same ID for two different text elements, the extraction tool extracts only the first one, and Angular uses the translation in place of both original text elements.

- For example, in the following code snippet the same myId custom ID is defined for two different text elements.

  - app/app.component.html
    ```
    <h3 i18n="@@myId">Hello</h3>
    <!-- ... -->
    <p i18n="@@myId">Good bye</p>
    ```

- The following displays the translation in French.
  - src/locale/messages.fr.xlf
    ```
    <trans-unit id="myId" datatype="html">
      <source>Hello</source>
      <target state="new">Bonjour</target>
    </trans-unit>
    ```
- Both elements now use the same translation (Bonjour), because both were defined with the same custom ID.
  ```
  <h3>Bonjour</h3>
  <!-- ... -->
  <p>Bonjour</p>
  ```
