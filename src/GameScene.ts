import { Card } from "./Card";
import { CardPosition, Offset } from "./utils";

export class GameScene extends Phaser.Scene {

    private cards: Card[] = [];
    private positionArray: CardPosition[] = [];
    private openCard: Card | null = null;
    private cardPairsCount: number = 0;

    constructor() {
        super({key: "game-scene"});
    }

    protected preload(): void {
        this.load.image("bg", "assets/background.png");
        this.load.image("card", "assets/card.png");
        this.load.image("card0", "assets/card1.png");
        this.load.image("card1", "assets/card2.png");
        this.load.image("card2", "assets/card3.png");
        this.load.image("card3", "assets/card4.png");
        this.load.image("card4", "assets/card5.png");
    }

    protected create(): void {
        this.createBackground();
        this.createCards();
    }

    private restartGame() {
        this.openCard = null;
        this.cardPairsCount = 0;
        Phaser.Utils.Array.Shuffle(this.positionArray); // make a random array
        for (let i = 0; i < this.cards.length; i++) {
            this.cards[i].close(); // close each card
            // set new position for each card
            this.cards[i].setPosition(this.positionArray[i].x, this.positionArray[i].y);
        }
    }

    private createBackground(): void {
        this.add.sprite(0, 0, "bg").setOrigin(0, 0);
    }

    private createCards(): void {
        this.positionArray = this.getCardsPosition();
        Phaser.Utils.Array.Shuffle(this.positionArray); // make a random array

        // create a list of cards` pairs
        let index: number = 0;
        for (let i: number = 0; i < this.positionArray.length; i++) {
            if (i >= 5) {
                this.cards.push(new Card(this, index, this.positionArray[i]));
                ++index;
            } else {
                this.cards.push(new Card(this, i, this.positionArray[i]));
            }
        }

        // assign listener to each card
        this.cards.forEach((card: Card) => {
            card.on("pointerdown", () => this.openCardClick(card), this);
        });
    }

    private openCardClick(card: Card): void {
        // if clicked card is already opened, nothing
        if (card.opened) {
            return;
        }

        if (this.openCard) { // remember the last opened card in prop this.openCard
            if (this.openCard.value === card.value) { // compare prop this.openCard and new card
                this.openCard = null; // clean prop
                this.cardPairsCount++;
            } else {
                // textures are different
                this.openCard.close(); //  -> close the previous card through prop-pointer this.openCard
                this.openCard = card; // assign newly opened card to prop this.openCard
            }
        } else {
            this.openCard = card; // assign newly opened card to prop this.openCard
        }
        // open new card
        card.open();

        // check if all cards` pairs are opened
        if (this.cardPairsCount === this.cards.length / 2) {
            this.restartGame();
        }
    }

    private getCardsPosition(): CardPosition[] {
        const cardsPosition: CardPosition[] = [];
        const cardTexture = this.textures.get("card").getSourceImage() as HTMLImageElement;
        const cardWidth: number = cardTexture.width + 4;
        const cardHeight: number = cardTexture.height + 4;

        for (let row = 0; row < 2; row++) {
            for (let col = 0; col < 5; col++) {
                cardsPosition.push({
                    x: Offset.OFFSET_X + col * cardWidth,
                    y: Offset.OFFSET_Y + row * cardHeight,
                });
            }
        }
        return cardsPosition;
    }
}
