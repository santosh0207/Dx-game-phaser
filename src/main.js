import BootState from "./states/Boot.js";
import PreloaderState from "./states/Preloader.js";
import GameState from "./states/Game.js";

class Game extends Phaser.Game {
    constructor() {
        let ratio = 1;

        super(480, 320, Phaser.CANVAS, "content", null);

        this.state.add("Boot", BootState, false);
        this.state.add("Preloader", PreloaderState, false);
        this.state.add("Game", GameState, false);

        this.state.start("Boot");
    }
}
window.game = new Game();

window.gameClose = function() {
    window.game.sound.stopAll();
    window.game.sound.mute = true;
};