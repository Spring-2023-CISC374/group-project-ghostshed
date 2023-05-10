import Phaser from 'phaser'
import Button from '../objects/Button'

export default class PreloadScene extends Phaser.Scene {

	button!: Button
	progressBar!: Phaser.GameObjects.Graphics
	progressBox!: Phaser.GameObjects.Graphics

	constructor() {
		super({ key: 'Preload' })
	}

	preload() {
		// Load the logo video before we display anything
		this.load.video('logo', 'assets/loading/loading.mp4')
	}

	setupProgressBar () {
		this.progressBar = this.add.graphics();
		this.progressBox = this.add.graphics();
		this.progressBox.fillStyle(0x222222, 0.8);
		this.progressBox.fillRect(260, 380, 320, 50);
	}

  create() {
		const { width, height } = this.scale // width and height of the current view
    const centerX = width / 2
    const centerY = height / 2
    
    const video = this.add.video(centerX, centerY - 100, "logo")
		video.setScale(0.45, 0.45)
		video.play(true)

		this.button = new Button(centerX, centerY + 85, 'CONTINUE', this, () => { this.scene.start('MainMenu') }, 20, 10)
		this.button.setVisible(false)

		this.setupProgressBar()

		// Load everything now that the loading screen is up

		this.load.image('tileset_image', 'assets/tilemaps/tileset.png')
		this.load.tilemapTiledJSON('tilemap', 'assets/tilemaps/main.json')
		this.load.image('player', 'assets/tilemaps/character.png')
		this.load.image('ghost', 'assets/tilemaps/ghost.png');

		// Keyboard sprites
		this.load.spritesheet('keyboard', 'assets/tutorial/Keyboard.png', { frameWidth: 16, frameHeight: 16})

		// AUDIO
		this.load.audio('Blow Candles', 'audio/BlowOutCandle.mp3');
		this.load.audio('Light Candle 1', 'audio/Candle1.mp3');
		this.load.audio('Light Candle 2', 'audio/Candle2.mp3');		
		this.load.audio('Light Candle 3', 'audio/Candle3.mp3');
		this.load.audio('Door Close', 'audio/DoorClosing.mp3');
		this.load.audio('Flashlight', 'audio/Flashlight.mp3');
		this.load.audio('Ghost Breath 1', 'audio/GhostBreathing1.mp3');
		this.load.audio('Ghost Breath 2', 'audio/GhostBreathing2.mp3');
		this.load.audio('Ghost Breath 3', 'audio/GhostBreathing3.mp3');
		this.load.audio('Ghost Move', 'audio/GhostFootsteps.mp3');
		this.load.audio('Ghost Move Left', 'audio/GhostFootstepsLeft.mp3');
		this.load.audio('Ghost Move Right', 'audio/GhostFootstepsRight.mp3');
		this.load.audio('Ghost Hit By Flashlight', 'audio/GhostHitByFlashlight.mp3');
		this.load.audio('Hide', 'audio/Hide.mp3');
		this.load.audio('Move', 'audio/PlayerFootsteps.mp3');
		this.load.audio('Window Close', 'audio/WindowClosing.mp3');
		this.load.audio('Window Open', 'audio/WindowOpening.mp3');
		this.load.audio('Window Knock 1', 'audio/WindowKnock1.mp3');
		this.load.audio('Window Knock 2', 'audio/WindowKnock2.mp3');
		this.load.audio('Window Knock 3', 'audio/WindowKnock3.mp3');
		this.load.audio("Button-sound", 'audio/Boo-sound-effect.mp3')

		//Background Music
		this.load.audio("menu-audio", `audio/audio.mp3`)

		//VIDEO
		this.load.video("Start-Animation", 'audio/Start-Animation.mp4')

		this.load.on('progress', (value: number) => {
			this.progressBar.clear()
			this.progressBar.fillStyle(0xffffff, 1)
			this.progressBar.fillRect(270, 390, 300 * value, 30)
		})

		this.load.on('complete', () => {
			this.progressBar.destroy()
			this.progressBox.destroy()
			this.button.setVisible(true)
		})

		this.load.start()
  }

}
