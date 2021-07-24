export default class GameState extends Phaser.State {

    ball = null;
    platform = null;
    
    speed = 100;
    lives = 3;

    tilesDiscription = {
       
    }

    rewardBalls = [];
    unusedRewardBalls = [];

    create = ()=> {

        this.stage.backgroundColor = "#038C8C";
        this.game.gameState = this;
        this.game.physics.startSystem(Phaser.Physics.ARCADE);// for starting the physics system
        this.game.physics.arcade.checkCollision.down = false;// to avoid bound in down side
        this.createTileDiscription();// provide number of rows and cols, default its 8x4
        this.assignPowerupGrid();// provide arguments advantages and disadvantages you want in game, By default its 1
        this.createPowerupBalls();
        this.createUI();
    }

    update = ()=> {         
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

    createTileDiscription =(numRow=8,numCol=4)=>{
        this.tilesDiscription.rows = numRow;
        this.tilesDiscription.cols = numCol;
        this.tilesDiscription.advantage = [];
        this.tilesDiscription.disAdvantage = [];
    }

    assignPowerupGrid =(numAdvantage=1,numDisAdvantage=1)=>{
        
        let _arr = [];
        for(let i=0;i<numAdvantage+numDisAdvantage;i++){
            let num;
            do{
                num = this.randomNumberGeneration(1,(this.tilesDiscription.rows*this.tilesDiscription.cols));
            }while(_arr.indexOf(num)!=-1)
            _arr.push(num)
        }

        this.tilesDiscription.advantage = _arr.slice(0, numAdvantage);
        this.tilesDiscription.disAdvantage = _arr.slice(numAdvantage, _arr.length);
    }

    createUI = ()=>{
        
        this.ball = this.game.add.sprite(
            this.world.centerX,
            this.world.centerY,
            "ball"
        );
        this.ball.anchor.setTo(0.5,0.5);
        this.ball.scale.setTo(0.05,0.05);

        this.game.physics.enable(this.ball, Phaser.Physics.ARCADE);//enabling physics for ball
        this.ball.body.collideWorldBounds = true;// making it collide to the bounds except down
        this.ball.body.bounce.set(1);
        this.ball.checkWorldBounds = true;
        this.ball.events.onOutOfBounds.add(this.checkGameOver, this);

        this.platform = this.game.add.sprite(
            this.world.centerX,
            this.world.centerY+this.world.height*0.45,
            "platform"
        );

        this.platform.anchor.setTo(0.5,0.5);
        this.platform.scale.setTo(0.1,0.1);
        this.game.physics.enable(this.platform, Phaser.Physics.ARCADE);
        this.platform.body.immovable = true;//makin it movable
        
        this.ball.x= this.game.world.centerX;
        this.ball.y= this.platform.y - this.platform.height*1;

        var style = { font: "20x Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };
        this.livesText = this.game.add.text(0, 0, "Lives left - "+this.lives, style);
        this.livesText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
        this.livesText.anchor.setTo(0.5,0.5);
        this.livesText.x = this.world.centerX-this.world.width*0.4;
        this.livesText.y= this.world.centerY-this.world.height*0.45;

        this.pause = this.game.add.sprite(
            this.world.centerX+this.world.width*0.45,
            this.world.centerY-this.world.height*0.45,
            "pause"
        );

        this.pause.inputEnabled = true;
        this.pause.events.onInputDown.add(this.onPauseClicked, this);

        this.pause.anchor.setTo(0.5,0.5);
        this.pause.scale.setTo(0.1,0.1);

        this.createGameTiles();

        this.ball.body.velocity.set(this.speed, -this.speed);
    }

    findRowWidth = (row)=>{
        let dummyTile =  this.tileFactory();
        let _width = dummyTile.width*row;
        dummyTile.destroy();
        return _width
    }
    createGameTiles =() =>{

        this.tileGroup = this.game.add.group();
        let tileCount = 0;
        let startPercentWidth =(this.findRowWidth(this.tilesDiscription.rows))*0.5;
        let startPosX = this.game.world.centerX - startPercentWidth;
        let startPosY = this.game.world.centerY- this.game.world.height*0.38;

        for(let i=0;i<this.tilesDiscription.cols;i++){
            for(let j=0;j<this.tilesDiscription.rows;j++){

                var _tile = this.tileFactory();
                _tile.x = startPosX;
                _tile.y = startPosY;
                tileCount++;

                startPosX += _tile.width*1.1;
                _tile.type = "normal";
                _tile.index = tileCount;

                if(this.tilesDiscription.advantage.indexOf(tileCount)!=-1){
                    _tile.tint = '0x00ff00';
                    _tile.type = "advantage";
                    
                    let _index = this.findIndex(this.unusedRewardBalls,tileCount,"index");

                    this.unusedRewardBalls[_index].x = _tile.x;
                    this.unusedRewardBalls[_index].y = _tile.y;

                }else if(this.tilesDiscription.disAdvantage.indexOf(tileCount)!=-1){
                    _tile.tint = '0xff0000';
                    _tile.type = "disadvantage";
                    
                    let _index = this.findIndex(this.unusedRewardBalls,tileCount,"index");
                    this.unusedRewardBalls[_index].x = _tile.x;
                    this.unusedRewardBalls[_index].y = _tile.y;
                }
                this.tileGroup.add(_tile);

            }
            startPosY += _tile.height*1.1;
            startPosX = this.game.world.centerX - startPercentWidth;
        }

    } 

    ballHitTile = (ball,tile)=>{

        if(tile.type =="advantage" || tile.type =="disadvantage"){
            var index = this.findIndex(this.unusedRewardBalls,tile.index,"index")
            this.rewardBalls[index]=this.unusedRewardBalls[index];
            this.unusedRewardBalls[index] = null;
            this.unusedRewardBalls = this.removeNullFromArray(this.unusedRewardBalls);
            this.rewardBalls[index].visible = true;
            this.rewardBalls[index].body.velocity.set(0, 150);
        }
        tile.kill();

        let tilealive = false;
        for(let i=0;i<this.tileGroup.children.length;i++){
            if(this.tileGroup.children[i].alive){
                tilealive = true;
                break;
            }
        }
        
        if(!tilealive){
            this.ball.body.velocity.set(0,0);
            setTimeout(this.gameOver,1000);
        }
    }
    
    addModel  = ( BtnText, _callback) =>{
    
        if(this.modalGroup){
            for(let i=0;i<this.modalGroup.children.length;i++){
                if(this.modalGroup.children[i]){
                    if(i==1){
                        this.modalGroup.children[i].children[0].setText(BtnText);
                        this.modalGroup.children[i].events.onInputDown.add(()=>{
                            this.removeModel();
                            _callback();
                        },this);
                    }
                    this.modalGroup.children[i].visible = true;
                }
            }
            return;
        }

        this.modalGroup = this.game.add.group();

        let modal = this.add.graphics(0, 0);
        modal.beginFill(0x000000);
        modal.drawRect(
            0,
            0,
            this.world.width,
            this.world.height
        );
        modal.alpha =0.5;
        this.modalGroup.add(modal);

        let submitBtn  = this.add.graphics(0, 0);
        submitBtn.beginFill(0xffffff);
        submitBtn.drawRect(
            this.game.world.centerX,
            this.game.world.centerY,
            70,
            30
        );
        submitBtn.anchor.setTo(0.5,0.5);
        
        submitBtn.x = submitBtn.x - submitBtn.width*0.5;
        submitBtn.y= submitBtn.y - submitBtn.height*0.5;

        var style = { font: "40x Arial", fill: "#000", align:"center"};
        let submitText= this.game.add.text(0, 0, BtnText, style);
        submitText.anchor.setTo(0.5,0.5);
        submitBtn.addChild(submitText);

        submitText.x = this.world.centerX + submitBtn.width*0.5 ;
        submitText.y= this.world.centerY + submitBtn.height*0.5;

        this.modalGroup.add(submitBtn);
        
        submitBtn.inputEnabled = true;
        submitBtn.events.onInputDown.add(()=>{
            this.removeModel();
            _callback();
        },this);

    }

    removeModel = () =>{
        this.isModalActive = false;
        for(let i=0;i<this.modalGroup.children.length;i++){
            if(this.modalGroup.children[i]){
                this.modalGroup.children[i].visible = false;
            }
        }
    }

    currentBallSpeed =[];
    onPauseClicked = ()=>{

        this.pause.inputEnabled = false;
        this.rewardBalls.map((e)=>{
            if(e.visible){
                e.body.velocity.set(0,0);
            }
        })
        this.currentBallSpeed.push(this.ball.body.velocity.x,this.ball.body.velocity.y);
        this.addModel("Play", ()=>{
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
        this.addModel("Game over", ()=>{
             location.reload();
       });  
    }

    executeReward =(_powerUpObj)=>{

        if(_powerUpObj.type=="advantage"){
            this.platform.scale.x = this.platform.scale.x *1.5;
        }else if(_powerUpObj.type=="disadvantage"){
            this.speed += this.speed;
        }
        
        //removing element from rewardArray for update to calculate less
        let index = this.findIndex(this.rewardBalls,_powerUpObj.type,"type");
        this.unusedRewardBalls.push(this.rewardBalls[index]);
        
        this.rewardBalls[index] = null;
        this.rewardBalls = this.removeNullFromArray(this.rewardBalls);

        _powerUpObj.kill();
    }

    checkGameOver = ()=>{
        // console.log(this.lives,"inside check game over");
        this.lives--;
        this.livesText.setText("Lives left - "+this.lives);
        if(this.lives){
            this.livesText.setText("Lives left - "+this.lives);
            this.ball.reset(this.world.centerX, this.world.centerY+this.world.height*0.4);
            this.platform.reset( this.world.centerX, this.world.centerY+this.world.height*0.45);
            this.pause.inputEnabled = false;
            this.addModel("Start over", ()=>{
                //this.speed = 100;
                this.ball.body.velocity.set(this.speed, -this.speed); 
                this.pause.inputEnabled = true;
           });
        }else{
            this.gameOver();
        }   
    }

    createPowerupBalls =() =>{

        for(let i=0;i<this.tilesDiscription.advantage.length;i++){
            this.ballFactory('0x00ff00',"advantage",this.tilesDiscription.advantage[i]);
        }

        for(let i=0;i<this.tilesDiscription.disAdvantage.length;i++){
            this.ballFactory('0xff0000',"disadvantage",this.tilesDiscription.disAdvantage[i]);
        }

    }

    ballFactory =(_tint,_type, _index)=>{

        let _ball= this.game.add.sprite(
            this.world.centerX,
            this.world.centerY,
            "ball"
        );
        _ball.anchor.setTo(0.5,0.5);
        _ball.scale.setTo(0.05,0.05);
        _ball.visible = false;
        this.game.physics.enable(_ball, Phaser.Physics.ARCADE);
        _ball.body.immovable = true;

        _ball.tint = _tint;
        _ball.type =_type;
        _ball.index = _index;

        this.unusedRewardBalls.push(_ball);

    }

    tileFactory =()=>{

        let _obj = this.game.add.sprite(
            this.world.centerX,
            this.world.centerY,
            "tile"
        );

        _obj.anchor.setTo(0.5,0.5);
        _obj.scale.setTo(0.1,0.1);
        this.game.physics.enable(_obj, Phaser.Physics.ARCADE);
        _obj.body.immovable = true;
       
        return _obj;
    }

    findIndex =(arr, value, prop)=>{
        return arr.map(function(e) { 
            return e[prop];
         }).indexOf(value);
    }

    removeNullFromArray =(array)=> {
        return array.filter(function (el) {
            return el != null;
          });
    }

    removeDuplicates =(array)=>{
        return [...new Set(array)]
    }

    randomNumberGeneration  = (min, max)=>{
        return Math.floor((Math.random() * max) + min);
    }
}