export default class Ghost extends Phaser.Physics.Arcade.Sprite {

    // https://gamedevacademy.org/how-to-make-tower-defense-game-with-phaser-3/
    protected follower: { t: number, vec: Phaser.Math.Vector2};
    protected zonePath?: Phaser.Curves.Path;
    protected zone: number = 0;
    protected isInPlayerZone: boolean = false;
    protected timeInZone: number = 0;
    protected timePaused: number = 0;
    public gameOver = false;
    protected fadedIn = false

    protected GHOST_SPEED: number = 1/3500;
    protected PAUSE_TIME: number = 5000;
    protected GAME_OVER_TIME: number = 8000;


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
        this.visible = true
        this.setAlpha(0)
        this.fadedIn = false
    }

    handleFadeIn () {
        const newAlpha = this.alpha += 0.02

        this.setAlpha(newAlpha)

        if (newAlpha === 1) {
            this.fadedIn = true
        }
    }

    update(_time: any, delta: any)
    {
        if (!this.fadedIn) {
            this.handleFadeIn()
        }
        
        if (this.isInPlayerZone){
            this.timeInZone += delta;
        }

        if (this.timeInZone >= this.GAME_OVER_TIME){
            this.gameOver = true
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