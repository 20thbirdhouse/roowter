/* eslint-env mocha, browser */
/* globals expect setRoute onRouteSwitch initializeRouteButtons */

describe('setRoute', () => {
	it('should set location.href correctly', () => {
		document.body.innerHTML = `
		<div id="router">
			<div class="route" pattern="/"></div>
		</div>`;

		window.location.href = `${window.location.href.split('#')[0]}#`;
		setRoute('/');
		window.location.href.split('#')[1].should.equal('/');
	});

	it('should set hidden attributes on all routes that do not match', () => {
		document.body.innerHTML = `
		<div id="router">
			<div class="route" pattern="/"></div>
			<div class="route" pattern="/lol" id="test"></div>
		</div>`;

		setRoute('/');
		document
			.querySelector('#test')
			.getAttribute('hidden')
			.should.not.equal(null);
	});

	it('should set aria-hidden attributes on all routes that do not match', () => {
		document.body.innerHTML = `
		<div id="router">
			<div class="route" pattern="/"></div>
			<div class="route" pattern="/lol" id="test"></div>
		</div>`;

		setRoute('/');
		document
			.querySelector('#test')
			.getAttribute('aria-hidden')
			.should.not.equal(null);
		document
			.querySelector('#test')
			.getAttribute('aria-hidden')
			.should.equal('true');
	});

	it('should unset hidden attributes as necessary on all routes', () => {
		document.body.innerHTML = `
		<div id="router">
			<div class="route" pattern="^/$" id="a"></div>
			<div class="route" pattern="^/lol$" id="b"></div>
			<div class="route" pattern="^/foo$" id="c" hidden></div>
		</div>`;

		setRoute('/');
		expect(document.querySelector('#a').getAttribute('hidden')).to.equal(null);
		setRoute('/lol');
		expect(document.querySelector('#a').getAttribute('hidden')).to.not.equal(
			null
		);
		expect(document.querySelector('#b').getAttribute('hidden')).to.equal(null);
		setRoute('/foo');
		expect(document.querySelector('#a').getAttribute('hidden')).to.not.equal(
			null
		);
		expect(document.querySelector('#b').getAttribute('hidden')).to.not.equal(
			null
		);
		expect(document.querySelector('#c').getAttribute('hidden')).to.equal(null);
	});

	it('should unset hidden attributes as necessary on all routes', () => {
		document.body.innerHTML = `
		<div id="router">
			<div class="route" pattern="^/$" id="a"></div>
			<div class="route" pattern="^/lol$" id="b"></div>
			<div class="route" pattern="^/foo$" id="c" hidden></div>
		</div>`;

		setRoute('/');
		expect(document.querySelector('#a').getAttribute('aria-hidden')).to.equal(
			null
		);
		setRoute('/lol');
		expect(
			document.querySelector('#a').getAttribute('aria-hidden')
		).to.not.equal(null);
		expect(document.querySelector('#b').getAttribute('aria-hidden')).to.equal(
			null
		);
		setRoute('/foo');
		expect(
			document.querySelector('#a').getAttribute('aria-hidden')
		).to.not.equal(null);
		expect(
			document.querySelector('#b').getAttribute('aria-hidden')
		).to.not.equal(null);
		expect(document.querySelector('#c').getAttribute('aria-hidden')).to.equal(
			null
		);
	});

	it('should select the fallback if no other route matches', () => {
		document.body.innerHTML = `
		<div id="router">
			<div class="route" pattern="^/$" id="test" fallback></div>
			<div class="route" pattern="^/foo$" id="test2"></div>
		</div>`;

		setRoute('qwertyuiopasdfghjklzxcvbnm');
		expect(document.querySelector('#test').getAttribute('hidden')).to.equal(
			null
		);
		expect(document.querySelector('#test2').getAttribute('hidden')).to.equal(
			'hidden'
		);
		expect(
			document.querySelector('#test').getAttribute('aria-hidden')
		).to.equal(null);
		expect(
			document.querySelector('#test2').getAttribute('aria-hidden')
		).to.equal('true');
	});

	it('should throw an error if no pattern attribute is provided', () => {
		document.body.innerHTML = `
		<div id="router">
			<div class="route"></div>
		</div>`;

		(() => {
			setRoute('/');
		}).should.throw(Error, /^Route is missing a 'pattern' attribute$/);
	});

	it('should throw an error even if the correct route has been found', () => {
		document.body.innerHTML = `
		<div id="router">
			<div class="route" pattern="^/$"></div>
			<div class="route"></div>
		</div>`;

		(() => {
			setRoute('/');
		}).should.throw(Error, /^Route is missing a 'pattern' attribute$/);
	});

	it('should throw an error if an invalid route is specified with no fallback', () => {
		document.body.innerHTML = `
		<div id="router">
			<div class="route" pattern="^/$"></div>
		</div>`;

		(() => {
			setRoute('qwertyuiopasdfghjklzxcvbnm');
		}).should.throw(
			Error,
			/^No route matches requested route, and no fallback provided$/
		);
	});

	it('should switch routes correctly with multiple routers', () => {
		document.body.innerHTML = `
		<div id="router-a">
			<div class="route" pattern="^/a$" id="aa" hidden></div>
			<div class="route" pattern="^/b$" id="ab"></div>
		</div>
		<div id="router-b">
			<div class="route" pattern="^/a$" id="ba"></div>
			<div class="route" pattern="^/b$" id="bb" hidden></div>
		</div>`;

		/* eslint-disable no-unused-expressions */
		setRoute('/a', '#router-a');
		expect(document.querySelector('#aa').getAttribute('hidden')).to.be.null;
		expect(document.querySelector('#ab').getAttribute('hidden')).to.not.be.null;
		expect(document.querySelector('#ba').getAttribute('hidden')).to.be.null;
		expect(document.querySelector('#bb').getAttribute('hidden')).to.not.be.null;

		setRoute('/b', document.querySelector('#router-a'));
		expect(document.querySelector('#aa').getAttribute('hidden')).to.not.be.null;
		expect(document.querySelector('#ab').getAttribute('hidden')).to.be.null;
		expect(document.querySelector('#ba').getAttribute('hidden')).to.be.null;
		expect(document.querySelector('#bb').getAttribute('hidden')).to.not.be.null;

		setRoute('/a', document.querySelector('#router-b'));
		expect(document.querySelector('#aa').getAttribute('hidden')).to.not.be.null;
		expect(document.querySelector('#ab').getAttribute('hidden')).to.be.null;
		expect(document.querySelector('#ba').getAttribute('hidden')).to.be.null;
		expect(document.querySelector('#bb').getAttribute('hidden')).to.not.be.null;

		setRoute('/b', '#router-b');
		expect(document.querySelector('#aa').getAttribute('hidden')).to.not.be.null;
		expect(document.querySelector('#ab').getAttribute('hidden')).to.be.null;
		expect(document.querySelector('#ba').getAttribute('hidden')).to.not.be.null;
		expect(document.querySelector('#bb').getAttribute('hidden')).to.be.null;
		/* eslint-enable no-unused-expressions */
	});

	it('should use #js-router if there is no #router router', () => {
		document.body.innerHTML = `<div id="js-router">
			<div class="route" pattern="^/foo$"></div>
			<div class="route" pattern="^/bar$"></div>
		</div>`;
		setRoute('/foo');

		/* eslint-disable-next-line no-unused-expressions */
		document.querySelector('#js-router').events.should.exist;
	});
});

