var gulp = require('gulp'),
    minifycss = require('gulp-minify-css'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    del = require('del'),
    imagemin = require('gulp-imagemin');


gulp.task('minifycss', function() {
  return gulp.src('src/css/*.css').pipe(rename({suffix: '.min'}))
      .pipe(minifycss())  //执行压缩
      .pipe(gulp.dest('assets/css')).pipe(notify({ message: 'css task complete' }));
});

gulp.task('minifyjs', function() {
  return gulp.src('src/js/*/*.js')
      .pipe(uglify())    //压缩
      .pipe(gulp.dest('assets/js')).pipe(notify({ message: 'js task complete' }));
});

gulp.task('images', function() {
  return gulp.src('src/img/*')
      .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
      .pipe(gulp.dest('assets/img'))
      .pipe(notify({ message: 'Images task complete' }));
});


gulp.task('clean', function(cb) {
  del(['assets/css', 'assets/js','assets/img'], cb);
});

gulp.task('default', function() {
  gulp.src('src/js/require.js').pipe(gulp.dest('assets/js'));
  gulp.start('minifycss', 'minifyjs','images');
});




gulp.task('watch', function() {
  gulp.watch('src/css/*.css', ['minifycss']);
  gulp.watch('src/js/*/*.js', ['minifyjs']);
  gulp.watch('src/img/*', ['images']);

});