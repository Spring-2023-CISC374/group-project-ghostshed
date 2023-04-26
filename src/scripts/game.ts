import Phaser from 'phaser'
import RoomScene from './scenes/RoomScene'
import PreloadScene from './scenes/PreloadScene'
import MainMenuScene from './scenes/MainMenuScene'
import TutorialScene from './scenes/TutorialScene'

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	parent: 'app',
	width: 800,
	height: 600,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 0 },
		},
	},
	scene: [PreloadScene, MainMenuScene, RoomScene, TutorialScene],
}

export default new Phaser.Game(config)
