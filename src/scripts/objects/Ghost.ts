
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

    protected toFadeIn = false;
    protected toFadeOut = false;
    protected fadeInBound = 1;
    protected fadeOutBound = 0.3;

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
        this.setAlpha(0)

        if (zone === 2) {
            this.zonePath = scene.add.path(230, 100);
            this.zonePath.lineTo(180, 100);
            this.zonePath.lineTo(180, 350);
        } else if (zone === 4) {
            this.zonePath = scene.add.path(300, 100);
            this.zonePath.lineTo(420, 100);
            this.zonePath.lineTo(420, 175)
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
        this.setAlpha(0) // Make this undiscovered until it's seen once
        this.setScale(1, 1)
    }

    initiateFadeIn(alpha:  number){
        this.toFadeIn = true;
        this.toFadeOut = false;        
        this.fadeInBound = alpha > 1 ? 1 : alpha
    }

    initiateFadeOut() {
        this.toFadeOut = true;
        this.toFadeIn = false;
    }

    fadeIn () {
        if (this.alpha <= this.fadeInBound){
            if(this.zone === 4){
                this.alpha += 0.01
                this.setAlpha(this.alpha)   
            }else{
                this.alpha += 0.02
                this.setAlpha(this.alpha)    
            }

            if (this.alpha >= this.fadeInBound) {
                this.toFadeIn = false
            } else {
                this.toFadeIn = true
            }
        }
    }

    fadeOut () {
        if (this.alpha >= this.fadeOutBound){
            if(this.zone === 4){
                this.alpha -= 0.01
                this.setAlpha(this.alpha)   
            }else{
                this.alpha -= 0.02
                this.setAlpha(this.alpha)    
            }

            if (this.alpha <= this.fadeOutBound) {
                this.toFadeOut = false
            } else {
                this.toFadeOut = true
            }
        }
    }

    // This function updates the ghosts position to move to the next position along the path
    update(time: any, delta: any)
    {

        // Make the ghost pulse when the player is less than 4 seconds from losing
        if (this.GAME_OVER_TIME - this.timeInZone <= 4000 || this.zone == 4 && this.follower.t >= 0.7) {
            if (time % 500 >= 250) {
                this.setAlpha(1)
                this.setScale(1.2, 1.2)
            } else {
                this.setAlpha(0.5)
                this.setScale(1, 1)
            }
        }

       
        if (this.toFadeIn){
            this.fadeIn()
        } else if (this.toFadeOut) {
            this.fadeOut()
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

    getZone(){
        return this.zone
    }

    isVisible(){
        return this.visible;
    }

    reset(){
        // reset the position of the ghost
        this.follower.t = 0;
        this.zonePath?.getPoint(this.follower.t, this.follower.vec);
        this.setPosition(this.follower.vec.x, this.follower.vec.y);
        // set follower.t to -1 so the ghost doesn't move
        this.follower.t = -1;
        // reset all fields
        this.isInPlayerZone = false;
        this.timeInZone = 0;
        this.timePaused = 0;
        this.gameOver = false;
        this.toFadeIn = false;
        this.fadeInBound = 1;
        this.toFadeOut = false;
        this.visible = false;
        this.GHOST_SPEED = 1/5000;
    }
}