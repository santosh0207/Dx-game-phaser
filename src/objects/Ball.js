export default class Ball extends Phaser.Group {
    constructor(game) {
        super(game);
        this.game = game;
    }

    speed = 100;
    initialSpeed;
    unusedRewardBalls =[];

    init ({advantage,disAdvantage}) {

        this.initialSpeed = this.speed;
        this.ball = this.game.add.sprite(
            this.game.world.centerX,
            this.game.world.centerY,
            "ball"
        );
        this.ball.anchor.setTo(0.5,0.5);
        this.ball.scale.setTo(0.05,0.05);

        this.game.physics.enable(this.ball, Phaser.Physics.ARCADE);//enabling physics for ball
        this.ball.body.collideWorldBounds = true;// making it collide to the bounds except down
        this.ball.body.bounce.set(1);
        this.ball.checkWorldBounds = true;

        this.ball.body.velocity.set(this.speed,this.speed);

        for(let i=0;i<advantage.length;i++){
            this.ballFactory('0x00ff00',"advantage",advantage[i]);
        }

        for(let i=0;i<disAdvantage.length;i++){
            this.ballFactory('0xff0000',"disadvantage",disAdvantage[i]);
        }

    }
    
    ballFactory =(_tint,_type, _index)=>{

        let _ball= this.game.add.sprite(
            this.game.world.centerX,
            this.game.world.centerY,
            "ball"
        );

        _ball.anchor.setTo(0.5,0.5);
        _ball.scale.setTo(0.05,0.05);
        _ball.visible = true;
        this.game.physics.enable(_ball, Phaser.Physics.ARCADE);
        _ball.body.immovable = false;

        _ball.tint = _tint;
        _ball.type =_type;
        _ball.index = _index;

        this.unusedRewardBalls.push(_ball);

    }
}