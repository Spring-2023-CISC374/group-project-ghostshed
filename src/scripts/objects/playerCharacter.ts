export default class Player extends Phaser.Physics.Arcade.Sprite {

    private movePath?: Phaser.Math.Vector2[]
    private endPath?: Phaser.Math.Vector2

    constructor(scene: Phaser.Scene) {
        super(scene, 315, 408, 'player');
        scene.add.existing(this);
    }

    moveAlong(path: Phaser.Math.Vector2[]){
        if(!path || path.length <= 0){
            return
        }

        this.movePath = path
        this.moveTo(this.movePath.shift()!)
    }

    moveTo(target: Phaser.Math.Vector2){
        this.endPath = target

    }

    update(){
        if (this.endPath){
            let dx = 0
            let dy = 0
            dx = this.endPath.x - this.x
            dy = this.endPath.y - this.y

            if (Math.abs(dx) < 5){
                dx = 0
            }
            if (Math.abs(dy) < 5){
                dy = 0
            }

            if (dx === 0 && dy === 0){
                if(this.movePath){
                    if (this.movePath.length > 0){
                        this.moveTo(this.movePath.shift()!)
                        return
                    }
                }
                this.endPath = undefined
            }
        }
    }
}