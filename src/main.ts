import Aurelia, { RouterConfiguration } from 'aurelia';
import { MyApp } from './my-app';
import { CardiganConfiguration } from 'au-cardigan';

import 'bootstrap/dist/css/bootstrap.css';

Aurelia
  .register(RouterConfiguration, CardiganConfiguration)
  .app(MyApp)
  .start();
