'use strict';

/***************************************************************************
* プラグイン読み込み
***************************************************************************/
var gulp         = require('gulp');
var browserSync  = require('browser-sync');
var cached       = require('gulp-cached');
var pug          = require('gulp-pug');
var plumber      = require('gulp-plumber');
var notify       = require('gulp-notify');
var sass         = require('gulp-sass');
var sassGlob     = require('gulp-sass-glob');
var postcss      = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var sourcemaps   = require('gulp-sourcemaps');
var cleanCSS     = require('gulp-clean-css');
var runSequence  = require('run-sequence');
//var ssi          = require('browsersync-ssi');

/***************************************************************************
* ローカルサーバー起動
***************************************************************************/
gulp.task('server', function () {
  browserSync({
    server: {
      baseDir: './htdocs/',
      // middleware: [
      //   ssi({
      //     baseDir: __dirname + '/htdocs',
      //     ext: ".html"
      //   })
      // ]
    },
    ghostMode: {
      location: true
    },
    open: true
  });
});

/***************************************************************************
* pug コンパイル
***************************************************************************/
gulp.task('pug', function() {
  return gulp
    .src(['./pug/**/*.pug','!./pug/**/_*.pug'])
    .pipe(cached('pug'))
    .pipe(plumber({
      errorHandler: notify.onError('Error: <%= error.message %>')
    }))
    .pipe(pug({
      basedir: './pug/',
      pretty: true
    }))
    .pipe(
      gulp.dest('./htdocs/')
    )
    .pipe(browserSync.reload({
      stream: true
    }));
});

/***************************************************************************
* scss コンパイル
***************************************************************************/
gulp.task('sass', function () {
//   runSequence('compile-sass');
// });


// // scssコンパイル
// gulp.task('compile-sass', function () {
  var processors = [
    autoprefixer({
      browsers: ['last 2 versions']
    })
  ];
  return gulp.src('./scss/**/*.scss')
    .pipe(sassGlob())
    .pipe(sourcemaps.init())
    .pipe(sass({
    outputStyle: 'expanded'
  }).on('error', sass.logError))
  .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
    .pipe(postcss(processors))
    .pipe(sourcemaps.write('../map/'))
    .pipe(gulp.dest('./htdocs/css/'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

/***************************************************************************
* アイコンフォント
***************************************************************************/
gulp.task( 'font', function() {
    var fontName = 'icon';

    return gulp.src( 'dev/icons/*.svg' )
        .pipe( $.iconfont( { fontName: fontName } ) )
            .on( 'codepoints', function( codepoints ) {
                var options = {
                    className: fontName,
                    fontName:  fontName,
                    fontPath:  '../fonts/',
                    glyphs: codepoints
                };

                // CSS
                gulp.src( 'dev/icons/template.css' )
                    .pipe( $.consolidate( 'lodash', options ) )
                    .pipe( $.rename( { basename: fontName } ) )
                    .pipe( gulp.dest( 'dev/css' ) );

                // フォント一覧 HTML
                gulp.src( 'dev/icons/template.html' )
                    .pipe( $.consolidate( 'lodash', options ) )
                    .pipe( $.rename( { basename: 'icon-sample' }))
                    .pipe( gulp.dest( 'src' ) );
            } )
        .pipe( gulp.dest( 'dev/fonts' ) );
} );


/***************************************************************************
* ファイルの監視
***************************************************************************/
gulp.task('watch', ['server'], function() {
  gulp.watch('./pug/**/*.pug', ['pug']);
  gulp.watch('./scss/**/*.scss', ['sass']);
  gulp.watch('./dev/icons/*.svg', ['Iconfont']);
});


/***************************************************************************
* 起動
***************************************************************************/
gulp.task('default', ['watch']);


