const gulp = require('gulp')
const cordial = require('@thebespokepixel/cordial')()

// transpilation/formatting
gulp.task('bundle', cordial.macro({
	source: 'src/index.js'
}).bundle())

gulp.task('master', cordial.macro({
	master: true,
	source: 'src/index.js'
}).bundle())

// Clean
gulp.task('clean', cordial.shell({
	source: ['bin/*', 'npm-debug.log', './nyc_output', './coverage']
}).trash())

// Docs
gulp.task('docs', cordial.shell({
	source: 'npm run doc-build'
}).job())

// ReadMe
gulp.task('readme', cordial.shell({
	source: 'npm run readme'
}).job())

gulp.task('cli', gulp.series(
	cordial.format({
		source: 'src/cli.js'
	}).rollup.babel({
		banner: '#! /usr/bin/env node',
		dest: 'bin/compile-readme'
	}),

	cordial.shell().permissions({
		mode: '755',
		dest: 'bin/compile-readme'
	})
))

// Tests
gulp.task('ava', cordial.test().ava(['test/*.js']))
gulp.task('xo', cordial.test().xo(['src/lib/*.js']))
gulp.task('test', gulp.parallel('xo', 'ava'))

// Hooks
gulp.task('start-release', gulp.series('reset', 'clean', 'master', 'cli', 'readme'))
gulp.task('post-flow-release-start', gulp.series('start-release', 'version-release', 'docs', 'commit'))

// Default
gulp.task('default', gulp.series('bump', 'clean', gulp.parallel('docs', 'bundle'), 'cli', 'readme'))
