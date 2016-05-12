/**
 * Created by faace on 2016.05.12.
 * QQ: 5615830
 */
define(function (require, exports, module) {
    angular.module('ngsea', [], ["$controllerProvider", "$compileProvider", "$filterProvider", "$provide",
        function ($controllerProvider, $compileProvider, $filterProvider, $provide) {
            $provide.factory('$ngsea', ['$rootScope', '$q', '$location', '$injector', function ($rootScope, $q, $location, $injector) {
                return function (app, settings) {
                    $rootScope.activeApply = function (fn) {
                        var phase = this.$root.$$phase;
                        if (phase == '$apply' || phase == '$digest') {
                            if (fn && (typeof(fn) === 'function')) fn();
                        } else {
                            this.$apply(fn);
                        }
                    };

                    var defaults = {
                        tpl_path: seajs.data.base + 'app/mod/',
                        tpl_ext: '.html',
                        mod_path: 'mod/',
                        module: 'home',
                        controller: 'index',
                        action: 'index',
                        version: ''
                    };
                    angular.extend(defaults, settings);

                    var register = {
                        controller: $controllerProvider.register,
                        directive: $compileProvider.directive,
                        filter: $filterProvider.register,
                        factory: $provide.factory,
                        service: $provide.service,
                        injector: $injector,
                        decorator: $provide.decorator
                    };
                    ge.register = register; // faacet
                    $rootScope.$on('$routeChangeStart', function (e, target) {
                        var route = target && target.$$route || {};
                        angular.extend(route, route_format(target.params));
                        route.resolve = route.resolve || {};
                        route.resolve.loadedModule = function () {
                            var deferred = $q.defer();
                            seajs.use(route.controllerUrl, function (m) {
                                $rootScope.activeApply(function () {
                                    if (angular.isUndefined(m)) {
                                        deferred.reject(m);
                                        $location.search({});
                                        $location.url('/')
                                    } else {
                                        register.cname = route.cname;
                                        deferred.resolve(angular.isFunction(m) ? m(register, app) : m);
                                    }
                                });
                            });
                            return deferred.promise;
                        }
                    });

                    var route_format = function (params) { // 格式化数据的内容，确定要加载的模块
                        var module = params.module || defaults.module;
                        var controller = params.controller || defaults.controller;
                        var action = params.action || defaults.action;
                        return {
                            controller: module + '_' + controller + '_' + action,
                            templateUrl: defaults.tpl_path + module + '/' + controller + '/view/' + action + defaults.tpl_ext + '?v=' + defaults.version,
                            controllerUrl: defaults.mod_path + module + '/' + controller + '/ctrl/' + action,
                            cname: module + '_' + controller + '_' + action
                        }
                    }
                };
            }]);
        }]);
});
