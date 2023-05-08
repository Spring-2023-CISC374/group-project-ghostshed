import Phaser from 'phaser'
import BaseLevelScene from './BaseLevelScene'
import TutorialGhost from '../objects/TutorialGhost'
import { Sounds, TutorialStepText } from '../consts'
import Button from '../objects/Button'

export default class TutorialScene extends BaseLevelScene {

	paused!: boolean
	visitedZones!: Array<boolean>
	usedFlashlight = false
	usedDoor = false
	usedHide = false
	usedCandle = false
	curStep = 0

	timer!: Phaser.Time.TimerEvent
	timeText!: Phaser.GameObjects.Text
	timeCount = 0

	candleTimer!: Phaser.Time.TimerEvent

	textBoxText!: Phaser.GameObjects.Text

	finishButton!: Button

	private WINDOW_INTERVAL: number = 3000;

	leftArrowKey!: Phaser.GameObjects.Image[]
	rightArrowKey!: Phaser.GameObjects.Image[]
	upArrowKey!: Phaser.GameObjects.Image[]
	downArrowKey!: Phaser.GameObjects.Image[]
	fKey!: Phaser.GameObjects.Image[]
	dKey!: Phaser.GameObjects.Image[]
	hKey!: Phaser.GameObjects.Image[]
	cKey!: Phaser.GameObjects.Image[]
	animatedKeys: Phaser.GameObjects.Image[][] = []
	animatedKeysTimer!: Phaser.Time.TimerEvent
	animatedKeysIndex = 0

	constructor () {
		super({ key: 'TutorialScene' })
		this.paused = false
		this.visitedZones = [false, false, false, false]
		this.incrementStep()
	}

	loadSpriteSheetImagePair (x: number, y: number, asset: string, index: number, startShown: boolean = false) {
		const images = [this.add.image(x, y, asset, index), this.add.image(x, y, asset, index + 56)]

		images[0].setScale(2.75, 2.75)
		images[0].setVisible(startShown)
		images[1].setScale(2.75, 2.75)
		images[1].setVisible(false)
		return images
	}

	changeSpriteSheetImagePairLocation(x:number, y:number, images: Phaser.GameObjects.Image[]) {
		for (const image of images) {
			image.setPosition(x, y)
		}
	}

	toggleSpriteSheetImagePair (images: Phaser.GameObjects.Image[]) {
		for (const image of images) {
			image.setVisible(!image.visible)
		}
	}

	restartSpriteSheetImagePairAnimations () {

		for (const keyImage of this.animatedKeys) {
			keyImage[0].setVisible(false)
			keyImage[1].setVisible(false)
		}

		this.animatedKeysIndex = 0
		this.animatedKeys = []
	}

	animateSpriteSheetImagePair () {
		const prevImages = this.animatedKeys[this.animatedKeysIndex]

		this.toggleSpriteSheetImagePair(prevImages)
		this.animatedKeysIndex = (this.animatedKeysIndex + 1) % this.animatedKeys.length
		this.toggleSpriteSheetImagePair(this.animatedKeys[this.animatedKeysIndex])
	}

	startTimer () {
		this.timeText = this.add.text(200, 100, "Time Left To Survive: 30s", {
			font: '18px Arial'
		})

		this.timer = this.time.addEvent({
				delay: 1000,
				callback : this.countTime,
				callbackScope: this,
				loop: true
		  })
	}

	startAnimatedKeysTimer () {
		this.animatedKeysTimer = this.time.addEvent({
			delay: 1000,
			callback : this.animateSpriteSheetImagePair,
			callbackScope: this,
			loop: true
		})
	}

	startCandleTimer () {
		this.candleTimer = this.time.addEvent({
			delay: 2000,
			callback : this.countCandleTime,
			callbackScope: this,
			loop: true
		})
	}

	countTime(){
		this.timeCount += 1
		this.timeText.setText(`Time Left To Survive: ${Math.floor(30 - this.timeCount)}s`);

		// Spawn a window ghost every X seconds (if there is no ghost there)
		// current time is in seconds, constant variables are in ms
		if (!this.ghosts[2].isVisible() && (this.timeCount*1000) % this.WINDOW_INTERVAL === 0){
			this.ghosts[2].startOnPath()
		}

	}

	handleTextBox (step: number) {
		if (this.textBoxText) {
			this.textBoxText.setText(TutorialStepText[step - 1])
		}
	}

	handleFinish () {
		this.scene.start('RoomScene')
	}

	// Special killGhost function to handle special tutorial logic
	killGhost (action: string) {
		super.killGhost(action)
		
		if (this.curStep === 2 && action === 'flashlight') {
			this.usedFlashlight = true
		}

		if (this.curStep === 3 && action === 'door') {
			this.usedDoor = true
		}

		if (this.curStep === 4 && action === 'hide') {
			this.usedHide = true
		}
	}

