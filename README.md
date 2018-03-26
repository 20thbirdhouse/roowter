# Roowter [![Travis CI](https://img.shields.io/travis/20thbirdhouse/roowter.svg)](https://travis-ci.org/20thbirdhouse/roowter)[![Codecov](https://img.shields.io/codecov/c/github/20thbirdhouse/roowter.svg)](https://codecov.io/gh/20thbirdhouse/roowter)[![Inch CI](https://inch-ci.org/github/20thbirdhouse/roowter.svg)](https://inch-ci.org/github/20thbirdhouse/roowter)
Roowter is a simple and fast router built in JavaScript that works off HTML
classes and IDs. It is *very* opiniated.

## Usage
```html
<div id="router">
  <div class="route" pattern="^/$" fallback hidden>Hello</div>
  <div class="route" pattern="^/search/" hidden>Search</div>
</div>
```
```js
setRoute('/');
```
The above code would show 'Hello' on screen. Running `setRoute('/search/q')`
would show 'Search'.

## Goals
* Load 300ms on Firefox Nightly
* <1kB built
