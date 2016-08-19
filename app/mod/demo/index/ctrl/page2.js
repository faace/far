define(function (require, exports, module) {
    module.exports = function (app) {
        app.controller(app.cname, ['$scope', '$location', function ($scope, $location) {
            ge.setTitle('far');
            $scope.isReady = true;
            $scope.goBack = function () {
                $location.path('/demo/index/index');
            };
        }]);
    };
});