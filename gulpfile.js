const gulp = require('gulp'),
    del = require('del'),
    cache = require('gulp-cache'),
    less = require('gulp-less'), //comment or uncomment
    // sass = require('gulp-sass'), // what you want to use
    // sass.compiler = require('node-sass'),
    watch = require('gulp-watch'),
    plumber = require('gulp-plumber'),
    include = require('gulp-file-include'),
    autoprefixer = require('gulp-autoprefixer'),
    svgSprite = require('gulp-svg-sprite'),
    svgmin = require('gulp-svgmin'),
    cheerio = require('gulp-cheerio'),
    replace = require('gulp-replace'),
    cleanCss = require('gulp-cleancss'),
    uglifyJs = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    browserSync = require('browser-sync').create();

const path = {
    build: {
        html: 'build/',
        js: 'build/js/',
        css: 'build/css/',
        img: 'build/img/',
        fonts: 'build/fonts/',
        svg: 'build/svg/'
    },
    src: {
        html: 'src/*.html',
        js: 'src/js/main.js',
        css: 'src/css/main.css',
        less: 'src/less/main.less',
        less_css: 'src/css/partials/',
        // sass: 'src/sass/main.sass',
        // sass_css: 'src/css/partials/',
        img: 'src/img/**/*.*',
        fonts: 'src/fonts/**/*.*',
        svg: 'src/svg/*.svg'
    },
    watch: {
        html: 'src/**/*.html',
        js: 'src/js/**/*.js',
        less: 'src/less/**/*.less',
        // sass: 'src/sass/**/*.sass',
        css: 'src/css/**/*.css',
        img: 'src/img/**/*.*',
        fonts: 'src/fonts/**/*.*',
        svg: 'src/svg/*.svg'
    }
};

const plumberOptions = {
    handleError: function(err) {
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
    return gulp
        .src(path.src.html)
        .pipe(plumber(plumberOptions))
        .pipe(include())
        .pipe(gulp.dest(path.build.html))
        .pipe(browserSync.stream());
}

function lessDev() {
    return gulp
        .src(path.src.less)
        .pipe(plumber(plumberOptions))
        .pipe(less())
        .pipe(gulp.dest(path.src.less_css))
        .pipe(browserSync.stream());
}

// function sassDev() {
//     return gulp.src(path.src.less)
//         .pipe(plumber(plumberOptions))
//         .pipe(sass().on('error', sass.logError))
//         .pipe(gulp.dest(path.src.less_css))
//         .pipe(browserSync.stream());
// };

function css() {
    return gulp
        .src(path.src.css)
        .pipe(plumber(plumberOptions))
        .pipe(include())
        .pipe(autoprefixer(autoprefixerOptions))
        .pipe(
            cleanCss({
                level: 2
            })
        )
        .pipe(gulp.dest(path.build.css))
        .pipe(browserSync.stream());
}

function js() {
    return gulp
        .src(path.src.js)
        .pipe(plumber(plumberOptions))
        .pipe(include())
        .pipe(uglifyJs())
        .pipe(gulp.dest(path.build.js))
        .pipe(browserSync.stream());
}

function svg() {
    return gulp
        .src(path.src.svg)
        .pipe(
            svgmin({
                js2svg: {
                    pretty: true
                }
            })
        )
        .pipe(
            cheerio({
                run: function($) {
                    $('[fill]').removeAttr('fill');
                    $('[stroke]').removeAttr('stroke');
                    $('[style]').removeAttr('style');
                },
                parserOptions: { xmlMode: true }
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
        .pipe(gulp.dest(path.build.svg));
}

function img() {
    return gulp
        .src(path.src.img)
        .pipe(
            cache(
                imagemin([
                    imagemin.gifsicle({ interlaced: true }),
                    imagemin.jpegtran({ progressive: true }),
                    imagemin.optipng({ optimizationLevel: 5 }),
                    imagemin.svgo({ plugins: [{ removeViewBox: true }] })
                ])
            )
        )
        .pipe(gulp.dest(path.build.img))
        .pipe(browserSync.stream());
}

function fonts() {
    return gulp.src(path.src.fonts).pipe(gulp.dest(path.build.fonts));
}

function clean() {
    return del(['build/']);
}

function watcher() {
    browserSync.init({
        server: {
            baseDir: 'build/'
        }
    });

    gulp.watch(path.watch.html, html);
    gulp.watch(path.watch.less, lessDev);
    // gulp.watch(path.watch.sass, sassDev);
    gulp.watch(path.watch.css, css);
    gulp.watch(path.watch.js, js);
    gulp.watch(path.watch.fonts, fonts);
    gulp.watch(path.watch.img, img);
    gulp.watch(path.watch.svg, svg);
    gulp.watch('./**/*.html', browserSync.reload);
}

gulp.task(
    'default',
    gulp.series(clean, html, lessDev, /* sassDev, */ css, js, fonts, svg, img, watcher)
);
gulp.task('build', gulp.series(clean, html, /* sassDev, */ lessDev, css, js, fonts, img, svg));
