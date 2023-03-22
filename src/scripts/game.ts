import Phaser from 'phaser'

import TestGhostScene from './scenes/TestGhostScene'

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
	scene: [TestGhostScene],
}

export default new Phaser.Game(config)
