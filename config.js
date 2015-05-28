var SECOND = 1000;
module.exports = {
  rootUrl: 'http://api.openweathermap.org/data/2.5',
  cacheExpiresIn: 60 * SECOND
};

// exported routes from rootUrl API
module.exports.routes = {
  current: {
    path: '/weather'
  },
  today: {
    path: '/weather'
  },
  forecast: {
    path: '/forecast'
  },
  'forecast-daily' : {
    path: '/forecast/daily'
  },
  'history-city' : {
    path: '/history/city'
  }
}
