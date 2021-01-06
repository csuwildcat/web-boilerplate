
const fs = require('fs-extra');
const gulp = require('gulp');
const run = require('gulp-run');
const bump = require('gulp-bump');
const concat = require('gulp-concat');
const terser = require('gulp-terser');
const mergeStreams = require('merge-stream');

async function bumpVersion(){
  return gulp.src('./package.json')
          .pipe(bump())
          .pipe(gulp.dest('./'));
}

gulp.task('bump', bumpVersion);
