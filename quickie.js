var http = require('http');
var Router = require('routes-router');
var st = require('st');
var fs = require('fs');

module.exports = {
  site: function(options) {
    return new QuickySite(options)
  }
}

var QuickySite = function(options) {
  var self = this;

  if(typeof(options) == 'string') {
    self.options = {
      dirname: options
    };
  } else {
    self.options = options;
  }

  self.dirname = self.options.dirname;
  self.staticPrefix = self.options.pages || 'public/';
  self.pagePrefix = self.options.pages || 'pages/';
  self.renderer = self.options.render || null;
  
  self.app = Router();

  self.addRoute = function(match, callback) {
    return self.app.addRoute(match, callback);
  }

  self.renderPage = function(markup, data) {
    if(self.renderer) {
      return self.renderer(markup.toString(), data);
    } else {
      return data;
    }
  }

  self.sendPage = function(req, res, pageName, data) {
    var path = self.pagePrefix + pageName;
    fs.readFile(path + '.html', function (err, markup) {
      if (err) {
        console.log('404: ')
        res.end("404! We can't find that page.");
      } else {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(self.renderPage(markup, data));
      }
    });
  }

  self.initialize = function() {
    self.addRoute("/public/*", st({
      path: self.dirname + "/public",
      url: "/public"
    }));

    self.addRoute('/:pageName', function(req, res, opts){
      return self.sendPage(req, res, opts.params.pageName);
    });

    self.addRoute('/', function(req, res){
      return self.sendPage(req, res, 'index');
    });

    return self;
  }

  self.listen = function(port) {
    var port = port || 3000;

    self.initialize();

    var server = http.createServer(self.app);
    server.listen(port);
    console.log('Server listening at '+port);
  }
}