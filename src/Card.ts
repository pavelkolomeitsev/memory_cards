import { CardPosition } from "./utils";

export class Card extends Phaser.GameObjects.Sprite {
    public value: number;
    public opened: boolean;

    constructor(scene: Phaser.Scene, value: number, position: CardPosition) {
        super(scene, position.x, position.y, "card");
        this.scene = scene;
        this.value = value;
        this.opened = false;
        this.setOrigin(0, 0);
        this.scene.add.existing(this);

        // make this sprite clickable
        this.setInteractive(); // it`s a flag which makes sprite interactive
    }

    public open() {
        // change one texture of the sprite into another one
        this.opened = true;
        this.setTexture("card" + this.value); // result - "card0", "card1" ...
    }

    public close() {
        this.opened = false;
        this.setTexture("card");
    }
}
