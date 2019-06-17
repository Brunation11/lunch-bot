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
var cuisineListener;
var selectionListener;
var searchResults = []; // List of venues

var askPreferences = function(res, robot, day) {
  var user = day === 'Friday' ? 'kevin' : res.message.user.name;
  var question = 'OK %user, what type of cuisine do you feel like?'.replace('%user', user);
  var options = '';

  Object.keys(cuisineOptions).forEach(function(key) {
    options += key + '. ' + cuisineOptions[key].label + '\n';
  });
  res.send(question);
  res.send(options);

  // This is to prevent the listener from firing multiple times
  if (!cuisineListener) {
    cuisineListener = robot.hear(/[abcde]/i, function(res) {
      var confirmMsg = getPreference(res);
      if (confirmMsg) res.send(confirmMsg);

      if (!cuisineKey) return;

      var categoryIds = cuisineOptions[cuisineKey].keys;
      var params = Object.assign({}, baseParams, {categoryId: Object.values(categoryIds).join(',')})

      getLunchSpots(robot, res, params).then(function() {
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
  if (!selectionListener) {
    selectionListener = robot.hear(/\d/i, function(res) {
      var selection = res.message.text;
      var selectedVenue = searchResults[selection - 1];
      if (!selectedVenue) return;

      res.send('You picked ' + selectedVenue.name + '.');
      getDetailedInfo(robot, res, selectedVenue);
    });
  }
};

module.exports = {
  askPreferences,
  getPreference,
  getSelection,
};
