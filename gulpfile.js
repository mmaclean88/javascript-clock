var gulp = require('gulp'),
    panini = require('panini'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    sass = require('gulp-sass'),
    minifycss = require('gulp-minify-css'),
    watch = require('gulp-watch');

gulp.task('pages', function() {
  gulp.src('src/pages/**/*.{html,hbs,handlebars}')
    .pipe(panini({
      root: 'src/pages/',
      layouts: 'src/layouts/',
      partials: 'src/partials/',
      helpers: 'src/helpers/',
      data: 'src/data/'
    }))
    .pipe(gulp.dest('dist'));
});

gulp.task('resetPages', function() {
    panini.refresh();
});

gulp.task('minjs', function() {
   gulp.src('src/assets/js/**/*.js')
       .pipe(concat('app.js'))
       .pipe(uglify())
       .pipe(rename({suffix: '.min'}))
       .pipe(gulp.dest('dist/assets/js'))
});

gulp.task('sass', function() {
    gulp.src('src/assets/sass/app.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(minifycss())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('dist/assets/css'));
});

gulp.task('watcher', function() {
    gulp.watch('src/assets/js/*.js', ['minjs']);
    gulp.watch('src/assets/sass/**/*.scss', ['sass']);
    gulp.watch('src/**/*.html', ['resetPages', 'pages']);
});

gulp.task('default', ['pages', 'minjs', 'sass', 'watcher'], function() {
    
});