import Phaser from 'phaser'

export default class MainMenuScene extends Phaser.Scene {

	constructor() {
		super({ key: 'MainMenu' })
	}

  create() {
    this.scene.start('RoomScene')
  }

}
