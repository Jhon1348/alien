import { GameScene } from '../GameScene';

export class Lab1 extends GameScene {
	constructor(){
        super('Lab1');
        
        this.portals.ascend = 'Area51';
        this.portals.descend = 'Lab2';
	}

	init(data){
		this.spawnPoint = {
            x:400,
            y:700
        };
        this.securityPoint = {
			x:220,
			y:310
		};
        if(data.hasOwnProperty('origin')){
            if(data.origin === 'Lab2') this.spawnPoint = {
                x:400,
                y:75
            }
        }
	}

	preload(){
		this.load.image('seckrit-lab-tiles', 'assets/tilemaps/scifitiles-sheet.png');
        this.load.tilemapTiledJSON('lab-1', 'assets/tilemaps/lab-1.json');

		super.preload();
	}

	create(){
        super.create({
			tileKey: 'seckrit-lab-tiles',
			mapKey: 'lab-1',
			tiledKey: 'seckrit-lab'
        });

		this.sentry = this.add.rpgcharacter({
			x: this.securityPoint.x,
			y: this.securityPoint.y,
			image: 'security',
			path: [
				{x: 220, y: 310},
                {x: 570, y: 310},
                {x: 570, y: 100},
                {x: 220, y: 100}
			],
			speed: 350
		});

		this.sentry2 = this.add.rpgcharacter({
			x: 220,
			y: 110,
			image: 'security',
			path: [
				{x: 220, y: 310},
                {x: 570, y: 310},
                {x: 570, y: 100},
                {x: 220, y: 100}
			],
			speed: 400
		});

		this.physics.add.collider(this.sentry, this.player, this.player.DoHit);
		this.physics.add.collider(this.sentry2, this.player, this.player.DoHit);
	}

	update(){
		super.update();

		this.sentry.update();
		this.sentry2.update();
	}
}