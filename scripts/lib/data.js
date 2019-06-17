const days = [
	'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday',
];

const greetings = [
  'Happy %day, %user!',
  'Hello %user. What a beautiful %day!',
  `Hi %user. Finally it's %day!`,
];
const greetingsStreet = [
  'Wazzap',
  'Whaddup homie',
  'Wassup dawg',
  "A-yo %user",
  "'Sup %user, what's cracking?",
  'Yo %user, what up?'
];

const streetModeMsgs = [
  'Alright alright, I see you',
  'Copy that',
  'Respect',
  'Yes, chief',
];
const normalModeMsgs = [
  'Lunchbot is at your service',
  'Greetings, my good friend',
  'How may I help you?',
];

const leaveMsgs = [
  'Bon appetit, %user.',
  'Have a heavenly day, %user!',
  'Bye %user. Hope to see you soon!',
];

const errorMsgs = [
  'Uh oh! Looks like I got turned around finding suggestions',
  `Sorry I'm experiencing some technical difficulties`,
  'Looks like the service is unavailable right now',
];
const tuesdayResps = [
  'Chopt is on the menu for today',
  'Chopt is your best bet',
  'Today is Chopt day',
  "Today's special is Chopt salad",
  'Nothing is better for a Tuesday than a Chopt salad',
];

const foodPuns = [
  'why did the banana go to the doctor?\nIt wasn\'t *peeling* well!',
  'what do you call cheese that isn\'t yours?\n*Nacho* cheese!',
  'What do you call a fake noodle?\nAn *impasta*!',
  'Why did the tomato blush?\nBecause it saw the salad *dressing*!',
  'Why don\'t eggs tell jokes? They\'d *crack* each other up!',
];

const cuisineOptions = {
  A: {
    label:'American/Italian',
    // Foursquare category keys
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

module.exports = {
  cuisineOptions,
  days,
  errorMsgs,
  foodPuns,
  greetings,
  greetingsStreet,
  leaveMsgs,
  normalModeMsgs,
  streetModeMsgs,
  tuesdayResps,
};
