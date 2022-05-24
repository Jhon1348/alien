import Phaser from 'phaser';

export class IntroScene extends Phaser.Scene {
    constructor() {
		super({
			key: 'IntroScene'
        });

	}

	preload() {
        this.load.image('logo', 'assets/images/logo.png');
        this.load.image('play', 'assets/images/play.png');
    }

    create() {
        // Add the background image

        //this.input.setDefaultCursor('url(assets/images/blue.cur), pointer');

        this.splash = this.add.image(400, 150, 'logo').setInteractive({ cursor: 'pointer' });
        
        this.credits=	this.add.text(650, 540, 'Credits', {fontSize: '32px', fill:'#777'}).setScrollFactor(0).setDepth(1000);

        this.credits.setBackgroundColor('#21D7EE').setInteractive({ cursor: 'pointer' });

        this.tweens.add({
            targets: this.splash,
            y: 450,
            duration: 2000,
            ease: "Power2",
            yoyo: true,
            loop: -1
        });

        this.splash.setInteractive().on('pointerdown', () => { 
            this.scene.start('Area51');
        });

        this.credits.setInteractive().on('pointerdown', () => { 
           this.w= window.open('https://github.com/Jhon1348/alien',null)
        });
    }
}