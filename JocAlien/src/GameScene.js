import Phaser from 'phaser';
import { Anims } from './anims';

export class GameScene extends Phaser.Scene {
	constructor(sceneName) {
		super({
			key: sceneName
		});

		this.controls = null; // User controls
		this.cursors = null;
		this.player = null;
		this.star = null;
		this.score=0;
		this.audio=null;
		this.scoretxt=null;
		this.audiosecu=null;

		this.spawnPoint = null;

		this.portals = {};

		this.animsManager = new Anims(this);
	}
	
	init(data){ }

	preload() {
		this.load.json('scriptdata', 'assets/data/script.json');
		this.load.image('heart', 'assets/images/heart_full.png');
		this.load.image('star', 'assets/images/star.png');
		this.load.audio('music','assets/music/sandwich.mp3');
		this.load.audio('musicWin','assets/music/win.mp3');
		this.load.audio('musicSecu','assets/music/assets_sounds_hit.wav');
		this.animsManager.preload();
	}

	create(settings) {
		//star
		this.star=this.physics.add.group({ immovable: true,allowGravity: false});


		//music
		this.audio = this.sound.add('music',{loop:true});
		this.audio.play();

		this.audiosecu = this.sound.add('musicSecu',{loop:false});
		
		this.audioWin = this.sound.add('musicWin',{loop:false});

		//keyboard controls
		this.cursors = this.input.keyboard.createCursorKeys();

		//player character
		window.player = this.player = this.add.rpgcharacter({
			x: this.spawnPoint.x,
			y: this.spawnPoint.y,
			name: 'zeta',
			image: 'zeta',
			speed: 225
		});

		this.player.setTexture("zeta", "zeta-front");


		if(this.game.global.playerHp !== -1) this.player.hp = this.game.global.playerHp;
		if(this.game.global.score !== 0) this.score = this.game.global.score;
		
		const map = this.make.tilemap({ key: settings.mapKey });

		const tileset = map.addTilesetImage(settings.tiledKey, settings.tileKey);

		const backgroundLayer = map.createStaticLayer('Background', tileset, 0, 0);
		const interactiveLayer = map.createStaticLayer('Interactive', tileset, 0, 0);
		const scriptLayer = map.createStaticLayer('Script', tileset, 0, 0);
		let overheadLayer = map.createStaticLayer('Overhead', tileset, 0, 0);


		interactiveLayer.setCollisionByProperty({ collide: true });

		this.physics.add.collider(this.player, interactiveLayer, this.HitInteractiveLayer.bind(this));

		//object layer
		const objectLayer = map.getObjectLayer('Script');
		// Convert object layer objects to Phaser game objects
		if(objectLayer && objectLayer.objects){
			objectLayer.objects.forEach(
				(object) => {
					let tmp = this.add.rectangle((object.x+(object.width/2)), (object.y+(object.height/2)), object.width, object.height);
					tmp.properties = object.properties.reduce(
						(obj, item) => Object.assign(obj, { [item.name]: item.value }), {}
					);
					this.physics.world.enable(tmp, 1);
					this.physics.add.collider(this.player, tmp, this.HitScript, null, this);
				}
			);
		}

		const coins =map.getObjectLayer('coins').objects;
		for(const star of coins){
			this.star.create(star.x,star.y, 'star').setDepth(1);
		}

		this.physics.add.overlap(this.player, this.star, this.collectStar, null, this);
		// if(coins && coins.objects){
		// 	coins.objects.forEach(
		// 		(object) => {
		// 			this.star= this.add.image(448, 1088, 'star');
		// 			this.physics.add.overlap(this.player, this.star, this.collectStar, null, this);
		// 		}
		// 	);
		// }


		this.player.setDepth(10);

		overheadLayer.setDepth(20);



		const camera = this.cameras.main;
		camera.startFollow(this.player);
		camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

		camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
		

		this.animsManager.create();

		this.script = this.cache.json.get('scriptdata');

		this.hearts = this.add.container(700, 32).setScrollFactor(0).setDepth(1000);
		for(let idx=0; idx<this.player.hp; idx++ )
			this.hearts.add(this.add.image((idx*20), 0, 'heart')).setRandomPosition;

		this.scoretxt=	this.add.text(16, 16, 'Score: '+this.game.global.score, {fontSize: '32px', fill:'#000'}).setScrollFactor(0).setDepth(1000)
			
		// this.star = this.add.container(450, 1100);
		// for(let idx=0; idx<100; idx++ )
		// 	this.star.add(this.add.image((idx*20), 0, 'star'));


		//this.star= this.add.image(448, 1088, 'star');

		//this.star.create(450, 1100, 'star');

		//this.physics.add.overlap(this.player, this.star, this.collectStar, null, this);
	}

	update(time, delta) {

		// Update player health
		this.game.global.playerHp = this.player.hp;


		if( this.gzDialog.visible ){
			if( this.cursors.space.isDown ){
				this.gzDialog.display(false);
			}
			return false;
		}

		if (this.cursors.left.isDown)
			this.player.SetInstruction({action: 'walk', option: 'left'});
		else if (this.cursors.right.isDown)
			this.player.SetInstruction({action: 'walk', option: 'right'});

		if (this.cursors.up.isDown)
			this.player.SetInstruction({action: 'walk', option: 'back'});
		else if (this.cursors.down.isDown)
			this.player.SetInstruction({action: 'walk', option: 'front'});

		this.player.update();

		// End game
		if(this.player.hp <= 0 && this.player.isHit <= 0){
			this.player.destroy();
			console.log('you dead');
			this.scene.start('EndScene');
			this.audio.stop();
			this.game.global.score=0;
			this.score=0;
		}else{
			if(this.hearts.list.length > this.player.hp){
				this.hearts.removeAt(this.hearts.list.length-1, true);
				this.audiosecu.play();
			}
		}

		return true;
	}


	HitInteractiveLayer(player, target){
		if(target.properties && target.properties.portal && this.portals[target.properties.portal]) 
			this.scene.start(this.portals[target.properties.portal], {origin:this.scene.key});
	}


	HitScript(player, target){
		if(target.properties.name && !this.gzDialog.visible){
			player.anims.stopOnRepeat();
			this.gzDialog.setText(this.script[player.name][target.properties.name]);
		}

		if(target.properties.name=="strawhat"){
			this.gzDialog.display(false);
			//this.player.destroy();
			this.audio.stop();

			this.audioWin.play();

			this.win=	this.add.text(190, 150, 'You Win!', {fontSize: '80px', fill:'#777'}).setScrollFactor(0).setDepth(1000);

        	this.win.setBackgroundColor('#DEEE21').setInteractive({ cursor: 'pointer' });
		
			this.win.setInteractive().on('pointerdown', () => { 
				this.scene.start('IntroScene');
			 });
		}
	}

	collectStar (player, star)
    {
        star.disableBody(true, true);

		this.score+=10;
		this.game.global.score=this.score;

		this.scoretxt.setText('Score: ' +this.score)
    }
	
}
