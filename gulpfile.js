import gulp from 'gulp'
import plumber from 'gulp-plumber'
import notify from 'gulp-notify'
import browserSync from 'browser-sync'
import fileinclude from 'gulp-file-include'
import del from 'del'
import dartSass from 'sass'
import gulpSass from 'gulp-sass'
import rename from 'gulp-rename'
import cleanCss from 'gulp-clean-css'
import autoprefixer from 'gulp-autoprefixer'
import groupCssMediaQueries from 'gulp-group-css-media-queries'
import imagemin from 'gulp-imagemin'
import ttf2woff from 'gulp-ttf2woff'
import ttf2woff2 from 'gulp-ttf2woff2'
import fs from 'fs'
import webpack from 'webpack-stream'
const css = gulpSass(dartSass)
//path
const buildFolder = './build'
const srcFolder = './src'
const path = {


   build: {
      html: `${buildFolder}/`,
      css: `${buildFolder}/assets/css/`,
      img: `${buildFolder}/assets/img/`,
      imgFiles: `${buildFolder}/assets/img/**/*.*`,
      fontsFiles: `${buildFolder}/assets/fonts/*.*`,
      js: `${buildFolder}/js/`,
      fonts: `${buildFolder}/assets/fonts/`,
      php: `${buildFolder}/php/`
   },
   src: {
      html: `${srcFolder}/*.html`,
      sass: `${srcFolder}/scss/main.scss`,
      img: `${srcFolder}/img/**/*.*`,
      js: `${srcFolder}/js/*.js`,
      fonts: `${srcFolder}/fonts/*.ttf`,
      css: `${srcFolder}/scss/css/*.css`,
      php: `${srcFolder}/php/**/*.php`
   },
   watch: {
      html: `${srcFolder}/**/*.html`,
      sass: `${srcFolder}/scss/**/*.scss`,
      js: `${srcFolder}/js/**/*.js`,
      php: `${srcFolder}/js/**/*.php`
   },
   clean: {
      html: `${buildFolder}/*.html`,
      js: `${buildFolder}/js/`,
      css: `${buildFolder}/assets/css/`,

   },
   cleanAll: buildFolder,
   buildFolder: buildFolder,
   srcFolder: srcFolder,
}

//plugins
const plugins = {
   plumber: plumber,
   notify: notify,
   browsersync: browserSync,
}

//global

global.app = {
   path: path,
   gulp: gulp,
   plugins: plugins,
}

//tasks
//html
const html = () => {
   return app.gulp.src(app.path.src.html)
      .pipe(app.plugins.plumber(
         app.plugins.notify.onError({
            title: "HTML",
            message: "Error <%= error.message %>"
         })
      ))
      .pipe(fileinclude())
      //.pipe(webphtml())
      .pipe(app.gulp.dest(app.path.build.html))
      .pipe(app.plugins.browsersync.stream())
}
//js
const js = () => {
   return app.gulp.src(app.path.src.js)
      .pipe(app.plugins.plumber(
         app.plugins.notify.onError({
            title: "JS",
            message: "Error <%= error.message %>"
         })
      ))
      .pipe(webpack({
         mode: 'development',
         output: {
            filename: 'app.min.js',
         }
      }))
      .pipe(app.gulp.dest(app.path.build.js))
      .pipe(app.plugins.browsersync.stream())
}
//clean
async function reset () {
   del(app.path.clean.html)
   del(app.path.clean.css)
   del(app.path.clean.js)
}
//clean all folder
const resetAll = () => {
   return del(app.path.cleanAll)
}
//sass
const sass = () => {
   return app.gulp.src(app.path.src.sass, { sourcemaps: true })
      .pipe(app.plugins.plumber(
         app.plugins.notify.onError({
            title: "SASS",
            message: "Error <%= error.message %>"
         })
      ))
      .pipe(css({
         outputStyle: 'expanded'
      }))
      .pipe(groupCssMediaQueries())
      .pipe(autoprefixer({
         grid: true,
         overrideBrowserslist: ['last 3 version'],
         cascade: true
      }))
      .pipe(app.gulp.dest(app.path.build.css))
      .pipe(cleanCss())
      .pipe(rename({
         extname: '.min.css'
      }))
      .pipe(app.gulp.dest(app.path.build.css))
      .pipe(app.plugins.browsersync.stream())
}

const server = (done) => {
   app.plugins.browsersync.init({
      server: {
         baseDir: `${app.path.build.html}`
      },
      notify: false,
      port: 3000
   })
}

//fonts
const fonts = () => {
   return app.gulp.src(app.path.src.fonts)
      .pipe(ttf2woff())
      .pipe(app.gulp.dest(app.path.build.fonts))
      .pipe(app.gulp.src(app.path.src.fonts))
      .pipe(ttf2woff2())
      .pipe(app.gulp.dest(app.path.build.fonts))
}

async function fontsStyle(params) {
   let file_content = fs.readFileSync(srcFolder + '/scss/_fonts.scss')
   if (file_content == '') {
      fs.writeFile(srcFolder + '/scss/_fonts.scss', '', cb)
      return fs.readdir(app.path.build.fonts, function (err, items) {
         if (items) {
            let c_fontname
            for (let i = 0; i < items.length; i++) {
               let fontname = items[i].split('.')
               fontname = fontname[0]
               if (c_fontname != fontname) {
                  fs.appendFile(srcFolder + '/scss/_fonts.scss', '@include font("' + fontname + '", "' + fontname + '", "400", "normal");\r\n', cb);
               } c_fontname = fontname
            }
         }
      })
   }
}
function cb() {

}
//img
const img = () => {
   return app.gulp.src(app.path.src.img)
      .pipe(app.gulp.dest(app.path.build.img))
      .pipe(app.gulp.src(app.path.src.img))
      .pipe(
         imagemin({
            progressive: true,
            svgoPlugins: [{ removeViewBox: false }],
            interlaced: true,
            optimizationLevel: 3
         }))
      .pipe(app.gulp.dest(app.path.build.img))
}
//watch
function watcher() {
   gulp.watch(path.watch.html, html)
   gulp.watch(path.watch.sass, sass)
   gulp.watch(path.watch.js, js)
   gulp.watch(path.watch.php, php)
}

//copy css modules
const copyCss = () => {
   return app.gulp.src(app.path.src.css)
      .pipe(app.gulp.dest(app.path.build.css))
}
// copy php files

const php = () => {
   return app.gulp.src(app.path.src.php)
      .pipe(app.gulp.dest(app.path.build.php))
}
//run
const main = gulp.parallel(html, sass, js, fonts, img , php)
const build = gulp.series(resetAll, main, fontsStyle, gulp.parallel(watcher, server))
const dev = gulp.series(reset,html,sass,js,copyCss,php,gulp.parallel(watcher, server))

gulp.task('default', dev)
gulp.task('build', build)
gulp.task('image', img)
gulp.task('fonts', fonts, fontsStyle)