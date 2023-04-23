enum Sounds {
  FLASHLIGHT = 'Flashlight',
  MOVE = 'Move',
  HIDE = 'Hide',
  GHOST_HIT_WITH_FLASHLIGHT = 'Ghost Hit By Flashlight',
  CLOSE_DOOR = 'Door Close',
  BLOW_CANDLES = 'Blow Candles'
}

const TutorialStepText = [
  'Move to all four zones using the arrow keys',
  'Ghosts far away can be scared away with the flashlight. Move to the left zone and press F to use your flashlight',
  'If you wait too long, a ghost can reach one of the doors. Move to the right zone and press D to close the door',
  'Sometimes ghosts appear at the window. You will need to hide from them so they look elsewhere. Press H by the table to hide',
  'Great work! Survive the next 30s and you will be ready to face the ghosts. Good luck!'
]


export {
  Sounds,
  TutorialStepText
}