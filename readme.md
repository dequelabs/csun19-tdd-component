# CSUN 19 TDD ARIA Tabs

Using test-driven development we spec out our aria tabs component using the [aria authoring practices](https://www.w3.org/TR/wai-aria-practices-1.1/#tabpanel).

Live coding presentation given by [Harris Schneiderman](https://www.harris-schneiderman.com)

* [@theHarrisius on twitter](https://twitter.com/theHarrisius)
* [schne324 on github](https:/github.com/schne324)

## Setup

### Install dependencies

```sh
$ yarn
```

**NOTE** you _can_ use npm (just run `npm install`)

### Run the tests

```sh
$ yarn test
```

### View the demo app

```sh
$ yarn dev
```

### Gotchas

* Both the unit tests _and_ the demo app run [axe-core](https://github.com/dequelabs/axe-core)
* This project uses very modern javascript APIs and will not work on non-modern browsers
* This is a somewhat minimal implementation completely done during the 40 minute csun 19 presentation
