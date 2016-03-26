var Promise = require('bluebird')
var fs = Promise.promisifyAll(require('fs-extra'))
var Gaze = require('gaze').Gaze
var objmerge = require('merge'), original, cloned
var runSequence = require('run-sequence')
var rename = require("gulp-rename")
 
var
  watch = require('watch'),
  header = require('gulp-header'),
  path = require('path'),
  gulp = require('gulp'),
  sass = require('gulp-sass'),
  jade = require('gulp-jade-php'),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify'),
  merge = require('merge-stream'),
  streamqueue = require('streamqueue'),
  run = require('run-sequence'),
  gulpif = require('gulp-if'),
  ProgressBar = require('progress')

var production = false 

var root = process.cwd()
var theme = {}

function load_theme() {
  return new Promise(function(resolve, reject) {
    fs.readJsonAsync(path.join(root, 'theme.json'))
      .then(function(content) {
        theme = content
        theme.locked = true
        theme.copy_registry = []
        theme.watch_registry = []
        theme.jade_registry = []
        theme.jade_src_registry = []
        theme.jade_watchers = []
        // npm
        for (var mod in theme.copy.from_npm) {
          for (var subj in theme.copy.from_npm[mod]) {
            theme.copy_registry.push([
              path.join(root, 'node_modules', mod, theme.copy.from_npm[mod][subj].from),
              path.join(theme.dist, theme.copy.from_npm[mod][subj].to)
            ])
          }
        }
        // bower
        for (var mod in theme.copy.from_bow) {
          for (var subj in theme.copy.from_bow[mod]) {
            theme.copy_registry.push([
              path.join(root, 'bower_components', mod, theme.copy.from_bow[mod][subj].from),
              path.join(theme.dist, theme.copy.from_bow[mod][subj].to),
            ])
          }
        }
        // res
        for (var res in theme.copy.from_res) {
          theme.copy_registry.push([
            path.join(root, 'res', theme.copy.from_res[res].from),
            path.join(theme.dist, theme.copy.from_res[res].to),
          ])
        }
        // src
        for (var src in theme.copy.from_src) {
          theme.copy_registry.push([
            path.join(root, 'src', theme.copy.from_src[src].from),
            path.join(theme.dist, theme.copy.from_src[src].to),
          ])
        }
        // build watch registry
        for (var i = 0; i < theme.copy_registry.length; i++) {
          theme.watch_registry.push(theme.copy_registry[i][0])
          if (fs.lstatSync(theme.watch_registry[i]).isDirectory()) theme.watch_registry[i] += '**'
        }
        //jade globs
        for (var i in theme.jade.main_globs) {
          theme.jade_registry.push([
            path.join(root, theme.jade.main_globs[i]),
            path.join(theme.dist)
          ])
          theme.jade_src_registry.push(
            path.join(root, theme.jade.main_globs[i])
          )
        }
        for (var i in theme.jade.sub_globs) {
          theme.jade_registry.push([
            path.join(root, theme.jade.sub_globs[i].from),
            path.join(theme.dist, theme.jade.sub_globs[i].to)
          ])
          theme.jade_src_registry.push(
            path.join(root, theme.jade.sub_globs[i].from)
          )
        }
        resolve()
      })
      .catch(function(param) {
        reject()
      })
  })
}
var init = load_theme()

function copy() {
  return new Promise(function(resolve, reject) {
    var handler = function(err) {
      if (err) console.log("error during file copying: " + err)
      reject()
    }
    var promises = []
    for (var i = 0; i < theme.copy_registry.length; i++) {
      promises.push(fs.copyAsync(theme.copy_registry[i][0], theme.copy_registry[i][1]).catch(handler))
    }
    Promise.all(promises).then(resolve()).catch(reject())
  })
}

