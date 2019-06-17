// Foursquare config
var apiBaseUrl = 'https://api.foursquare.com/v2/venues/search?';
var baseParams = {
  client_id: process.env.CLIENT_ID,
  client_secret: process.env.CLIENT_SECRET,
  v: '20180808',
  m: 'swarm',
  ll: '40.7537571,-73.9783438',
  radius: 500,
  intent: 'browse',
  limit: 10,
};

var parseVenues = function(res, response) {
  searchResults = response.venues || [];
  res.send(
    'I found ' + searchResults.length + ' location' +
    (searchResults.length > 1 ? 's:' : ':')
  );

  var message = '';
  searchResults.forEach(function(venue, index) {
    var name = venue.name;
    var location = venue.location.address ? ' at ' + venue.location.address : '';
    var minutes = Math.ceil(venue.location.distance / 100);
    var distance = '(approx. ' + minutes + '-minute walk)';
    message += (index + 1) + '. ' + name + location  + ' ' + distance + '\n';
  });
  res.send(message);
};

var getDetailedInfo = function(robot, res, venue) {
  var apiDetailsUrl = apiBaseUrl.replace('search?', venue.id) + '?';

  robot.http(apiDetailsUrl + compileQueryString(baseParams))
    .header('Accept', 'application/json')
    .get()(function(err, response, body) {
      if (err) {
        res.send(res.random(errorMsgs));
      }
      parseVenue(res, JSON.parse(body).response);
    });
};

var getLunchSpots = function(robot, res, params) {
  return new Promise(function(resolve, reject) {
    robot.http(apiBaseUrl + compileQueryString(params))
      .header('Accept', 'application/json')
      .get()(function(err, response, body) {
        if (err) {
          res.send(res.random(errorMsgs));
          reject(err);
        }
        var resp = JSON.parse(body).response;
        parseVenues(res, resp);
        resolve();
      });
  });
};

/* Helper functions */
var compileQueryString = function(params) {
  var queryString = '';
  for (var field in params) {
    queryString += field + '=' + params[field] + '&';
  };
  return queryString;
};

var parseVenue = function(res, response) {
  var venue = response.venue;
  if (!venue) {
    res.send(res.random(errorMsgs));
    return;
  }

  res.send(venue.location.address);
  res.send('Price range: ' + venue.price.message + ' | Rating: ' + venue.rating);
  res.send('*' + cuisineOptions[cuisineKey].confirmMsg + '*');
};

