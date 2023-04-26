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

	constructor (params: { key:string }) {
		super(params)
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

  killGhost(action:string){
		if (this.ghosts[this.curZone - 2].retreat(action) && action === 'flashlight'){
			//
		}
	}

  create () {
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

    this.initializeAudio()
  }

  initializeAudio () {
    // Get every registered sound in the enum, load them with the corresponding key here
    for (const soundKey of Object.values(Sounds)) {
      this.sound.add(soundKey)
    }
  }

}