	candleGhost(lightCandle: number){
		//let new_candles = this.litCandles += lightCandle
		if(lightCandle == -1){
			if(this.litCandles <= 0){
				console.log("Waste of breath")
				this.litCandles = 0
			}
			else{
				console.log("A candle was blown out")
				this.extinguishCandle(this.litCandles)
				this.litCandles -= 1
			}
		}
		else {
			if(this.litCandles < 4){
				this.lightCandle(this.litCandles)
				this.litCandles += 1
			}
		}
	}

	countCandleTime() {
		this.currentCandleTime += 1000
		//1 in 4 chance for candle to light
		if(this.currentCandleTime == 2000){
			this.chance = Math.floor(Math.random() * 4) + 1
		}
		//1 in 2 chance for candle to light
		else if(this.currentCandleTime == 3000){
			this.chance = Math.floor(Math.random() * 2) + 1
		}
		//guarantee chance for candle to light
		if(this.currentCandleTime == 5000){
			this.chance = 1
		}
		//if chance = 1, reset counter and light candle
		if(this.chance == 1){
			this.currentCandleTime = 0
			this.chance = 0
			this.candleGhost(1)
		}
	}

	incrementStep () {
		console.log(`Moving to step ${this.curStep + 1}`)
		this.curStep += 1
		this.handleTextBox(this.curStep)
	}

	checkStep () {
		switch (this.curStep) {
			case 1:
				let valid = true

				for (const visitedZone of this.visitedZones) {
					if (!visitedZone) {
						valid = false
					}
				}

				if (valid) {
					this.ghosts[0].startOnPath()

					this.restartSpriteSheetImagePairAnimations()
					this.animatedKeys = [this.leftArrowKey, this.fKey]

					this.leftArrowKey[1].setVisible(true)  // Start this key as pressed
					this.fKey[0].setVisible(true)
					this.changeSpriteSheetImagePairLocation(85, 485, this.leftArrowKey)

					this.incrementStep()
				}

				break
			case 2:
				if (this.usedFlashlight) {
					const ghost3 = this.ghosts[1] as TutorialGhost
					ghost3.overrideTValue(0.95) // Put it right next to the door

					this.restartSpriteSheetImagePairAnimations()
					this.animatedKeys = [this.rightArrowKey, this.dKey]

					this.rightArrowKey[1].setVisible(true) // Start this key as pressed (at index 1)
					this.dKey[0].setVisible(true)
					this.changeSpriteSheetImagePairLocation(85, 485, this.rightArrowKey)

					this.incrementStep()
				}
				break
			case 3:
				if (this.usedDoor) {
					this.ghosts[2].startOnPath()

					this.restartSpriteSheetImagePairAnimations()
					this.animatedKeys = [this.upArrowKey, this.hKey]

					this.upArrowKey[1].setVisible(true) // Start this key as pressed (at index 1)
					this.hKey[0].setVisible(true)
					this.changeSpriteSheetImagePairLocation(85, 485, this.upArrowKey)

					this.incrementStep()
				}
				break
			case 4:
				if (this.usedHide) {
					// Force light a candle to start
					this.lightCandle(this.litCandles)
					this.litCandles += 1

					this.restartSpriteSheetImagePairAnimations()
					this.animatedKeys = [this.downArrowKey, this.cKey]

					this.downArrowKey[1].setVisible(true) // Start this key as pressed (at index 1)
					this.cKey[0].setVisible(true)
					this.changeSpriteSheetImagePairLocation(85, 485, this.downArrowKey)

					this.incrementStep()
				}
				break
			case 5:
				if (this.usedCandle) {
					this.startCandleTimer()
					this.startTimer()

					// Clear the helper keys
					this.restartSpriteSheetImagePairAnimations()
					this.animatedKeysTimer.destroy()

					// Reset the ghosts to work like the real things
					const zone2Ghost = this.ghosts[0] as TutorialGhost
					const zone3Ghost = this.ghosts[1] as TutorialGhost
			
					zone2Ghost.toggleFlashlightModeOnly()
					zone3Ghost.toggleDoorModeOnly()

					zone2Ghost.startOnPath()

					this.incrementStep()
				}
				break
			case 6:
				if (this.timeCount === 30) {
					this.incrementStep()
					this.timeText.setVisible(false)
					this.finishButton.setVisible(true)
					this.timer.destroy()
					this.gameOver = true
				}
				break
			case 7:
				// Empty end step to wait for complete
				break
			default:
				console.error(`No tutorial step found for ${this.curStep}`)
		}
	}

