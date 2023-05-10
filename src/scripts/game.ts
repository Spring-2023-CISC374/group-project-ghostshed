import Phaser from 'phaser'
import RoomScene from './scenes/RoomScene'
import PreloadScene from './scenes/PreloadScene'
import MainMenuScene from './scenes/MainMenuScene'
import TutorialScene from './scenes/TutorialScene'

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	parent: 'app',
	width: 840,
	height: 640,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 0 },
		},
	},
	scene: [PreloadScene, MainMenuScene, RoomScene, TutorialScene],
	scale: {
		parent: 'app',
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        min: {
            width: 840,
            height: 640
        },
        zoom: 1.25,  // Size of game canvas = game size * zoom
    },
}

export default new Phaser.Game(config)
