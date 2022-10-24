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

### Refer to locales by ID

### Format data based on locale

### Prepare component for translation

### Work with translation files

### Merge translations into the app

### Deploy multiple locales

## Example Angular Application

## Optional internationalization practices

### Overview

### Set the runtime locale manually

### Import global variants of the locale data

### Manage marked text with custom IDs
