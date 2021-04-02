module.exports = (config) => {
	config.set({
		frameworks: ['chai', 'mocha'],
		files: ['*.js'],
		reporters: ['spec', 'coverage'],
		colors: true,
		browsers: ['FirefoxHeadless'],
		singleRun: true,
		concurrency: Number.POSITIVE_INFINITY,

		preprocessors: {
			'index.js': ['coverage']
		},
		coverageReporter: {
			type: 'lcov',
			dir: 'coverage/'
		}
	});
};
