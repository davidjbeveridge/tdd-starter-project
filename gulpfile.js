var gulp = require('gulp')
var shell = require('gulp-shell')
var _ = require('underscore')

var paths = {
  js: {
    all: ['*.js', '**/*.js']
  }
}

gulp.task('default', ['spec-watch'])

var localPath = function (path) {
  return path.replace(process.cwd()+'/', '')
};
var isSpec = function (path) {
  return /.*_spec\.js$/.test(path)
}

var makeSpecPath = function (path) {
  var specPath = path.replace(/^src\//, 'spec/').replace(/\.js$/, '_spec.js')
  if(!/^spec\//.test(specPath)) {
    return 'spec/'+specPath
  }
  return specPath
}

var mocha = function (path) {
  gulp.src(path).pipe(shell([
    'node_modules/.bin/mocha --color -r ./spec/spec_helper <%= file.path %>'
  ]))
};

gulp.task('spec-watch', function () {
  gulp.watch(paths.js.all, _.throttle(function (event) {
    var fs = require('fs')
    if (event.type === 'changed') {
      var path = localPath(event.path);
      if (isSpec(path)) {
        mocha(path)
      } else {
        var specPath = makeSpecPath(path)
        if (fs.existsSync(specPath)) {
          mocha(specPath)
        }
      }
    }
  }))
})
