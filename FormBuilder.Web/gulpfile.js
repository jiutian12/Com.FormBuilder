var gulp = require('gulp'),
    less = require('gulp-less'),
    jshint = require('gulp-less');
concat = require('gulp-concat');
rename = require('gulp-rename');
uglify = require('gulp-uglify');
notify = require('gulp-notify');
minifycss = require('gulp-minify-css');


gulp.task('default', function () {
    gulp.src(['less/bulid.less']) //多个文件以数组形式传入
        .pipe(less())
        .pipe(gulp.dest('dlist/css')); //将会在src/css下生成index.css以及detail.css 
});





gulp.task('minifycss', function () {
    return gulp.src('src/css/*.css')
        .pipe(concat('main.css'))  //需要操作的文件
        .pipe(rename({ suffix: '.min' }))   //rename压缩后的文件名
        .pipe(minifycss())   //执行压缩
        .pipe(gulp.dest('src/css'));   //输出文件夹
});

gulp.task('minifycss2', function () {
    return gulp.src('src/css/*.css')
        .pipe(concat('main.css'))  //需要操作的文件
        .pipe(minifycss())   //执行压缩
        .pipe(gulp.dest('src/css'));   //输出文件夹
});


gulp.task('leeui', function () {
    return gulp.src(
        [
            'DList/leeui/js/Core.js',
            'DList/leeui/js/Drag.js',
            'DList/leeui/js/Resize.js',
            'DList/leeui/js/ToolTip.js',
            'DList/leeui/js/DropMenu.js',
            'DList/leeui/js/Menu.js',
            'DList/leeui/js/ToolBar.js',
            'DList/leeui/js/Tab.js',
            'DList/leeui/js/Messager.js',
            'DList/leeui/js/Dialog.js',
            'DList/leeui/js/Tree.js',
            'DList/leeui/js/Layout.js',
            'DList/leeui/js/TextBox.js',
            'DList/leeui/js/Button.js',
            'DList/leeui/js/CheckBox.js',
            'DList/leeui/js/CheckList.js',
            'DList/leeui/js/Combox.js',
            'DList/leeui/js/DateTime.js',
            'DList/leeui/js/Lookup.js',
            'DList/leeui/js/Popup.js',
            'DList/leeui/js/Radio.js',
            'DList/leeui/js/RadioList.js',
            'DList/leeui/js/Upload.js',
            'DList/leeui/js/Select.js',
            'DList/leeui/js/Spinner.js',
            'DList/leeui/js/Grid.Defaults.js',
            'DList/leeui/js/Grid.js',
            'DList/leeui/js/Grid.Render.js',
            'DList/leeui/js/Pager.js',
            'DList/leeui/js/ListView.js',
            'DList/leeui/js/TreeListView.js'

        ])
        .pipe(concat('leeui.js'))
        .pipe(gulp.dest('dist/leeui'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify())
        .pipe(gulp.dest('dist/leeui'))
        .pipe(notify({ message: 'js task ok' }));
});


 
 