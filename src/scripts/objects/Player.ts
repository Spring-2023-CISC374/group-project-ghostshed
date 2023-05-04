
export default class Player extends Phaser.Physics.Arcade.Sprite {

    private follower: { t: number, vec: Phaser.Math.Vector2};
    private zonePath?: Phaser.Curves.Path; 
    private zone1Path?: Phaser.Curves.Path;
    private zone2Path?: Phaser.Curves.Path;
    private zone3Path?: Phaser.Curves.Path;
    private zone4Path?: Phaser.Curves.Path;

    private speed: number = 1/750;
    private moving: boolean = false;
    private targetZone: number = 0;

    private light: Phaser.GameObjects.Light

    constructor(scene: Phaser.Scene) {
        super(scene, 415, 500, 'player');
        scene.physics.world.enable(this);
        scene.add.existing(this);

        this.light = scene.lights.addLight(this.x, this.y, 100).setScrollFactor(0.0);

        this.follower = { t: 0, vec: new Phaser.Math.Vector2() };

        this.zone1Path = scene.add.path(415, 350);
        this.zone1Path.lineTo(415, 500);

        this.zone2Path = scene.add.path(420, 350);
        this.zone2Path.lineTo(220, 350);

        this.zone3Path = scene.add.path(415, 350);
        this.zone3Path.lineTo(615, 350);

        this.zone4Path = scene.add.path(415, 350);
        this.zone4Path.lineTo(415, 200);        
    }

    move(currentZone: number, targetZone: number){
        if (currentZone === targetZone && !this.moving)
            return;

        if (!this.moving) {
            this.swapPaths(currentZone);
        }

        this.targetZone = targetZone;

        this.moving = true;
        if (this.follower.t <= 0)
            this.follower.t = 1;

        if (this.speed > 0) this.speed *= -1;
    }

    update(_time: any, delta: any): any
    {
        if (this.moving){
            this.follower.t += this.speed * delta;
            this.zonePath?.getPoint(this.follower.t, this.follower.vec);
            this.setPosition(this.follower.vec.x, this.follower.vec.y);

            this.light.x = this.x
            this.light.y = this.y

            if (this.follower.t <= 0){
                this.follower.t = 0;
                this.speed *= -1;
                this.swapPaths(this.targetZone);
            }

            if (this.follower.t >= 1){
                this.moving = false;
                return this.targetZone;
            }
        }
        
    }

    swapPaths(zone: number){
        if (zone === 1){
            this.zonePath = this.zone1Path;
        } else if (zone === 2){
            this.zonePath = this.zone2Path;
        } else if (zone === 3){
            this.zonePath = this.zone3Path;
        } else if (zone === 4){
            this.zonePath = this.zone4Path;
        } else {
            this.zonePath = this.zone1Path;
        }
    }

    reset(){
        this.moving = false
        this.follower.t = 0
        this.setPosition(415, 500)
        this.light.x = this.x
        this.light.y = this.y
    }
}