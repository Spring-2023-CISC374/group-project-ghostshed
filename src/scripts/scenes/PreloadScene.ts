import Phaser from 'phaser'

export default class PreloadScene extends Phaser.Scene {

	constructor() {
		super({ key: 'Preload' })
	}

	preload() {
		// Main Menu
		this.load.image('glass-panel', 'assets/ui/glassPanel.png')


		this.load.image('tileset_image', 'assets/tilemaps/tileset.png')
    this.load.tilemapTiledJSON('tilemap', 'assets/tilemaps/main.json')
		this.load.image('player', 'assets/tilemaps/character.png')


		this.load.image('tileset_image', 'assets/tilemaps/tileset.png');
		this.load.tilemapTiledJSON('tilemap', 'assets/tilemaps/main.json');
		this.load.spritesheet('dude',
			'/assets/dude_edited.png',
			{ frameWidth: 32, frameHeight: 48 }
		);
	}

  create() {
    this.scene.start('MainMenu')
  }

}
