define(function (require, exports, module) {
    module.exports = function (app) {
        app.controller(app.cname, ['$scope', '$location', function ($scope, $location) {
            gf.setTitle('far');
            $scope.isReady = true;
            $scope.gotoPage2 = function () {
                $location.path('/demo/index/page2');
            };
        }]);
    };
});