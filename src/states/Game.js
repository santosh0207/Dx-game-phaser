export default class GameState extends Phaser.State {
    init() {
        this.ctaShown = false;
    }

    create() {
        //this.stage.backgroundColor = "#f00fff";
        this.game.gameState = this;
        this.gameGroup = this.game.add.group();

    }

    update() { }
    shuffle(array) {
        var currentIndex = array.length,
            temporaryValue,
            randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {
            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    }
    replaceString(string, _with, _to) {
        string = string.split("");
        let finalstr = "";
        for (let i = 0; i < string.length; i++) {
            if (string[i] == _with) {
                string[i] = _to;
            }
            finalstr += string[i];
        }
        return finalstr;
    }
    checkOverlap(spriteA, spriteB) {
        if (spriteA && spriteB) {
            var bounds1 = spriteA.getBounds();
            var bounds2 = spriteB.getBounds();
            if (Phaser.Rectangle.intersects(bounds1, bounds2)) return true;
            else return false;
        }
        return false;
    }
}