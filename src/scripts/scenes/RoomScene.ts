import Phaser from 'phaser'
import BaseLevelScene from './BaseLevelScene'
import { Sounds } from '../consts'
import Button from '../objects/Button'

export default class RoomScene extends BaseLevelScene {

	protected timer!: Phaser.Time.TimerEvent
	protected candleTimer!: Phaser.Time.TimerEvent
	protected timeText: any
	protected currentTime:number = 0;
	protected currentCandleTime: number = 0
	protected litCandles: number = 0;
	protected candleTiles: Phaser.Tilemaps.Tile[] = []
	protected resetButton!: Button;
	protected backButton!: Button;

	private WINDOW_INTERVAL: number = 3000;

	constructor() {
		super({ key: 'RoomScene' })
	}

	init(data: {level:number}){
		this.level = data.level;
	}

	create() {
		super.create()
		this.timeText = this.add.text(200, 100, "Time: 0:00")
		
		this.resetButton = new Button(750, 400, 'RESTART', this, () => { this.resetLevel() })
		this.resetButton.setVisible(false)
		this.backButton = new Button(750, 460, 'BACK', this, () => { this.backToMain() })
		this.backButton.setVisible(false)


		this.createTimers()

		for(let i = 0; i < 4; i++){
			this.candleTiles.push(this.map.getLayer('Decorations Ground').data[15][8 + i])
		}
		
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
				console.log("Summoning Delayed")
				this.candleGhost(-1)
			}else{
				console.log("Wasting Breath")
			}
	
		});


		const Zone1Key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
		Zone1Key.on('down',  (_key:any, _event:any) => {
			if (!this.gameOver){
				this.player.move(this.curZone, 1);
				this.sound.play(Sounds.MOVE)
			}
		});

		const Zone2Key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
		Zone2Key.on('down',  (_key:any, _event:any) => {
			if (!this.gameOver){
				this.player.move(this.curZone, 2);
				this.sound.play(Sounds.MOVE)
			}
		});

		const Zone3Key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
		Zone3Key.on('down',  (_key:any, _event:any) => {
			if (!this.gameOver){
				this.player.move(this.curZone, 3);
				this.sound.play(Sounds.MOVE)
			}
		});

		const Zone4Key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
		Zone4Key.on('down',  (_key:any, _event:any) => {
			if (!this.gameOver){
				this.player.move(this.curZone, 4);
				this.sound.play(Sounds.MOVE)
			}
		});
	}

	backToMain(){
		this.scene.start('MainMenu')
	}
	
	countTime(){
		if(this.gameOver){
			this.timer.destroy()
		}
		this.currentTime += 1;
		
		// Spawn a window ghost every X seconds (if there is no ghost there)
		// current time is in seconds, constant variables are in ms
		if (!this.ghosts[2].isVisible() && (this.currentTime*1000) % this.WINDOW_INTERVAL === 0){
			this.ghosts[2].startOnPath()
		}

		this.timeText.setText(`Time: ${Math.floor(this.currentTime/60)}:${this.currentTime%60<10 ? `0${this.currentTime%60}`: this.currentTime%60}`);
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
			console.log("A candle is lit")
			if(this.litCandles >= 4){
				console.log("The Ghost is summoned - Game Over")
				this.candleTimer.destroy()
				this.gameOver = true
			} else {
				this.lightCandle(this.litCandles)
				this.litCandles += 1
			}
		}
	}

	countCandleTime(){
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

	update(time: any, delta: any) {
		if(this.gameOver){
			this.resetButton.setVisible(true)
			this.backButton.setVisible(true)
			return
		}

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
				this.candleTimer.destroy()
				console.log("THE GAME IS OVER. THE GHOSTS WIN");
			}
		}
		
		let dist = this.ghosts[0].getDistance()
		if (this.ghosts[0].isVisible() && !this.ghosts[1].isVisible() && dist >= 0.75 && dist <= 0.77){
			this.ghosts[1].startOnPath();
		}

		dist = this.ghosts[1].getDistance()
		if (this.ghosts[1].isVisible() && !this.ghosts[0].isVisible() && dist >= 0.75 && dist <= 0.77){
			this.ghosts[0].startOnPath();
		}

		let zone = this.player.update(time, delta);
		if (zone)
			this.curZone = zone;
	}

	createTimers(){
		this.timer = this.time.addEvent({
			delay:1000,
			callback : this.countTime,
			callbackScope: this,
			loop: true
		  })
		
		this.candleTimer = this.time.addEvent({
			delay:2000,
			callback : this.countCandleTime,
			callbackScope: this,
			loop: true
		})
	}

	resetCandles(){
		this.currentCandleTime = 0
		console.log(this.litCandles)
		console.log(this.candleTiles)
		for(let i = 1; i <= this.litCandles; i++){
			this.extinguishCandle(i)
		} 
		this.litCandles = 0
	}

	resetLevel() {
		this.createTimers()
		this.resetCandles()
		this.currentTime = 0
		this.curZone = 1
		this.timeText.setText(`Time: 0:00`)

		
		for (let ghost of this.ghosts){
			ghost.reset()
		}
		this.player.reset()
		this.ghosts[0].startOnPath()

		this.gameOver = false
		this.resetButton.setVisible(false)
	}
}
