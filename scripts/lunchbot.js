// Commands:
//   lunchbot hi
//   lunchbot bye
//   lunchbot What's for lunch today?|I need some lunch options|
//            Give me some lunch suggestions
//   lunchbot find

var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
var greetings = [
  'Happy %day, %user!', 'Hello %user. What a beautiful %day!', 'Hi %user. Finally it\'s %day!',
];
var leaveMsgs = [
  'Bon appetit, %user.', 'Have a heavenly day, %user!', 'Bye %user. Hope to see you soon!',
];
var errorMsgs = [
  'Uh oh! Looks like I\'ve gotten all turned around finding suggestions',
];

var apiBaseUrl = 'https://api.foursquare.com/v2/venues/search?';

var baseParams = {
  client_id: process.env.CLIENT_ID,
  client_secret: process.env.CLIENT_SECRET,
  v: '20180808',
  m: 'swarm',
  ll: '40.7537571,-73.9783438',
  radius: 500,
  intent: 'browse',
  limit: 5,
};

var cuisineOptions = {
  A: {
    label:'American/Italian',
    keys: {
      american: '4bf58dd8d48988d14e941735',
      italian: '4bf58dd8d48988d110941735',
    },
    confirmMsg: 'Magnifico!',
  },
  B: {
    label: 'Asian (Chinese, Japanese, Korean, Vietnamese)',
    keys: {
      chinese: '4bf58dd8d48988d145941735',
      japanese: '4bf58dd8d48988d111941735',
      korean: '4bf58dd8d48988d113941735',
      vietnamese: '4bf58dd8d48988d14a941735',
    },
    confirmMsg: 'Chuc an ngon mieng!',
  },
  C: {
    label: 'Indian/Pakistani',
    keys: {
      indian: '4bf58dd8d48988d10f941735',
      pakistani: '52e81612bcbc57f1066b79f8',
    },
    confirmMsg: 'achchhee bhookh!',
  },
  D: {
    label: 'Latin American (Mexican, Peruvian, Brazilian)',
    keys: {
      mexican: '4bf58dd8d48988d1c1941735',
      peruvian: '4eb1bfa43b7b52c0e1adc2e8',
      brazilian: '4bf58dd8d48988d16b941735',
    },
    confirmMsg: 'Bom proveito!'
  },
  E: {
    label: 'Middle Eastern (Turkish, Persian)',
    keys: {
      turkish: '4f04af1f2fb6e1c99f3db0bb',
      persian: '52e81612bcbc57f1066b79f7',
    },
    confirmMsg: 'iyi iştah!',
  }
};
var cuisineKey; // One of A|B|C|D|E
var answerListener;
var searchResults = [];

// Helper functions
var getDay = function() {
  var today = new Date();
  return days[today.getDay()];
};

var askPreferences = function(res, robot) {
  var user = res.message.user.name;
  var question = 'OK %user, what type of cuisine you feel like?'.replace('%user', user);
  var options = '';
  Object.keys(cuisineOptions).forEach(function(key) {
    options += key + '. ' + cuisineOptions[key].label + '\n';
  });

  res.send(question);
  res.send(options);

  // This is to prevent the listener from firing multiple times
  if (!answerListener) {
    answerListener = robot.hear(/[abcde]/i, function(res) {
      var confirmMsg = getPreference(res);
      if (confirmMsg) res.send(confirmMsg);

      var categoryIds = cuisineOptions[cuisineKey].keys;
      var params = Object.assign({}, baseParams, {categoryId: Object.values(categoryIds).join(',')});

      getLunchSpots(robot, res, params)
        .then(function() {
          getSelection(robot);
        });
    });
  }
};

var getPreference = function(res) {
  cuisineKey = (res.message.text || 'A').toUpperCase();
  var value = cuisineOptions[cuisineKey];

  if (!value) {
    cuisineKey = null;
    return null;
  } else {
    return 'You picked ' + value.label + '. Let me see what\'s good around here.';
  }
};

var getSelection = function(robot) {
  answerListener = robot.hear(/[12345]/i, function(res) {
    var selection = res.message.text;
    var selectedVenue = searchResults[selection - 1];
    // console.warn('GET SELECTION', selectedVenue);
    res.send('You picked ' + selectedVenue.name + '!');
    getLunchSpot(robot, res, selectedVenue);
  });
};

var compileQueryString = function(params) {
  var queryString = '';
  for (var field in params) {
    queryString += field + '=' + params[field] + '&';
  };
  return queryString;
};

var parseVenue = function(res, body) {
  var response = JSON.parse(body).response;
  var venue = response.venue || {};
  const data = {
    'url': venue.url,
    'address': venue.location.formattedAddress.join(', '),
    'phone number': venue.contact.formattedPhone,
    'price range': venue.price.message,
    'rating': venue.rating,
  };

  for (key in data) {
    res.send(key + ': ' + data[key]);
  }
}

var parseVenues = function(res, body) {
  var response = JSON.parse(body).response;
  searchResults = response.venues || [];

  res.send('I found ' + searchResults.length + (searchResults.length === 1 ? ' location' : ' locations'));
  searchResults.forEach(function(venue, index) {
    var name = venue.name;
    var location = venue.location.address ? ' at ' + venue.location.address : '';
    var distance = '(aprox. ' + Math.ceil(venue.location.distance / 100) + ' minute walk)';
    res.send((index + 1) + '. ' + name + location  + ' | ' + distance);
  });
  res.send(cuisineOptions[cuisineKey].confirmMsg);
}

var getLunchSpot = function(robot, res, selectedVenue) {
  var apiDetailsUrl = apiBaseUrl.replace('search?', selectedVenue.id) + '?';

  robot.http(apiDetailsUrl + compileQueryString(baseParams))
    .header('Accept', 'application/json')
    .get()(function(err, response, body) {
      if (err) {
        res.send(res.random(errorMsgs));
      }
      parseVenue(res, body);
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
        parseVenues(res, body);
        resolve();
      });
  });
};

module.exports = function(robot) {
  // Check user preferences
  robot.respond(/(.*lunch|.*options)/i, function(res) {
    askPreferences(res, robot);
  });

  // Venue queries
  robot.respond(/find( (\w+))/i, function(res) {
    var params = Object.assign({}, baseParams, {query: res.match[2]});
    getLunchSpots(robot, res, params);
  });

  // Greetings and goodbye
  robot.respond(/(hi|hello|hola|wassup|what's up)/i, function(res) {
    var greeting = res.random(greetings);
    var user = res.message.user.name;
    greeting = greeting.replace('%user', user).replace('%day', getDay());

    res.send(greeting);
  });

  robot.respond(/(goodbye|bye|adios|ta ta)/i, function(res) {
    var user = res.message.user.name;
    var reply = res.random(leaveMsgs).replace('%user', user);
    res.send(reply);
  });

  robot.respond(/.*(good|nice)/, function(res) {
    var reply = 'Aww, thank you %user.'.replace('%user', res.message.user.name);
    res.send(reply);
  });
};
