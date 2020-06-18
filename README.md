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

All CSS properties can be changed by specifying CSS Variable values. Values on the left denoted by the double hyphen "--" are the variable names and the value to the right is the default value set from within each component.

## Button

`<au-button>`

### Button

Default button stylings

* --button-background : none
* --button-border : none
* --button-color : transparent
* --button-display : inline-flex
* --button-font-family : Arial, Helvetica, sans-serif
* --button-font-size : 1rem
* --button-margin : 0
* --button-outline : none
* --button-text-decoration : none
* --button-text-transform : none
* --button-hover-cursor : pointer

### Button: Primary

Primary button styling

* --button-primary-background
* --button-primary-color
* --button-primary-background-hover : var(--button-primary-background)

### Button Sizes

* --button-small-padding
* --button-medium-padding
* --button-large-padding
* --button-xlarge-padding

## Image

`<au-image>`

### Image

This is the image element itself, only when a fit property isn't specified as `contain` or `cover`.

* --image-height : auto
* --image-max-width : 100%
* --image-with-alt-color : transparent

### Scaled Image

When supplying the fit property as `contain` or `cover`, it becomes a scaled image.

* --scaled-img-background-position : center center
* --scaled-img-background-repeat : no-repeat
* --scaled-img-height : 100%
* --scaled-img-position : relative
* --scaled-img-width : 100%
* --img-contain-background-size : contain
* --img-cover-background-size : cover

## Modal

`<au-modal>`

### Container

Wraps the entire modal itself.

* --modal-container-align-items : center
* --modal-container-box-sizing : border-box
* --modal-container-display : flex
* --modal-container-height : 100%
* --modal-container-justify-content : center
* --modal-container-left : 0
* --modal-container-position : fixed
* --modal-container-top : 0
* --modal-container-width : 100%

### Backdrop

The dark overflow showing behind the modal.

* --modal-backdrop-cursor : no-cursor
* --modal-backdrop-background : rgba(0, 0, 0, 0.4)
* --modal-backdrop-height : 100%
* --modal-backdrop-left : 0
* --modal-backdrop-opacity : 0.9
* --modal-backdrop-overflow-y : scroll
* --modal-backdrop-position : absolute
* --modal-backdrop-top : 0
* --modal-backdrop-width : 100%

### Wrapper

The element that wraps the main content

* --modal-wrapper-background-color : #FFF
* --modal-wrapper-border-radius : 32px
* --modal-wrapper-display : flex
* --modal-wrapper-margin-left : 16px
* --modal-wrapper-margin-right : 16px
* --modal-wrapper-max-height : calc(100vh - 32px)
* --modal-wrapper-overflow : hidden
* --modal-wrapper-position : relative
* --modal-wrapper-focus-outline : none

### Content

The element that contains the content itself. By default it has a white background.

* --modal-content-display : flex
* --modal-content-flex : 1 1 auto
* --modal-content-flex-direction : column
* --modal-content-min-height : 0
* --modal-content-min-width : 0
* --modal-content-position : relative
* --modal-content-width : 100%

### Content Inner

The element which has the slotted content, it sits within the content wrapper (above)

* --modal-content-inner-flex : 1 1 auto
* --modal-content-inner-min-height : 0
* --modal-content-inner-min-width : 0
* --modal-content-inner-overflow : auto

## Credits

Inspiration for this library was taken from [Gestalt](https://github.com/pinterest/gestalt) by Pinterest, including attribute names and how markup for some of their React components were created.