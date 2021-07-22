export default class extends Phaser.State {
    init() {
        this.questionImageArray = [];
    }

    preload() {
        this.load.image("Loading_1", "assets/loadingbar/Loading_1.png");
        this.load.image("Loading_4", "assets/loadingbar/Loading_4.png");
        this.load.image("Loading", "assets/loadingbar/Loding.png");
    }

    create() {
        this.load.onLoadStart.add(this.loadStart, this);
        this.load.onFileComplete.add(this.fileComplete, this);
        this.load.onLoadComplete.add(this.loadComplete, this);

        this.loadImage1 = this.game.add.sprite(
            this.world.centerX,
            this.world.centerY,
            "Loading_1"
        );
        this.loadImage1.anchor.setTo(0.5, 0.5);

        this.loadImage3 = this.game.add.sprite(
            this.world.centerX,
            this.world.centerY,
            "Loading"
        );

        this.loadImage3.anchor.setTo(0.5, 0.5);
        this.loadImage3.y = this.loadImage1.y + this.loadImage1.height * 2;
        this.loadImage3.x =
            this.loadImage1.x -
            this.loadImage1.width * 0.5 +
            this.loadImage3.width * 0.5;
        this.start();
    }
    start() {
        // Images
      
        // Spritesheet
        this.load.atlasJSONHash("sheet", "assets/sheet.png", "assets/sheet.json");
        this.load.start();
    }
    loadStart() {
        //console.log("inisde load start");
    }

    //	This callback is sent the following parameters:
    fileComplete(progress, cacheKey, success, totalLoaded, totalFiles) {
        if (this.mask) {
            this.mask.destroy();
            this.mask = null;
        }
        this.mask = this.add.graphics(0, 0);
        this.mask.beginFill(0x800000);
        this.mask.drawRect(
            this.loadImage1.x - this.loadImage1.width * 0.5,
            this.loadImage1.y - this.loadImage1.height * 0.5,
            this.loadImage1.width * (progress / 100),
            this.loadImage1.height
        );
    }

    loadComplete() {
        this.loadImage3.visible = false;
        this.state.start("Game");
    }
}