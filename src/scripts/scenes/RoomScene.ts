import Phaser from 'phaser'

export default class RoomScene extends Phaser.Scene {

	private map!: Phaser.Tilemaps.Tilemap
	private tiles!: Phaser.Tilemaps.Tileset 
	private player!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody
	private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
	private curZone = "Zone 1"

	
	
	constructor() {
		super('hello-world')
	}

	preload() {
		this.load.image('tileset_image', 'assets/tilemaps/tileset.png')
    this.load.tilemapTiledJSON('tilemap', 'assets/tilemaps/main.json')
		this.load.image('player', 'assets/tilemaps/character.png')
	}

	updateZone(newZone: string){
		this.curZone = newZone
	}
	
	hide(){
		console.log("Trying to Hide")
		if(this.curZone == "Zone 4"){
			console.log("Hiding")
		}else{
			console.log("No wheres to hide")
		}
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

		this.map.setTileIndexCallback(435, () => { this.updateZone("Zone 2")}, this, "Zone 2");
		const zone2 = this.map.getLayer("Zone 2").tilemapLayer
		this.physics.add.overlap(this.player, zone2);

		this.map.setTileIndexCallback(486, () => { this.updateZone("Zone 1")}, this, "Zone 1");
		const zone1 = this.map.getLayer("Zone 1").tilemapLayer
		this.physics.add.overlap(this.player, zone1);

		this.map.setTileIndexCallback(436, () => { this.updateZone("Zone 3")}, this, "Zone 3");
		const zone3 = this.map.getLayer("Zone 3").tilemapLayer
		this.physics.add.overlap(this.player, zone3);

		this.map.setTileIndexCallback(434, () => { this.updateZone("Zone 4")}, this, "Zone 4");
		const zone4 = this.map.getLayer("Zone 4").tilemapLayer
		this.physics.add.overlap(this.player, zone4);

		this.map.setTileIndexCallback(338, () => { this.updateZone("Zone 0")}, this, "Ground");
		const zone0 = this.map.getLayer("Ground").tilemapLayer
		this.physics.add.overlap(this.player, zone0);

		const hKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.H);

		hKey.on('down',  (key:any, event:any) => {

			console.log("Trying to Hide")
			if(this.curZone == "Zone 4"){
				console.log("Hiding")
			}else{
				console.log("No wheres to hide")
			}
	
		});

		const fKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);

		fKey.on('down',  (key:any, event:any) => {

			console.log("Using Flashlight")
			if(this.curZone == "Zone 2" || this.curZone == "Zone 3"){
				console.log("Shining Bright")
			}else{
				console.log("Wasting Light")
			}
	
		});

		const dKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

		dKey.on('down',  (key:any, event:any) => {

			console.log("Trying to close door")
			if(this.curZone == "Zone 2" || this.curZone == "Zone 3"){
				console.log("Door Closed")
			}else{
				console.log("No door close")
			}
	
		});

		const cKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C);

		cKey.on('down',  (key:any, event:any) => {

			console.log("Trying to Blow out candle")
			if(this.curZone == "Zone 1"){
				console.log("Summoning Delayed")
			}else{
				console.log("Wasting Breath")
			}
	
		});
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
