import {findIndex} from "../Utils/utils"
export default class Grid extends Phaser.Group {
    constructor(game) {
        super(game);
        this.game = game;
    }
    tileGroup;
    init(tilesDiscription,unusedRewardBalls) {
        
        this.tileGroup = this.game.add.group();
        let tileCount = 0;
        let startPercentWidth =(this.findRowWidth(tilesDiscription.rows))*0.5;
        let startPosX = this.game.world.centerX - startPercentWidth;
        let startPosY = this.game.world.centerY- this.game.world.height*0.38;

        for(let i=0;i<tilesDiscription.cols;i++){
            for(let j=0;j<tilesDiscription.rows;j++){

                var _tile = this.tileFactory();
                _tile.x = startPosX;
                _tile.y = startPosY;
                tileCount++;

                startPosX += _tile.width*1.1;
                _tile.type = "normal";
                _tile.index = tileCount;

                if(tilesDiscription.advantage.indexOf(tileCount)!=-1){
                    _tile.tint = '0x00ff00';
                    _tile.type = "advantage";
                    
                    let _index = findIndex(unusedRewardBalls,tileCount,"index");

                    unusedRewardBalls[_index].x = _tile.x;
                    unusedRewardBalls[_index].y = _tile.y;

                }else if(tilesDiscription.disAdvantage.indexOf(tileCount)!=-1){
                    _tile.tint = '0xff0000';
                    _tile.type = "disadvantage";
                    
                    let _index = findIndex(unusedRewardBalls,tileCount,"index");
                    unusedRewardBalls[_index].x = _tile.x;
                    unusedRewardBalls[_index].y = _tile.y;
                }
                this.tileGroup.add(_tile);

            }
            startPosY += _tile.height*1.1;
            startPosX = this.game.world.centerX - startPercentWidth;
        }
    
    }

    findRowWidth = (row)=>{
        let dummyTile =  this.tileFactory();
        let _width = dummyTile.width*row;
        dummyTile.destroy();
        return _width
    }

    
    tileFactory (){

        let _obj = this.game.add.sprite(
            this.game.world.centerX,
            this.game.world.centerY,
            "tile"
        );

        _obj.anchor.setTo(0.5,0.5);
        _obj.scale.setTo(0.1,0.1);
        this.game.physics.enable(_obj, Phaser.Physics.ARCADE);
        _obj.body.immovable = true;
       
        return _obj;
    }

    allDead(){
        
        for(let i=0;i<this.tileGroup.children.length;i++){
            if(this.tileGroup.children[i].alive){
                return false;
            }
        }

        return true;
    }
}