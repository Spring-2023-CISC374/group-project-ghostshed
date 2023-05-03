import Phaser from 'phaser'
import Button from '../objects/Button'

export default class MainMenuScene extends Phaser.Scene {

  trees!: Phaser.GameObjects.TileSprite

	constructor () {
		super({ key: 'MainMenu' })
	}

  create () {

    const { width, height } = this.scale // width and height of the current view
    const centerX = width / 2
    const centerY = height / 2

    //this.trees = this.add.tileSprite(0, 0, 0, 0, 'background').setOrigin(0, 0);
    
    this.add.video(400, 250, "Start-Animation").play(true)

    
    //this.trees.setScale(1, 0.75)

    new Button(200, 225, 'Play', this, () => { this.handlePlay() })
    new Button(325, 225, 'Tutorial', this, () => { this.handleTutorial() })

    this.add.text(300, 50, 'Ghost Shed')
    .setFontSize(60)
    .setOrigin(0.5, 0.5)
    .setColor("Red")

  }

  update () {
    //this.trees.tilePositionX -= 1;
  }

  handlePlay () {
    this.scene.start('RoomScene')
  }

  handleTutorial () {
    this.scene.start('TutorialScene')
  }

}
