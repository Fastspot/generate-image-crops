const fs = require('fs');

module.exports = function(customOptions) {
	var defaultOptions = {
		base: 'src/twig/components',
		packageJson: require('./package.json'),
		fileName: "fs-component-image-crops",
		dest: 'static-html/templates'
	};

	var options = customOptions ? Object.assign(customOptions, defaultOptions) : defaultOptions;
	var cropsHTML = '';
	var resultsHTML = '';

	fs.readdirSync(options.base).forEach(folder => {
		fs.readdirSync(options.base + '/' + folder).forEach(file => {
			var content = fs.readFileSync(options.base + '/' + folder + '/' + file, 'utf8');
			var sizes = content.match(/(img\.[a-z]*\.[a-z]*)/g);
			var uniqueSizes = [...new Set(sizes)];

			cropsHTML += 
				`<div class="crops_item">
					<h2 class="crops_item_title">${ file.replace('.twig', '') }</h2>
					<ul class="crops_item_list">`;
			
			for (var x = 0; x < uniqueSizes.length; x++) {
				for (var crop in options.packageJson.img) {
					for (var size in options.packageJson.img[crop]) {
						if ('img.' + crop + '.' + size == uniqueSizes[x]) {
							cropsHTML += 
								`<li class="crop">
									<span class="crop-size">${ options.packageJson.img[crop][size].width }x${ options.packageJson.img[crop][size].height }</span>
									<span class="crop-name">${ crop }.${ size }</span>
								</li>`;
						}
					}
				}
			}

			cropsHTML +=
					`</ul>
				</div>`;
		});
	});

	resultsHTML =
		`<!DOCTYPE html>
		<html lang="en">
			<head>
				<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
				<title>Component Image Crops</title>
				<style>
					html {
						height: 100%;
			
						font-family: "Neue Haas Grotesk Text Std", Helvetica, Arial, sans-serif;
						overflow-y: scroll;
					}
			
					body {
						max-width: 780px;
			
						margin: 0 auto;
						padding: 40px 20px;
					}
					
					.crops_item {
						border: 2px solid #eee;
						margin-bottom: 40px;
					}

					.crops_item_title {
						border-bottom: 1px solid #000;
						margin: 0;
						padding: 21px 20px 20px;
					}

					.crops_item_list {
						list-style: none;
						margin: 0;
						padding: 0;
					}

					.crop {
						padding: 11px 40px;
					}

					.crop:nth-of-type(even) {
						background: #eee;
					}

					.crop-size {}

					.crop-size:after {
						color: #999;
						content: "•";
						display: inline-block;
						margin: 0 6px 0 10px;
						vertical-align: middle;
					}

					.crop-name {}
				</style>
			</head>
			<body>
				<header class="crops_header">
					<h1 class="crops_title">Component Image Crops</h1>
				</header>
				<main class="crops_main">
					<div class="crops_items">
						${ cropsHTML }
					</div>
				</main>
			</body>
		</html>`;
	
	fs.mkdir(options.dest, { 
		recursive: true 
	}, (err) => {
		if (err) throw err;

		fs.writeFile(options.dest + '/' + options.fileName + '.html', resultsHTML, function(err) {
			if (err) throw err;
		});
	});
}