//Déclarations des variables

var gulp          =	require('gulp');
var sass          = require('gulp-sass');
var autoprefixer  =	require('gulp-autoprefixer');
// var htmlmin       = require('gulp-htmlmin');         // Minify html
var cleanCSS      = require('gulp-clean-css');
var plumber       = require('gulp-plumber');            // Error notifications in terminal
var notify        = require("gulp-notify");             // Error beautifyer
var browserSync   =	require("browser-sync");            // Browser live reload
var uglify        = require("gulp-uglify");             //
var rename        = require("gulp-rename");             // Renaming file
// var fileinclude =   require('gulp-file-include');
var imagemin      = require('gulp-imagemin');           // Minify all images
var jshint        = require('gulp-jshint');
var sourcemaps    = require('gulp-sourcemaps');         // Sourcemaps for browser inspection

// Fonctionnalités

gulp.task('optimisation', () =>
    gulp.src('src/img/*')
        .pipe(imagemin({ 
          interlaced: true,
          progressive: true,
          optimizationLevel: 6,
          svgoPlugins: [{removeViewBox: false}, {cleanupIDs: false}]
        }))
        .pipe(gulp.dest('dist/img'))
);

gulp.task('transformcss', function () {			//On donne un nom à la tâche
  return gulp.src('src/css/scss/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(plumber({errorHandler: notify.onError("Erreur: <%= error.message %>")}))
    .pipe(sass())
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist/css'));
});

gulp.task('uglification', function () {     //On donne un nom à la tâche
    return gulp.src('src/js/*.js')
      .pipe(plumber({errorHandler: notify.onError("Erreur: <%= error.message %>")}))
      .pipe(jshint())
      .pipe(jshint.reporter('jshint-stylish'))
      .pipe(jshint.reporter('fail'))
      // .pipe(rename(function(path){
      //   path.basename += ".min";
      // }))
      .pipe(uglify())
      .pipe(gulp.dest('dist/js'));
});

gulp.task('minify', function() {
  return gulp.src('src/*.html')
    
    // .pipe(fileinclude({
    //   prefix: '@@',
    //   basepath: '@file'
    // }))

    // .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('dist'));
});

gulp.task('sync', function() {
    browserSync.init({
        browser: "google chrome",
        server: {
            baseDir: "dist"
        }
    });
});

// Surveille et lance

gulp.task('watch', ['sync', 'minify', 'transformcss', 'optimisation'], function () {
  gulp.watch('src/img/*', ['optimisation']);
  gulp.watch('src/css/scss/**/*.scss', ['transformcss']); // Je surveille tous les fichiers scss pour les sassifier
  gulp.watch('src/js/*.js', ['uglification']);
  gulp.watch('src/*.html', ['minify']);
  gulp.watch("dist/*.html").on('change', browserSync.reload);
  gulp.watch("dist/css/*.css").on('change', browserSync.reload);
  gulp.watch('dist/js/*.js').on('change', browserSync.reload);
  gulp.watch('dist/img/*').on('change', browserSync.reload);
});

gulp.task('default',['watch']); //Je dis ce qu'il se passe lorsqu'on tape "Gulp"