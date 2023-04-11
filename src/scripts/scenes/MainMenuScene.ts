import Phaser from 'phaser'
import Button from '../objects/Button'

export default class MainMenuScene extends Phaser.Scene {

	constructor () {
		super({ key: 'MainMenu' })
	}

  create () {

    const { width, height } = this.scale // width and height of the current view

    const button = new Button(width / 2, height / 2, 'Play', this, () => { this.handlePlay() })

  }

  handlePlay () {
    this.scene.start('RoomScene')
  }

}
