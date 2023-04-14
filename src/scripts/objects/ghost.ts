export default class Ghost extends Phaser.Physics.Arcade.Sprite {

    // https://gamedevacademy.org/how-to-make-tower-defense-game-with-phaser-3/
    // The follower.t value is the percentage of the path traversed
    private follower: { t: number, vec: Phaser.Math.Vector2};
    private zonePath?: Phaser.Curves.Path;
    private zone: number = 0;
    private isInPlayerZone: boolean = false;
    private timeInZone: number = 0;
    private timePaused: number = 0;
    public gameOver = false;

    private GHOST_SPEED: number = 1/3500;
    private PAUSE_TIME: number = 5000;
    private GAME_OVER_TIME: number = 8000;


    constructor(scene: Phaser.Scene, zone: number) {
        super(scene, 0, 0, 'ghost');
        scene.add.existing(this);

        // initialize t as -1 so it doesn't move to start
        this.follower = { t: -1, vec: new Phaser.Math.Vector2() };
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

    // This function initiates the movement of the ghost by setting the follower.t variable
    startOnPath()
    {
        // make sure the speed is positive
        if (this.GHOST_SPEED < 0) this.GHOST_SPEED *= -1;
        // ghost is moving so timePaused is 0
        this.timePaused = 0;

        // set the t parameter to the start of the path
        this.follower.t = 0;
        // get the point along the path based on the percentage of the path traveled (right now it is the start of the path, 0%)
        this.zonePath?.getPoint(this.follower.t, this.follower.vec);
        // set the position of the ghost to the point defined above
        this.setPosition(this.follower.vec.x, this.follower.vec.y);

        // show the ghost because they are now moving
        this.visible = true
    }

    // This function updates the ghosts position to move to the next position along the path
    update(_time: any, delta: any)
    {
        if (this.isInPlayerZone){
            this.timeInZone += delta;
        }

        if (this.timeInZone >= this.GAME_OVER_TIME){
            this.gameOver = true
        }

        if (this.follower.t <= 1 && this.follower.t >= 0){
            // The ghost will only pause in zone 2 or 3
            // The ghost will remain paused for PAUSE_TIME ms
            if ((this.zone == 2 || this.zone == 3) && this.timePaused < this.PAUSE_TIME){
                // The ghost is paused at 45% of the path - about halfway through
                if (this.follower.t >= 0.45 && this.follower.t <= 0.5){
                    this.timePaused += delta;
                    // set delta to 0 so the ghost doesn't move
                    delta = 0;
                }
            }

            // increase / decrease t value to move the ghost along the path
            // increase if moving forwards, decrease if moving backwards
            // depends on GHOST_SPEED >/< 0
            this.follower.t += this.GHOST_SPEED * delta;
            // get the point along the path based on the percentage of the path traveled
            this.zonePath?.getPoint(this.follower.t, this.follower.vec);
            // set the position of the ghost to the point defined above
            this.setPosition(this.follower.vec.x, this.follower.vec.y);

        } else if (this.follower.t > 1) {
            this.follower.t = 1;
        } else if (this.follower.t < 0 && this.follower.t != -1){
            this.follower.t = 0;
        } 
        
        this.isInPlayerZone = this.follower.t >= 1;
    }

    retreat(action :string){
        if ((((action == 'door') == (this.follower.t >= 1)) && ((action == 'flashlight') == (this.follower.t < 1)) || (action == 'hide'))){
            this.GHOST_SPEED = this.GHOST_SPEED * -1;
            // initiate the reverse by moving to the next point along the path
            this.zonePath?.getPoint(this.follower.t, this.follower.vec);
            this.setPosition(this.follower.vec.x, this.follower.vec.y);
            
            this.timeInZone = 0;
            this.visible = false

            if (this.isPaused()) this.timePaused = this.PAUSE_TIME;
            return true
        }else{
            return false
        }
    }

    isPaused(){
        return this.timePaused < this.PAUSE_TIME && this.timePaused > 0;
    }
}