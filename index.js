/**
  * Sets the route by toggling the hidden attribute of the children of the
  * router.
  *
  * @param {String} route - The route to set.
  * @returns {String} The passed route.
  */
function setRoute(route) {
	const router = document.getElementById('router');
	const routes = Array.from(router.children);
	window.location.href = `${window.location.href.split('#')[0]}#${route}`;

	let chosen = false;
	routes.forEach((routeElement) => {
		if (!routeElement.attributes.pattern) {
			throw new Error('Route is missing a \'pattern\' attribute');
		} else if (!chosen && route.search(new RegExp(routeElement.attributes.pattern.nodeValue)) + 1) {
			routeElement.removeAttribute('hidden');
			chosen = true;
		} else {
			routeElement.setAttribute('hidden', 'hidden');
		}
	});

	if (!chosen) {
		routes.forEach((routeElement) => {
			if (chosen !== true && routeElement.attributes.fallback) {
				routeElement.removeAttribute('hidden');
				chosen = true;
			}
		});

		// If still not chosen, throw
		if (!chosen) throw new Error('No route matches requested route, and no fallback provided');
	}

	return route;
}

/**
  * Initializes all Roowter 'route buttons'. These are effectively hyperlinks
  * between routes, working off onclick. It may be recommended to use CSS to
  * add a pointer cursor, although you
  * <a href="https://medium.com/simple-human/b11e99ca374b">shouldn't overdo
  * it</a>.
  *
  * @param {(HTMLElement[]|undefined)} elements - The elements to transform.
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

/**
  * Injects Roowter into module.exports. Intended as a hack for 100% coverage.
  *
  * @returns {undefined}
  */
function roowterInject() {
	try {
		if (typeof module === 'undefined') {
			module.exports = {
				setRoute,
				initializeRouteButtons,
			};
		}
	} catch (err) {
		//
	}
}

roowterInject();
