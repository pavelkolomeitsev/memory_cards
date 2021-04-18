import { Card } from "./Card";
import { CardPosition, Sound, Offset, startTime } from "./utils";

export class GameScene extends Phaser.Scene {

    private cards: Card[] = [];
    private positionArray: CardPosition[] = [];
    private sounds: Sound = null;
    private openCard: Card | null = null;
    private cardPairsCount: number = 0;
    private timeText: Phaser.GameObjects.Text | undefined;
    private timer: Phaser.Time.TimerEvent = new Phaser.Time.TimerEvent({});
    private timeout: number = 0;

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

        this.load.audio("theme", "assets/sounds/theme.mp3");
        this.load.audio("card", "assets/sounds/card.mp3");
        this.load.audio("complete", "assets/sounds/complete.mp3");
        this.load.audio("success", "assets/sounds/success.mp3");
        this.load.audio("timeout", "assets/sounds/timeout.mp3");
    }

    protected create(): void {
        this.timeout = startTime;
        // order of elements MATTERS!!!
        this.createSounds();
        this.createBackground();
        this.createCards();
        this.createTimer();
        this.createText();
    }

    private createSounds() {
        this.sounds = {
            theme: this.sound.add("theme"),
            card: this.sound.add("card"),
            complete: this.sound.add("complete"),
            success: this.sound.add("success"),
            timeout: this.sound.add("timeout")
        };
        this.sounds.theme.play({volume: 0.15});
    }

    private restartGame() {
        this.sounds?.theme.play({volume: 0.15});
        this.timeout = startTime;
        this.openCard = null;
        this.cardPairsCount = 0;
        // Phaser.Utils.Array.Shuffle(this.positionArray); // make a random array
        for (let i = 0; i < this.cards.length; i++) {
            this.cards[i].close(); // close each card
            // set new position for each card
            this.cards[i].setPosition(this.positionArray[i].x, this.positionArray[i].y);
        }
        // animate the disappearance of cards
        this.positionArray = this.outsideCardsPosition();
        for (let i = 0; i < this.positionArray.length; i++) {
            const delayTime: number = i * 100;
            this.cards[i].moveSmoothly(this.positionArray[i], delayTime);
        }
        setTimeout(() => { this.displayCardsSmoothly() }, 1000);
    }

    private onTimerTick() {
        this.timeText?.setText(`Time: ${this.timeout--}`);
        if (this.timeout < 0) {
            this.timer.paused = true; // stop timer
            this.sounds?.timeout.play({volume: 1.5});
            this.restartGame();
        }
    }

    private createTimer() {
        this.timer = this.time.addEvent({
            delay: 1000,
            callback: this.onTimerTick,
            loop: true,
            callbackScope: this // to pass the correct context
        });
    }

    private createText() {
        this.timeText = this.add.text(10, 336, "", { font: "36px CurseCasual", color: "#ffffff" });
    }

    private createBackground(): void {
        this.add.sprite(0, 0, "bg").setOrigin(0, 0);
    }

    private createCards(): void {
        this.positionArray = this.outsideCardsPosition();
        
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

        this.displayCardsSmoothly();
        
        // assign listener to each card
        this.cards.forEach((card: Card) => {
            card.on("pointerdown", () => this.openCardClick(card), this);
        });
    }

    private displayCardsSmoothly() {
        this.positionArray = this.getCardsPosition();
        Phaser.Utils.Array.Shuffle(this.positionArray); // make a random array

        let delayTime: number = 0;
        // display cards with animation
        for (let i = 0; i < this.positionArray.length; i++) {
            this.cards[i].moveSmoothly(this.positionArray[i], delayTime);
            this.cards[i].depth = i; // it`s like z-index of texture
            delayTime = i * 100;
        }
        this.timer.paused = false; // start timer
    }

    private openCardClick(card: Card): void {
        // if clicked card is already opened, nothing
        if (card.opened) {
            return;
        }

        this.sounds?.card.play({volume: 0.7});

        if (this.openCard) { // remember the last opened card in prop this.openCard
            if (this.openCard.value === card.value) { // compare prop this.openCard and new card
                this.openCard = null; // clean prop
                this.cardPairsCount++;
                this.sounds?.success.play({volume: 1.5});
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
            this.timer.paused = true; // stop timer
            this.sounds?.complete.play({ volume: 1.5 });
            setTimeout(() => this.restartGame(), 400);
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
                    x: Offset.OFFSET_X + col * cardWidth + cardWidth / 2,
                    y: Offset.OFFSET_Y + row * cardHeight + cardHeight / 2,
                });
            }
        }
        return cardsPosition;
    }

    private outsideCardsPosition(): CardPosition[] {
        const cardsPosition: CardPosition[] = [];
        const cardTexture = this.textures.get("card").getSourceImage() as HTMLImageElement;
        const cardWidth: number = cardTexture.width;
        const cardHeight: number = cardTexture.height;

        for (let row = 0; row < 2; row++) {
            for (let col = 0; col < 5; col++) {
                cardsPosition.push({
                    x: cardWidth * -1,
                    y: cardHeight * -1,
                });
            }
        }
        return cardsPosition;
    }
}
