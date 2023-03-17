export default class ExampleObject extends Phaser.GameObjects.Sprite {

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'example-object');
        scene.add.existing(this);
    }
}