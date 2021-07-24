
export default class HUD extends Phaser.Group {
    constructor(game) {
        super(game);
        this.game = game;
    }
    pause;
    livesText;
    init(lives) {
        
        var style = { font: "20x Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };
        this.livesText = this.game.add.text(0, 0, "Lives left - "+lives, style);
        this.livesText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
        this.livesText.anchor.setTo(0.5,0.5);
        this.livesText.x = this.game.world.centerX-this.game.world.width*0.4;
        this.livesText.y= this.game.world.centerY-this.game.world.height*0.45;

        this.pause = this.game.add.sprite(
            this.game.world.centerX+this.game.world.width*0.45,
            this.game.world.centerY-this.game.world.height*0.45,
            "pause"
        );

        this.pause.inputEnabled = true;
        
        this.pause.anchor.setTo(0.5,0.5);
        this.pause.scale.setTo(0.1,0.1);
    }
    
}