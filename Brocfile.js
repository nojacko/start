var env = process.argv[4] || 'development';

// Import some Broccoli plugins
// - Classes
var ES6Modules          = require('broccoli-es6modules');
var BroccoliSass        = require('broccoli-sass');

// - Functions
var concat              = require('broccoli-concat');
var mergeTrees          = require('broccoli-merge-trees');
var uglifyJavaScript    = require('broccoli-uglify-js');

// Functions
var buildJsLibs = function() {
    return concat('bower_components/', {
        inputFiles: [
            'moment/min/moment.min.js',
            'URIjs/src/URI.js',
            'bag.js/bag.js',
            'external-links-js/ExternalLinks.js',
        ],
        outputFile: '/libs.js',
    });
}

var buildJs = function() {
    return new ES6Modules('resources/javascript', {
        format: 'umd',
        bundleOptions: {entry: 'app.js', name: 'app'}
    });
}

var buildCss = function() {
    return new BroccoliSass(['resources/scss'], 'app.scss', 'app.css', {outputStyle: 'compressed'});
}

// Build
var css = buildCss(),
    js = buildJs(),
    jsLibs = buildJsLibs();

if (env === 'production') {
    js = uglifyJavaScript(js);
    jsLibs = uglifyJavaScript(jsLibs);
}

// Merge the compiled styles and scripts into one output directory.
module.exports = mergeTrees([css, js, jsLibs]);