	create() {
		super.create()

		// Setup the keyboard images
		this.upArrowKey = this.loadSpriteSheetImagePair(125, 450, 'keyboard', 0, true)
		this.toggleSpriteSheetImagePair(this.upArrowKey)
		this.downArrowKey = this.loadSpriteSheetImagePair(125, 485, 'keyboard', 1, true)
		this.leftArrowKey = this.loadSpriteSheetImagePair(85, 485, 'keyboard', 2, true)
		this.rightArrowKey = this.loadSpriteSheetImagePair(165, 485, 'keyboard', 3, true)

		this.fKey = this.loadSpriteSheetImagePair(145, 485, 'keyboard', 21)
		this.dKey = this.loadSpriteSheetImagePair(145, 485, 'keyboard', 19)
		this.hKey = this.loadSpriteSheetImagePair(145, 485, 'keyboard', 23)
		this.cKey = this.loadSpriteSheetImagePair(145, 485, 'keyboard', 18)

		this.animatedKeys = [this.upArrowKey, this.leftArrowKey, this.downArrowKey, this.rightArrowKey]

		this.startAnimatedKeysTimer()

		// Override the ghosts and set them as Tutorial ghosts
		for (const ghost of this.ghosts) {
			ghost.destroy(true)
		}

		this.ghosts = []
		this.ghosts.push(new TutorialGhost(this, 2))
		this.ghosts.push(new TutorialGhost(this, 3))
		this.ghosts.push(new TutorialGhost(this, 4))

		const zone2Ghost = this.ghosts[0] as TutorialGhost
		const zone3Ghost = this.ghosts[1] as TutorialGhost

		zone2Ghost.toggleFlashlightModeOnly()
		zone3Ghost.toggleDoorModeOnly()

		this.textBoxText = this.make.text({
			x: 450,
			y: 70,
			text: 'Hello World',
			origin: {
				x: 0.5,
				y: 0.5
			},
			style: {
				font: '18px Arial',
				wordWrap: { width: 400, useAdvancedWrap: true }
			}
		})

		this.handleTextBox(this.curStep)

		this.finishButton = new Button(750, 400, 'Finish', this, () => { this.handleFinish() }, 18, 10)
		this.finishButton.setVisible(false)

		// Inputs

		const hKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.H);

		hKey.on('down',  (_key:any, _event:any) => {

			console.log("Trying to Hide")
			if(this.curZone == 4){
				console.log("Hiding")
				this.killGhost("hide");
			}else{
				console.log("No wheres to hide")
			}
	
		});

		const fKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);

		fKey.on('down',  (_key:any, _event:any) => {

			console.log("Using Flashlight")
			if(this.curZone == 2|| this.curZone == 3){
				this.sound.play(Sounds.FLASHLIGHT)
				console.log("Shining Bright")
				this.killGhost("flashlight");
			}else{
				console.log("Wasting Light")
			}
	
		});

		const dKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

		dKey.on('down',  (_key:any, _event:any) => {

			console.log("Trying to close door")
			if(this.curZone == 2 || this.curZone == 3){
				this.sound.play(Sounds.CLOSE_DOOR)
				console.log("Door Closed")
				this.killGhost("door");
			}else{
				console.log("No door close")
			}
	
		});

		const cKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C);

		cKey.on('down',  (_key:any, _event:any) => {

			console.log("Trying to Blow out candle")
			if(this.curZone == 1){
				this.sound.play(Sounds.BLOW_CANDLES)
				this.candleGhost(-1)
				this.usedCandle = true
				console.log("Summoning Delayed")
			}else{
				console.log("Wasting Breath")
			}
	
		});


		const Zone1Key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
		Zone1Key.on('down',  (_key:any, _event:any) => {
			this.player.move(this.curZone, 1);
			this.sound.play(Sounds.MOVE)
			this.visitedZones[0] = true
		});

		const Zone2Key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
		Zone2Key.on('down',  (_key:any, _event:any) => {
			this.player.move(this.curZone, 2);
			this.sound.play(Sounds.MOVE)
			this.visitedZones[1] = true
		});

		const Zone3Key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
		Zone3Key.on('down',  (_key:any, _event:any) => {
			this.player.move(this.curZone, 3);
			this.sound.play(Sounds.MOVE)
			this.visitedZones[2] = true
		});

		const Zone4Key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
		Zone4Key.on('down',  (_key:any, _event:any) => {
			this.player.move(this.curZone, 4);
			this.sound.play(Sounds.MOVE)
			this.visitedZones[3] = true
		});


	}

	update(time: any, delta: any) {
		if (this.gameOver) {
			return
		}

		// Enable ghosts only for the 
		if (this.curStep !== 1) {
			for (let ghost of this.ghosts){

				// calculate distance from player and set the fade in bound
				if (this.curZone === ghost.getZone()){
					let alpha = 75 / this.calculateDistance(this.player.x, this.player.y, ghost.x, ghost.y)
					ghost.initiateFadeIn(alpha)
				}

				ghost.update(time, delta);
				let ghostsWin = ghost.gameOver
				if (ghostsWin){
					this.gameOver = true
					console.log("THE GAME IS OVER. THE GHOSTS WIN");
				}
			}
		}

		if (this.curStep > 5) {
			let dist = this.ghosts[0].getDistance()
			if (this.ghosts[0].isVisible() && !this.ghosts[1].isVisible() && dist >= 0.75 && dist <= 0.77){
				this.ghosts[1].startOnPath();
			}

			dist = this.ghosts[1].getDistance()
			if (this.ghosts[1].isVisible() && !this.ghosts[0].isVisible() && dist >= 0.75 && dist <= 0.77){
				this.ghosts[0].startOnPath();
			}
		}

		this.checkStep()
		
		let zone = this.player.update(time, delta);
		if (zone)
			this.curZone = zone;
	}
}
