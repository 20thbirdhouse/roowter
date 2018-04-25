module.exports = (config) => {
	config.set({
		frameworks: ['chai', 'mocha'],
		files: ['*.js'],
		reporters: ['spec', 'coverage'],
		port: 9876,
		colors: true,
		browsers: ['Firefox'],
		singleRun: true,
		concurrency: Infinity,

		preprocessors: {
			'roowter.js': ['coverage'],
		},
		coverageReporter: {
			type: 'lcov',
			dir: 'coverage/',
		},
	});
};
