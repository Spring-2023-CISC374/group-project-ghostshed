import Phaser from 'phaser'
import Button from '../objects/Button'

export default class MainMenuScene extends Phaser.Scene {

	constructor () {
		super({ key: 'MainMenu' })
	}

  create () {

    const { width, height } = this.scale // width and height of the current view
    const centerX = width / 2
    const centerY = height / 2

    const button = new Button(centerX, centerY, 'Play', this, () => { this.handlePlay() })

    this.add.text(centerX, centerY - 100, 'Ghost Shed')
    .setFontSize(60)
    .setOrigin(0.5, 0.5)

  }

  handlePlay () {
    this.scene.start('RoomScene')
  }

}
