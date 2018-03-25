/* eslint-env mocha, browser */
/* globals expect setRoute initializeRouteButtons */

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
		document.getElementById('test').getAttribute('hidden').should.not.equal(null);
	});

	it('should unset hidden attributes as necessary on all routes', () => {
		document.body.innerHTML = `
		<div id="router">
			<div class="route" pattern="^/$" id="1"></div>
			<div class="route" pattern="^/lol$" id="2"></div>
			<div class="route" pattern="^/foo$" id="3" hidden></div>
		</div>`;

		setRoute('/');
		expect(document.getElementById('1').getAttribute('hidden')).to.equal(null);
		setRoute('/lol');
		expect(document.getElementById('1').getAttribute('hidden')).to.not.equal(null);
		expect(document.getElementById('2').getAttribute('hidden')).to.equal(null);
		setRoute('/foo');
		expect(document.getElementById('1').getAttribute('hidden')).to.not.equal(null);
		expect(document.getElementById('2').getAttribute('hidden')).to.not.equal(null);
		expect(document.getElementById('3').getAttribute('hidden')).to.equal(null);
	});

	it('should select the fallback if no other route matches', () => {
		document.body.innerHTML = `
		<div id="router">
			<div class="route" pattern="^/$" id="test" fallback></div>
			<div class="route" pattern="^/foo$" id="test2"></div>
		</div>`;

		setRoute('qwertyuiopasdfghjklzxcvbnm');
		expect(document.getElementById('test').getAttribute('hidden')).to.equal(null);
		expect(document.getElementById('test2').getAttribute('hidden')).to.equal('hidden');
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
		}).should.throw(Error, /^No route matches requested route, and no fallback provided$/);
	});
});

describe('initializeRouteButtons', () => {
	it('should attach an onClick handler to all route buttons', () => {
		document.body.innerHTML = `
		<div class="route-button" destination="/" id="test"></div>`;

		initializeRouteButtons();
		expect(document.getElementById('test').onclick).to.not.equal(null);
	});

	it('should update the route when a button\'s onclick is called', () => {
		document.body.innerHTML = `
		<div id="router">
			<div class="route" pattern="^/$" hidden id="1"></div>
			<div class="route" pattern="^/foo$" hidden id="2"></div>
		</div>
		<div class="route-button" destination="/foo" id="test"></div>`;

		initializeRouteButtons();
		setRoute('/');
		expect(document.getElementById('1').getAttribute('hidden')).to.equal(null);
		expect(document.getElementById('2').getAttribute('hidden')).to.equal('hidden');
		document.getElementById('test').onclick();
		expect(document.getElementById('1').getAttribute('hidden')).to.equal('hidden');
		expect(document.getElementById('2').getAttribute('hidden')).to.equal(null);
	});

	it('should not affect any elements if elements is passed and they are not in it', () => {
		// Don't specify a destination as we are not checking for if
		// they affect the route.
		document.body.innerHTML = `
		<div class="route-button" id="1"></div>
		<div class="route-button" id="2"></div>`;

		initializeRouteButtons([document.getElementById('1')]);
		expect(document.getElementById('1').onclick).to.not.equal(null);
		expect(document.getElementById('2').onclick).to.equal(null);
	});
});
