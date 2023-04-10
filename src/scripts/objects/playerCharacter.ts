export default class Player extends Phaser.Physics.Arcade.Sprite {

    follower: { t: number, vec: Phaser.Math.Vector2};
    zonePath?: Phaser.Curves.Path;
    
    zone1Path?: Phaser.Curves.Path;
    zone2Path?: Phaser.Curves.Path;
    zone3Path?: Phaser.Curves.Path;
    zone4Path?: Phaser.Curves.Path;

    speed: number = 1/2000;
    moving: boolean = false;
    targetZone: number = 0;

    constructor(scene: Phaser.Scene) {
        super(scene, 315, 500, 'player');
        scene.add.existing(this);

        this.follower = { t: 0, vec: new Phaser.Math.Vector2() };

        let graphics = scene.add.graphics();    
        graphics.lineStyle(3, 0xffffff, 1);

        this.zone1Path = scene.add.path(315, 350);
        this.zone1Path.lineTo(315, 500);
        //this.zone1Path.draw(graphics);

        this.zone2Path = scene.add.path(315, 350);
        this.zone2Path.lineTo(115, 350);
        //this.zone2Path.draw(graphics);

        this.zone3Path = scene.add.path(315, 350);
        this.zone3Path.lineTo(515, 350);
        //this.zone3Path.draw(graphics);

        this.zone4Path = scene.add.path(315, 350);
        this.zone4Path.lineTo(315, 200);
        //this.zone4Path.draw(graphics);
        
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

    update(time: any, delta: any)
    {
        if (this.moving){
            this.follower.t += this.speed * delta;
            this.zonePath?.getPoint(this.follower.t, this.follower.vec);
            this.setPosition(this.follower.vec.x, this.follower.vec.y);

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
        } 
    }
}