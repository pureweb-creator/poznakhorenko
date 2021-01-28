var
    gulp         = require("gulp"),
    rename       = require("gulp-rename"),
    autoprefixer = require("gulp-autoprefixer"),
    sourcemaps   = require("gulp-sourcemaps"),
    uglify       = require("gulp-uglify"),
    browserSync  = require("browser-sync").create(),
    sass         = require("gulp-sass"),
    log          = require('fancy-log'),
    critical     = require('critical').stream;

// Generate & Inline Critical-path CSS
gulp.task('critical', () => {
  return gulp
    .src('*.html')
    .pipe(
      critical({
        base: './',
        inline: true,
        css: ['css/main.min.css'],
      })
    )
    .on('error', err => {
      log.error(err.message);
    })
    .pipe(gulp.dest('./'));
});

function livereload(done){
    browserSync.init({
        server: {
            baseDir: "./"
        },
        port: 3000
    });  
    
    done();
}

function browserReload(done){
    browserSync.reload();
    done();
}

function build(done){
    gulp.src("./scss/**/*.scss")
        .pipe(sourcemaps.init())
        .pipe(sass({
            errorLogToConsole: true,
            outputStyle: "compressed"
        }))
        .on("error", console.error.bind(console))
        .pipe(autoprefixer(["last 15 versions", "> 1%", "ie 8", "ie 7"], { cascade: true }))
        .pipe(rename({suffix: ".min"}))
        .pipe(sourcemaps.write("./"))
        .pipe(gulp.dest("./css/"))
        .pipe(browserSync.stream());

    done();
}  

function jsBuild(done){
	gulp.src('./js/**/main.js')
		.pipe(sourcemaps.init())
		.pipe(uglify())
		.pipe(rename({suffix: ".min"}))
		.pipe(sourcemaps.write("./"))
		.pipe(gulp.dest("./js/"))
		.pipe(browserSync.stream());

	done();	
}

function watch(){
    gulp.watch("./scss/**/*.scss", build);
    gulp.watch("./*.html", browserReload);
    gulp.watch("./js/**/main.js", jsBuild);
    gulp.watch("php/**/*.php", browserReload);
}

gulp.task("default", gulp.parallel(watch, livereload, critical));
gulp.task(livereload);