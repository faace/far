// ============================= config begin
var config = {
    port: 80, // listening port
    trackAll: false, // false：only display the file unexist，true: any request
    filter: ['html', 'js', 'css', 'json', 'png', 'jpeg', 'jpg', 'bmp', 'gif', 'ico', 'plist', 'fnt', 'ttf', 'otf', 'woff', 'apk', 'm4a', 'mp3', 'less'],
    version: '0.0.1',
    author: 'faace',
    qq: '5615830',
    date: '2015-12-25'
};
// ============================= config end


var http = require('http');
var path = require('path');
var url = require("url");
var fs = require('fs');

var filterMap = {
    'bmp': 'application/x-bmp',
    'css': 'text/css',
    'doc': 'application/msword',
    'exe': 'application/x-msdownload',
    'gif': 'image/gif',
    'html': 'text/html',
    'ico': 'image/x-icon',
    'java': 'java/*',
    'jpeg': 'image/jpeg',
    'jpg': 'image/jpeg',
    'js': 'application/javascript',
    'm4a': 'audio/m4a',
    'mp3': 'audio/mp3',
    'mp4': 'video/mpeg4',
    'png': 'image/png',
    'txt': 'text/plain',
    'wav': 'audio/wav',
    'less': 'text/html'
};
function OneFlow(req, rsp) {
    this.req = req;
    this.rsp = rsp;
    return this;
}
OneFlow.prototype.rsp404 = function () {
    this.rsp.is404 = true;
    this.rsp.writeHead(404, {'Content-Type': 'text/plain'});
    this.rsp.end('404 error');
};
OneFlow.prototype.track = function () {
    var start = new Date();
    var rsp = this.rsp;
    var req = this.req;
    rsp.end2 = rsp.end;
    rsp.end = function (data) {
        var ts = new Date().getTime() - start.getTime();
        if (rsp.is404) {
            console.info('[404]' + req.url + ' ' + ts + 'ms');
        } else if (config.trackAll) {
            console.info('[req]' + req.url + ' ' + ts + 'ms');
        }
        return rsp.end2(data);
    };
    return rsp;
};
OneFlow.prototype.setContentType = function () {
    var fm = filterMap[this.fileType];
    if (fm) this.rsp.setHeader('content-type', fm);
};
OneFlow.prototype.passFiles = function (pathName) { // 指定后缀的请求直接读取文件，其他的则通过js解释
    var f, s;
    var filter = config.filter;
    for (var i in filter) {
        f = '.' + filter[i];
        s = pathName.substr(-f.length);
        if (s == f) {
            return filter[i];
        }
    }
    return false;
};
OneFlow.prototype.initUrl = function () { // 指定后缀的请求直接读取文件，其他的则通过js解释
    var req = this.req;
    if (req.url.length < 2 || req.url == '/.' || req.url == '/..') { // 默认跳转到index.html
        req.url += 'index.html';
    }
    this.parseUrl = url.parse(req.url, true);

    var name = path.basename(__filename, '.js');
    return !(this.parseUrl.pathname == name + '.js' || this.parseUrl.pathname == name);
};
OneFlow.prototype.handle = function () {
    var req = this.req, rsp = this.rsp;
    rsp.setHeader("Access-Control-Allow-Origin", '*');
    rsp.setHeader("Access-Control-Allow-Headers", 'Origin, X-Requested-With, Content-Type, Accept, devid');
    var url = path.normalize(__dirname + this.parseUrl.pathname);

    if (this.fileType = this.passFiles(this.parseUrl.pathname)) { // 直接读取对应的文件
        if (fs.existsSync(url)) { //
            // console.info(req.headers.accept);
            // rsp.writeHead(200, {"Content-Type": 'image/' + ext});
            this.setContentType();
            var a = fs.readFileSync(url, 'binary'); // 'utf-8'
            rsp.write(a, 'binary');
            return rsp.end();
        } else {
            return this.rsp404(rsp);
        }
    } else {
        if (fs.existsSync(url + '.js')) { // 运行js
            try {
                var func = require(url);
                req.body = this.rawBody;
                req.query = this.parseUrl.query || {};
                return func(req, rsp);
            } catch (e) {
                console.log(e);
                return this.rsp404(rsp);
            }
        } else {
            return this.rsp404(rsp);
        }
    }
};
OneFlow.prototype.process = function () {
    this.track();
    this.req.setEncoding('utf-8'); // 设置接收数据编码格式为 UTF-8
    if (!this.initUrl()) return this.rsp404();
    this.req.addListener("data", function (chunk) { // 数据块接收中
        if (!this.rawBody) this.rawBody = '';
        this.rawBody += chunk;
    }.bind(this));
    this.req.addListener("end", this.handle.bind(this));
};

var server = http.createServer(function (req, rsp) { // 服务启动
    new OneFlow(req, rsp).process();
});

server.listen(config.port);
console.log('server started and listening ' + config.port + '...');