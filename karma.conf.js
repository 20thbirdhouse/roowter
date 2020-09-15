module.exports = config => {
	config.set({
		frameworks: ['chai', 'mocha'],
		files: ['*.js'],
		reporters: ['spec', 'coverage'],
		colors: true,
		browsers: ['Firefox'],
		singleRun: true,
		concurrency: Infinity,

		preprocessors: {
			'index.js': ['coverage']
		},
		coverageReporter: {
			type: 'lcov',
			dir: 'coverage/'
		}
	});
};
