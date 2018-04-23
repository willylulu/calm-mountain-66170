var gulp = require('gulp'),               // 載入 gulp
    gulpUglify = require('gulp-uglify'),  // 載入 gulp-uglify
    uglifycss = require('gulp-uglifycss'),
    gulpImagemin = require('gulp-imagemin');

gulp.task('script', function () {
    gulp.src('public/js/row/*.js')        // 指定要處理的原始 JavaScript 檔案目錄
        .pipe(gulpUglify())                     // 將 JavaScript 做最小化
        .pipe(gulp.dest('public/js'));  // 指定最小化後的 JavaScript 檔案目錄
});

gulp.task('image', function () {
    gulp.src('public/picture/row/**')
        .pipe(gulpImagemin())
        .pipe(gulp.dest('public/picture'));
});

gulp.task('css', function(){
	return gulp.src('public/css/row/*.css')
		.pipe(uglifycss())
		.pipe(gulp.dest('public/css'));
});