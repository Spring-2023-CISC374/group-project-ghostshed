import Ghost from './Ghost'

export default class TutorialGhost extends Ghost {

    protected flashLightMode = false
    protected doorMode = false

    constructor(scene: Phaser.Scene, zone: number) {
        super(scene, zone, 1);
        scene.add.existing(this);

        // initialize t as -1 so it doesn't move to start
        this.follower = { t: -1, vec: new Phaser.Math.Vector2() };
        this.zone = zone;
        this.visible = false
        this.alpha = 0

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
    }

    /**
     * Toggles whether this tutorial ghost should stop at the halfway point instead of proceeding after the pauseTime
     */
    public toggleFlashlightModeOnly() {
        this.flashLightMode = !this.flashLightMode
    }

    /**
     * Toggles whether this tutorial ghost should go straight to the door instead or waiting for the pauseTime
     */
    public toggleDoorModeOnly() {
        this.doorMode = !this.doorMode
    }

    update(time: any, delta: any)
    {
        if (this.toFadeIn){
            this.fadeIn()
        } else if (this.toFadeOut) {
            this.fadeOut()
        }

        // Make the ghost pulse when the player is less than 3 seconds from losing
        if (this.GAME_OVER_TIME - this.timeInZone <= 3000 && time % 500 >= 250){
            this.setScale(1.2, 1.2)
        } else {
            this.setScale(1, 1)
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
}