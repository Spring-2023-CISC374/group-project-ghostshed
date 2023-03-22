import Phaser from 'phaser'

export default class RoomScene extends Phaser.Scene {

	

	constructor() {
		super('hello-world')
	}

	preload() {
		this.load.image('tileset_image', 'assets/tilemaps/tileset.png')
    this.load.tilemapTiledJSON('tilemap', 'assets/tilemaps/main.json')
	}

	create() {
  	const map = this.make.tilemap({ key: 'tilemap' })
    const tiles = map.addTilesetImage('tileset', 'tileset_image')
    
    // Render the layers in Phaser
    for (const layerName of map.getTileLayerNames()) {
      map.createLayer(layerName, tiles, 0, 0)
    }
	}
}
