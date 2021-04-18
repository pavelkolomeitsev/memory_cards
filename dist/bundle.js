/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/Card.ts":
/*!*********************!*\
  !*** ./src/Card.ts ***!
  \*********************/
/***/ (function(__unused_webpack_module, exports) {


var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Card = void 0;
var Card = (function (_super) {
    __extends(Card, _super);
    function Card(scene, value, position) {
        var _this = _super.call(this, scene, position.x, position.y, "card") || this;
        _this.scene = scene;
        _this.value = value;
        _this.opened = false;
        _this.scene.add.existing(_this);
        _this.setInteractive();
        return _this;
    }
    Card.prototype.flipCard = function () {
        var _this = this;
        this.scene.tweens.add({
            targets: this,
            scaleX: 0,
            ease: "Linear",
            duration: 200,
            onComplete: function () {
                _this.showCard(_this);
            }
        });
    };
    Card.prototype.showCard = function (context) {
        var texture = this.opened ? "card" + this.value : "card";
        context.setTexture(texture);
        context.scene.tweens.add({
            targets: context,
            scaleX: 1,
            ease: "Linear",
            duration: 200
        });
    };
    Card.prototype.open = function () {
        this.opened = true;
        this.flipCard();
    };
    Card.prototype.close = function () {
        this.opened = false;
        this.flipCard();
    };
    Card.prototype.moveSmoothly = function (position, delayTime) {
        this.scene.tweens.add({
            targets: this,
            x: position.x,
            y: position.y,
            ease: "Linear",
            delay: delayTime,
            duration: 250,
        });
    };
    return Card;
}(Phaser.GameObjects.Sprite));
exports.Card = Card;


/***/ }),

