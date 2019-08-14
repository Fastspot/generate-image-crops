const fs = require('fs');

module.exports = function(customOptions) {
	var defaultOptions = {
		base: 'src/twig/components'
	};

	var options = customOptions ? Object.assign(customOptions, defaultOptions) : defaultOptions;

	fs.readdir(options.base, function(err, folders) {

	});
}