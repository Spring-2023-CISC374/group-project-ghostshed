export default class Ghost extends Phaser.Physics.Arcade.Sprite {

    // https://gamedevacademy.org/how-to-make-tower-defense-game-with-phaser-3/
    follower: { t: number, vec: Phaser.Math.Vector2};
    zonePath?: Phaser.Curves.Path;
    GHOST_SPEED: number = 1/5000;
    isInPlayerZone: boolean = false;
    timeInZone: number = 0;
    zone: number = 0;

    constructor(scene: Phaser.Scene, zone: number) {
        super(scene, 0, 0, 'dude');
        scene.add.existing(this);

        this.follower = { t: 0, vec: new Phaser.Math.Vector2() };

        this.zone = zone;
        //let graphics = scene.add.graphics();    
        //graphics.lineStyle(3, 0xffffff, 1);

        // Draw the right path for the corresponding zone
        if (zone === 2) {
            this.zonePath = scene.add.path(130, 100);
            this.zonePath.lineTo(80, 100);
            this.zonePath.lineTo(80, 350);
            //this.zonePath.draw(graphics);
        } else if (zone === 4) {
            this.zonePath = scene.add.path(280, 100);
            this.zonePath.lineTo(360, 100);
            //this.zonePath.draw(graphics);

            // zone 3 ghost moves back and forth faster
            this.GHOST_SPEED *= 2;
        } else if (zone === 3) {
            this.zonePath = scene.add.path(510, 100);
            this.zonePath.lineTo(560, 100);
            this.zonePath.lineTo(560, 350);
            //this.zonePath.draw(graphics);
        }
    }

    startOnPath()
    {
        // set the t parameter at the start of the path
        this.follower.t = 0;
        // get x and y of the given t point            
        this.zonePath?.getPoint(this.follower.t, this.follower.vec);
        // set the x and y of our enemy to the received from the previous step
        this.setPosition(this.follower.vec.x, this.follower.vec.y);
    }

    update(time: any, delta: any)
    {
        if (this.isInPlayerZone){
            // time in zone in MS
            this.timeInZone += delta;
        }

        // if the ghost is in the zone for more than 8 seconds the player loses
        if (this.timeInZone >= 8000){
            return true;
        }

        if (this.follower.t <= 1 && this.follower.t >= 0){
            // move the t point along the path, 0 is the start and 0 is the end
            this.follower.t += this.GHOST_SPEED * delta;

            // get the new x and y coordinates in vec
            this.zonePath?.getPoint(this.follower.t, this.follower.vec);

            // update enemy x and y to the newly obtained x and y
            this.setPosition(this.follower.vec.x, this.follower.vec.y);
        } else if (this.follower.t > 1) {
            this.follower.t = 1;
        } else if (this.follower.t < 0){
            this.follower.t = 0;
        }
        
        this.isInPlayerZone = this.follower.t >= 1;
    }

    retreat(){
        if (this.isInPlayerZone){
            console.log("IN ZONE");
            this.GHOST_SPEED = this.GHOST_SPEED * -1;
            // initiate the reverse
            this.zonePath?.getPoint(this.follower.t, this.follower.vec);
            this.setPosition(this.follower.vec.x, this.follower.vec.y);
        }
    }


    /**
     * Ghost Positions
     * 
     * Zone 2 (left door)
     *      Start: top left (130, 100)
     *      Pos 1: more left - requires flashlight to deter (80, 100)
     *      Pos 2: at door - requires door to be closed to deter (80, 350)
     * Zone 3 (top center - window)
     *      Start / only position: at window (320, 100) 
     * Zone 4 (right door)
     *      Start: top right (510, 100)
     *      Pos 1: more right - requires flashlight to deter (560, 100)
     *      Pos 2: at door - requires door to be closed to deter (560, 350)
     */
}