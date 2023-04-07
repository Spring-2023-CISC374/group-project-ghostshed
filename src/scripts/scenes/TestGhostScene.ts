import Phaser from 'phaser'
import Ghost from '../objects/ghost'

export default class TestGhostScene extends Phaser.Scene {

    ghost2: any;
    ghost3: any;
    ghost4: any;

	constructor() {
		super({ key: 'TestGhostScene'})
	}

	create() {
        const map = this.make.tilemap({ key: 'tilemap' });
        const tiles = map.addTilesetImage('tileset', 'tileset_image');
        
        for (const layerName of map.getTileLayerNames()) {
            map.createLayer(layerName, tiles, 0, 0);
        }

        this.ghost2 = new Ghost(this, 2);
        this.ghost2.startOnPath();

        this.ghost3 = new Ghost(this, 3);
        this.ghost3.startOnPath();

        this.ghost4 = new Ghost(this, 4);
        this.ghost4.startOnPath();
	}

    update(time: any, delta: any) {
        this.ghost2.update(time, delta);
        this.ghost3.update(time, delta);
        this.ghost4.update(time, delta);
    }

}
