module.exports = (config) => {
	config.set({
		frameworks: ['chai', 'mocha'],
		files: ['*.js'],
		reporters: ['spec'],
		port: 9876,
		colors: true,
		browsers: ['Firefox'],
		singleRun: true,
		concurrency: Infinity,
	});
};
