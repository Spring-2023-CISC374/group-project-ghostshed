import Phaser from 'phaser'
import Player from '../objects/Player'
import Ghost from '../objects/Ghost'
import { Sounds } from '../consts'

export default class BaseLevelScene extends Phaser.Scene {

 	protected map!: Phaser.Tilemaps.Tilemap
	protected tiles!: Phaser.Tilemaps.Tileset 
	protected player!: Player
	protected curZone: number = 1
	protected ghosts: Ghost[] = []
	protected gameOver: boolean = false
	protected level: number = 1;

	protected currentCandleTime: number = 0
	protected chance!: number
	protected litCandles: number = 0;
	protected candleTiles: Phaser.Tilemaps.Tile[] = []
	protected doorTiles: Phaser.Tilemaps.Tile[] = []

	protected pointLights: Phaser.GameObjects.Light[] = []

	constructor (params: { key:string }) {
		super(params)
	}

	updateZone(newZone: number){
		if (this.curZone != newZone && newZone > 1){
			let ghostIndex = (newZone + 1) % 3
			let alpha = 75 / this.calculateDistance(this.player.x, this.player.y, this.ghosts[ghostIndex].x, this.ghosts[ghostIndex].y)
			this.ghosts[ghostIndex].initiateFadeIn(alpha)

			// a distance of 60 is when the player and ghost are both at the door
			// a distance of 250ish is when the ghost spawns
		} 
		
		if (this.curZone != newZone && newZone === 0){
			let ghostIndex = (this.curZone + 1) % 3
			this.ghosts[ghostIndex].initiateFadeOut()
		}

		this.curZone = newZone
	}

	calculateDistance(xA: number, yA: number, xB: number, yB: number){
		return Math.sqrt((xB - xA)*(xB-xA) + (yB-yA)*(yB-yA))
	}
	
	hide() {
		console.log("Trying to Hide")
		if(this.curZone == 4){
			console.log("Hiding")
		}else{
			console.log("No wheres to hide")
		}
	}

	extinguishCandle(currentlylit: number){
		this.candleTiles[currentlylit-1].index = 201
		this.pointLights[currentlylit-1].visible = false
	}

	lightCandle(currentlylit: number){
		const tile = this.candleTiles[currentlylit]
		tile.index = 202
		this.sound.play(Sounds.LIGHTCANDLE)
		this.pointLights[currentlylit].visible = true
	}

	killGhost(action:string) {
		let retreated = this.ghosts[this.curZone - 2].retreat(action)
		// if the side ghosts are killed with a flashlight, spawn the other side ghost
		if (retreated && action === 'flashlight'){
			if (this.curZone == 2 && !this.ghosts[1].isVisible())
				this.ghosts[1].startOnPath();
			else if (this.curZone == 3 && !this.ghosts[0].isVisible())
				this.ghosts[0].startOnPath();
		}

		// if the side ghosts are killed with the door, if the other ghost is at the door already, spawn the dead ghost again
		if (retreated && action === 'door'){
			if (this.curZone == 2 && this.ghosts[1].getPlayerZoneStatus())
				this.ghosts[0].startOnPath();
			else if (this.curZone == 3 && this.ghosts[0].getPlayerZoneStatus())
				this.ghosts[1].startOnPath();
		}
	}

  create () {
		this.map = this.make.tilemap({ key: 'tilemap', tileHeight: 32, tileWidth: 32 })
		this.tiles = this.map.addTilesetImage('tileset', 'tileset_image')
		
		// the index of the ghost is zone # - 2
		this.ghosts = []
		this.ghosts.push(new Ghost(this, 2, this.level))
		this.ghosts.push(new Ghost(this, 3, this.level))
		this.ghosts.push(new Ghost(this, 4, this.level))

		for(let ghost of this.ghosts){
			ghost.alpha = 0.3;
		}

		// the game starts with a zone 2 ghost
		this.ghosts[0].startOnPath();

		// Render the layers in Phaser
		for (const layerName of this.map.getTileLayerNames()) {
			this.map.createLayer(layerName, this.tiles, 100, 0).setPipeline('Light2D');
		}

		this.candleTiles = []
		this.pointLights = []
		// Initialize candles and their lights
		for(let i = 0; i < 4; i++){
			const tile = this.map.getLayer('Zone 1').data[15][8 + i]
			const x = this.map.tileToWorldX(tile.x) + 16 // Offset to the half to get the middle
			const y = this.map.tileToWorldY(tile.y) + 16 // Offset to the half to get the middle
			this.candleTiles.push(tile)
			this.pointLights.push(this.lights.addLight(x, y, 100, undefined, 0.65))
			this.pointLights[i].visible = false
		}

		this.player = new Player(this);
		this.player.setScale(2,2)

		this.initializeDoors()
		this.initializeLighting()
		this.initializeZones()
    this.initializeAudio()
  }

	initializeDoors () {
		this.doorTiles = []
		const leftDoorTiles = this.map.getLayer('Walls').data[11][3]
		const rightDoorTiles = this.map.getLayer('Walls').data[11][16]
		this.doorTiles.push(leftDoorTiles)
		this.doorTiles.push(rightDoorTiles)
	}

	initializeLighting () {
		this.lights.enable().setAmbientColor(0x171717);
	}

	initializeZones () {
		this.map.setTileIndexCallback(433, () => { this.updateZone(2)}, this, "Zone 2");
		const zone2 = this.map.getLayer("Zone 2").tilemapLayer
		this.physics.add.overlap(this.player, zone2);

		this.map.setTileIndexCallback([201, 202], () => { this.updateZone(1)}, this, "Zone 1");
		const zone1 = this.map.getLayer("Zone 1").tilemapLayer
		this.physics.add.overlap(this.player, zone1);

		this.map.setTileIndexCallback(481, () => { this.updateZone(3)}, this, "Zone 3");
		const zone3 = this.map.getLayer("Zone 3").tilemapLayer
		this.physics.add.overlap(this.player, zone3);

		this.map.setTileIndexCallback([487, 439], () => { this.updateZone(4)}, this, "Zone 4");
		const zone4 = this.map.getLayer("Zone 4").tilemapLayer
		this.physics.add.overlap(this.player, zone4);

		this.map.setTileIndexCallback([385, 386, 387, 388], () => { this.updateZone(0)}, this, "Ground");
		const zone0 = this.map.getLayer("Ground").tilemapLayer
		this.physics.add.overlap(this.player, zone0);
	}

  initializeAudio () {
    // Get every registered sound in the enum, load them with the corresponding key here
    for (const soundKey of Object.values(Sounds)) {
      this.sound.add(soundKey)
    }
  }

}
