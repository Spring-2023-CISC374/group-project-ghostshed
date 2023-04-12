import Phaser from 'phaser'
import Player from '../objects/playerCharacter';
import Ghost from '../objects/ghost';

export default class RoomScene extends Phaser.Scene {

	private map!: Phaser.Tilemaps.Tilemap
	private tiles!: Phaser.Tilemaps.Tileset 
	private player!: Player
	private curZone: number = 1
	private ghosts: Ghost[] = []

	constructor() {
		super({ key: 'RoomScene' })
	}

	// this trigger action code
	updateZone(newZone: number){
		this.curZone = newZone
	}
	
	hide(){
		console.log("Trying to Hide")
		if(this.curZone == 4){
			console.log("Hiding")
		}else{
			console.log("No wheres to hide")
		}
	}

	create() {
  		this.map = this.make.tilemap({ key: 'tilemap', tileHeight: 32, tileWidth: 32 })
    	this.tiles = this.map.addTilesetImage('tileset', 'tileset_image')
		// the index of the ghost is zone # - 2
		this.ghosts.push(new Ghost(this, 2))
		//this.ghosts.push(new Ghost(this, 3))
		//this.ghosts.push(new Ghost(this, 4))


    	// Render the layers in Phaser
    	for (const layerName of this.map.getTileLayerNames()) {
      		this.map.createLayer(layerName, this.tiles, 0, 0)
    	}

		this.player = new Player(this);
		this.player.setScale(2,2)

		this.map.setTileIndexCallback(435, () => { this.updateZone(2)}, this, "Zone 2");
		const zone2 = this.map.getLayer("Zone 2").tilemapLayer
		this.physics.add.overlap(this.player, zone2);

		this.map.setTileIndexCallback(486, () => { this.updateZone(1)}, this, "Zone 1");
		const zone1 = this.map.getLayer("Zone 1").tilemapLayer
		this.physics.add.overlap(this.player, zone1);

		this.map.setTileIndexCallback(436, () => { this.updateZone(3)}, this, "Zone 3");
		const zone3 = this.map.getLayer("Zone 3").tilemapLayer
		this.physics.add.overlap(this.player, zone3);

		this.map.setTileIndexCallback(434, () => { this.updateZone(4)}, this, "Zone 4");
		const zone4 = this.map.getLayer("Zone 4").tilemapLayer
		this.physics.add.overlap(this.player, zone4);

		this.map.setTileIndexCallback(338, () => { this.updateZone(0)}, this, "Ground");
		const zone0 = this.map.getLayer("Ground").tilemapLayer
		this.physics.add.overlap(this.player, zone0);

		const TESTKEY = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
		TESTKEY.on('down',  (key:any, event:any) => {
			this.ghosts[0].startOnPath();
		});

		const hKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.H);

		hKey.on('down',  (key:any, event:any) => {

			console.log("Trying to Hide")
			if(this.curZone == 4){
				console.log("Hiding")
			}else{
				console.log("No wheres to hide")
			}
	
		});

		const fKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);

		fKey.on('down',  (key:any, event:any) => {

			console.log("Using Flashlight")
			if(this.curZone == 2 || this.curZone == 3){
				console.log("Shining Bright")
				this.ghosts[this.curZone - 2].retreat();
			}else{
				console.log("Wasting Light")
			}
	
		});

		const dKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

		dKey.on('down',  (key:any, event:any) => {

			console.log("Trying to close door")
			if(this.curZone == 2 || this.curZone == 3){
				console.log("Door Closed")
				this.ghosts[this.curZone - 2].retreat();
			}else{
				console.log("No door close")
			}
	
		});

		const cKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C);

		cKey.on('down',  (key:any, event:any) => {

			console.log("Trying to Blow out candle")
			if(this.curZone == 1){
				console.log("Summoning Delayed")
			}else{
				console.log("Wasting Breath")
			}
	
		});


		const Zone1Key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
		Zone1Key.on('down',  (key:any, event:any) => {
			this.player.move(this.curZone, 1);
		});

		const Zone2Key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
		Zone2Key.on('down',  (key:any, event:any) => {
			this.player.move(this.curZone, 2);
		});

		const Zone3Key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
		Zone3Key.on('down',  (key:any, event:any) => {
			this.player.move(this.curZone, 3);
		});

		const Zone4Key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
		Zone4Key.on('down',  (key:any, event:any) => {
			this.player.move(this.curZone, 4);
		});
	}
	

	update(time: any, delta: any) {
		for (let ghost of this.ghosts){
			let ghostsWin = ghost.update(time, delta);
			if (ghostsWin){
				console.log("THE GAME IS OVER. THE GHOSTS WIN");
			}
		}
		
		let zone = this.player.update(time, delta);
		if (zone)
			this.curZone = zone;
	}
}
