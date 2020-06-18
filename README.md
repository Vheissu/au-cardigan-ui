# au-cardigan-ui
A robust set of UI components for Aurelia 2 applications.

## Installation

```
yarn add au-cardigan
```

## Usage

Import the configuration object and register it with Aurelia during app boostrap.

```
import { CardiganConfiguration } from 'au-cardigan';

Aurelia
  .register(
    CardiganConfiguration,
  )
  .app(App)
  .start(
```

# Styling

Styling components uses [CSS Shadow Parts](https://meowni.ca/posts/part-theme-explainer/) which allow you complete stylistic control over each component used. Each component in this library exposes a part name which you can then reference in your CSS styles.

For example, to style a primary button in your app you can reference the element and the primary style part like this:

```css
au-button::part(primary) {
    background: blue;
}
```

## Credits

Inspiration for this library was taken from [Gestalt](https://github.com/pinterest/gestalt) by Pinterest, including attribute names and how markup for some of their React components were created.