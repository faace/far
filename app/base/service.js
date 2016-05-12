/**
 * Created by faace on 2016.05.12.
 * QQ: 5615830
 */
define(function (require, exports, module) { // 用于截取接收和发送消息
    angular.module('app').factory('requestCheckLine', ['$q', '$rootScope', '$timeout', '$window', '$location', function ($q, $rootScope, $timeout, $window, $location) {
        return {
            responseError: function (rejection) {
                // do something on error
                if (rejection.status === 404) { // 找不到响应的资源
                }

                if (rejection.status === 401) {
                }

                if (rejection.status === 403) { // 无权访问
                }

                if (rejection.status === 406) { // 无权访问
                }

                if (rejection.status === 422) {
                }
                return $q.reject(rejection);
            },
            request: function (request) {
                if (request.url.indexOf('.html') == -1) { // 处理消息头
                    request.headers = request.headers || {}
                }
                return request;
            },
            response: function (response) {
                if (response.data) { // 接收数据的统一处理
                }
                return response;
            }
        };
    }]);
});
