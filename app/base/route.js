/**
 * Created by faace on 2016.05.12.
 * QQ: 5615830
 */
define(function (require, exports, module) {
    angular.module('app').config(['$routeProvider', '$httpProvider', function ($routeProvider, $httpProvider) {
        $routeProvider
            .when('/', {})
            .when('/:module', {})
            .when('/:module/', {})
            .when('/:module/:controller', {})
            .when('/:module/:controller/', {})
            .when('/:module/:controller/:action', {});
        $httpProvider.interceptors.push('requestCheckLine');
    }]);
});
