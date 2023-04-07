import Phaser from 'phaser'
import TestGhostScene from './scenes/TestGhostScene'
import RoomScene from './scenes/RoomScene'
import PreloadScene from './scenes/Preload'

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
	scene: [PreloadScene, RoomScene, TestGhostScene],
}

export default new Phaser.Game(config)
