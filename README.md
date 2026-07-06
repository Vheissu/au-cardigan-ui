# Cardigan UI

A robust set of UI components for Aurelia 2.

## Installation

```
npm install au-cardigan
```

## Usage

Import the configuration object and register it with Aurelia during app bootstrap. The following would usually go inside of `main.ts` / `main.js`.

```
import { CardiganConfiguration } from 'au-cardigan';

Aurelia
  .register(
    CardiganConfiguration,
  )
  .app(App)
  .start();
```

## Components

Cardigan features a growing set of components.

- `<au-button>` wraps the native `<button>` element with solid/outline/ghost variants, colors, sizes, loading state and a composed `au-button-click` event
- `<au-heading>` wraps the native heading elements, h1 through to h6, validating out-of-range levels and defaulting to 1
- `<au-image>` wraps the native `<img>` element, but also offers support for scaling, srcSet and more
- `<au-modal>` a lightweight modal implementation
- `<au-select>` wraps the native select element
- `<au-code>` displays code snippets using `<pre>` or `<code>`
- `<au-badge>` displays a small label that can be color coded
- `<au-alert>` shows a contextual message with optional dismissal
- `<au-progress>` displays progress for an operation
- `<au-input>` wraps native `<input>` elements with consistent labels, helper text, and validation states
- `<au-textarea>` mirrors `au-input` for multiline text areas
- `<au-checkbox>` renders a labeled checkbox with optional descriptions and helper/error messages
- `<au-switch>` provides a toggle presentation for boolean settings
- `<au-card>` offers a flexible content surface with header/footer/media slots and interactive states
- `<au-tabs>` + `<au-tab-panel>` provide accessible tabbed navigation with keyboard support
- `<au-accordion>` + `<au-accordion-item>` collapse dense content while preserving semantic headings
- `<au-toast>` displays compact status messages, while `<au-toast-center>` manages toast stacks and timers
- `<au-spinner>` presents a standardized loading indicator with multiple sizes and variants
- `<au-skeleton>` renders loading placeholders for text, blocks, or avatars
- `<au-breadcrumb>` + `<au-breadcrumb-item>` render accessible breadcrumb navigation with configurable separators and automatic `aria-current` handling
- `<au-button-group>` visually joins a row (or column) of `au-button`s into a single control
- `<au-callout>` highlights important messages with variant accents, an optional icon slot and dismissal
- `<au-divider>` separates content horizontally or vertically, with optional inline labels
- `<au-animated-image>` displays GIF/WebP/APNG images with play/pause controls and `prefers-reduced-motion` awareness
- `<au-animation>` declaratively animates its content via the Web Animations API — 18 built-in presets (`fade-in`, `slide-in-up`, `zoom-in`, `bounce`, `shake`, …) or bring your own keyframes
- `<au-carousel>` + `<au-carousel-item>` provide an accessible slideshow with controls, indicators, keyboard navigation, autoplay and looping
- `<au-checkbox-group>` coordinates a fieldset of `au-checkbox`es behind a single two-way `string[]` value
- `<au-color-picker>` combines a native color input, validated hex field and preset swatches
- `<au-combobox>` offers a filterable single-select with full combobox ARIA and keyboard support
- `<au-copy-button>` copies a value (or the text of a target element) to the clipboard with copied-state feedback
- `<au-date-input>` provides a locale-aware segmented date field (day/month/year order derived from `Intl`) with min/max constraints, validation and a popup calendar
- `<au-bar-chart>`, `<au-bubble-chart>`, `<au-doughnut-chart>`, `<au-radar-chart>` render dependency-free, theme-aware canvas charts with HTML legends and screen-reader data tables

## Storybook

Every component ships with Storybook stories, including a toolbar for switching between the built-in theme presets.

```
npm run storybook        # dev server at http://localhost:6006
npm run build-storybook  # static build in storybook-static/
```

Stories live in `stories/` and use the official [`@aurelia/storybook`](https://www.npmjs.com/package/@aurelia/storybook) framework with the Vite builder.

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

## Configuration & Theming

Cardigan now exposes helpers for dialing in the footprint you actually need, as well as runtime theme tokens:

- `CardiganConfiguration.select(['au-button', 'au-card'])` registers a curated subset instead of the full bundle.
- `CardiganConfiguration.from({ add: [MyCustomElement], exclude: ['au-toast'] })` lets you append custom registries while trimming built-ins.
- `CardiganConfiguration.withTheme({ colors: { primary: '#ff3366' }, typography: { fontFamily: '"Space Grotesk", sans-serif' } })` injects CSS custom properties (`--au-cardigan-color-*`, `--au-cardigan-radius-*`, `--au-cardigan-spacing-*`, etc.) onto `:root` so every Cardigan component inherits your palette.
- `CardiganConfiguration.withTheme('dark')` applies one of the built-in theme presets: `light`, `dark`, `ocean`, `forest` or `sunset`. Preset names also work anywhere a theme is accepted, e.g. `CardiganConfiguration.from({ theme: 'ocean' })`.
- `CardiganConfiguration.withGlobalStyles()` ensures the shared CSS variables are emitted once at the document level (handy for styling non-Cardigan DOM) and accepts an optional string for extra overrides.

Theme tokens can also be set manually in your global styles via the `--au-cardigan-*` variables if you prefer static CSS over runtime configuration.

Presets are exported as plain objects via `CardiganThemes`, so you can extend one instead of starting from scratch:

```ts
import { CardiganConfiguration, CardiganThemes } from 'au-cardigan';

export const MyTheme = CardiganConfiguration.withTheme({
  ...CardiganThemes.dark,
  typography: { fontFamily: '"Space Grotesk", sans-serif' },
});
```

Or build a fully custom theme:

```ts
import { CardiganConfiguration, CardiganThemeOptions } from 'au-cardigan';

const theme: CardiganThemeOptions = {
  colors: {
    primary: '#4c6ef5',
    dark: '#0b0f19',
  },
  radius: {
    medium: '0.75rem',
  },
  spacing: {
    md: '1.25rem',
  },
  typography: {
    fontFamily: '"Space Grotesk", sans-serif',
    fontSize: '15px',
  },
};

export const CardiganTheme = CardiganConfiguration.withTheme(theme);
export const CardiganGlobals = CardiganConfiguration.withGlobalStyles();

// In your Aurelia bootstrap:
// Aurelia.register(CardiganGlobals, CardiganTheme);
// applyGlobalStyles(); // or call directly if you only need the CSS variables.
```
