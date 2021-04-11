import { CardPosition } from "./utils";

export class Card extends Phaser.GameObjects.Sprite {
    public value: number;
    public opened: boolean;

    constructor(scene: Phaser.Scene, value: number, position: CardPosition) {
        super(scene, position.x, position.y, "card");
        this.scene = scene;
        this.value = value;
        this.opened = false;
        this.scene.add.existing(this);

        // make this sprite clickable
        this.setInteractive(); // it`s a flag which makes sprite interactive
    }

    private flipCard() {
        this.scene.tweens.add({
            targets: this,
            scaleX: 0,
            ease: "Linear",
            duration: 200,
            onComplete: () => {
                this.showCard(this)
            }
        });
    }

    private showCard(context: Card) {
        const texture = this.opened ? "card" + this.value : "card";
        // change one texture of the sprite into another one
        context.setTexture(texture); // result - "card0", "card1" ...
        context.scene.tweens.add({
            targets: context,
            scaleX: 1,
            ease: "Linear",
            duration: 200
        });
    }

    public open() {
        this.opened = true;
        this.flipCard();
    }

    public close() {
        this.opened = false;
        this.flipCard();
    }
}
