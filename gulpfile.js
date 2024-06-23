const proxy = "central-park";
let webPackSetting = true;
let typeScriptSetting = false;


var fs = require('fs');
const gulp = require('gulp');
const rename = require('gulp-rename');
const del = require('del');
const notify = require("gulp-notify");
const plumber = require('gulp-plumber');
const browserSync = require('browser-sync').create();
// pug
const pug = require('gulp-pug');
// css
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
// webpack
const gulpWebpack = require('gulp-webpack');
const webpack = require('webpack');
const webpackConfig = require('./webpack.config.js');
//js
const importFile = require('gulp-file-include');
const uglify = require('gulp-uglify-es').default;

//img
const cache = require('gulp-cache');
const imagemin = require('gulp-imagemin');
const imageminJpegRecompress = require('imagemin-jpeg-recompress');
// const imageminPngquant = require('imagemin-pngquant');
//svg
const svgSprites = require("gulp-svg-sprites");
const cheerio = require('gulp-cheerio');
const cleanSvg = require('gulp-cheerio-clean-svg');
// eslint
const eslint = require('gulp-eslint');

// type script
const browserify = require("browserify");
const source = require('vinyl-source-stream');
const tsify = require("tsify");
const buffer = require('vinyl-buffer');
const glob = require("glob")
const merge = require('merge-stream');
const path = require('path');




const paths = {
    root: './dist',
    templateStyles: {
        main: './src/assets/styles/pages',
    },
    templates: {
        pages: './src/pug/pages/*.pug',
        src: './src/pug/**/*.pug',
        dest: './dist'
    },
    styles: {
        main: './src/assets/styles/main.scss',
        importsFiles: 'src/assets/styles/assets/templates.scss',
        stylesPages: 'src/assets/styles/pages',
        src: './src/**/*.scss',
        dest: './dist/assets/styles'
    },
    scripts: {
        src: './src/**/*.js',
        dest: './dist/assets/scripts/'
    },
    ts: {
        src: './src/assets/scripts/gulp-modules/ts/*.ts',
        dest: './dist/assets/scripts/'
    },
    fonts: {
        src: './src/assets/fonts/**/*',
        dest: './dist/assets/fonts'
    },
    images: {
        src: './src/assets/images/**/*',
        dest: './dist/assets/images'
    },
    svgSprite: {
        src: './src/assets/svg-sprite/*.svg',
        dest: './src/assets/svg-sprite/sprite/'
    },
    gulpModules: {
        src: './src/assets/scripts/gulp-modules/**/*.js',
        dest: './dist/assets/scripts/'
    },
    libs: {
        src: './src/assets/scripts/libs/libs.js',
        dest: './src/assets/scripts/gulp-modules/'
    },
    static: {
        src: './src/static/**/*.*',
        dest: './dist/static/'
    },
}

// слежка
function watch() {
    gulp.watch(paths.templateStyles.main, watchScssTemplates);
    gulp.watch(paths.styles.src, styles);
    gulp.watch(paths.templates.src, templates);
    if (webPackSetting) {
        gulp.watch(paths.scripts.src, scripts); //for webpack
    }
    // gulp.watch(paths.gulpModules.src, gulpModules);
    if (typeScriptSetting) {
        gulp.watch(paths.ts.src, typeScript);
    }

    gulp.watch(paths.ts.src, testJsLint);
    gulp.watch(paths.images.src, images);
    gulp.watch(paths.fonts.src, fonts);
    gulp.watch(paths.libs.src, libs);
    gulp.watch(paths.static.src, static);
    gulp.watch('./src/pug/**/*.html', templates);
    gulp.watch('./src/assets/svg-sprite/*.*', svgSprite);
}

// creater templates scss

function watchScssTemplates() {
    scssTemplateCreater();
    return gulp.src(paths.templates.pages);
    // .pipe(gulp.dest(paths.root));
}

