import Phaser from 'phaser'
import Player from '../objects/playerCharacter';
import Ghost from '../objects/ghost';

export default class RoomScene extends Phaser.Scene {

	private map!: Phaser.Tilemaps.Tilemap
	private tiles!: Phaser.Tilemaps.Tileset 
	private player!: Player
	private curZone: number = 1
	private ghosts: Ghost[] = []
	private gameOver: boolean = false

	constructor() {
		super({ key: 'RoomScene' })
	}

	preload() {
		this.load.image('tileset_image', 'assets/tilemaps/tileset.png')
    this.load.tilemapTiledJSON('tilemap', 'assets/tilemaps/main.json')
		this.load.image('player', 'assets/tilemaps/character.png')

		//All Sound Affects needed for Room
		//MAY NEED MORE ADDED
		this.load.audio('Blow Candles', 'audio/BlowOutCandle.mp3');
		this.load.audio('Light Candle 1', 'audio/Candle1.mp3');
		this.load.audio('Light Candle 2', 'audio/Candle2.mp3');		
		this.load.audio('Light Candle 3', 'audio/Candle3.mp3');
		this.load.audio('Door Close', 'audio/DoorClosing.mp3');
		this.load.audio('Flashlight', 'audio/Flashlight.mp3');
		this.load.audio('Ghost Breath 1', 'audio/GhostBreathing1.mp3');
		this.load.audio('Ghost Breath 2', 'audio/GhostBreathing2.mp3');
		this.load.audio('Ghost Breath 3', 'audio/GhostBreathing3.mp3');
		this.load.audio('Ghost Move', 'audio/GhostFootsteps.mp3');
		this.load.audio('Ghost Move Left', 'audio/GhostFootstepsLeft.mp3');
		this.load.audio('Ghost Move Right', 'audio/GhostFootstepsRight.mp3');
		this.load.audio('Ghost Hit By Flashlight', 'audio/GhostHitByFlashlight.mp3');
		this.load.audio('Hide', 'audio/Hide.mp3');
		this.load.audio('Player Move', 'audio/PlayerFootsteps.mp3');
		this.load.audio('Window Close', 'audio/WindowClosing.mp3');
		this.load.audio('Window Open', 'audio/WindowOpening.mp3');
		this.load.audio('Window Knock 1', 'audio/WindowKnock1.mp3');
		this.load.audio('Window Knock 2', 'audio/WindowKnock2.mp3');
		this.load.audio('Window Knock 3', 'audio/WindowKnock3.mp3');
	}

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
		this.ghosts.push(new Ghost(this, 3))
		this.ghosts.push(new Ghost(this, 4))

		// the game starts with a zone 2 ghost
		this.ghosts[0].startOnPath();


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
		TESTKEY.on('down',  (_key:any, _event:any) => {
			this.ghosts[0].startOnPath();
		});

		const hKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.H);

		hKey.on('down',  (_key:any, _event:any) => {

			console.log("Trying to Hide")
			if(this.curZone == 4){
				console.log("Hiding")
				this.killGhost("hide");
			}else{
				console.log("No wheres to hide")
			}
	
		});

		const fKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);

		fKey.on('down',  (_key:any, _event:any) => {

			console.log("Using Flashlight")
			if(this.curZone == 2|| this.curZone == 3){
				console.log("Shining Bright")
				this.killGhost("flashlight");
			}else{
				console.log("Wasting Light")
			}
	
		});

		const dKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

		dKey.on('down',  (_key:any, _event:any) => {

			console.log("Trying to close door")
			if(this.curZone == 2 || this.curZone == 3){
				console.log("Door Closed")
				this.killGhost("door");
			}else{
				console.log("No door close")
			}
	
		});

		const cKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C);

		cKey.on('down',  (_key:any, _event:any) => {

			console.log("Trying to Blow out candle")
			if(this.curZone == 1){
				console.log("Summoning Delayed")
			}else{
				console.log("Wasting Breath")
			}
	
		});


		const Zone1Key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
		Zone1Key.on('down',  (_key:any, _event:any) => {
			this.player.move(this.curZone, 1);
		});

		const Zone2Key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
		Zone2Key.on('down',  (_key:any, _event:any) => {
			this.player.move(this.curZone, 2);
		});

		const Zone3Key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
		Zone3Key.on('down',  (_key:any, _event:any) => {
			this.player.move(this.curZone, 3);
		});

		const Zone4Key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
		Zone4Key.on('down',  (_key:any, _event:any) => {
			this.player.move(this.curZone, 4);
		});
	}
	

	update(time: any, delta: any) {
		if(this.gameOver){
			return
		}
		for (let ghost of this.ghosts){
			ghost.update(time, delta);
			let ghostsWin = ghost.gameOver
			if (ghostsWin){
				this.gameOver = true
				console.log("THE GAME IS OVER. THE GHOSTS WIN");
			}
		}
		
		let zone = this.player.update(time, delta);
		if (zone)
			this.curZone = zone;
	}

	killGhost(action:string){
		// retreat the current ghost
		if(this.ghosts[this.curZone - 2].retreat(action)){
			// make a different ghost start moving again
			this.ghosts[(this.curZone - 1) % 3].startOnPath();
		}
	}
}
