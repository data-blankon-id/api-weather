var Hapi = require('hapi');
var server = new Hapi.Server();
server.connection({port : process.env.PORT || 3000});
server.register({
  register: require('lout')
}, function(err){
  if (err) throw err;
});
server.register({
  register: require('./plugins/weather'),
  options: {
  }
}, function(err){
  if (err) throw err;
});
server.start(function(){
  console.log('->', server.info.uri);
});
