// Commands:
//   lunchbot hi
//   lunchbot bye

var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
var greetings = [
  'Happy %day, %user!', 'Hello %user. What a beautiful %day!', 'Hi %user. Finally it\'s %day!',
];
var leaveMsgs = [
  'Bon appetit, %user.', 'Have a heavenly day, %user!', 'Bye %user. Hope to see you soon!',
];

// Helper functions
var getDay = function() {
  var today = new Date();
  return days[today.getDay()];
};

module.exports = function(robot) {
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
