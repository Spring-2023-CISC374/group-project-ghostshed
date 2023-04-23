import Ghost from './Ghost'

export default class TutorialGhost extends Ghost {

    protected flashLightMode = false
    protected doorMode = false

    constructor(scene: Phaser.Scene, zone: number) {
        super(scene, zone);
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

    /**
     * Toggles whether this tutorial ghost should stop at the halfway point instead of proceeding after the pauseTime
     */
    public enableFlashlightModeOnly() {
        this.flashLightMode = !this.flashLightMode
    }

    /**
     * Toggles whether this tutorial ghost should go straight to the door instead or waiting for the pauseTime
     */
    public enableDoorModeOnly() {
        this.doorMode = !this.doorMode
    }

    update(_time: any, delta: any)
    {
        if (!this.fadedIn) {
            this.handleFadeIn()
        }

        if (this.isInPlayerZone){
            this.timeInZone += delta;
        }

        if (this.follower.t <= 1 && this.follower.t >= 0){
            if ((this.zone == 2 || this.zone == 3) && this.timePaused < this.PAUSE_TIME){
                if (this.follower.t >= 0.45 && this.follower.t <= 0.5){
                    if (!this.flashLightMode) {
                        //Don't increment the paused time so we never move if we are pasued time disabled
                        this.timePaused += delta;
                    }

                    if (this.doorMode) {
                        // Skip the wait period
                        this.timePaused = this.PAUSE_TIME
                    }

                    // set delta to 0 so the ghost doesn't move
                    delta = 0;
                }
            }
            
            this.follower.t += this.GHOST_SPEED * delta;
            this.zonePath?.getPoint(this.follower.t, this.follower.vec);
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
            // initiate the reverse
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