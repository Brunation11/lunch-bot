/*
 * Commands:
 *  lunchbot kitten me - Receive a kitten
 *  lunchbot kitten bomb N - get N kittens
 */

module.exports = (robot) => {
  robot.respond(/kitten me/i, (res) => {
    res.http('http://kittenme.herokuapp.com/random')
      .get()((err, response, body) => {
        if (err) {
          res.send('Kittens are unavailable at the moment :(');
        } else {
          res.send(JSON.parse(body).kitten);
        }
      });
  });

  robot.respond(/kitten bomb( (\d+))?/i, (res) => {
    const count = res.match[2] || 5;

    res.http(`http://kittenme.herokuapp.com/bomb?count=${count}`)
      .get()((err, response, body) => {
        if (err) {
          res.send('Kittens are unavailable at the moment :(');
        } else {
         const imageUrls = JSON.parse(body).kittens;
           imageUrls.forEach((url) => res.send(url));
        }
      });
  });
};
