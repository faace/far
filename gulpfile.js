/**
 * Created by Faace on 2016/08/11.
 */

var gs = {
    desc: 'build', // desc path
    root: __dirname,
    gulp: require('gulp'),
    connect: require('gulp-connect'),
    less: require('gulp-less'),
    cssmin: require('gulp-cssmin'),
    rename: require('gulp-rename'),
    path: require('path'),
    htmlreplace: require('gulp-html-replace'),
    replace: require('gulp-replace'),
    htmlmin: require('gulp-htmlmin'),
    uglify: require('gulp-uglify'),
    fs: require('fs'),
    del: require('del'),
    through: require('through-gulp')
};


var run = function (gs) {
    gs.gulp.task('clean', function (cb) {
        gs.del([gs.desc], cb);
    });

    gs.gulp.task('less', function () {
        return gs.gulp.src([gs.root + '/static/less/style*.less'])
            .pipe(gs.less())
            .pipe(gs.cssmin())
            .pipe(gs.rename('style.css'))
            .pipe(gs.gulp.dest(gs.root + '/' + gs.desc + '/'));
    });

    var opts = {empty: true, spare: true, quotes: true, collapseWhitespace: true, removeComments: true, minifyJS: true};// html 配置
    var jsminOpt = {mangle: {except: ['define', 'require', 'module', 'exports']}};//js 压缩配置

    function replaceOption() { // 修改样式
        return gs.through(function (file, encoding, callback) {
            var option = process.argv[2];
            var html = file.contents.toString('utf-8');

            if (option == '-test' || option == '-t') {
            } else if (option == '-product' || option == '-pd') {
                html = html.replace(/debug(\s)*\:(\s)*(\d)*/, 'debug: 0')
                    .replace(/VERSION/g, new Date().getTime());
            } else {
                html = html.replace(/debug(\s)*\:(\s)*(\d)*/, 'debug: 1')
                    .replace(/VERSION/g, new Date().getTime());
            }
            file.contents = new Buffer(html);
            this.push(file);
            if (callback) callback();
        });
    }

    gs.gulp.task('index', ['less'], function () {
        gs.gulp.src(gs.root + '/index.html')
            .pipe(replaceOption())
            .pipe(gs.htmlreplace({
                'less': 'static/css/style.css'
            }))
            .pipe(gs.replace(/<link rel="stylesheet" href="(.)*\.css">/g, function () {
                var style = gs.fs.readFileSync('' + gs.desc + '/style.css', 'utf8');
                gs.fs.unlink(gs.desc + '/style.css'); // 删除对应的css
                return '<style>\n' + style + '\n</style>';
            }))
            .pipe(gs.htmlmin(opts))
            .pipe(gs.gulp.dest(gs.root + '/' + gs.desc + ''))
    });

    gs.gulp.task('htmlmin', function () {
        gs.gulp.src([gs.root + '/app/mod/**/*.html'])
            .pipe(gs.htmlmin(opts))
            .pipe(gs.gulp.dest(gs.root + '/' + gs.desc + '/app/mod'))
    });

    gs.gulp.task('core', function () {
        gs.gulp.src([gs.root + '/core/*.js'])
            .pipe(gs.uglify(jsminOpt))
            .pipe(gs.gulp.dest(gs.root + '/' + gs.desc + '/core'))
    });

    gs.gulp.task('static', function () {
        gs.gulp.src([gs.root + '/static/img/*']).pipe(gs.gulp.dest(gs.root + '/' + gs.desc + '/static/img'));
        gs.gulp.src([gs.root + '/favicon.ico']).pipe(gs.gulp.dest(gs.root + '/' + gs.desc + ''));

    });

    gs.gulp.task('js', function () {
        gs.gulp.src([gs.root + '/app/load.js']).pipe(gs.uglify(jsminOpt)).pipe(gs.gulp.dest(gs.root + '/' + gs.desc + '/app'));
        gs.gulp.src([gs.root + '/app/base/*.js']).pipe(gs.uglify(jsminOpt)).pipe(gs.gulp.dest(gs.root + '/' + gs.desc + '/app/base'));
        gs.gulp.src([gs.root + '/app/mod/**/*.js']).pipe(gs.uglify(jsminOpt)).pipe(gs.gulp.dest(gs.root + '/' + gs.desc + '/app/mod'));


    });

    gs.gulp.task('default', ['index', 'htmlmin', 'core', 'static', 'js']);
};

run(gs);
