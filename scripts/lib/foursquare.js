const data = require('./data');

// Foursquare config
const apiBaseUrl = 'https://api.foursquare.com/v2/venues/search?';
const baseParams = {
  client_id: process.env.FOURSQUARE_CLIENT_ID,
  client_secret: process.env.FOURSQUARE_CLIENT_SECRET,
  v: '20180808',
  m: 'swarm',
  ll: '40.7537571,-73.9783438',
  radius: 500,
  intent: 'browse',
  limit: 10,
};

let searchResults = []; // List of venues

const parseVenues = (res, response) => {
  searchResults = response.venues || [];
  res.send(
    `I found ${searchResults.length} location${searchResults.length > 1 ? 's' : ''}:`
  );

  let message = '';
  searchResults.forEach((venue, index) => {
    const name = venue.name;
    const location = venue.location.address ? ' at ' + venue.location.address : '';
    const minutes = Math.ceil(venue.location.distance / 100);
    const distance = `(approx. ${minutes}-minute walk)`;
    message += `${(index + 1)}. ${name}${location} ${distance}\n`;
  });

  res.send(message);
};

const getDetailedInfo = (robot, res, venue, cuisineKey) => {
  const apiDetailsUrl = apiBaseUrl.replace('search?', venue.id) + '?';

  robot.http(apiDetailsUrl + compileQueryString(baseParams))
    .header('Accept', 'application/json')
    .get()((err, response, body) => {
      if (err) {
        res.send(res.random(errorMsgs));
      }

      const venueDetails = getVenueDetails(res, JSON.parse(body).response, cuisineKey);
      venueDetails.forEach((msg) => res.send(msg));
    });
};

const getLunchSpots = (robot, res, params) => {
  params = Object.assign({}, baseParams, params);

  return new Promise((resolve, reject) => {
    robot.http(apiBaseUrl + compileQueryString(params))
      .header('Accept', 'application/json')
      .get()((err, response, body) => {
        if (err) {
          res.send(res.random(errorMsgs));
          reject(err);
        }

        const resp = JSON.parse(body).response;
        parseVenues(res, resp);
        resolve(searchResults);
      });
  });
};

/* Helper functions */
const compileQueryString = (params) => {
  let queryString = '';
  for (let field in params) {
    queryString += `${field}=${params[field]}&`;
  };

  return queryString;
};

const getVenueDetails = (res, response, cuisineKey) => {
  const venue = response.venue;
  if (!venue) {
    res.send(res.random(errorMsgs));
    return;
  }

  const rating = venue.rating || 'Unavailable';
  const details = [
    venue.location.address,
    `Price range: ${venue.price.message} | Rating: ${rating}`,
  ];
  if (cuisineKey) {
    details.push(`*${data.cuisineOptions[cuisineKey].confirmMsg}*`);
  }

  return details;
};

module.exports = {
  getDetailedInfo,
  getLunchSpots,
};
