import Ball from "../objects/Ball";
import Grid from "../objects/Grid";
import Paddle from "../objects/Paddle";
import HUD from "../objects/HUD";
import Modal from '../objects/Modal';
import {findIndex,removeNullFromArray,gridDiscription,assignPowerupGrid} from '../Utils/utils';

export default class GameState extends Phaser.State {

    ball = null;
    platform = null;
    tileGroup = null;
    livesText = null;
    speed = 0;
    lives = 3;

    tilesDiscription = {};

    rewardBalls = [];
    unusedRewardBalls = [];

    create (){

        this.stage.backgroundColor = "#038C8C";
        this.game.gameState = this;
        this.game.physics.startSystem(Phaser.Physics.ARCADE);// for starting the physics system
        this.game.physics.arcade.checkCollision.down = false;// to avoid bound in down side
        
        this.tilesDiscription = gridDiscription(3,3);// provide number of rows and cols, default its 8x4

        // provide arguments for number of advantages and disadvantages you want in game, By default its 1
        [this.tilesDiscription.advantage, this.tilesDiscription.disAdvantage ] = assignPowerupGrid();

        this.BallClass =  new Ball(this.game);
        this.BallClass.init(this.tilesDiscription);

        this.GridClass = new Grid(this.game);
        this.GridClass.init(this.tilesDiscription,this.BallClass.unusedRewardBalls);
        
        this.PaddleClass = new Paddle(this.game);
        this.PaddleClass.init();

        this.HUDClass = new HUD(this.game);
        this.HUDClass.init(this.lives);

        this.ModalClass = new Modal(this.game);
        
        /*providing alias for readability */
        this.pause = this.HUDClass.pause;
        this.platform = this.PaddleClass.platform;
        this.unusedRewardBalls = this.BallClass.unusedRewardBalls;
        this.tileGroup = this.GridClass.tileGroup;
        this.livesText = this.HUDClass.livesText;
        this.ball = this.BallClass.ball;
        this.speed = this.BallClass.speed;

        this.pause.events.onInputDown.add(this.onPauseClicked, this);
        this.ball.events.onOutOfBounds.add(this.checkGameOver, this);

    }

    update () {     

        if(this.pause.inputEnabled){
            this.game.physics.arcade.collide(this.ball, this.platform);
            this.game.physics.arcade.collide(this.ball, this.tileGroup, this.ballHitTile);
            this.platform.x = (this.game.input.x)  || this.game.world.width*0.5;
        }
        
        for(let i=0;i<this.rewardBalls.length;i++){
            if(this.rewardBalls[i]){    
                //condition check collion only when ball are active and no modal is present
                if(this.rewardBalls[i].visible){
                    this.game.physics.arcade.collide(this.rewardBalls[i], this.platform, this.executeReward);
                }
            }
        }

    }

    ballHitTile  = (ball,tile)=>{

        if(tile.type =="advantage" || tile.type =="disadvantage"){
            var index = findIndex(this.unusedRewardBalls,tile.index,"index")
            this.rewardBalls[index]=this.unusedRewardBalls[index];
            this.unusedRewardBalls[index] = null;
            this.unusedRewardBalls = removeNullFromArray(this.unusedRewardBalls);
            this.rewardBalls[index].visible = true;
            this.rewardBalls[index].body.velocity.set(0, this.speed);
        }
        tile.kill();

        if(this.GridClass.allDead()){
            this.ball.body.velocity.set(0,0);
            this.pause.inputEnabled = false;
            this.gameOver();
        }
    }
    
    currentBallSpeed =[];
    onPauseClicked =()=>{

        this.pause.inputEnabled = false;
        this.rewardBalls.map((e)=>{
            if(e.visible){
                e.body.velocity.set(0,0);
            }
        })
        this.currentBallSpeed.push(this.ball.body.velocity.x,this.ball.body.velocity.y);
        this.ModalClass.add("Play", ()=>{
            this.ball.body.velocity.set(this.currentBallSpeed[0], this.currentBallSpeed[1]);
            this.pause.inputEnabled = true;
            this.rewardBalls.map((e)=>{
                if(e.visible){
                    e.body.velocity.set(0,150);
                }
            })
        });

        this.ball.body.velocity.set(0,0);
    }

    gameOver =()=>{
        this.ModalClass.add("Game Complete", ()=>{
             location.reload();
       });  
    }

    executeReward = (_powerUpObj)=>{

        if(_powerUpObj.type=="advantage"){
            this.platform.scale.x = this.platform.scale.x *1.5;
        }else if(_powerUpObj.type=="disadvantage"){
            this.speed += this.speed*0.5;
            this.ball.body.velocity.set(this.speed, -this.speed); 

        }
        
        //removing element from rewardArray for update to calculate less
        let index = findIndex(this.rewardBalls,_powerUpObj.type,"type");
        this.unusedRewardBalls.push(this.rewardBalls[index]);
        
        this.rewardBalls[index] = null;
        this.rewardBalls = removeNullFromArray(this.rewardBalls);

        _powerUpObj.kill();
    }

    checkGameOver = ()=>{
        this.lives--;
        this.livesText.setText("Lives left - "+this.lives);
        if(this.lives){
            this.livesText.setText("Lives left - "+this.lives);
            this.ball.reset(this.game.world.centerX, this.game.world.centerY+this.game.world.height*0.4);
            this.platform.reset( this.game.world.centerX, this.game.world.centerY+this.world.height*0.45);
            this.pause.inputEnabled = false;

            this.ModalClass.add("Start over", ()=>{
                this.speed = this.BallClass.initialSpeed;
                this.platform.scale.x = this.PaddleClass.initialScaleX;
                this.ball.body.velocity.set(this.speed, -this.speed); 
                this.pause.inputEnabled = true;
           });

        }else{
            this.gameOver();
        }   
    }

}