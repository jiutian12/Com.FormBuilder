var gulp = require('gulp'),
    less = require('gulp-less'),
    jshint = require('gulp-less');
    concat= require('gulp-concat');
	rename= require('gulp-rename');
	uglify= require('gulp-uglify');
	notify= require('gulp-notify');
	
	minifycss=require('gulp-minify-css');
	
gulp.task('form',function() {
        return gulp.src('css/form_blue.css')  
          	.pipe(concat('form_blue.css'))  //需要操作的文件
            .pipe(rename({suffix: '.min'}))   //rename压缩后的文件名
            .pipe(minifycss())   //执行压缩
            .pipe(gulp.dest('src/css'));   //输出文件夹
});

gulp.task('default', function () {
    gulp.src(['less/bulid.less']) //多个文件以数组形式传入
        .pipe(less())
        .pipe(gulp.dest('dlist/css')); //将会在src/css下生成index.css以及detail.css 
});

gulp.task('testLess1', function () {
    gulp.src(['src/less/light.less'])
        .pipe(less())
        .pipe(gulp.dest('src/css')); //将会在src/css下生成index.css以及detail.css 
});

 

gulp.task('bt', function () {
    gulp.src(['src/bt/less/bootstrap.less'])
        .pipe(less())
        .pipe(gulp.dest('src/bt/dlist')); //将会在src/css下生成index.css以及detail.css 
});

gulp.task('minifycss',function() {
        return gulp.src('src/css/*.css')  
          	.pipe(concat('main.css'))  //需要操作的文件
            .pipe(rename({suffix: '.min'}))   //rename压缩后的文件名
            .pipe(minifycss())   //执行压缩
            .pipe(gulp.dest('src/css'));   //输出文件夹
});

gulp.task('minifycss2',function() {
        return gulp.src('src/css/*.css')  
          	.pipe(concat('main.css'))  //需要操作的文件
            .pipe(minifycss())   //执行压缩
            .pipe(gulp.dest('src/css'));   //输出文件夹
});

gulp.task('js', function() {
  return gulp.src('src/js/*.js')
    .pipe(concat('all.js'))
    .pipe(gulp.dest('dist/js'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'))
    .pipe(notify({ message: 'js task ok' }));
});


gulp.task('lint', function() {
  return gulp.src('src/js/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(notify({ message: 'lint task ok' }));
});

gulp.task('default22', function() {
  return gulp.src('1.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(notify({ message: 'lint task ok' }));
});



gulp.task('liger', function() {
  return gulp.src('liger/*.js')
    .pipe(concat('all.js'))
    .pipe(gulp.dest('dist/js'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'))
    .pipe(notify({ message: 'js task ok' }));
});
gulp.task('pic', function() {
  return gulp.src('liger/jquery-pic.js')
    .pipe(concat('jquery-pic.js'))
    .pipe(gulp.dest('dist/js'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'))
    .pipe(notify({ message: 'js task ok' }));
});


gulp.task('leeui', function() {
  return gulp.src(
  	[
  		'js/Core.js',
  		'js/Drag.js',
  		'js/Resize.js',
  		'js/ToolTip.js',
  		'js/DropMenu.js',
  		'js/Menu.js',
  		'js/ToolBar.js',
  		'js/Tab.js',
  		'js/Messager.js',
  		'js/Dialog.js',
  		'js/Tree.js',
  		'js/Layout.js',
  		'js/TextBox.js',
  		'js/Button.js',
  		'js/CheckBox.js',
  		'js/CheckList.js',
  		'js/Combox.js',
  		'js/DateTime.js',
  		'js/Lookup.js',
  		'js/Popup.js',
  		'js/Radio.js',
  		'js/RadioList.js',
  		'js/Upload.js',
  		'js/Select.js',
  		'js/Spinner.js',
  		'js/Grid.Defaults.js',
  		'js/Grid.js',
  		'js/Grid.Render.js',
  		'js/Pager.js',
  		'js/ListView.js',
  		'js/TreeListView.js'
  		
  	])
    .pipe(concat('leeui.js'))
    .pipe(gulp.dest('dist/js'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'))
    .pipe(notify({ message: 'js task ok' }));
});


var jshint = require("gulp-jshint");  
gulp.task("scripts",function(){  
   gulp.src("js/*.js")  
      .pipe(jshint())  
      .pipe(jshint.reporter("default"))  
});  


gulp.task('bzzx', function() {
  return gulp.src('liger/bzzx.js')
    .pipe(concat('bzzx.js'))
    .pipe(gulp.dest('dist/js'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'))
    .pipe(notify({ message: 'js task ok' }));
});


 
gulp.task('idpcard', function() {
  return gulp.src(
  	[
  		'IDPForm/DealAjax.js',
  		'IDPForm/CodeMgr.js',
  		'IDPForm/GSIDPSession.js',
  		'IDPForm/RemoteCheckData.js',
  		'IDPForm/GSYCOLDEFDESIGN_Ety.js',
  		'IDPForm/pubctrl.js',
  		'IDPForm/base.js',
  		'IDPForm/printbill.js'
  	])
    .pipe(concat('idp.js'))
    .pipe(gulp.dest('dist/js'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'))
    .pipe(notify({ message: 'js task ok' }));
});
