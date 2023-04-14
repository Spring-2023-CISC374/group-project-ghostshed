import Phaser from 'phaser'
import BaseLevelScene from './BaseLevelScene'
import { Sounds } from '../consts'

export default class RoomScene extends BaseLevelScene {

	constructor() {
		super({ key: 'RoomScene' })
	}

	create() {
		super.create()

		const TESTKEY = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
		TESTKEY.on('down',  (_key:any, _event:any) => {
			this.ghosts[0].startOnPath();
		});

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
			}else{
				console.log("Wasting Breath")
			}
	
		});


		const Zone1Key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
		Zone1Key.on('down',  (_key:any, _event:any) => {
			this.player.move(this.curZone, 1);
			this.sound.play(Sounds.MOVE)
		});

		const Zone2Key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
		Zone2Key.on('down',  (_key:any, _event:any) => {
			this.player.move(this.curZone, 2);
			this.sound.play(Sounds.MOVE)
		});

		const Zone3Key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
		Zone3Key.on('down',  (_key:any, _event:any) => {
			this.player.move(this.curZone, 3);
			this.sound.play(Sounds.MOVE)
		});

		const Zone4Key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
		Zone4Key.on('down',  (_key:any, _event:any) => {
			this.player.move(this.curZone, 4);
			this.sound.play(Sounds.MOVE)
		});
	}
	

	update(time: any, delta: any) {
		if(this.gameOver){
			return
		}
		for (let ghost of this.ghosts){
			ghost.update(time, delta);
			let ghostsWin = ghost.gameOver
			if (ghostsWin){
				this.gameOver = true
				console.log("THE GAME IS OVER. THE GHOSTS WIN");
			}
		}
		
		let zone = this.player.update(time, delta);
		if (zone)
			this.curZone = zone;
	}
}
