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

export type Sound = {
    theme: Phaser.Sound.BaseSound,
    card: Phaser.Sound.BaseSound,
    complete: Phaser.Sound.BaseSound,
    success: Phaser.Sound.BaseSound,
    timeout: Phaser.Sound.BaseSound
} | null;

export enum Offset {
    OFFSET_X = 140,
    OFFSET_Y = 50
};

export const startTime: number = 30;
