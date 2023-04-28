import Phaser from 'phaser'

export default class PreloadScene extends Phaser.Scene {

	constructor() {
		super({ key: 'Preload' })
	}

	preload() {
		// Main Menu
		this.load.image('glass-panel', 'assets/ui/glassPanel.png')
		this.load.image('menu-ground', 'assets/ui/groundLayer1.png')
		this.load.image('cloud-layer-1', 'assets/ui/cloudLayer1.png')
		this.load.image('cloud-layer-2', 'assets/ui/cloudLayerB1.png')
		this.load.image('hills-layer', 'assets/ui/hills.png')
		this.load.image('background', 'assets/ui/backgroundForest.png')


		this.load.image('tileset_image', 'assets/tilemaps/tileset.png')
		this.load.tilemapTiledJSON('tilemap', 'assets/tilemaps/main.json')
		this.load.image('player', 'assets/tilemaps/character.png')
		this.load.image('ghost', '/assets/tilemaps/ghost.png');

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
	}

  create() {
    this.scene.start('MainMenu')
  }

}
