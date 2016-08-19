/**
 * Created by faace on 2016.05.12.
 * QQ: 5615830
 */
define(function () {
    var _ios_set_title = function (title) {
        var $body = $('body');
        document.title = title;
        var $iframe = $('<iframe src="./favicon.ico"></iframe>').hide().on('load', function () {
            setTimeout(function () {
                $iframe.off('load').remove()
            }, 0)
        }).appendTo($body)
    };

    var fn = { // define some public functions
        getQueryString: function (key) { // get the query string from the url
            var reg = new RegExp("(^|[&|?])" + key + "=([^&]*)(&|$)", "i");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return unescape(r[2]);
            return null;
        },
        checkDevice: function () { // check the device
            var mobile = 'other';
            var sUserAgent = navigator.userAgent.toLowerCase();
            if (sUserAgent.match(/iphone os/i)) {
                mobile = 'iphone'
            } else if (sUserAgent.match(/android/i)) {
                mobile = 'android'
            } else if (sUserAgent.match(/ipad/i)) {
                mobile = 'ipad'
            } else if (sUserAgent.match(/midp/i)) {
                mobile = 'midp'
            } else if (sUserAgent.match(/rv:1.2.3.4/i)) {
                mobile = 'rv'
            } else if (sUserAgent.match(/ucweb/i)) {
                mobile = 'ucweb'
            } else if (sUserAgent.match(/windows ce/i)) {
                mobile = 'wince'
            } else if (sUserAgent.match(/windows mobile/i)) {
                mobile = 'winphone'
            }
            return mobile;
        },
        setTitle: function (title) {
            ge.$rootScope.site_title = title && (title);
            if (['iphone', 'ipad'].indexOf(ge.checkDevice()) > -1) _ios_set_title(ge.$rootScope.site_title)
        },
        use: function (url, cb) { // load a script or css
            seajs.use(url, function () {
                if (cb) ge.$rootScope.$apply(cb);
            });
        }
    };
    for (var key in fn) {
        ge[key] = fn[key];
    }
});
