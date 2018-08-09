/* Commands:
 *   lunchbot hi
 *   lunchbot bye
 */

var leaveMsgs = [
  'Bon appetit', 'Have a heavenly day', 'Goodbye gorgeous',
];

module.exports = function(robot) {
  robot.respond(/(hi|hello|hola|whassup|wazzup)/i, function(msg) {
    msg.send('Happy Friday');
  });
  robot.respond(/(goodbye|bye|adios)/i, function(msg) {
    msg.send('Bon appetit');
  });
};
