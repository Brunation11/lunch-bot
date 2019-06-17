const data = require('./data');
const foursquare = require('./foursquare');

// Put cuisineOptions in data to avoid circular imports with foursquare
const cuisineOptions = data.cuisineOptions;
let cuisineKey; // One of A|B|C|D|E
let cuisineListener;
let selectionListener;

const askPreferences = (res, robot, day) => {
  const user = day === 'Friday' ? 'kevin' : res.message.user.name;
  const question = 'OK %user, what type of cuisine do you feel like?'.replace('%user', user);
  let options = '';

  Object.keys(cuisineOptions).forEach((key) => {
    options += `${key}. ${cuisineOptions[key].label}\n`;
  });
  res.send(question);
  res.send(options);

  // This is to prevent the listener from firing multiple times
  if (!cuisineListener) {
    cuisineListener = robot.hear(/[abcde]/i, (res) => {
      const confirmMsg = getPreference(res);
      if (confirmMsg) res.send(confirmMsg);

      if (!cuisineKey) return;

      const categoryIds = cuisineOptions[cuisineKey].keys;
      const params = {categoryId: Object.values(categoryIds).join(',')};

      foursquare.getLunchSpots(robot, res, params).then((searchResults) => {
        return getSelection(robot, searchResults);
      });
    });
  }
};

const getPreference = (res) => {
  cuisineKey = (res.message.text || 'A').toUpperCase();
  const value = cuisineOptions[cuisineKey];

  if (!value) {
    cuisineKey = null;
    return null;
  } else {
    return `You picked ${value.label}. Let me see what's good around here.`;
  }
};

const getSelection = (robot, searchResults) => {
  if (!selectionListener) {
    selectionListener = robot.hear(/\d/i, (res) => {
      const selection = res.message.text;
      const selectedVenue = searchResults[selection - 1];
      if (!selectedVenue) return;

      res.send(`You picked ${selectedVenue.name}`);
      foursquare.getDetailedInfo(robot, res, selectedVenue, cuisineKey);
    });
  }
};

module.exports = {
  askPreferences,
  getPreference,
  getSelection,
};
