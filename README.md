# Cardigan UI

A robust set of UI components for Aurelia 2.

## Installation

```
npm install au-cardigan
```

## Usage

Import the configuration object and register it with Aurelia during app boostrap. The following would usually go inside of `main.ts` / `main.js`.

```
import { CardiganConfiguration } from 'au-cardigan';

Aurelia
  .register(
    CardiganConfiguration,
  )
  .app(App)
  .start(
```

## Components

Cardigan features a small, but growing number of components.

- `<au-button>` wraps the native `<button>` component
- `<au-heading>` wraps the native heading elements, h1 through to h6
- `<au-image>` wraps the native `<img>` element, but also offers support for scaling, srcSet and more
- `<au-modal>` a lightweight modal implementation
- `<au-select>` wraps the native select element

## Styling Components

Styling components uses [CSS Shadow Parts](https://meowni.ca/posts/part-theme-explainer/) which allow you complete stylistic control over each component used. Each component in this library exposes a part name which you can then reference in your CSS styles.

For example, to style a primary button in your app you can reference the element and the primary style part like this:

```css
au-button::part(primary) {
    background: blue;
}
```

Similarly, if you have added a class to your button, reference the class instead:

```css
.my-button::part(primary) {
    background: blue;
}
```