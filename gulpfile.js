// Initialize Modules
const gulp = require('gulp');
const { src, dest, watch, series, parallel } = require('gulp');
const clean = require('gulp-clean');
const browserSync = require('browser-sync').create();
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const concat = require('gulp-concat');
const postcss = require('gulp-postcss');
const replace = require('gulp-replace');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');
const useref = require('gulp-useref');
const nunjucksRender = require('gulp-nunjucks-render');
const prettyHtml = require('gulp-pretty-html');
const gulpif = require('gulp-if');


// File Path Variables
const files = {
    vendorPath: 'app/assets/vendor/**/*',
    vendorSass: 'app/assets/vendor/**/*.scss',
    scssPath: 'app/assets/scss/**/*.scss',
    jsPath: 'app/assets/js/**/*.js',
    fontPath: 'app/assets/fonts/**/*.{eot,svg,ttf,woff,woff2}',
    imagePath: 'app/assets/images/**/*',
    distImagePath: 'dist/assets/images/**/*',
    htmlPath: 'dist/**/*.html',
    njkPath: 'app/views/**/*.+(html|nunjucks|njk)',
    njkPages: 'app/views/pages/**/*.+(html|nunjucks|njk)',
}

// Sass task
function scssTask() {
    return src(files.scssPath)
        .pipe(sourcemaps.init())
        .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
        .pipe(postcss([autoprefixer(), cssnano()]))
        .pipe(sourcemaps.write('.'))
        .pipe(dest('dist/assets/css'));
}

// Vendor Sass task
function vendorScssTask() {
    return src(files.vendorSass)
        .pipe(sourcemaps.init())
        .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
        .pipe(postcss([autoprefixer(), cssnano()]))
        .pipe(sourcemaps.write('.'))
        .pipe(dest('dist/assets/css'));
}

// js task
function jsTask() {
    return src(files.jsPath)
        .pipe(dest('dist/assets/js'));
}

// Move Vendor Files to dist For Client
function vendorMove() {
    return src(files.vendorPath)
        .pipe(dest('dist/assets/vendor'));
}

// Move Sass Files to dist For Client
function scssMove() {
    return src(files.scssPath)
        .pipe(dest('dist/assets/sass'));
}

function sendMailMove() {
    return src("app/mail/**/*")
        .pipe(dest('dist/mail'));
}

//Clean Images
function imageClean() {
    return src('dist/assets/images/', { read: false, allowEmpty: true })
        .pipe(clean({ force: true }))
}

//Image Task
function imageTask() {
    return src(files.imagePath)
        .pipe(gulp.dest('dist/assets/images'))
}

// Html Task
const cbString = new Date().getTime();
function htmlTask() {
    return src(files.njkPages)
        .pipe(nunjucksRender({
            path: ['app/views']
        }))
        .pipe(replace(/cb=\d+/g, 'cb=' + cbString))
        .pipe(prettyHtml({
            indent_size: 4,
            indent_char: ' ',
            unformatted: ['code', 'pre', 'em', 'strong', 'span', 'i', 'b', 'br'],
            extra_liners: ['head', 'body'],
            max_preserve_newlines: 1
        }))
        .pipe(dest('dist'));
}

// Combine Everything
function combineTask() {
    return src(files.htmlPath)
        .pipe(useref())
        .pipe(gulpif('*.js', uglify()))
        .pipe(dest('dist'));
}

// browser Sync: To Initialize
function serve(done) {
    browserSync.init({
        port: 3001,
        server: {
            baseDir: './dist',
        }
    });
    done();
}

// browser Sync: To Reload
function reload(done) {
    browserSync.reload();
    done();
}

// watch task
function watchTask() {
    watch([files.scssPath, files.jsPath, files.imagePath, files.njkPath],
        parallel(scssTask, jsTask, imageTask, htmlTask, reload)
    );
}

// #########################################################
// Default Tasks =======================================
// #########################################################
exports.default = series(
    vendorScssTask,
    parallel(scssTask, jsTask, htmlTask),
    scssMove,
    sendMailMove,
    vendorMove,
    imageTask,
    reload,
    serve,
    watchTask
);

exports.combine = series(
    combineTask,
    reload
);

// #########################################################
// Non Default Tasks =======================================
// #########################################################

//Image Compression Task
gulp.task('optimize', () => {
    return gulp.src(files.imagePath)
        .pipe(imagemin([
            imagemin.gifsicle({ interlaced: true }),
            imagemin.mozjpeg({ quality: 75, progressive: true }),
            imagemin.optipng({ optimizationLevel: 5 }),
            imagemin.svgo({
                plugins: [
                    { removeViewBox: true },
                    { cleanupIDs: false }
                ]
            })
        ]))
        .pipe(gulp.dest('dist/assets/images'))
});

// Clean Everything
gulp.task('clean', function () {
    return gulp.src('./dist', { read: false })
        .pipe(clean());
});
