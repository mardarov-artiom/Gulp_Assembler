'use strict'

const {src, dest, watch} = require('gulp');
const gulp = require('gulp');
const del = require('del');
const plumber = require('gulp-plumber');
const include = require('gulp-include');
const browserSync = require('browser-sync').create();
const scss = require('gulp-sass')(require('sass'));
const importCss = require('gulp-import-css');
const autoprefixer = require('gulp-autoprefixer');
const cleanCss = require('gulp-cleancss');
const uglifyJs = require('gulp-uglify');
const svgmin = require('gulp-svgmin');
const cheerio = require('gulp-cheerio');
const svgSprite = require('gulp-svg-sprite');
const replace = require('gulp-replace');
const cache = require('gulp-cache');
const imagemin = require('gulp-imagemin');
const rename = require("gulp-rename");

const sourcePath = 'src/';
const assetsPath = sourcePath + 'assets/';
const buildPath = 'build/';
const compiledCssName = 'compiled.css';

const path = {
  build: {
    html: buildPath,
    js: buildPath + 'js/',
    css: buildPath + 'css/',
    img: buildPath + 'img/',
    fonts: buildPath + 'fonts/',
    svg: buildPath + 'svg/'
  },
  src: {
    html: sourcePath + '*.html',
    js: sourcePath + 'js/main.js',
    css: assetsPath + 'css/styles.css',
    scss: sourcePath + 'scss/styles.scss',
    scss_css: assetsPath + 'css/',
    img: assetsPath + 'img/**/*.*',
    fonts: assetsPath + 'fonts/**/*.*',
    svg: assetsPath + 'svg/*.svg'
  },
  watch: {
    html: sourcePath + '**/*.html',
    js: sourcePath + 'js/**/*.js',
    scss: sourcePath + 'scss/**/*.scss',
    css: assetsPath + 'css/**/*.css',
    img: assetsPath + 'img/**/*.*',
    fonts: assetsPath + 'fonts/**/*.*',
    svg: assetsPath + 'svg/*.svg'
  },
  clean: './' + buildPath
};

const plumberOptions = {
  handleError: function (err) {
    console.log(err);
    this.emit('end');
  }
};

const autoprefixerOptions = {
  grid: true,
  overrideBrowserslist: ['last 15 versions', 'ie 9', 'android 4', 'opera 12.1'],
  cascade: false
};

function html() {
  return src(path.src.html)
    .pipe(plumber(plumberOptions))
    .pipe(include())
    .pipe(dest(path.build.html))
    .pipe(browserSync.stream());
}

function scssDev() {
  return src(path.src.scss)
    .pipe(plumber(plumberOptions))
    .pipe(scss().on('error', scss.logError))
    .pipe(rename(compiledCssName))
    .pipe(dest(path.src.scss_css))
    .pipe(browserSync.stream());
}

function css() {
  return src(path.src.css)
    .pipe(importCss())
    .pipe(plumber(plumberOptions))
    .pipe(autoprefixer(autoprefixerOptions))
    .pipe(
      cleanCss({
        level: 2
      })
    )
    .pipe(dest(path.build.css))
    .pipe(browserSync.stream());
}

function js() {
  return src(path.src.js)
    .pipe(plumber(plumberOptions))
    .pipe(include())
    .pipe(uglifyJs())
    .pipe(dest(path.build.js))
    .pipe(browserSync.stream());
}

function svg() {
  return src(path.src.svg)
    .pipe(
      svgmin({
        js2svg: {
          pretty: true
        }
      })
    )
    .pipe(
      cheerio({
        run: function ($) {
          $('[fill]').removeAttr('fill');
          $('[stroke]').removeAttr('stroke');
          $('[style]').removeAttr('style');
        },
        parserOptions: {xmlMode: true}
      })
    )
    .pipe(replace('&gt;', '>'))
    .pipe(
      svgSprite({
        mode: {
          symbol: {
            sprite: '../sprite.svg'
          }
        }
      })
    )
    .pipe(dest(path.build.svg));
}

function img() {
  return src(path.src.img)
    .pipe(
      cache(
        imagemin([
          imagemin.gifsicle({interlaced: true}),
          imagemin.mozjpeg({progressive: true}),
          imagemin.optipng({optimizationLevel: 5}),
          imagemin.svgo({plugins: [{removeViewBox: true}]})
        ])
      )
    )
    .pipe(dest(path.build.img))
    .pipe(browserSync.stream());
}

function fonts() {
    return src(path.src.fonts).pipe(dest(path.build.fonts));
}

function clean() {
    return del(path.clean);
}

function watcher() {
    browserSync.init({
        server: {
            baseDir: buildPath
        }
    });

    watch(path.watch.html, html);
    watch(path.watch.scss, scssDev);
    watch(path.watch.css, css);
    watch(path.watch.js, js);
    watch(path.watch.fonts, fonts);
    watch(path.watch.img, img);
    watch(path.watch.svg, svg);
    watch('./**/*.html', browserSync.reload);
}

exports.html = html;
exports.scssDev = scssDev;
exports.css = css;
exports.js = js;
exports.svg = svg;
exports.img = img;
exports.fonts = fonts;
exports.clean = clean;

exports.build = gulp.series(clean, scssDev, gulp.parallel(html, css, js, fonts, img, svg));
exports.watch = gulp.series(clean, scssDev, gulp.parallel(html, css, js, fonts, img, svg, watcher));
