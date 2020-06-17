# au-cardigan-ui
A robust set of UI components for Aurelia 2 applications.

## Installation

```
yarn add au-cardian
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