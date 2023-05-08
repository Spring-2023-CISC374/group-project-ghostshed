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
    this.backgroundMusic = this.sound.add('menu-audio', {
      volume:1,
      loop:true
    })


    this.backgroundMusic.play()


    new Button(centerX - 100, centerY - 85, 'PLAY', this, () => { this.handlePlay() })
    new Button(centerX- 100, centerY - 10, 'TUTORIAL', this, () => { this.handleTutorial() })

    this.add.text(centerX-100, centerY/2, 'GHOST SHED', {
      fontFamily:"CustomFont",
    })
     .setFontSize(30)
     .setOrigin(0.5, 0.5)
     .setColor('#4B0101')

  }

  handlePlay () {
    this.backgroundMusic.destroy()
    this.sound.play('Button-sound')
    this.scene.start('RoomScene')
  }

  handleTutorial () {
    this.backgroundMusic.destroy()
    this.sound.play('Button-sound')
    this.scene.start('TutorialScene')
  }

}
