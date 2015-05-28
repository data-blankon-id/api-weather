var Code = require('code');
var Hapi = require('hapi');
var Lab = require('lab');

var lab = exports.lab = Lab.script();
var it = lab.it;
var expect = Code.expect;
var describe = lab.describe;

describe('openweathermap API', function(){
  // http://openweathermap.org/forecast
  it ('should not call the current weather data', function(done){
    var server = new Hapi.Server();
    server.connection();
    server.register(require('../'), function(err) {
      var options = {
        method: 'GET',
        url: '/weather/current'
      };
      server.inject(options, function(res){
        expect(res.statusCode).to.equal(404);
        done();
      });
    });
  });
  it ('should not call the current weather data - event when the mode equals xml', function(done){
    var server = new Hapi.Server();
    server.connection();
    server.register(require('../'), function(err) {
      var options = {
        method: 'GET',
        url: '/weather/current?q=&mode=xml'
      };
      server.inject(options, function(res){
        expect(res.statusCode).to.equal(404);
        done();
      });
    });
  });
  it ('should get the current weather data', function(done){
    var cityName = 'Bandung';
    var server = new Hapi.Server();
    server.connection();
    server.register(require('../'), function(err) {
      var options = {
        method: 'GET',
        url: '/weather/current?q=' + cityName
      };
      server.inject(options, function(res){
        expect(res.statusCode).to.equal(200);
        done();
      });
    });
  });
  it ('should get the current weather data in xml format', function(done){
    var cityName = 'Bandung';
    var server = new Hapi.Server();
    server.connection();
    server.register(require('../'), function(err) {
      var options = {
        method: 'GET',
        url: '/weather/current?q=' + cityName + '&mode=xml'
      };
      server.inject(options, function(res) {
        expect(res.headers['content-type'].indexOf('xml')).to.above(0);
        expect(res.statusCode).to.equal(200);
        done();
      });
    });
  });
  // http://openweathermap.org/forecast
  // 5 and 16 days forecast
  it ('should call forecast data for one location, by city-name, 5 days with data every 3 hours forecast data', function(done){
    var cityName = 'Bandung';
    var server = new Hapi.Server();
    server.connection();
    server.register(require('../'), function(err) {
      var options = {
        method: 'GET',
        url: '/weather/forecast?q=' + cityName
      };
      server.inject(options, function(res){
        expect(res.statusCode).to.equal(200);
        done();
      });
    });
  });
  it ('should call forecast data for one location, by city-id, 5 days with data every 3 hours forecast data', function(done){
    var cityId = 524901;
    var server = new Hapi.Server();
    server.connection();
    server.register(require('../'), function(err) {
      var options = {
        method: 'GET',
        url: '/weather/forecast?id=' + cityId
      };
      server.inject(options, function(res){
        expect(res.statusCode).to.equal(200);
        done();
      });
    });
  });
  it ('should call forecast data for one location, by city-lat-lng, 5 days with data every 3 hours forecast data', function(done){
    var cityLatLng = 'lat=35&lon=139';
    var server = new Hapi.Server();
    server.connection();
    server.register(require('../'), function(err) {
      var options = {
        method: 'GET',
        url: '/weather/forecast?' + cityLatLng
      };
      server.inject(options, function(res){
        expect(res.statusCode).to.equal(200);
        done();
      });
    });
  });
  it ('should call forecast data for one location, by city-name, 7 days daily forecast data', function(done){
    var cityName = 'Bandung';
    var server = new Hapi.Server();
    server.connection();
    server.register(require('../'), function(err) {
      var options = {
        method: 'GET',
        url: '/weather/forecast/daily?q=' + cityName + '&cnt=' + 7
      };
      server.inject(options, function(res){
        expect(res.statusCode).to.equal(200);
        done();
      });
    });
  });
  // skipped since the upstream api is error
  it.skip ('should call history data for one location, by city-name', function(done){
    var cityName = 'Bandung';
    var server = new Hapi.Server();
    server.connection();
    server.register(require('../'), function(err) {
      var options = {
        method: 'GET',
        url: '/weather/history/city?q=London,UK'
      };
      server.inject(options, function(res){
        expect(res.statusCode).to.equal(200);
        done();
      });
    });
  });
});

