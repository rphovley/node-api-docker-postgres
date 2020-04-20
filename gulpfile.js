const gulp = require('gulp')
const ts = require('gulp-typescript')
const nodemon = require('gulp-nodemon')
const eslint = require('gulp-eslint')

var sourcemaps = require('gulp-sourcemaps')


const tsProject = ts.createProject('server/src/tsconfig.json')
const DESTINATION = 'server/dist'

function watchNode(done) {
  //Restart node server if changes to file systeym happen
  const stream = nodemon({
    script: '',
    ext: 'ts',
    watch: ['**/*.ts'],
    ignore: ['node_modules', 'migrations', 'scripts', 'seeds', 'test', 'server/dist', 'data'],
    exec: 'nodemon --nolazy --inspect ./server/dist/server.js',
    tasks: ['compilejs'],
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

function lint() {
  return gulp.src(['server/src/**/*.{ts,js}'])
    .pipe(eslint())
    .pipe(eslint.format('codeframe'))
    .pipe(eslint.failAfterError())
}

module.exports = {
  watchNode,
  compilejs,
  lint,
  default: gulp.series(compilejs, watchNode)
}