function scssTemplateCreater() {

    fs.readdir(paths.styles.stylesPages, (err, nameFiles) => {
        const filesNameWithoutExt = nameFiles.map(el => el.replace(/\.scss/g, ''));
        const contentImportsFiles = filesNameWithoutExt.reduce((acc, el) => acc += `@import './pages/${el}';\n`, ``);
        console.log(paths.styles.importsFiles, contentImportsFiles);
        fs.writeFile(paths.styles.importsFiles, contentImportsFiles, null, () => {});
    });

};


// следим за build и релоадим браузер
function server() {
    browserSync.init({
      server: {
        baseDir: './',
        serveStaticOptions: {
            extensions: ['html']
        },
        routes: {},
        middleware: function (req, res, next) {
            if (/\.json|\.txt|\.html/.test(req.url) && req.method.toUpperCase() == 'POST') {
                console.log('[POST => GET] : ' + req.url);
                req.method = 'GET';
            }
            next();
        }
      },
      // server: paths.root,
      // notify: false,
      // proxy,
    });
    browserSync.watch(`${paths.root}/**/*.*`, browserSync.reload);
  }
  



// очистка
function clean() {
    return del(paths.root);
}

// pug
function templates() {
    return gulp.src(paths.templates.pages)
        .pipe(pug({ pretty: true }))
        .pipe(gulp.dest(paths.root));
}

// eslint
function testJsLint() {
    return gulp.src(paths.ts.src).
    pipe(eslint()).
    pipe(eslint.format())
        // .pipe(eslint.failAfterError());
}

// scss
function styles() {
    return gulp.src(paths.styles.main)
        .pipe(sourcemaps.init()) // инциализация sourcemap'ов
        .pipe(sass({
            outputStyle: 'expanded' // компиляции в CSS с отступами
        }))
        .on('error', notify.onError({
            title: 'SCSS',
            message: '<%= error.message %>' // вывод сообщения об ошибке
        }))
        .pipe(sourcemaps.write())
        .pipe(rename("main.min.css"))
        .pipe(gulp.dest(paths.styles.dest))
}

// fonts
function fonts() {
    return gulp.src(paths.fonts.src)
        .pipe(gulp.dest(paths.fonts.dest))
}

// php
function static() {
    return gulp.src(paths.static.src)
        .pipe(gulp.dest(paths.static.dest))
}

// svg-sprite
function svgSprite() {
    return gulp.src(paths.svgSprite.src)
        // .pipe(cheerio({
        // 	run: function ($) {
        // 		$('[fill^="#"]').removeAttr('fill');
        // 		$('[style]').removeAttr('style');
        // 	},
        // 	parserOptions: {
        // 		xmlMode: false
        // 	}
        // }))
        .pipe(svgSprites({
            mode: "symbols",
            preview: false,
            selector: "icon-%f",
            svg: {
                symbols: 'symbol_sprite.php'
            }
        }))
        .pipe(gulp.dest(paths.svgSprite.dest))
}

// images
function images() {
    return gulp.src(paths.images.src)
        .pipe(gulp.dest(paths.images.dest));
}

gulp.task('clear', function() {
    return cache.clearAll();
})

// webpack
function scripts() {
    return gulp.src(paths.scripts.src)
        .pipe(gulpWebpack(webpackConfig('development'), webpack))
        .pipe(gulp.dest(paths.scripts.dest));
}

//gulp-scripts
function gulpModules() {
    return gulp.src(paths.gulpModules.src)
        .pipe(plumber({
            errorHandler: notify.onError({
                title: 'JavaScript',
                message: '<%= error.message %>' // выводим сообщение об ошибке
            })
        }))
        .pipe(importFile({ //
            prefix: '@@', // импортим все файлы, описанные в результируещем js
            basepath: '@file' //
        }))
        .pipe(gulp.dest(paths.gulpModules.dest))
}



//ts-scripts
function typeScript() {
    var files = glob.sync(paths.ts.src);
    return merge(files.map(function(file) {
        return browserify({
                entries: file,
                debug: true
            })
            .plugin(tsify)
            .bundle()
            .pipe(source(path.basename(file, '.ts') + ".js"))
            .pipe(buffer())
            .pipe(sourcemaps.init({
                loadMaps: true
            }))
            .pipe(uglify())
            .pipe(sourcemaps.write("./"))
            .pipe(gulp.dest(paths.ts.dest))
    }));
}




