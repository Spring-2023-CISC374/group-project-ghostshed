export default class Ghost extends Phaser.Physics.Arcade.Sprite {

    // https://gamedevacademy.org/how-to-make-tower-defense-game-with-phaser-3/
    private follower: { t: number, vec: Phaser.Math.Vector2};
    private zonePath?: Phaser.Curves.Path;
    private zone: number = 0;
    private isInPlayerZone: boolean = false;
    private timeInZone: number = 0;
    private timePaused: number = 0;

    private GHOST_SPEED: number = 1/3500;
    private PAUSE_TIME: number = 5000;
    private GAME_OVER_TIME: number = 8000;


    constructor(scene: Phaser.Scene, zone: number) {
        super(scene, 0, 0, 'ghost');
        scene.add.existing(this);

        this.follower = { t: 0, vec: new Phaser.Math.Vector2() };
        this.zone = zone;

        if (zone === 2) {
            this.zonePath = scene.add.path(130, 100);
            this.zonePath.lineTo(80, 100);
            this.zonePath.lineTo(80, 350);
        } else if (zone === 4) {
            this.zonePath = scene.add.path(200, 100);
            this.zonePath.lineTo(320, 100);
        } else if (zone === 3) {
            this.zonePath = scene.add.path(510, 100);
            this.zonePath.lineTo(560, 100);
            this.zonePath.lineTo(560, 350);
        }
    }

    startOnPath()
    {
        if (this.GHOST_SPEED < 0) this.GHOST_SPEED *= -1;
        this.timePaused = 0;

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
            this.timeInZone += delta;
        }

        if (this.timeInZone >= this.GAME_OVER_TIME){
            return true;
        }

        if (this.follower.t <= 1 && this.follower.t >= 0){
            if ((this.zone == 2 || this.zone == 3) && this.timePaused < this.PAUSE_TIME){
                if (this.follower.t >= 0.45 && this.follower.t <= 0.5){
                    this.timePaused += delta;
                    // set delta to 0 so the ghost doesn't move
                    delta = 0;
                }
            }
            
            this.follower.t += this.GHOST_SPEED * delta;
            this.zonePath?.getPoint(this.follower.t, this.follower.vec);
            this.setPosition(this.follower.vec.x, this.follower.vec.y);

        } else if (this.follower.t > 1) {
            this.follower.t = 1;
        } else if (this.follower.t < 0){
            this.follower.t = 0;
        }
        
        this.isInPlayerZone = this.follower.t >= 1;
    }

    retreat(){
        if (this.isInPlayerZone || this.isPaused()){
            this.GHOST_SPEED = this.GHOST_SPEED * -1;
            // initiate the reverse
            this.zonePath?.getPoint(this.follower.t, this.follower.vec);
            this.setPosition(this.follower.vec.x, this.follower.vec.y);
            this.timeInZone = 0;

            if (this.isPaused()) this.timePaused = this.PAUSE_TIME;
        }
    }

    isPaused(){
        return this.timePaused < this.PAUSE_TIME && this.timePaused > 0;
    }
}