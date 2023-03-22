import Phaser from 'phaser'

import HelloWorldScene from './scenes/HelloWorldScene'
import RoomScene from './scenes/RoomScene'

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	parent: 'app',
	width: 800,
	height: 600,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 500 },
		},
	},
	scene: [RoomScene],
}

export default new Phaser.Game(config)