// function jade_watch(from, to) {
//   return new Promise(function(resolve, reject) {
//     var promises = []
//     for (var i = 0 i < theme.jade_registry.length i++) {
//       promises.push(
//         function() {
//           return new Promise(function(resolve, reject) {
//             theme.jade_watchers.push(new Gaze(theme.jade_registry[i][0]))
//             theme.jade_watchers[theme.jade_watchers.length-1].on('all', function(event, filepath) { })
//           })
//         }
//       )
//     }
//     Promise.all(promises).then(resolve()).catch(reject())
//   })
// }
///////////////////////////////////////////////////////////////////////////////
// function jade_dir(from, to) {
//   return new Promise(function(resolve, reject) {
//     from = path.join(root, from)
//     to = path.join(theme.dist, to)
//     console.log(theme.general_locals)
//     console.log(theme.jade.locals)
//     var foo = merge(theme.general_locals, theme.jade.locals)
//     console.log('merged:'+foo)
//     gulp.src(from)
//       .pipe(jade({
//         locals: foo
//       }))
//       .pipe(gulp.dest(to))
//     resolve()
//   })
// }
// function jade_dirs() {
//   return new Promise(function(resolve, reject) {
//     var promises = []
//     for (var i = 0 i < theme.jade_registry.length i++) {
//       promises.push(jade_dir(theme.jade_registry[i][0], theme.jade_registry[i][1]))
//     }
//     Promise.all(promises).then(resolve())
//   })
// }
function jade_dir(from, to) {
  // from = path.join(root, from)
  // to = path.join(theme.dist, to)
  console.log(theme.general_locals)
  console.log(theme.jade.locals)
  var foo = theme.jade.locals
  console.log('merged:'+foo)
  console.log('starting dulp-jade-php: "'+from+'"->"'+to+'"')
  return gulp.src(from)
    .pipe(jade({
      locals: foo
    }))
    .pipe(gulp.dest(to))
}
function jade_dirs() {
  var streams=[]
  for (var i = 0; i < theme.jade_registry.length; i++) {
    streams.push(jade_dir(theme.jade_registry[i][0], theme.jade_registry[i][1]))
  }
  return merge(streams)
}

function get_header() {
  var out = ""
  out += "/*\n"
  out += "Theme Name: " + theme.meta.themeName + '\n'
  out += "Theme URI: " + theme.meta.themeURI + '\n'
  out += "Author: " + theme.meta.author + '\n'
  out += "Author URI: " + theme.meta.authorURI + '\n'
  out += "Description: " + theme.meta.description + '\n'
  out += "Version: " + theme.meta.version + '\n'
  out += "License: " + theme.meta.license + '\n'
  out += "License URI: " + theme.meta.licenseURI + '\n'
  out += "Tags: "
  for (var i = 0; i < theme.meta.tags.length; i++) {
    out += theme.meta.tags[i]
    if (i + 1 < theme.meta.tags.length) out += ', '
  }
  out += '\n'
  out += "Text Domain: " + theme.meta.textDomain + '\n'
  out += '\n' + theme.meta.postScriptum + '\n*/'
  return out
}

gulp.task('copy', function() {
  return new Promise(function(resolve, reject) {
    copy().then(resolve)
  })
})
gulp.task('copy:watch', function() {
  gulp.watch(theme.watch_registry, ['copy'])
})
gulp.task('sass', function() {
  console.log(path.join(root, theme.sass.style_css_src))
  return merge(
    gulp.src(path.join(root, theme.sass.main_files_glob))
      .pipe(sass().on('error', sass.logError))
      .pipe(gulp.dest(path.join(theme.dist, theme.sass.main_files_dist))),
    gulp.src(path.join(root, theme.sass.style_css_src))
      .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
      .pipe(header(get_header()))
      .pipe(rename("style.css"))
      .pipe(gulp.dest(path.join(theme.dist))))
})
gulp.task('sass:watch', function() {
  // gulp.watch(path.join(root, theme.sass.main_files_glob), ['sass'])
  gulp.watch([path.join(root, 'src/**/*.scss'),path.join(root, 'src/**/*.sass'),path.join(root, 'res/**/*.scss')], ['sass'])
})
gulp.task('jade', function() {
  return jade_dirs()
})
// gulp.task('jade:watch', function() {
//   return gulp.watch(theme.jade_registry, ['jade'])
// })
gulp.task('jade:watch', function() {
  return gulp.watch(root+'/**/*.jade', ['jade'])
})
gulp.task('default',['develop'], function() {
})
gulp.task('clean', function() {
  fs.emptyDirSync(theme.dist)
})
gulp.task('build', function() {
   init.then(function() {runSequence(
    'clean',
    ['sass', 'jade', 'copy'])},function (par,ams) {
      
    })
})
gulp.task('develop', function() {
     init.then(function() {runSequence(
    'clean',
    ['sass', 'jade', 'copy'],
    ['sass:watch', 'jade:watch', 'copy:watch'])})
})
