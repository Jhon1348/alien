import { GameScene } from '../GameScene';

export class Area51 extends GameScene {
	constructor(){
		super('Area51');
		this.portals.lab = 'Lab1';
	}

	init(data){
		this.spawnPoint = {
			x:450,
			y:1200
		}
		this.securityPoint = {
			x:780,
			y:170
		}
		if(data.hasOwnProperty('origin')){
			if(data.origin === 'Lab1') this.spawnPoint = {
				x:688,
				y:236
			}
		}
	}

	preload(){
		this.load.image('tiles', 'assets/tilemaps/Area-51.png');
		this.load.image('tiles2', 'assets/tilemaps/trees.png');
		this.load.tilemapTiledJSON('map', 'assets/tilemaps/area-51.json');
		this.load.image('saucer', 'assets/images/saucer.png');
		this.load.image('star', 'assets/images/star.png');
		// this.load.audio('audioArea51','');

		super.preload();
	}

	create(){
		super.create({
			tileKey: 'tiles',
			// tileKey: 'tiles2',
			mapKey: 'map',
			tiledKey: 'Area-51'
		});

		this.sentry = this.add.rpgcharacter({
			x: this.securityPoint.x,
			y: this.securityPoint.y,
			image: 'security',
			path: [
				{x: 570, y: 170},	// top left
				{x: 570, y: 250},	// bottom left
				{x: 780, y: 250},	// bottom right
				{x: 780, y: 170}	// top right
			],
			speed: 400
		});

		
		this.sentry2 = this.add.rpgcharacter({
			x: 1300,
			y: 900,
			image: 'security',
			path: [
				{x: 1000, y: 900},
                {x: 1000, y: 700},
                {x: 1300, y: 700},
                {x: 1300, y: 900}
			],
			speed: 350
		});

		// this.splash = this.add.image(450, 1200, 'star');
		// this.tweens.add({
        //     targets: this.splash,
        //     y: 1100,
        //     duration: 2000,
        //     ease: "Power2",
        //     yoyo: true,
        //     loop: -1,
		// 	speed:200
        // });
		// this.splash = this.physics.add.group({
		// 	key: 'star',
		// 	repeat: 11,
		// 	setXY: { x: 12, y: 0, stepX: 70 }
		// });

		// this.splash.children.iterate(function (child) {

		// 	child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
		
		// });


		this.physics.add.collider(this.sentry2, this.player, this.player.DoHit);
		this.physics.add.collider(this.sentry, this.player, this.player.DoHit);
		// this.physics.add.overlap(this.player, this.splash, this.splash.);

	}

	update(){
		if(super.update()){
			this.sentry.update();
			this.sentry2.update();
		}else{
			this.sentry.DoHalt();
			this.sentry2.DoHalt();
		}
	}
}