describe('onRouteSwitch', () => {
	it('should run the callback when the route matches a regex and the regex is a string', () => {
		document.body.innerHTML = `
		<div id="router">
			<div class="route" pattern="^/foo$"></div>
			<div class="route" pattern="^/bar$"></div>
		</div>`;

		let ok = false;
		onRouteSwitch('^/bar$', () => {
			ok = true;
		});
		setRoute('/foo');
		ok.should.equal(false);
		setRoute('/bar');
		ok.should.equal(true);
	});

	it('should run the callback when the route matches a regex and the regex is a RegExp', () => {
		document.body.innerHTML = `
		<div id="router">
			<div class="route" pattern="^/foo$"></div>
			<div class="route" pattern="^/bar$"></div>
		</div>`;

		let ok = false;
		onRouteSwitch(/^\/bar$/, () => {
			ok = true;
		});
		setRoute('/foo');
		ok.should.equal(false);
		setRoute('/bar');
		ok.should.equal(true);
	});

	it('should create a unique ID for each event set', () => {
		document.body.innerHTML = `
		<div id="router">
			<div class="route" pattern="^/$"></div>
		</div>`;
		const router = document.querySelector('#router');

		const found = [];
		for (let index = 0; index <= 100; index += 1) {
			onRouteSwitch(/^\/$/, () => {});
			found.forEach((entry) => {
				entry.id.should.not.equal(index);
			});

			found.push(router.events[router.events.length - 1]);
		}
	});

	it('should create a thunk removing it from events if `once` is true', () => {
		document.body.innerHTML = `
		<div id="router">
			<div class="route" pattern="^/$"></div>
		</div>`;
		const router = document.querySelector('#router');

		onRouteSwitch(/^\/$/, () => {}, true);
		expect(router.events[0]).to.not.equal(undefined);
		setRoute('/');
		expect(router.events[0]).to.equal(undefined);
	});

	it('should NOT create a thunk removing it from events if `once` is false', () => {
		document.body.innerHTML = `
		<div id="router">
			<div class="route" pattern="^/$"></div>
		</div>`;
		const router = document.querySelector('#router');

		onRouteSwitch(/^\/$/, () => {});
		expect(router.events[0]).to.not.equal(undefined);
		setRoute('/');
		expect(router.events[0]).to.not.equal(undefined);
	});

	it('should work correctly with multiple routers', () => {
		document.body.innerHTML = `
		<div id="a">
			<div class="route" pattern="^/$"></div>
		</div>
		<div id="b">
			<div class="route" pattern="^/$"></div>
		</div>`;

		onRouteSwitch(/^\/$/, () => {}, false, '#a');
		expect(document.querySelector('#a').events[0]).to.not.equal(undefined);
		expect(document.querySelector('#b').events).to.equal(undefined);
		onRouteSwitch(/^\/$/, () => {}, false, '#b');
		expect(document.querySelector('#a').events[0]).to.not.equal(undefined);
		expect(document.querySelector('#b').events[0]).to.not.equal(undefined);
	});
});

