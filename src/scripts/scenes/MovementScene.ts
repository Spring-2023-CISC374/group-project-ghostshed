import Phaser from 'phaser'
import PlayerCharacter from '../objects/playerCharacter'

export default class TestGhostScene extends Phaser.Scene {

    PlayerCharacter: any;
    private map!: Phaser.Tilemaps.Tilemap
	private tiles!: Phaser.Tilemaps.Tileset 
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys

	constructor() {
		super('hello-world')
	}

	preload() {
		this.load.image('tileset_image', 'assets/tilemaps/tileset.png');
        this.load.tilemapTiledJSON('tilemap', 'assets/tilemaps/main.json');
        this.load.spritesheet('dude',
			'/assets/dude_edited.png',
			{ frameWidth: 32, frameHeight: 48 }
		);
	}

	create() {
        const map = this.make.tilemap({ key: 'tilemap' });
        const tiles = map.addTilesetImage('tileset', 'tileset_image');
        
        for (const layerName of map.getTileLayerNames()) {
            map.createLayer(layerName, tiles, 0, 0);
        }

        this.PlayerCharacter= new PlayerCharacter(this);
        //this.PlayerCharacter.startOnPath();
		
		this.cursors = this.input.keyboard.createCursorKeys();
	}

    update(time: any, delta: any) {
        if (this.cursors.left.isDown) {
			this.PlayerCharacter.update(time, delta, 2);
		}
		else if (this.cursors.right.isDown) {
			this.PlayerCharacter.update(time, delta, 3);
        }
		else if (this.cursors.up.isDown) {
			this.PlayerCharacter.update(time, delta, 4);
		}
		else if (this.cursors.down.isDown) {
			this.PlayerCharacter.update(time, delta, 1);
		}
    }

}
