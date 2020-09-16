# Roowter [![Travis CI](https://img.shields.io/travis/thatlittlegit/roowter.svg)](https://travis-ci.org/thatlittlegit/roowter)[![Codecov](https://img.shields.io/codecov/c/github/thatlittlegit/roowter.svg)](https://codecov.io/gh/thatlittlegit/roowter)[![Inch CI](https://inch-ci.org/github/thatlittlegit/roowter.svg)](https://inch-ci.org/github/thatlittlegit/roowter)
Roowter is a simple and fast router built in JavaScript that works off HTML
classes and IDs.

## Usage
Roowter works by having a router, by default with the `router` ID, and a series
of routes as direct children.

Routes should have the `hidden` attribute if they shouldn't be shown to the user
on page load; Roowter only configures visibility on a route change.

Routes must have a `pattern` attribute, which is a valid JavaScript
[regular expression] and states for which pages the route should be shown. For
many cases, you'll want a regex of the form `^/whatever$`, so it is only shown
for the exact path; however, you can use it for whatever pattern you would like.

Routes may also have a `fallback` attribute (value ignored), which means it will
be shown if no other route can be found. Only one route should have a fallback.

Here's an example of using Roowter:

```html
<div id="router">
	<div class="route" pattern="^/$" fallback>Hello</div>
	<div class="route" pattern="^/search/.*" hidden>Search</div>
</div>
```
```js
setRoute('/');
```
The above code would show 'Hello' on screen. Running `setRoute('/search/q')`
would show 'Search'.

Roowter can set callbacks on a route change, and create route buttons for a
router:

```html
<div id="router">
	<div class="route" pattern="^/$" fallback>
		<div class="route-button" destination="/alert">Alert!</div>
	</div>
	<div class="route" pattern="^/alert$" hidden>
		Oh no!
	</div>
</div>
```
```js
initializeRouteButtons();
onRouteSwitch(/^alert$/, () => alert('hello!'));
```

The above code would show 'Alert!' and show an alert dialog when clicked.

[regular expression]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions

## License
Roowter is licensed under the three-clause BSD license.