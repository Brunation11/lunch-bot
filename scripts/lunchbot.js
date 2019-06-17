// Commands:
//   lunchbot hi
//   lunchbot bye
//   lunchbot What's for lunch today?|I need some lunch options|Give me some lunch suggestions
//   lunchbot find ramen
//   lunchbot good job

const questions = require('./lib/questions');
const data = require('./lib/data');

let streetMode = false;

module.exports = function(robot) {
  // Mode settings
  robot.respond(/enter street mode/i, function(res) {
    streetMode = true;
    res.send(res.random(data.streetModeMsgs));
  });
  robot.respond(/enter normal mode/i, function(res) {
    streetMode = false;
    res.send(res.random(data.normalModeMsgs));
  });

  // Check user preferences
  robot.respond(/(.*lunch|.*food|.*eat)/i, function(res) {
    var day = getDay();

    if (day === 'Tuesday') {
      res.send(res.random(tuesdayResps));
    } else {
      askPreferences(res, robot, day);
    }
  });

  robot.respond(/(.*other|.*more|.*else)/i, function(res) {
    askPreferences(res, robot);
  });

  // Venue queries
  robot.respond(/find( (\w+))/i, function(res) {
    var params = Object.assign({}, baseParams, {query: res.match[2]});
    getLunchSpots(robot, res, params)
      .then(function() {
        getSelection(robot);
      });
  });

  // Greetings and goodbye
  robot.respond(/(hi|hello|hola|wassup|what's up)/i, function(res) {
    let greeting;
    const user = res.message.user.name;

    if (streetMode) {
      greeting = res.random(data.greetingsStreet).replace('%user', user);
    } else {
      greeting = res.random(data.greetings)
        .replace('%user', user)
        .replace('%day', getDay());
    }

    res.send(greeting);
  });

  robot.respond(/(goodbye|bye|adios|ta ta)/i, function(res) {
    var user = res.message.user.name;
    var reply = res.random(leaveMsgs).replace('%user', user);
    res.send(reply);
  });

  robot.respond(/.*(good|nice|excellent)/, function(res) {
    var reply = 'Aww, thank you %user.'.replace('%user', res.message.user.name);
    res.send(reply);
  });

  robot.respond(/(pun|pun me)/i, function(res) {
    var user = res.message.user.name;
    res.send(user + ' ' + res.random(foodPuns));
  });
};

// Helper functions
var getDay = function() {
  var today = new Date();
  return data.days[today.getDay()];
};
