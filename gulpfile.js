//region Include gulp
var gulp = require('gulp'),
    concat = require('gulp-concat'),
    concatCss = require('gulp-concat-css'),
    rename = require('gulp-rename'),
    sass = require('gulp-ruby-sass'),
    cssmin = require("gulp-clean-css"),
    uglify = require('gulp-uglify'),
    wrap = require("gulp-wrap"),
    autoprefixer = require('gulp-autoprefixer');
//endregion

//region Define base folders www
var src = 'srcApp/',
    dest = 'www/build/',
    bower = 'bower_components/',
    App = 'srcApp/js/app/',
    modules = 'srcApp/js/modules/';

//endregion

//region Define base folders web
var srcWeb = 'srcWeb/',
    destWeb = 'public/build/',
    AppWeb = 'srcWeb/js/app/',
    modulesWeb = 'srcWeb/js/modules/';
//endregion

//region Compile App JS
gulp.task('app', function () {
    console.log('Compiling the Main System.');
    return gulp.src(App + '**/*.js')
    //.pipe(uglify())
        .pipe(wrap('(function(){\n"use strict";\n<%= contents %>\n})();'))
        .pipe(concat('AppProject.js'))
        .pipe(gulp.dest(dest + 'js'));
});

gulp.task('appWeb', function () {
    console.log('Compiling the Main System.');
    return gulp.src(AppWeb + '**/*.js')
    //.pipe(uglify())
        .pipe(wrap('(function(){\n"use strict";\n<%= contents %>\n})();'))
        .pipe(concat('AppProject.js'))
        .pipe(gulp.dest(destWeb + 'js'));
});
//endregion

//region Compile Modules JS
gulp.task('modules', function () {
    console.log('Compiling the Modules System.');
    return gulp.src(modules + '**/*.js')
    //.pipe(uglify())
        .pipe(wrap('(function(){\n"use strict";\n<%= contents %>\n})();'))
        .pipe(concat('modules.js'))
        .pipe(gulp.dest(dest + 'js'));
});

gulp.task('modulesWeb', function () {
    console.log('Compiling the Modules System.');
    return gulp.src(modulesWeb + '**/*.js')
    //.pipe(uglify())
        .pipe(wrap('(function(){\n"use strict";\n<%= contents %>\n})();'))
        .pipe(concat('modules.js'))
        .pipe(gulp.dest(destWeb + 'js'));
});
//endregion

//region Compile Vendor JS
gulp.task('vendor', function () {
    console.log('Compiling the Vendor Dependencies.');
    return gulp.src([
        /*bower + 'jquery/dist/jquery.js',*/
        bower + 'angular/angular.js',
        bower + 'angular-animate/angular-animate.js',
        bower + 'angular-aria/angular-aria.js',
        bower + 'angular-resource/angular-resource.js',
        bower + 'angular-messages/angular-messages.js',
        bower + 'angular/angular-locale_pt-br.js',

        bower + 'angular-material/angular-material.js',
        bower + 'angular-loading-bar/build/loading-bar.js',

        bower + 'moment/moment.js',
        bower + 'moment/locale/pt-br.js',

        bower + 'angular-ui-router/release/angular-ui-router.js',
        bower + 'ui-router-extras/release/ct-ui-router-extras.js',
        bower + 'angular-ui-router-styles/ui-router-styles.js',
        bower + 'angular-ui-router.stateHelper/statehelper.js',

        bower + 'ng-cordova-oauth/dist/ng-cordova-oauth.js'
    ])
        .pipe(concat('vendor.js'))
        .pipe(gulp.dest(dest + 'js'));
});

gulp.task('vendorWeb', function () {
    console.log('Compiling the Vendor Dependencies.');
    return gulp.src([
        /*bower + 'jquery/dist/jquery.js',*/
        bower + 'angular/angular.js',
        bower + 'angular-animate/angular-animate.js',
        bower + 'angular-aria/angular-aria.js',
        bower + 'angular-resource/angular-resource.js',
        bower + 'angular-messages/angular-messages.js',
        bower + 'angular/angular-locale_pt-br.js',

        bower + 'angular-material/angular-material.js',
        bower + 'angular-loading-bar/build/loading-bar.js',

        bower + 'moment/moment.js',
        bower + 'moment/locale/pt-br.js',

        bower + 'angular-ui-router/release/angular-ui-router.js',
        bower + 'ui-router-extras/release/ct-ui-router-extras.js',
        bower + 'angular-ui-router-styles/ui-router-styles.js',
        bower + 'angular-ui-router.stateHelper/statehelper.js',

        bower + 'angular-jwt/dist/angular-jwt.js',

        bower + 'ng-file-upload/ng-file-upload.js',
        bower + 'ng-file-upload/ng-file-upload-shim.js',

        bower + 'angular-material-data-table/dist/md-data-table.js',
    ])
        .pipe(concat('vendor.js'))
        .pipe(gulp.dest(destWeb + 'js'));
});
//endregion

//region Compile CSS from Bower modules
gulp.task('css', function () {
    console.log('Compiling the project CSS in Bower');
    return gulp.src([
        bower + 'angular-material/angular-material.css',
        bower + 'angular-loading-bar/build/loading-bar.css'
    ])
        .pipe(concatCss('bowerCssComponents.css'))
        .pipe(gulp.dest(dest + 'css'));
});

gulp.task('cssWeb', function () {
    console.log('Compiling the project CSS in Bower');
    return gulp.src([
        bower + 'angular-material/angular-material.css',
        bower + 'angular-loading-bar/build/loading-bar.css',
        bower + 'angular-material-data-table/dist/md-data-table.css'
    ])
        .pipe(concatCss('bowerCssComponents.css'))
        .pipe(gulp.dest(destWeb + 'css'));
});
//endregion

//region Compile CSS from Scss files
gulp.task('sass', function () {
    console.log('Compiling the project CSS');
    return sass(src + 'sass/**/*.scss')
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(cssmin())
        .pipe(gulp.dest(dest + 'css'));
});

gulp.task('sassWeb', function () {
    console.log('Compiling the project CSS');
    return sass(srcWeb + 'sass/**/*.scss')
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(cssmin())
        .pipe(gulp.dest(destWeb + 'css'));
});
//endregion

//region Watch for changes in files
gulp.task('watch', function () {
    // Watch App Files
    gulp.watch(App + '**/*.js', ['app']);
    gulp.watch(AppWeb + '**/*.js', ['appWeb']);
    // Watch User Files
    gulp.watch(modules + '**/*.js', ['modules']);
    gulp.watch(modulesWeb + '**/*.js', ['modulesWeb']);
    // Watch .scss files
    gulp.watch(src + 'sass/**/*.scss', ['sass']);
    gulp.watch(srcWeb + 'sass/**/*.scss', ['sassWeb']);
    // Watch vendor files
    gulp.watch(bower + '**/*.js', ['vendor']);
    gulp.watch(bower + '**/*.js', ['vendorWeb']);
    gulp.watch(bower + '**/*.css', ['css']);
    gulp.watch(bower + '**/*.css', ['cssWeb']);
});
//endregion

//region Default Task
gulp.task('default', [
    'vendor',
    'vendorWeb',
    'app',
    'appWeb',
    'modules',
    'modulesWeb',
    'sass',
    'sassWeb',
    'css',
    'cssWeb',
    'watch'
]);
//endregion