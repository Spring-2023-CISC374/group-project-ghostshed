import Phaser from 'phaser'
import Button from '../objects/Button'

export default class MainMenuScene extends Phaser.Scene {

backgroundMusic:any

	constructor () {
		super({ key: 'MainMenu' })
	}

  create () {

    const { width, height } = this.scale // width and height of the current view
    const centerX = width / 2
    const centerY = height / 2
    
    this.add.video(centerX, centerY, "Start-Animation").play(true)

    this.backgroundMusic = this.sound.add(`audio`, {
      volume:.5,
      loop:true
    })


    this.backgroundMusic.play()


    new Button(centerX - 75, centerY - 25, 'Play', this, () => { this.handlePlay() })
    new Button(centerX- 75, centerY - 100, 'Tutorial', this, () => { this.handleTutorial() })

    this.add.text(centerX-100, centerY/2, 'Ghost Shed', {
      fontFamily:"CustomFont",
    })
     .setFontSize(60)
     .setOrigin(0.5, 0.5)
     .setColor("Red")

  }

  handlePlay () {
    this.backgroundMusic.destroy()
    this.scene.start('RoomScene')
  }

  handleTutorial () {
    this.backgroundMusic.destroy()
    this.scene.start('TutorialScene')
  }

}