describe('initializeRouteButtons', () => {
	it('should attach an onClick handler to all route buttons', () => {
		document.body.innerHTML = `
		<div class="route-button" destination="/" id="test"></div>`;

		initializeRouteButtons();
		expect(document.querySelector('#test').onclick).to.not.equal(null);
	});

	it("should update the route when a button's onclick is called", () => {
		document.body.innerHTML = `
		<div id="router">
			<div class="route" pattern="^/$" hidden id="a"></div>
			<div class="route" pattern="^/foo$" hidden id="b"></div>
		</div>
		<div class="route-button" destination="/foo" id="test"></div>`;

		initializeRouteButtons();
		setRoute('/');
		expect(document.querySelector('#a').getAttribute('hidden')).to.equal(null);
		expect(document.querySelector('#b').getAttribute('hidden')).to.equal(
			'hidden'
		);
		document.querySelector('#test').onclick();
		expect(document.querySelector('#a').getAttribute('hidden')).to.equal(
			'hidden'
		);
		expect(document.querySelector('#b').getAttribute('hidden')).to.equal(null);
	});

	it('should not affect any elements if elements is passed and they are not in it', () => {
		// Don't specify a destination as we are not checking for if
		// they affect the route.
		document.body.innerHTML = `
		<div class="route-button" id="a"></div>
		<div class="route-button" id="b"></div>`;

		initializeRouteButtons([document.querySelector('#a')]);
		expect(document.querySelector('#a').onclick).to.not.equal(null);
		expect(document.querySelector('#b').onclick).to.equal(null);
	});

	it("should throw an error if the 'destination' attribute isn't defined", () => {
		document.body.innerHTML = `
		<div class="route-button"></div>`;

		expect(() => {
			initializeRouteButtons();
			document.querySelectorAll('.route-button')[0].onclick();
		}).to.throw(Error, /^Route button has no 'destination' attribute$/);
	});

	it('should make the buttons, on click, go to whichever route on the instructed router', () => {
		document.body.innerHTML = `
		<div class="route-button" destination="/a"></div>
		<div id="router-a">
			<div id="aa" class="route" pattern="^/a$" hidden></div>
			<div id="ab" class="route" pattern="^/b$" hidden></div>
		</div>
		<div id="router-b">
			<div id="ba" class="route" pattern="^/a$" hidden></div>
			<div id="bb" class="route" pattern="^/b$" hidden></div>
		</div>`;

		const btn = document.querySelector('.route-button');

		/* eslint-disable no-unused-expressions */
		initializeRouteButtons(undefined, '#router-a');
		btn.click();
		expect(document.querySelector('#aa').getAttribute('hidden')).to.be.null;
		expect(document.querySelector('#ab').getAttribute('hidden')).to.not.be.null;
		expect(document.querySelector('#ba').getAttribute('hidden')).to.not.be.null;
		expect(document.querySelector('#bb').getAttribute('hidden')).to.not.be.null;

		initializeRouteButtons(undefined, '#router-b');
		btn.click();
		expect(document.querySelector('#aa').getAttribute('hidden')).to.be.null;
		expect(document.querySelector('#ab').getAttribute('hidden')).to.not.be.null;
		expect(document.querySelector('#ba').getAttribute('hidden')).to.be.null;
		expect(document.querySelector('#bb').getAttribute('hidden')).to.not.be.null;

		/* eslint-enable no-unused-expressions */
	});
});
