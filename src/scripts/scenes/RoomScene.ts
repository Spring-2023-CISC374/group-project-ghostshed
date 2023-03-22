import Phaser from 'phaser'

export default class RoomScene extends Phaser.Scene {

	private map!: Phaser.Tilemaps.Tilemap
	private tiles!: Phaser.Tilemaps.Tileset 
	private player!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody
	private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
	

	constructor() {
		super('hello-world')
	}

	preload() {
		this.load.image('tileset_image', 'assets/tilemaps/tileset.png')
    this.load.tilemapTiledJSON('tilemap', 'assets/tilemaps/main.json')
		this.load.image('player', 'assets/tilemaps/character.png')
	}

	create() {
  	this.map = this.make.tilemap({ key: 'tilemap', tileHeight: 32, tileWidth: 32 })
    this.tiles = this.map.addTilesetImage('tileset', 'tileset_image')

    // Render the layers in Phaser
    for (const layerName of this.map.getTileLayerNames()) {
      this.map.createLayer(layerName, this.tiles, 0, 0)
    }


		this.player = this.physics.add.sprite(315, 408, 'player')
		this.player.setScale(2,2)
		
		this.cursors = this.input.keyboard.createCursorKeys();
	}

	update() {
		if (this.cursors.left.isDown) {
			this.player.setVelocityX(-160);
		}
		else if (this.cursors.right.isDown) {
			this.player.setVelocityX(160);
		}
		else {
			this.player.setVelocityX(0);
		}

		if (this.cursors.up.isDown) {
			this.player.setVelocityY(-160);
		}
		else if (this.cursors.down.isDown) {
			this.player.setVelocityY(160);
		}
		else {
			this.player.setVelocityY(0);
		}
	}
}
