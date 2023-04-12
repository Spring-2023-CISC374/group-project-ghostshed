import Phaser from 'phaser'

export default class PreloadScene extends Phaser.Scene {

	constructor() {
		super({ key: 'Preload' })
	}

	preload() {
		// Main Menu
		this.load.image('glass-panel', 'assets/ui/glassPanel.png')
		this.load.image('menu-ground', 'assets/ui/groundLayer1.png')
		this.load.image('cloud-layer-1', 'assets/ui/cloudLayer1.png')
		this.load.image('cloud-layer-2', 'assets/ui/cloudLayerB1.png')
		this.load.image('hills-layer', 'assets/ui/hills.png')
		this.load.image('background', 'assets/ui/backgroundForest.png')


		this.load.image('tileset_image', 'assets/tilemaps/tileset.png')
    	this.load.tilemapTiledJSON('tilemap', 'assets/tilemaps/main.json')
		this.load.image('player', 'assets/tilemaps/character.png')
		this.load.image('ghost', '/assets/ghost.png');
	}

  create() {
    this.scene.start('MainMenu')
  }

}
