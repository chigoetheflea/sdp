"use strict";

const gulp = require("gulp");
const plumber = require("gulp-plumber");
const sourcemap = require("gulp-sourcemaps");

const less = require("gulp-less");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const csso = require("gulp-csso");
const rename = require("gulp-rename");

const jsmin = require("gulp-jsmin");
const babel = require('gulp-babel');
const htmlmin = require("gulp-htmlmin");

const imagemin = require("gulp-imagemin");
const webp = require("gulp-webp");
const svgstore = require("gulp-svgstore");

const posthtml = require("gulp-posthtml");
const include = require("posthtml-include");

const del = require("del");

const server = require("browser-sync").create();

gulp.task("css", function () {
  return gulp.src("source/less/style.less")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(less())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(gulp.dest("build/css"))
    .pipe(csso())
    .pipe(rename("style.min.css"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("build/css"))
    .pipe(server.stream());
});

gulp.task("js", function () {
  return gulp.src("source/js/scripts.js")
    .pipe(babel({presets: ["@babel/preset-env"]}))
    .pipe(jsmin())
    .pipe(rename("scripts.min.js"))
    .pipe(gulp.dest("build/js"))
});

gulp.task("images", function () {
  return gulp.src("source/img/**/*.{png,jpg,svg}")
    .pipe(imagemin([
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.mozjpeg({progressive: true}),
      imagemin.svgo()
    ]))
    .pipe(gulp.dest("source/img"));
});

gulp.task("webp", function () {
  return gulp.src("source/img/**/*.{png,jpg}")
    .pipe(webp({quality: 85}))
    .pipe(gulp.dest("source/img"));
});

gulp.task("sprite", function () {
  return gulp.src([
      "source/img/**/icon_*.svg",
      "source/img/**/logo_*.svg"
    ], {
      base: "source"
    })
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("build/img"));
});

gulp.task("html", function () {
  return gulp.src("source/*.html")
    .pipe(posthtml([
      include()
    ]))
    //.pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest("build"))
});

gulp.task("copy", function () {
  return gulp.src([
    "source/fonts/**/*.{woff,woff2}",
    "source/img/**",
    "source/js/**",
    "source/*.ico",
    "source/lib/**"
  ], {
    base: "source",
    //ignore: "source/js/scripts.js"
  })
  .pipe(gulp.dest("build"));
});

gulp.task("clean", function () {
  return del("build");
});

gulp.task("refresh", function (done) {
  server.reload();
  done();
});

gulp.task("server", function () {
  server.init({
    server: "build/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("source/less/**/*.less", gulp.series("css"));
  gulp.watch([
    "source/img/icon_*.svg",
    "source/img/logo_*.svg"
  ], gulp.series("sprite", "html", "refresh"));
  gulp.watch("source/*.html", gulp.series("html", "refresh"));
  gulp.watch("source/js/scripts.js", gulp.series("js", "refresh"));
});

gulp.task("themeBuild", function () {
  return gulp.src([
    "build/js/**",
    "build/css/**",
    "build/img/**",
    "build/fonts/**/*.{woff,woff2}",
  ], {
    base: "build"
  })
  .pipe(gulp.dest("../wp-content/themes/sdp/"));
});

gulp.task("build", gulp.series(
  "clean",
  "copy",
  "css",
  "js",
  "sprite",
  "html"
));

gulp.task("wp", gulp.series("build", "themeBuild"));
gulp.task("start", gulp.series("build", "server"));
