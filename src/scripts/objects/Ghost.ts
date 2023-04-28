
export default class Ghost extends Phaser.Physics.Arcade.Sprite {

    // https://gamedevacademy.org/how-to-make-tower-defense-game-with-phaser-3/
    // The follower.t value is the percentage of the path traversed
    protected follower: { t: number, vec: Phaser.Math.Vector2};
    protected zonePath?: Phaser.Curves.Path;
    protected zone: number = 0;
    protected isInPlayerZone: boolean = false;
    protected timeInZone: number = 0;
    protected timePaused: number = 0;
    public gameOver = false;
    protected fadedIn = false

    protected GHOST_SPEED: number = 1/5000;
    protected PAUSE_TIME: number = 2000;
    protected GAME_OVER_TIME: number = 6000;


    constructor(scene: Phaser.Scene, zone: number, level: number) {
        super(scene, 0, 0, 'ghost');
        scene.add.existing(this);
        this.setDepth(1)
        // initialize t as -1 so it doesn't move to start
        this.follower = { t: -1, vec: new Phaser.Math.Vector2() };
        this.zone = zone;
        this.visible = false

        if (zone === 2) {
            this.zonePath = scene.add.path(230, 100);
            this.zonePath.lineTo(180, 100);
            this.zonePath.lineTo(180, 350);
        } else if (zone === 4) {
            this.zonePath = scene.add.path(300, 100);
            this.zonePath.lineTo(420, 100);
            this.zonePath.lineTo(420, 200)
            this.GHOST_SPEED = 1/12000
        } else if (zone === 3) {
            this.zonePath = scene.add.path(610, 100);
            this.zonePath.lineTo(660, 100);
            this.zonePath.lineTo(660, 350);
        }

        switch(level){
            case 1:
                this.GHOST_SPEED *= 1;
                break;
            case 2:
                this.GHOST_SPEED *= 1.5;
                break;
            case 3: 
                this.GHOST_SPEED *= 2;
                break;
            default:
                this.GHOST_SPEED *= 1;
                break;
        }
    }

    // This function initiates the movement of the ghost by setting the follower.t variable
    startOnPath()
    {
        this.playMoveSound();

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
        this.setAlpha(0)
        this.fadedIn = false
    }

    handleFadeIn () {
        let newAlpha = 0
        if(this.zone === 4){
            newAlpha = this.alpha += 0.01

            this.setAlpha(newAlpha)   
        }else{
            newAlpha = this.alpha += 0.02

            this.setAlpha(newAlpha)    
        }
       
        if (newAlpha === 1) {
            this.fadedIn = true
        }
    }

    // This function updates the ghosts position to move to the next position along the path
    update(time: any, delta: any)
    {

        // Make the ghost pulse when the player is less than 3 seconds from losing
        if ((this.GAME_OVER_TIME - this.timeInZone <= 3000 || this.zone == 4 && this.follower.t >= 0.7) && time % 500 >= 250){
            this.setScale(1.2, 1.2)
        } else {
            this.setScale(1, 1)
        }

        if (!this.fadedIn) {
            this.handleFadeIn()
        }
        if (this.isInPlayerZone){
            this.timeInZone += delta;
        }

        if (this.timeInZone >= this.GAME_OVER_TIME){
            this.gameOver = true
        }
        if((this.zone === 4) && this.follower.t >= 1){
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

                if (this.timePaused >= this.PAUSE_TIME){
                    this.playMoveSound()
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
        if ((((action == 'door') == (this.follower.t >= 1)) && ((action == 'flashlight') == (this.follower.t < 1)) || ((action == 'hide'))) && this.visible){
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

    playMoveSound(){
        if (this.zone === 2)
            this.scene.sound.play('Ghost Move Left')
        else if (this.zone === 3)
            this.scene.sound.play('Ghost Move Right')
        else if (this.zone === 4)
            this.scene.sound.play('Ghost Move')
    }

    isPaused(){
        return this.timePaused < this.PAUSE_TIME && this.timePaused > 0;
    }

    getDistance(){
        return this.follower.t;
    }

    isVisible(){
        return this.visible;
    }

    reset(){
        this.follower.t = -1;
        this.isInPlayerZone = false;
        this.timeInZone = 0;
        this.timePaused = 0;
        this.gameOver = false;
        this.fadedIn = false;
        this.GHOST_SPEED = 1/5000;
    }
}