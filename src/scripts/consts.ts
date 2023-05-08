enum Sounds {
  FLASHLIGHT = 'Flashlight',
  MOVE = 'Move',
  HIDE = 'Hide',
  GHOST_HIT_WITH_FLASHLIGHT = 'Ghost Hit By Flashlight',
  CLOSE_DOOR = 'Door Close',
  BLOW_CANDLES = 'Blow Candles',
  LIGHTCANDLE = 'Light Candle 1'
}

const TutorialStepText = [
  'Let\'s start with moving to all four zones. Use the arrow keys to travel to each. Just press one and you\'ll travel there',
  'Hmm I think I hear a ghost approaching. Ghosts at a distance can be scared away with the flashlight. Move to the left zone and press F to use your flashlight',
  'If you wait too long, a ghost can reach one of the doors. It\'ll start pulsing when it\'s close to breaking in. Close the door on that side (press D) to force it away',
  'Sometimes ghosts appear at the window. You will need to hide from them so they look elsewhere. Press H by the table in the top zone to hide',
  'The candles should not be overlooked, they seem to light all on their own! Press C by them to put them out. If too many light, the ghosts will be able to easily get in!',
  'Great work! Survive the next 30s and you will be ready to face the ghosts. Good luck!',
  'Excellent! You have learned the ropes to ghost fighting. Click continue to try you hand in a real haunted shed...'
]


export {
  Sounds,
  TutorialStepText
}