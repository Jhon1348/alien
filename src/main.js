import '../app-shell.css';
import '../styles/main.scss';

import 'phaser';
import { Area51 } from './scenes/Area51';
import { Lab1 } from './scenes/Lab1';
import { Lab2 } from './scenes/Lab2';
import { EndScene } from './scenes/EndScene';
import { IntroScene } from './scenes/IntroScene';
import { GzRpgCharacterPlugin } from './plugins/GzRpgCharacter';
import { GzDialog } from './plugins/GzDialog';

const gameConfig = {
	type: Phaser.AUTO,
	width: 800,
	height: 600,
	parent: 'phaser-game',
	dom: {
		createContainer: true
	},
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 0 },
			debug: false
		}
	},
	plugins: {
        global: [
            { key: 'GzRpgCharacterPlugin', plugin: GzRpgCharacterPlugin, start: true }
		],
		scene: [
            { key: 'gzDialog', plugin: GzDialog, mapping: 'gzDialog' }
        ]
    },
	scene: [
		IntroScene,
		Area51,
		Lab1,
		Lab2,
		EndScene
	]
};

const phaserGame = new Phaser.Game(gameConfig);

phaserGame.global = {
	playerHp: -1,
	score:0,
}