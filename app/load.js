seajs.config({
    base: ge.path.root,
    alias: {},
    map: [[/^(.*\.(?:css|js))(?!\?)(.*)$/i, '$1?' + ge.version]],
    paths: {
        'base': 'app/base',
        'mod': 'app/mod'
    }
});

// local the basic function
(function () {
    seajs.use([
        'base/function',
        'base/ngsea',
        'base/app',
        'base/route',
        'base/service'
    ], function () {
        angular.bootstrap(document, ["app"]);
        if (ge.debug != 2) {
            var url = ge.wxConfigHost + 'jsapi/config.js';
            if (ge.debug == 1) {
                url += '?debug=true';
            }
            seajs.use([url]);

        }
    })
})();
