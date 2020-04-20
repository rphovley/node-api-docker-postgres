const gulp = require('gulp')
const ts = require('gulp-typescript')
const gulpWatch = require('gulp-watch')
const nodemon = require('gulp-nodemon')

var sourcemaps = require('gulp-sourcemaps')

const tsProject = ts.createProject('server/src/tsconfig.json')
const DESTINATION = 'server/dist'
function watchNode(done) {
  //Restart node server if changes to file systeym happen
  const stream = nodemon({
    script: '',
    ext: 'js',
    watch: ['./server/**/*.js'],
    ignore: ['node_modules'],
    exec: 'nodemon --nolazy --inspect=0.0.0.0 --nolazy ./server/dist/server.js',
    done,
    verbose: true,
  })

  stream.on('restart', (files) => {
    console.log('files changed, restarting node server: ', files)
  })
}

function compilejs(done) {
  return gulp.src('server/src/**/*.{ts,env}')
    .pipe(sourcemaps.init())
    .pipe(tsProject())
    .pipe(sourcemaps.write('.', { sourceRoot: '../src', includeContent: false}))
    .on('error', () => {
      done()
      process.exit(1)
    })
    .pipe(gulp.dest(DESTINATION))
}

function watch() {
  return gulpWatch('server/src/**/*.ts',compilejs)
}

module.exports = {
  watchNode,
  compilejs,
  watchTs: gulp.series(compilejs, watch),
  default: gulp.series(watchNode)
}