//libs-scripts
function libs() {
    return gulp.src(paths.libs.src)
        .pipe(importFile({ //
            prefix: '@@', // импортим все файлы, описанные в результируещем js
            basepath: '@file' //
        }))
        .pipe(uglify())
        .pipe(gulp.dest(paths.libs.dest))
}



exports.templates = templates;
exports.styles = styles;

let additionalTask = [];


if (webPackSetting) {
    exports.scripts = scripts;
    additionalTask.push(scripts)
}
if (typeScriptSetting) {
    exports.typeScript = typeScript;
    additionalTask.push(typeScript)
}



exports.gulpModules = gulpModules;
exports.testJsLint = testJsLint;
exports.images = images;
exports.clean = clean;
exports.fonts = fonts;
exports.svgSprite = svgSprite;
exports.libs = libs;
exports.static = static;
exports.watchScssTemplates = watchScssTemplates;


gulp.task('default', gulp.series(
    watchScssTemplates,
    svgSprite,
    clean,
    libs,
    ...additionalTask,
    gulp.parallel(styles, templates, fonts, gulpModules, testJsLint, images, static),
    gulp.parallel(watch, server)
));


// -- BUILD PRODUCTION
const pathsProd = {
        root: './prod',
        templates: {
            src: './dist/*.html',
            dest: './prod'
        },
        style: {
            src: './dist/assets/styles/*.css',
            dest: './prod/assets/styles',
        },
        js: {
            src: './dist/assets/scripts/*.js',
            dest: './prod/assets/scripts',
        },
        fonts: {
            src: './dist/assets/fonts/**/*',
            dest: './prod/assets/fonts'
        },
        static: {
            src: './dist/static/**/*.*',
            dest: './prod/static/'
        },
        images: {
            src: './dist/assets/images/**/*',
            dest: './prod/assets/images'
        },
    }
    // CLEAN PROD FOLDER
function _clean() {
    return del(pathsProd.root);
}
// HTML
function _templates() {
    return gulp.src(pathsProd.templates.src)
        .pipe(gulp.dest(pathsProd.root));
}
// CSS
function _styles() {
    return gulp.src(pathsProd.style.src)
        .pipe(autoprefixer({
            cascade: false
        }))
        .pipe(cleanCSS())
        .pipe(gulp.dest(pathsProd.style.dest))
}

// FONTS
function _fonts() {
    return gulp.src(pathsProd.fonts.src)
        .pipe(gulp.dest(pathsProd.fonts.dest))
}

// PHP
function _static() {
    return gulp.src(pathsProd.static.src)
        .pipe(gulp.dest(pathsProd.static.dest))
}
// JS
function _scripts() {
    // return gulp.src(pathsProd.js.src)
    // 	.pipe(gulp.dest(pathsProd.js.dest))
    return gulp.src(pathsProd.js.src)
        .pipe(gulpWebpack(webpackConfig('production'), webpack))
        .pipe(gulp.dest(pathsProd.js.dest));
}
// IMG
function _images() {
    return gulp.src(pathsProd.images.src)
        .pipe(cache(imagemin([
            imagemin.gifsicle({
                interlaced: true
            }),
            imagemin.jpegtran({
                progressive: true
            }),
            imageminJpegRecompress({
                loops: 5,
                min: 85,
                max: 95,
                quality: 'high'
            }),
            imagemin.svgo(),
            imagemin.optipng()
        ], {
            verbose: true
        })))
        .pipe(gulp.dest(pathsProd.images.dest))
}

exports._templates = _templates;
exports._fonts = _fonts;
exports._static = _static;
exports._clean = _clean;
exports._scripts = _scripts;
exports._styles = _styles;
exports._images = _images;

gulp.task('prod', gulp.series(
    _clean,
    gulp.parallel(_templates, _fonts, _static, _scripts, _styles, _images)
));