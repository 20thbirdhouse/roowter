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
  * Finds the element corresponding to `name`:
  *
  * 1. Returns `name` if it is an HTMLElement
  * 2. Returns `querySelector(name)` if it's truthy
  * 3. Returns #router or #js-router
  *
  * @param {(String|HTMLElement)} [name] - The element, or its name, or a falsy
  *   value.
  * @returns {HTMLElement} The corresponding HTMLElement.
  * @throws `name` must be falsy or exist in the DOM.
  * @private
  */
function findRoowter(name) {
	const defaultRouter = document.querySelector('#router');
	const defaultJsRouter = document.querySelector('#js-router');
	const requestedRouter = typeof name === 'string'
		? document.querySelector(name)
		: null;

	if (name instanceof HTMLElement) {
		return name;
	}

	if (requestedRouter !== null) {
		return document.querySelector(name);
	}

	if (defaultRouter !== null) {
		return defaultRouter;
	}

	if (defaultJsRouter !== null) {
		return defaultJsRouter;
	}

	throw new Error('Invalid router name');
}

/**
  * Sets the route by toggling the hidden attribute of the children of the
  * router.
  *
  * @param {String} route - The route to set.
  * @param {(String|HTMLElement)} [router] The router element to use; defaults
  *   to '#router' or '#js-router'. If a string, uses querySelector.
  */
function setRoute(route, routerElem) {
	const router = findRoowter(routerElem);
	if (!router.events) {
		router.events = [];
	}

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

	router.events
		.filter(event => route.search(event.regex) + 1)
		.forEach(event => event.callback());
}

/**
  * Event handler system for Roowter. Fires an event when a route passed to
  * setRoute() matches a RegExp.
  *
  * @param {(RegExp|String)} regex - The regular expression to test for.
  * @param {Function} callback - The callback to run.
  * @param {Boolean} [once] - If `true`, removes it from the array after one run.
  * @param {(String|HTMLElement)} [routerName] - The router element to use;
  *   defaults to #router or #js-router.
  */
function onRouteSwitch(regex, callback, once, routerName) {
	const id = Math.random() * 2;
	const pattern = regex instanceof RegExp ? regex : new RegExp(regex);

	const router = findRoowter(routerName);
	if (!router.events) {
		router.events = [];
	}

	if (once) {
		router.events.push({
			regex: pattern,
			callback() {
				callback();

				router.events = router.events.filter(event => event.id !== id);
			},
			id,
		});
	} else {
		router.events.push({
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
  * @param {(HTMLElement|String)} [routerName] - The router to initialize
  *   buttons for. Note that there is no way currently to specify *which*
  *   router should get the buttons; calling initializeRouteButtons switches
  *   them all over.
  */
function initializeRouteButtons(elements, routerName) {
	(elements || Array.from(document.getElementsByClassName('route-button')))
		.forEach((elem) => {
			// eslint-disable-next-line no-param-reassign
			elem.onclick = () => {
				if (!elem.attributes.destination) {
					throw new Error('Route button has no \'destination\' attribute');
				} else {
					setRoute(elem.attributes.destination.nodeValue, routerName);
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
