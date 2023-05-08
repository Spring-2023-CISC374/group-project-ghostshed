import Phaser from 'phaser'
import Button from '../objects/Button'

export default class MainMenuScene extends Phaser.Scene {

protected backgroundMusic:any
protected playButton?:Button
protected tutorialButton?:Button
protected creditButton?:Button
protected Level1Button?:Button
protected Level2Button?:Button
protected Level3Button?:Button
protected backButton?:Button

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

    this.playButton = new Button(centerX - 100, centerY - 90, 'PLAY', this, () => { this.showButtons(false) })
    this.tutorialButton = new Button(centerX- 100, centerY - 30, 'TUTORIAL', this, () => { this.handleTutorial() })
    this.creditButton = new Button(centerX- 100, centerY + 30, 'CREDIT', this, () => { this.handleCredits() })
    this.Level1Button = new Button(centerX - 100, centerY - 90, 'EASY', this, () => { this.handlePlay(1) })
    this.Level1Button.setVisible(false)
    this.Level2Button= new Button(centerX- 100, centerY - 30, 'MEDIUM', this, () => { this.handlePlay(2) })
    this.Level2Button.setVisible(false)
    this.Level3Button = new Button(centerX- 100, centerY + 30, 'DIFICULT', this, () => { this.handlePlay(3) })
    this.Level3Button.setVisible(false)
    this.backButton = new Button(centerX- 100, centerY + 90, 'BACK', this, () => { this.showButtons(true) })
    this.backButton.setVisible(false)


    this.add.text(centerX-100, centerY/2, 'GHOST SHED', {
      fontFamily:"CustomFont",
    })
     .setFontSize(30)
     .setOrigin(0.5, 0.5)
     .setColor('#4B0101')

  }

  showButtons(firstSet:boolean){
    this.playButton?.setVisible(firstSet)
    this.tutorialButton?.setVisible(firstSet)
    this.creditButton?.setVisible(firstSet)
    this.Level1Button?.setVisible(!firstSet)
    this.Level2Button?.setVisible(!firstSet)
    this.Level3Button?.setVisible(!firstSet)
    this.backButton?.setVisible(!firstSet)
  }

  handleCredits(){
    //this.handleSound()
    //this.scene.start('something for the credit')

  }

  handleSound(){
    this.backgroundMusic.destroy()
    this.sound.play('Button-sound')
  }

  handlePlay (level:number) {
    this.handleSound()
    this.scene.start('RoomScene', {level: level})
  }

  handleTutorial () {
    this.handleSound()
    this.scene.start('TutorialScene')
  }

}
