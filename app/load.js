seajs.config({
    base: ge.path.root,
    alias: {},
    'map': [[/^(.*\.(?:css|js))(?!\?)(.*)$/i, '$1?' + ge.version]],
    paths: {
        'base': 'app/base',
        'mod': 'app/mod'
    }
});

// local the basic function
var bootstrap_ng = function () {
    seajs.use([
        'base/function',
        'base/ngsea',
        'base/app',
        'base/route',
        'base/service'
    ], function () {
        angular.bootstrap(document, ["app"]);
    })
};
bootstrap_ng();
