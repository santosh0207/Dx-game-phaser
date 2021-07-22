export default class extends Phaser.State {
    init() {
        this.stage.backgroundColor = "#000000";
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.stage.disableVisibilityChange = false;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
    }

    create() {
        this.state.start("Preloader");
    }
}