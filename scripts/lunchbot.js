// Commands:
//   lunchbot hi
//   lunchbot bye
//   lunchbot What's for lunch today?|I need some lunch options|
//            Give me some lunch suggestions

var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
var greetings = [
  'Happy %day, %user!', 'Hello %user. What a beautiful %day!', 'Hi %user. Finally it\'s %day!',
];
var leaveMsgs = [
  'Bon appetit, %user.', 'Have a heavenly day, %user!', 'Bye %user. Hope to see you soon!',
];

var cuisineOptions = {
  A: 'American/Italian',
  B: 'Asian (Chinese, Japanese, Korean, Vietnamese)',
  C: 'Indian/Pakistani',
  D: 'Latin American (Mexican, Peruvian, Brazilian)',
  E: 'Middle Eastern (Turkish, Persian)',
};
var cuisineKey; // One of A|B|C|D|E

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
    options += key + '. ' + cuisineOptions[key] + '\n';
  });

  res.send(question);
  res.send(options);

  robot.hear(/[abcde]/i, function(res) {
    var confirm = getPreference(res);
    if (confirm) res.send(confirm);
  });
};

var getPreference = function(res) {
  cuisineKey = (res.message.text || 'A').toUpperCase();
  var value = cuisineOptions[cuisineKey];

  if (!value) {
    cuisineKey = null;
    return null;
  } else {
    return 'You picked ' + value + '. Let me see what\'s good around here.';
  }
};

module.exports = function(robot) {
  // Check user preferences
  robot.respond(/(.*lunch|.*options)/i, function(res) {
    askPreferences(res, robot);
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
};
