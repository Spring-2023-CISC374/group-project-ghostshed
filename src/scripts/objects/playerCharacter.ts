export default class Player extends Phaser.Physics.Arcade.Sprite {
    //currently just a copy of ghosts
    // https://gamedevacademy.org/how-to-make-tower-defense-game-with-phaser-3/
    // https://phaser.io/examples/v3/view/paths/path-add-line-curve#
    private follower: { t: number, vec: Phaser.Math.Vector2};
    private zonePath?: Phaser.Curves.Path;
    private testingPath?: Phaser.Curves.Path;
    GHOST_SPEED: number = 1/800;

    constructor(scene: Phaser.Scene) {
        super(scene, 315, 408, 'dude');
        scene.add.existing(this);

        this.follower = { t: 0, vec: new Phaser.Math.Vector2() };

        this.testingPath = scene.add.path(315, 180);
        this.testingPath.lineTo(315, 480);
        //zone  4 red x = 320 y = 180
        //zone 3 blue x = 520 y = 350
        //zone 2 green x = 120 y = 350
        //zone 1 candles x = 320 y = 480
        
        let graphics = scene.add.graphics();    
        graphics.lineStyle(3, 0xffffff, 1);

        //this is the starting position
        this.zonePath = scene.add.path(315, 480);
        //this is the Zone 1 (candles)
        this.zonePath.lineTo(315, 480);
        //this is the Zone 2 (green)
        this.zonePath.lineTo(120, 350);
        //this is zone 4 (red)
        this.zonePath.lineTo(315, 180);
        //this is zone 3 (blue)
        this.zonePath.lineTo(520, 350);
        //this is going back to zone one
        this.zonePath.lineTo(315, 480);
        this.testingPath.draw(graphics, 128);
        this.zonePath.draw(graphics, 128);

        scene.tweens.add({
            targets: this.follower,
            t:1,
            repeat: -1
        });
    }

    startOnPath(){
        // set the t parameter at the start of the path
        this.follower.t = 0;
        // get x and y of the given t point            
        this.zonePath?.getPoint(this.follower.t, this.follower.vec);
        // set the x and y of our enemy to the received from the previous step
        this.setPosition(this.follower.vec.x, this.follower.vec.y);
    }

    update(time: any, delta: any, Zone:number){
        // move the t point along the path, 0 is the start and 0 is the end
        switch(Zone){
            //candle
            case 1:
                if(this.follower.vec.y <= 475){this.follower.t += this.GHOST_SPEED * delta;}
                break;
            //green
            case 2:
                if(this.follower.vec.y >= 355 && this.follower.vec.x >= 125){this.follower.t += this.GHOST_SPEED * delta;}
                break;
            //blue
            case 3:
                if(this.follower.vec.y <= 350 ){this.follower.t += this.GHOST_SPEED * delta;}
                console.log(this.follower.vec.y)
                break;
            //red
            case 4:
                    if(this.follower.vec.y >= 185){this.follower.t += this.GHOST_SPEED * delta;}
                break
        }
        // get the new x and y coordinates in vec
        this.zonePath?.getPoint(this.follower.t, this.follower.vec);
        
        // update enemy x and y to the newly obtained x and y
        this.setPosition(this.follower.vec.x, this.follower.vec.y);
    }
}