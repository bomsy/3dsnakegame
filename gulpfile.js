var gulp = require('gulp'),
    connect = require('gulp-connect');


gulp.task('startServer', function() {
  return connect.server({
    port: 4003,
    livereload: true
  });
});

gulp.task('stopServer', function() {
  connect.serverStop();
});

gulp.task('reload', function() {
  connect.reload();
});

gulp.task('watch', function() {
  gulp.watch(['*.html', '*.css', '*.js'], ['reload']);
});

gulp.task('default', ['startServer', 'watch']);
