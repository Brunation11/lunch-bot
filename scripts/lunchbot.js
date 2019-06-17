// Commands:
//   lunchbot hi
//   lunchbot bye
//   lunchbot What's for lunch today?|I need some lunch options|Give me some lunch suggestions
//   lunchbot find ramen
//   lunchbot good job

const data = require('./lib/data');
const foursquare = require('./lib/foursquare');
const interactions = require('./lib/interactions');

const getDay = () => {
  const today = new Date();
  return data.days[today.getDay()];
};

let day = getDay();
let streetMode = false;

module.exports = function(robot) {
  // Mode settings
  robot.respond(/enter street mode/i, (res) => {
    streetMode = true;
    res.send(res.random(data.streetModeMsgs));
  });
  robot.respond(/enter normal mode/i, (res) => {
    streetMode = false;
    res.send(res.random(data.normalModeMsgs));
  });

  // Check user preferences
  robot.respond(/(.*lunch|.*food|.*eat)/i, (res) => {
    if (day === 'Tuesday') {
      res.send(res.random(data.tuesdayResps));
    } else {
      interactions.askPreferences(res, robot, day);
    }
  });

  robot.respond(/(.*other|.*more|.*else)/i, (res) => {
    interactions.askPreferences(res, robot);
  });

  // Venue queries
  robot.respond(/find( (\w+))/i, (res) => {
    const params = {query: res.match[2]};
    foursquare.getLunchSpots(robot, res, params).then((searchResults) => {
      interactions.getSelection(robot, searchResults);
    });
  });

  // Greetings and goodbye
  robot.respond(/(hi|hello|hola|wassup|what's up)/i, (res) => {
    let greeting;
    const user = res.message.user.name;

    if (streetMode) {
      greeting = res.random(data.greetingsStreet).replace('%user', user);
    } else {
      greeting = res.random(data.greetings)
        .replace('%user', user)
        .replace('%day', day);
    }

    res.send(greeting);
  });

  robot.respond(/(goodbye|bye|adios|ta ta)/i, (res) => {
    const user = res.message.user.name;
    let reply;
    if (streetMode) {
      reply = res.random(data.leaveMsgsStreet);
    } else {
      reply = res.random(data.leaveMsgs).replace('%user', user);
    }

    res.send(reply);
  });

  robot.respond(/(what's wrong|how are you|you ok).*/i, (res) => {
    res.send(res.random(data.errorMsgsStreet));
  });

  robot.respond(/.*(excellent|good|nice|smart|sweet).*/, (res) => {
    const reply = res.random(thankMsgs).replace('%user', res.message.user.name);
    res.send(reply);
  });

  // Pun
  robot.respond(/(pun|pun me)/i, (res) => {
    var user = res.message.user.name;
    res.send(`${user} ${res.random(data.foodPuns)}`);
  });
};
