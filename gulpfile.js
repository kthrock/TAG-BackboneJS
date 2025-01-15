const { src, dest, series, parallel, watch } = require('gulp');
const less = require('gulp-less');
const rename = require('gulp-rename');
const concat = require('gulp-concat');
const clean = require('gulp-rimraf');
const connect = require('gulp-connect');
const handlebars = require('gulp-handlebars');
const wrap = require('gulp-wrap');
const declare = require('gulp-declare');
const cors = require('cors');
const path = require('path');

// Server task
function server() {
    return connect.server({
        root: './www',
        middleware: () => [cors()],
        port: 5000,
        livereload: true
    });
}

// Watch task
function watchFiles() {
    watch('./src', build);
}

// Clean task
function cleanApp() {
    console.log("Clean all files in build folder");
    return src("./dist/*", { read: false, allowEmpty: true })
        .pipe(clean());
}

// LESS to CSS task
function lessCss() {
    return src('./src/less/*.less')
        .pipe(less())
        .pipe(concat('style.css'))
        .pipe(dest('./www/'));
}

// Bootstrap CSS task
function bootstrapCss() {
    return src('./node_modules/bootstrap/dist/css/bootstrap.min.css')
        .pipe(concat('bootstrap.min.css'))
        .pipe(dest('./www/'));
}

// Bootstrap JS task
function bootstrapJs() {
    return src('./node_modules/bootstrap/dist/js/bootstrap.min.js')
        .pipe(concat('bootstrap.min.js'))
        .pipe(dest('./www/libs'));
}

// JavaScript files task
function jsAll() {
    return src([
        './src/models/*.js',
        './src/views/*.js',
        './src/routes/*.js'
    ])
        .pipe(concat('app.js'))
        .pipe(dest('./www/'));
}

// JavaScript libraries task
function jsLibs() {
    return src('./src/libs/**/*')
        .pipe(dest('./www/libs'));
}

// Images task
function images() {
    return src('./src/images/**/*')
        .pipe(dest('./www/images'));
}

// Img task
function img() {
    return src('./src/img/**/*')
        .pipe(dest('./www/img'));
}

// Resources task
function res() {
    return src('./src/res/**/*')
        .pipe(dest('./www/res'));
}

// Index file task
function index() {
    return src('./src/index.html')
        .pipe(dest('./www/'));
}

// Handlebars templates task
function templates() {
    return src('./src/template/*.hbs')
        .pipe(handlebars())
        .pipe(wrap('Handlebars.template(<%= contents %>)'))
        .pipe(declare({
            namespace: 'Handlebars.templates',
            noRedeclare: true // Avoid duplicate declarations
        }))
        .pipe(concat('template.js'))
        .pipe(dest('./www/'));
}

// Handlebars partials task
function partials() {
    return src('./src/template/partial/_*.hbs')
        .pipe(handlebars())
        .pipe(wrap('Handlebars.registerPartial(<%= processPartialName(file.relative) %>, Handlebars.template(<%= contents %>));', {}, {
            imports: {
                processPartialName: function(fileName) {
                    return JSON.stringify(path.basename(fileName, '.hbs').substr(1));
                }
            }
        }))
        .pipe(concat('partial.js'))
        .pipe(dest('./www/'));
}

// Build task
const build = parallel(jsAll, jsLibs, lessCss, bootstrapCss, bootstrapJs, templates, partials, images, img, res, index);

// Default task
exports.default = series(build, cleanApp, parallel(server, watchFiles));

// Export individual tasks
exports.server = server;
exports.watch = watchFiles;
exports.cleanApp = cleanApp;
exports.lessCss = lessCss;
exports.bootstrapCss = bootstrapCss;
exports.bootstrapJs = bootstrapJs;
exports.jsAll = jsAll;
exports.jsLibs = jsLibs;
exports.images = images;
exports.img = img;
exports.res = res;
exports.index = index;
exports.templates = templates;
exports.partials = partials;
exports.build = build;
