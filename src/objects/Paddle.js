export default class Paddle extends Phaser.Group {
    constructor(game) {
        super(game);
        this.game = game;
    }
    platform;
    initialScaleX;
    init() {
        
        this.platform = this.game.add.sprite(
            this.game.world.centerX,
            this.game.world.centerY+this.game.world.height*0.45,
            "platform"
        );

        this.platform.anchor.setTo(0.5,0.5);
        this.platform.scale.setTo(0.1,0.1);
        this.initialScaleX = this.platform.scale.x;
        this.game.physics.enable(this.platform, Phaser.Physics.ARCADE);
        this.platform.body.immovable = true;//makin it movable
    }
    
}