/***/ "./src/GameScene.ts":
/*!**************************!*\
  !*** ./src/GameScene.ts ***!
  \**************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GameScene = void 0;
var Card_1 = __webpack_require__(/*! ./Card */ "./src/Card.ts");
var utils_1 = __webpack_require__(/*! ./utils */ "./src/utils.ts");
var GameScene = (function (_super) {
    __extends(GameScene, _super);
    function GameScene() {
        var _this = _super.call(this, { key: "game-scene" }) || this;
        _this.cards = [];
        _this.positionArray = [];
        _this.sounds = null;
        _this.openCard = null;
        _this.cardPairsCount = 0;
        _this.timer = new Phaser.Time.TimerEvent({});
        _this.timeout = 0;
        return _this;
    }
    GameScene.prototype.preload = function () {
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
    };
    GameScene.prototype.create = function () {
        this.timeout = utils_1.startTime;
        this.createSounds();
        this.createBackground();
        this.createCards();
        this.createTimer();
        this.createText();
    };
    GameScene.prototype.createSounds = function () {
        this.sounds = {
            theme: this.sound.add("theme"),
            card: this.sound.add("card"),
            complete: this.sound.add("complete"),
            success: this.sound.add("success"),
            timeout: this.sound.add("timeout")
        };
        this.sounds.theme.play({ volume: 0.15 });
    };
    GameScene.prototype.restartGame = function () {
        var _this = this;
        var _a;
        (_a = this.sounds) === null || _a === void 0 ? void 0 : _a.theme.play({ volume: 0.15 });
        this.timeout = utils_1.startTime;
        this.openCard = null;
        this.cardPairsCount = 0;
        for (var i = 0; i < this.cards.length; i++) {
            this.cards[i].close();
            this.cards[i].setPosition(this.positionArray[i].x, this.positionArray[i].y);
        }
        this.positionArray = this.outsideCardsPosition();
        for (var i = 0; i < this.positionArray.length; i++) {
            var delayTime = i * 100;
            this.cards[i].moveSmoothly(this.positionArray[i], delayTime);
        }
        setTimeout(function () { _this.displayCardsSmoothly(); }, 1000);
    };
    GameScene.prototype.onTimerTick = function () {
        var _a, _b;
        (_a = this.timeText) === null || _a === void 0 ? void 0 : _a.setText("Time: " + this.timeout--);
        if (this.timeout < 0) {
            this.timer.paused = true;
            (_b = this.sounds) === null || _b === void 0 ? void 0 : _b.timeout.play({ volume: 1.5 });
            this.restartGame();
        }
    };
    GameScene.prototype.createTimer = function () {
        this.timer = this.time.addEvent({
            delay: 1000,
            callback: this.onTimerTick,
            loop: true,
            callbackScope: this
        });
    };
    GameScene.prototype.createText = function () {
        this.timeText = this.add.text(10, 336, "", { font: "36px CurseCasual", color: "#ffffff" });
    };
    GameScene.prototype.createBackground = function () {
        this.add.sprite(0, 0, "bg").setOrigin(0, 0);
    };
    GameScene.prototype.createCards = function () {
        var _this = this;
        this.positionArray = this.outsideCardsPosition();
        var index = 0;
        for (var i = 0; i < this.positionArray.length; i++) {
            if (i >= 5) {
                this.cards.push(new Card_1.Card(this, index, this.positionArray[i]));
                ++index;
            }
            else {
                this.cards.push(new Card_1.Card(this, i, this.positionArray[i]));
            }
        }
        this.displayCardsSmoothly();
        this.cards.forEach(function (card) {
            card.on("pointerdown", function () { return _this.openCardClick(card); }, _this);
        });
    };
    GameScene.prototype.displayCardsSmoothly = function () {
        this.positionArray = this.getCardsPosition();
        Phaser.Utils.Array.Shuffle(this.positionArray);
        var delayTime = 0;
        for (var i = 0; i < this.positionArray.length; i++) {
            this.cards[i].moveSmoothly(this.positionArray[i], delayTime);
            this.cards[i].depth = i;
            delayTime = i * 100;
        }
        this.timer.paused = false;
    };
    GameScene.prototype.openCardClick = function (card) {
        var _this = this;
        var _a, _b, _c;
        if (card.opened) {
            return;
        }
        (_a = this.sounds) === null || _a === void 0 ? void 0 : _a.card.play({ volume: 0.7 });
        if (this.openCard) {
            if (this.openCard.value === card.value) {
                this.openCard = null;
                this.cardPairsCount++;
                (_b = this.sounds) === null || _b === void 0 ? void 0 : _b.success.play({ volume: 1.5 });
            }
            else {
                this.openCard.close();
                this.openCard = card;
            }
        }
        else {
            this.openCard = card;
        }
        card.open();
        if (this.cardPairsCount === this.cards.length / 2) {
            this.timer.paused = true;
            (_c = this.sounds) === null || _c === void 0 ? void 0 : _c.complete.play({ volume: 1.5 });
            setTimeout(function () { return _this.restartGame(); }, 400);
        }
    };
    GameScene.prototype.getCardsPosition = function () {
        var cardsPosition = [];
        var cardTexture = this.textures.get("card").getSourceImage();
        var cardWidth = cardTexture.width + 4;
        var cardHeight = cardTexture.height + 4;
        for (var row = 0; row < 2; row++) {
            for (var col = 0; col < 5; col++) {
                cardsPosition.push({
                    x: utils_1.Offset.OFFSET_X + col * cardWidth + cardWidth / 2,
                    y: utils_1.Offset.OFFSET_Y + row * cardHeight + cardHeight / 2,
                });
            }
        }
        return cardsPosition;
    };
    GameScene.prototype.outsideCardsPosition = function () {
        var cardsPosition = [];
        var cardTexture = this.textures.get("card").getSourceImage();
        var cardWidth = cardTexture.width;
        var cardHeight = cardTexture.height;
        for (var row = 0; row < 2; row++) {
            for (var col = 0; col < 5; col++) {
                cardsPosition.push({
                    x: cardWidth * -1,
                    y: cardHeight * -1,
                });
            }
        }
        return cardsPosition;
    };
    return GameScene;
}(Phaser.Scene));
exports.GameScene = GameScene;


/***/ }),

/***/ "./src/utils.ts":
/*!**********************!*\
  !*** ./src/utils.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.startTime = exports.Offset = exports.config = void 0;
var GameScene_1 = __webpack_require__(/*! ./GameScene */ "./src/GameScene.ts");
exports.config = {
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
    scene: [new GameScene_1.GameScene()]
};
var Offset;
(function (Offset) {
    Offset[Offset["OFFSET_X"] = 140] = "OFFSET_X";
    Offset[Offset["OFFSET_Y"] = 50] = "OFFSET_Y";
})(Offset = exports.Offset || (exports.Offset = {}));
;
exports.startTime = 30;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;
/*!********************!*\
  !*** ./src/app.ts ***!
  \********************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
var utils_1 = __webpack_require__(/*! ./utils */ "./src/utils.ts");
new Phaser.Game(utils_1.config);

})();

/******/ })()
;
//# sourceMappingURL=bundle.js.map