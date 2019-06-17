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
  'Uh oh! Looks like I\'ve gotten all turned around finding suggestions',
];
const tuesdayResps = [
  'Today is Chopt day', 'Chopt is on the menu for today', "Today's special is Chopt salad",
];

const foodPuns = [
  'why did the banana go to the doctor?\nIt wasn\'t *peeling* well!',
  'what do you call cheese that isn\'t yours?\n*Nacho* cheese!',
  'What do you call a fake noodle?\nAn *impasta*!',
  'Why did the tomato blush?\nBecause it saw the salad *dressing*!',
  'Why don\'t eggs tell jokes? They\'d *crack* each other up!',
];

module.exports = {
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
