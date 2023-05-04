import Phaser from 'phaser'

export default class PreloadScene extends Phaser.Scene {

	constructor() {
		super({ key: 'Preload' })
	}

	preload() {
		this.load.image('tileset_image', 'assets/tilemaps/tileset.png')
		this.load.tilemapTiledJSON('tilemap', 'assets/tilemaps/main.json')
		this.load.image('player', 'assets/tilemaps/character.png')
		this.load.image('ghost', 'assets/tilemaps/ghost.png');

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

		//Background Music
		this.load.audio("audio", `audio/audio.mp3`)

		//VIDEO
		this.load.video("Start-Animation", 'audio/Start-Animation.mp4')
	}

  create() {
    this.scene.start('MainMenu')
  }

}
