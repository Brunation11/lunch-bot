# Description:
#   Kitten Me is for cat lovers
# Commands:
#   hubot kitten me - Receive a kitten
#   hubot kitten bomb N - get N kittens

module.exports = (robot) ->

  robot.respond /kitten me/i, (msg) ->
    msg.http("http://kittenme.herokuapp.com/random")
      .get() (err, res, body) ->
        msg.send JSON.parse(body).kitten

  robot.respond /kitten bomb( (\d+))?/i, (msg) ->
    count = msg.match[2] || 5
    msg.http("http://kittenme.herokuapp.com/bomb?count=" + count)
      .get() (err, res, body) ->
        msg.send kitten for kitten in JSON.parse(body).kittens
