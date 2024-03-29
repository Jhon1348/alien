import Phaser from 'phaser';

export class RpgCharacter extends Phaser.GameObjects.Sprite {
    constructor({ scene, x, y, image, name, path, speed }){
        super(scene, x, y, image);

        this.path = path || false;
        this.waypoint = 0;
        this.isHit = -1;
        this.hp = 3;
        this.name = name || "anonymous";
        this.speed = speed;
        this.image = image;


        this.instructions = [];


        scene.physics.world.enable(this, 0);

        scene.add.existing(this);
    }

    update(){

        if(this.isHit > 0){
			this.isHit--;
		}else if(this.isHit === 0){
            this.tint = 0xffffff;
            this.isHit = -1;
        }else{
            this.body.setVelocity(0);
            if(this.path) this.DoPatrol();
            this.DoInstructions();
            if(this.body && this.body.velocity.x == 0 && this.body.velocity.y == 0){ 
                this.anims.stopOnRepeat()
            }
        }
        
    }


    DoHalt(){
        this.body.setVelocity(0);
        this.anims.stopOnRepeat();
    }


    SetInstruction(instruction){
        if(!instruction.action) return;

        if(instruction.action == 'walk' && !instruction.option) return;

        this.instructions.push(instruction);
    }

    DoInstructions(){
        while(this.instructions.length > 0){

            let instruction = this.instructions.pop();
            switch(instruction.action){
                case 'walk':
                    this.DoWalk(instruction.option);
                    break;
            }
        }
    }


    DoWalk(direction){
        switch(direction){
            case 'left':
                this.body.setVelocityX(-this.speed);
                break;
            case 'right':
                this.body.setVelocityX(this.speed);
                break;
            case 'back':
                this.body.setVelocityY(-this.speed);
                break;
            case 'front':
                this.body.setVelocityY(this.speed);
                break;
        }

        this.body.velocity.normalize().scale(this.speed);

        if (this.body.velocity.y < 0) this.anims.play(this.image+'-walk-back', true);
        else if (this.body.velocity.y > 0) this.anims.play(this.image+'-walk-front', true);
        else if (this.body.velocity.x < 0) this.anims.play(this.image+'-walk-left', true);
        else if (this.body.velocity.x > 0) this.anims.play(this.image+'-walk-right', true);
    }


    DoPatrol(){
        if(!this.body) return;
        if(this.isHit >= 0) return;

        this.body.setVelocity(0);

        if(
            this.x >= this.path[this.waypoint].x-5 &&
            this.x <= this.path[this.waypoint].x+5 &&
            this.y >= this.path[this.waypoint].y-5 &&
            this.y <= this.path[this.waypoint].y+5
        ){
            this.waypoint++;
            if(this.waypoint >= this.path.length) this.waypoint = 0;
        }
        
        if(this.x < this.path[this.waypoint].x-5){

            this.SetInstruction({action: 'walk', option: 'right'});
        }else if(this.x > this.path[this.waypoint].x+5){

            this.SetInstruction({action: 'walk', option: 'left'});
        }else{
            this.x = this.path[this.waypoint].x;
        }
        if(this.y < this.path[this.waypoint].y-5){

            this.SetInstruction({action: 'walk', option: 'front'});
        }else if(this.y > this.path[this.waypoint].y+5){
            this.SetInstruction({action: 'walk', option: 'back'});

        }else{
            this.y = this.path[this.waypoint].y;
        }

    }


    DoHit(source, target){
        target.tint = 0xff0000;
        target.isHit = target.hp*5;
        target.hp--;
        target.body.setVelocity(-(source.x-target.x)*10, -(source.y-target.y)*10);
        source.body.setVelocity(0);
    }
}

export class GzRpgCharacterPlugin extends Phaser.Plugins.BasePlugin {

    constructor(pluginManager){
        super(pluginManager);

        pluginManager.registerGameObject('rpgcharacter', this.createRpgCharacter);
    }

    createRpgCharacter(params){
        return new RpgCharacter({scene: this.scene, ...params});
    }

}