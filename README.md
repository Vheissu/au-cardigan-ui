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
  .start();
```

## Credits

Inspiration for this library was taken from [Gestalt](https://github.com/pinterest/gestalt) by Pinterest, including attribute names and how markup for some of their React components were created.