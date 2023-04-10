import Phaser from 'phaser'
import  { findPath } from '../objects/findPath';
import Ghost from '../objects/ghost';

export default class RoomScene extends Phaser.Scene {

	private map!: Phaser.Tilemaps.Tilemap
	private tiles!: Phaser.Tilemaps.Tileset 
	private player!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody
	private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
	private curZone: number = 1

	private ghosts: Ghost[] = []

	//movement variables
	private movePath?: Phaser.Math.Vector2[]
    private endPath?: Phaser.Math.Vector2

	constructor() {
		super('hello-world')
	}

	preload() {
		this.load.image('tileset_image', 'assets/tilemaps/tileset.png')
    	this.load.tilemapTiledJSON('tilemap', 'assets/tilemaps/main.json')
		this.load.image('player', 'assets/tilemaps/character.png')

		this.load.spritesheet('dude',
			'/assets/dude_edited.png',
			{ frameWidth: 32, frameHeight: 48 }
		)
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

		this.player = this.physics.add.sprite(315, 408, 'player')
		this.player.setScale(2,2)

		this.cursors = this.input.keyboard.createCursorKeys();

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

		//adapted from https://blog.ourcade.co/posts/2020/phaser-3-point-click-pathfinding-movement-tilemap/
		//pathfinding code to the Zone 1
		Zone1Key.on('down',  (key:any, event:any) => {
			let startVec = this.map.worldToTileXY(this.player.x, this.player.y)
			let targetVec = this.map.worldToTileXY(312.0 , 480.0);
			// generate the path
			let path = findPath(startVec, targetVec, zone0)
			this.moveAlong(path)
		});

		//pathfinding code to zone 2
		const Zone2Key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);

		Zone2Key.on('down',  (key:any, event:any) => {
			let startVec = this.map.worldToTileXY(this.player.x, this.player.y)
			let targetVec = this.map.worldToTileXY(160.0 , 330.0);

			// generate the path from the ground layer
			let path = findPath(startVec, targetVec, zone0)
			this.moveAlong(path)
		});

		//pathfinding code to zone 3
		const Zone3Key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);

		Zone3Key.on('down',  (key:any, event:any) => {
			let startVec = this.map.worldToTileXY(this.player.x, this.player.y)
			let targetVec = this.map.worldToTileXY(310.0 , 295.0);

			// generate the path from the ground layer
			let path = findPath(startVec, targetVec, zone0)
			this.moveAlong(path)
		});

		//pathfinding code to zone 4
		const Zone4Key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

		Zone4Key.on('down',  (key:any, event:any) => {
			let startVec = this.map.worldToTileXY(this.player.x, this.player.y)
			let targetVec = this.map.worldToTileXY(470.0 , 330.0);
	
			// generate the path from the ground layer
			let path = findPath(startVec, targetVec, zone0)
			this.moveAlong(path)
		});

	}
	
    moveAlong(path: Phaser.Math.Vector2[]){
        if(!path || path.length <= 0){
            return
        }

        this.movePath = path
        this.moveTo(this.movePath.shift()!)
    }

	moveTo(target: Phaser.Math.Vector2){
        this.endPath = target

    }

	update(time: any, delta: any) {
		for (let ghost of this.ghosts){
			let ghostsWin = ghost.update(time, delta);
			if (ghostsWin){
				console.log("THE GAME IS OVER. THE GHOSTS WIN");
			}
		}

		let dx = 0
		let dy = 0
		if (this.endPath){
            dx = this.endPath.x - this.player.x
            dy = this.endPath.y - this.player.y

            if (Math.abs(dx) < 5){
                dx = 0
            }
            if (Math.abs(dy) < 5){
                dy = 0
            }

            if (dx === 0 && dy === 0){
                if(this.movePath){
                    if (this.movePath.length > 0){
                        this.moveTo(this.movePath.shift()!)
                        return
                    }
                }
                this.endPath = undefined
            }
        }

		const speed = 160

		let leftDown = dx < 0
		let rightDown = dx > 0
		let upDown = dy < 0
		let downDown = dy > 0
		let upleft = ( dx < 0 && dy < 0 )
		let upright = ( dx > 0 && dy < 0 )
		let downleft = ( dx < 0 && dy > 0 )
		let downright = ( dx > 0 && dy > 0 )


		// this is the left up
		if(upleft){
			this.player.setVelocity(-speed, -speed)
		}
		//this is the right up
		else if(upright){
			this.player.setVelocity(speed, -speed)
		}
		//this is the left bottom
		else if(downleft){
			this.player.setVelocity(-speed, speed)
		}
				//this is the right bottom
		else if (downright){
			this.player.setVelocity(speed, speed)
		}
		else if (leftDown){
			this.player.setVelocity(-speed, 0)
		}
		else if (rightDown){
			this.player.setVelocity(speed, 0)
		}
		else if (upDown){
			this.player.setVelocity(0, -speed)
		}
		else if (downDown){
			this.player.setVelocity(0, speed)
		}
		else{
			this.player.setVelocity(0, 0)
		}

		if (this.cursors.left.isDown) {
			this.player.setVelocityX(-160);
		}
		else if (this.cursors.right.isDown) {
			this.player.setVelocityX(160);
		}

		if (this.cursors.up.isDown) {
			this.player.setVelocityY(-160);
		}
 		else if (this.cursors.down.isDown) {
			this.player.setVelocityY(160);
		}

		//console.log(`x${this.player.x} y${this.player.y}`)
	}
}
