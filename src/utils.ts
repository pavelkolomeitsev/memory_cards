import { GameScene } from "./GameScene";

export const config: object = {
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
    scene: [new GameScene()]
};

export type CardPosition = {
    x: number,
    y: number
};

export enum Offset {
    OFFSET_X = 140,
    OFFSET_Y = 50
};
