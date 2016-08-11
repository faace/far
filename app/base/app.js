/**
 * Created by faace on 2016.05.12.
 * QQ: 5615830
 */

define(function (require, exports, module) {
    var app = angular.module('app', ['ngRoute', 'ngSanitize', 'ngsea'])
        .run(['$rootScope', '$timeout', '$ngsea', '$location', function ($rootScope, $timeout, $ngsea, $location) {
            ge.$rootScope = $rootScope;
            $ngsea(app, ge.entry || {}); // set the default home site
            gf.setTitle('');



            $('#initLoad').hide(); // 隐藏首次加载的等待窗口
        }]);
    module.exports = app;
});
