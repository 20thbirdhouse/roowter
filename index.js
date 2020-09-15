/**
  * Stores a event that is to be fired on a route change.
  *
  * @typedef {Object} Event
  * @property {RegExp} regex - The regular expression to fire on.
  * @property {Function} callback - The callback to run.
  * @property {Number} id - Internal identifier for this event.
  * @private
  */

/**
  * The list of all events to be fired on a route change.
  *
  * @type {Event[]}
  * @private
  */
let _events = [];

/**
  * Sets the route by toggling the hidden attribute of the children of the
  * router.
  *
  * @param {String} route - The route to set.
  * @returns {String} The passed route.
  */
function setRoute(route) {
	const router = document.getElementById('router') || document.getElementById('js-router');
	const routes = Array.from(router.children).filter(elem => elem.classList.contains('route') || elem.classList.contains('js-route'));
	window.location.href = `${window.location.href.split('#')[0]}#${route}`;

	let chosen = false;
	routes.forEach((routeElement) => {
		if (!routeElement.attributes.pattern) {
			throw new Error('Route is missing a \'pattern\' attribute');
		} else if (!chosen && route.search(new RegExp(routeElement.attributes.pattern.nodeValue)) + 1) {
			routeElement.removeAttribute('hidden');
			routeElement.removeAttribute('aria-hidden');
			chosen = true;
		} else {
			routeElement.setAttribute('hidden', 'hidden');
			routeElement.setAttribute('aria-hidden', 'true');
		}
	});

	if (!chosen) {
		routes.forEach((routeElement) => {
			if (chosen !== true && routeElement.attributes.fallback) {
				routeElement.removeAttribute('aria-hidden');
				routeElement.removeAttribute('hidden');
				chosen = true;
			}
		});

		// If still not chosen, throw
		if (!chosen) throw new Error('No route matches requested route, and no fallback provided');
	}

	_events
		.filter(event => route.search(event.regex) + 1)
		.forEach(event => event.callback());

	return route;
}

/**
  * Event handler system for Roowter. Fires an event when a route passed to
  * setRoute() matches a RegExp.
  *
  * @param {(RegExp|String)} regex - The regular expression to test for.
  * @param {Function} callback - The callback to run.
  * @param {Boolean} [once] - If `true`, removes it from the array after one run.
  */
function onRouteSwitch(regex, callback, once) {
	const id = Math.random() * 2;
	const pattern = regex instanceof RegExp ? regex : new RegExp(regex);

	if (once) {
		_events.push({
			regex: pattern,
			callback() {
				callback();

				_events = _events.filter(event => event.id !== id);
			},
			id,
		});
	} else {
		_events.push({
			regex: pattern,
			callback,
			id,
		});
	}
}

/**
  * Initializes all Roowter 'route buttons'. These are effectively hyperlinks
  * between routes, working off onclick. It may be recommended to use CSS to
  * add a pointer cursor, although you
  * <a href="https://medium.com/simple-human/b11e99ca374b">shouldn't overdo
  * it</a>.
  *
  * @param {HTMLElement[]} [elements] - The elements to transform.
  * @returns {undefined}
  */
function initializeRouteButtons(elements) {
	(elements || Array.from(document.getElementsByClassName('route-button')))
		.forEach((elem) => {
			// eslint-disable-next-line no-param-reassign
			elem.onclick = () => {
				if (!elem.attributes.destination) {
					throw new Error('Route button has no \'destination\' attribute');
				} else {
					setRoute(elem.attributes.destination.nodeValue);
				}
			};
		});
}

/* istanbul ignore next */
try {
	if (typeof module !== 'undefined') {
		module.exports = {
			setRoute,
			onRouteSwitch,
			initializeRouteButtons,
		};
	}
} catch (err) {
	//
}
