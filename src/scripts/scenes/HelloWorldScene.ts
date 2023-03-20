import Phaser from 'phaser'

export default class HelloWorldScene extends Phaser.Scene {

	private platforms?: Phaser.Physics.Arcade.StaticGroup;
	private player?: Phaser.Physics.Arcade.Sprite;
	private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
	private bombs?: Phaser.Physics.Arcade.Group;
	private stars?: Phaser.Physics.Arcade.Group;
	private gems?: Phaser.Physics.Arcade.Group;
	private score = 0;
	private scoreText?: Phaser.GameObjects.Text;
	private gameOver = false;

	private jumpCount = 0;

	constructor() {
		super('hello-world')
	}

	preload() {
		this.load.image('sky', '/assets/night_sky.png');
		this.load.image('ground', '/assets/platform_edited.png');
		this.load.image('star', '/assets/star_edited.png');
		this.load.image('gem', '/assets/gem.png');
		this.load.image('bomb', '/assets/bomb.png');
		this.load.spritesheet('dude',
			'/assets/dude_edited.png',
			{ frameWidth: 32, frameHeight: 48 }
		);
	}

	create() {
		// Background
		this.add.image(400, 300, 'sky');

		// Platforms
		this.platforms = this.physics.add.staticGroup();
		this.platforms.create(400, 568, 'ground').setScale(2).refreshBody();
		this.platforms.create(600, 400, 'ground');
		this.platforms.create(50, 250, 'ground');
		this.platforms.create(750, 220, 'ground');

		// Player
		this.player = this.physics.add.sprite(100, 450, 'dude');
		this.player.setBounce(0.2);
		this.player.setCollideWorldBounds(true);
		this.setPlayerAnimations();
		this.physics.add.collider(this.player, this.platforms);

		// Input / Cursors
		this.cursors = this.input.keyboard.createCursorKeys();

		// Stars
		this.stars = this.physics.add.group({
			key: 'star',
			repeat: 5,
			setXY: { x: 82, y: 0, stepX: 140 }
		});
		this.stars.children.iterate((c)=> {
			const child = c as Phaser.Physics.Arcade.Image;
			child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
		});
		this.physics.add.collider(this.stars, this.platforms);
		this.physics.add.overlap(this.player, this.stars, this.collectStar, undefined, this);


		// gems
		this.gems = this.physics.add.group({
			key: 'gem',
			repeat: 5,
			setXY: { x: 12, y: 0, stepX: 140 }
		});
		this.gems.children.iterate((c)=> {
			const child = c as Phaser.Physics.Arcade.Image;
			child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
		});
		this.physics.add.collider(this.gems, this.platforms);
		this.physics.add.overlap(this.player, this.gems, this.collectGem, undefined, this);


		// Score Text
		this.scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', color: '#FFF' });
		
		// Bombs
		this.bombs = this.physics.add.group();
		this.physics.add.collider(this.bombs, this.platforms);
		this.physics.add.collider(this.player, this.bombs, this.hitBomb, undefined, this);
	}

	update() {

		if (this.cursors?.left.isDown) {
			this.player?.setVelocityX(-160);
			this.player?.anims.play('left', true);
		}
		else if (this.cursors?.right.isDown) {
			this.player?.setVelocityX(160);
			this.player?.anims.play('right', true);
		}
		else {
			this.player?.setVelocityX(0);
			this.player?.anims.play('turn');
		}

		if (this.cursors){
			if (Phaser.Input.Keyboard.JustDown(this.cursors.up) && (this.jumpCount < 2)){
				this.jumpCount++;
				this.player?.setVelocityY(-330);
			} else if (this.player?.body.touching.down){
				this.jumpCount = 0;
			}
		}
	}

	collectStar(player: Phaser.GameObjects.GameObject, s: Phaser.GameObjects.GameObject) {
		const star = s as Phaser.Physics.Arcade.Image;
		star.disableBody(true, true);

		this.score += 10;
		this.scoreText?.setText(`score: ${this.score}`);

		// When all stars are collected, respawn stars and spawn a bomb
		if (this.stars?.countActive(true) == 0){
			this.stars.children.iterate((c)=>{
				const child = c as Phaser.Physics.Arcade.Image;
				child.enableBody(true, child.x, 0, true, true);
			});

			if (this.player){
				let x = (this.player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
				let i = 1;
				do {
					let bomb = this.bombs?.create(x, 16, 'bomb');
					bomb.setBounce(1);
					bomb.setCollideWorldBounds(true);
					bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
				} while (i++ < 2)
			}
		}
	}

	collectGem(player: Phaser.GameObjects.GameObject, c: Phaser.GameObjects.GameObject) {
		const gem = c as Phaser.Physics.Arcade.Image;
		gem.disableBody(true, true);

		this.score += 5;
		this.scoreText?.setText(`score: ${this.score}`);

		// If all gems are collected, spawn more gems and despawn 1 bomb
		if (this.gems?.countActive(true) == 0){
			this.gems.children.iterate((ch)=>{
				const child = ch as Phaser.Physics.Arcade.Image;
				child.enableBody(true, child.x, 0, true, true);
			});

			if (this.bombs?.countActive(true)){
				let bomb = this.bombs.children.entries.pop() as Phaser.Physics.Arcade.Image;
				bomb?.disableBody(true, true);
			}
		}
	}

	hitBomb(player: Phaser.GameObjects.GameObject, bomb: Phaser.GameObjects.GameObject){
		this.physics.pause();
		this.player?.setTint(0xff0000);
		this.player?.anims.play('turn');
		this.gameOver = true;
	}

	setPlayerAnimations(){
		// Move left animation
		this.anims.create({
			key: 'left',
			frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
			frameRate: 10,
			repeat: -1
		});

		// Turn around animation
		this.anims.create({
			key: 'turn',
			frames: [{ key: 'dude', frame: 4 }],
			frameRate: 20
		});

		// Move right animation
		this.anims.create({
			key: 'right',
			frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
			frameRate: 10,
			repeat: -1
		});
	}
}
