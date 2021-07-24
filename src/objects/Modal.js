export default class Modal extends Phaser.Group {
    constructor(game) {
        super(game);
        this.game = game;
    }
    modalGroup;

    add (BtnText, _callback){

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

        let modal = this.game.add.graphics(0, 0);
        modal.beginFill(0x000000);
        modal.drawRect(
            0,
            0,
            this.game.world.width,
            this.game.world.height
        );
        modal.alpha =0.5;
        this.modalGroup.add(modal);

        let submitBtn  = this.game.add.graphics(0, 0);
        submitBtn.beginFill(0xffffff);
        submitBtn.drawRect(
            this.game.world.centerX,
            this.game.world.centerY,
            80,
            30
        );
        submitBtn.anchor.setTo(0.5,0.5);
        
        submitBtn.x = submitBtn.x - submitBtn.width*0.5;
        submitBtn.y= submitBtn.y - submitBtn.height*0.5;

        var style = { font: "40x Arial", fill: "#000", align:"center"};
        let submitText= this.game.add.text(0, 0, BtnText, style);
        submitText.anchor.setTo(0.5,0.5);
        submitBtn.addChild(submitText);

        submitText.x = this.game.world.centerX + submitBtn.width*0.5 ;
        submitText.y= this.game.world.centerY + submitBtn.height*0.5;

        this.modalGroup.add(submitBtn);
        
        submitBtn.inputEnabled = true;
        submitBtn.events.onInputDown.add(()=>{
            this.removeModel();
            _callback();
        },this);

    }

    removeModel = () =>{
        for(let i=0;i<this.modalGroup.children.length;i++){
            if(this.modalGroup.children[i]){
                this.modalGroup.children[i].visible = false;
            }
        }
    }
    
}
