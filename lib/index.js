var request = require('hyperquest');
var config = require('../config');
var qs = require('querystring');
var boom = require('boom');
var joi = require('joi');

var Weather = function(server, options, next) {
  this.server = server;
  this.options = options || {};
  this.registerEndPoints();

  function openweather(type, query, next) {
    var r = request(config.rootUrl + type + '?' + query);
    var data = '';
    var contentType = 'application/json';
    var statusCode = 200;
    r.on('data', function(chunk){
      data += chunk;
    });
    r.on('response', function(res){
      statusCode = res.statusCode;
      contentType = res.headers['content-type'];
    });
    r.on('end', function(){
      var obj = {};
      obj.isXml = contentType.indexOf('xml') >= 0;
      obj.data = data;
      try {
        obj.data = JSON.parse(data);
      } catch (ex) {
        obj.parsed = {
          cod: statusCode 
        };
        return next(obj.isXml ? null : ex, obj);
      }
      next(null, obj);
    });
    r.on('error', next);
  }
  server.method('openweather', openweather, {
    cache: {
      expiresIn: config.cacheExpiresIn
    }
  });
}

Weather.prototype.registerEndPoints = function() {
  var self = this;
  function createHandler(path) {
    return function(req, reply) {
      self.server.methods.openweather(path, qs.stringify(req.query), function(err, result) {
        result.parsed = result.parsed || result.data || {};
        if (result.parsed.cod != 200)
          err = new Error(result.parsed.message);
        if (err)
          err = boom.wrap(err, result.parsed.cod || 500);
        var response = reply(err, result.data);
        if (result.isXml)
          response.type('application/xml');
      });
    }
  }
  for (var route in config.routes) {
    var cfg = config.routes[route];
    self.server.route({
      method: 'GET',
      path: '/weather/' + route.split('-').join('/'),
      config: {
        tags: ['api'],
        description: cfg.description || 'No description yet.',
        notes: cfg.notes || 'No notes yet.',
        handler: createHandler(cfg.path),
        validate: cfg.validate || {}
      }
    });
  }
}

exports.register = function(server, options, next) {
  new Weather(server, options, next);
  next();
};

exports.register.attributes = {
  pkg: require(__dirname + "/../package.json")
};
