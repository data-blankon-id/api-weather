var request = require("hyperquest");
var joi = require("joi");

var ROOT_URL = "http://api.openweathermap.org/data/2.5";
var SECOND = 1000;
var qs = require("querystring");

var Weather = function(server, options, next) {
  this.server = server;
  this.options = options || {};
  this.registerEndPoints();
  this.query = {
    q: joi.string().insensitive().required()
  }

  function openweather(type, query, next) {
    var r = request(ROOT_URL + '/' + type + '?' + query);
    var data = '';
    r.on('data', function(chunk){
      data += chunk;
    });
    r.on('end', function(){
      if (query.indexOf("mode=xml")>=0) {
        return next(null, data);
      }
      var obj = {};
      try {
        obj = JSON.parse(data);
      } catch (ex) {
        return next(ex);
      }
      next(null, obj);
    });
    r.on('error', next);
  }
  server.method('openweather', openweather, {
    cache: {
      expiresIn: 60 * SECOND
    }
  }); 

}

Weather.prototype.registerEndPoints = function() {
  var self = this;
  self.server.route({
    method: "GET",
    path: "/weather/current",
    config: {
      handler: function(req, res) {
        self.server.methods.openweather("weather", qs.stringify(req.query), function(err, data) {
          var type = "application/json";
          if (req.query && req.query.mode == "xml") {
            type = "text/xml";
          }
          res(err || data).type(type);
        });
      },
      query: self.query
    }
  });
  self.server.route({
    method: "GET",
    path: "/weather/forecast",
    config: {
      handler: function(req, res) {
        self.server.methods.openweather("forecast", qs.stringify(req.query), function(err, data) {
          var type = "application/json";
          if (req.query && req.query.mode == "xml") {
            type = "text/xml";
          }
          res(err || data).type(type);
        });
      },
      query: self.query
    }
  });
}

exports.register = function(server, options, next) {
  new Weather(server, options, next);
  next();
};

exports.register.attributes = {
  pkg: require(__dirname + "/package.json")
};


