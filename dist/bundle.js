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
        _this.setOrigin(0, 0);
        _this.scene.add.existing(_this);
        _this.setInteractive();
        return _this;
    }
    Card.prototype.open = function () {
        this.opened = true;
        this.setTexture("card" + this.value);
    };
    Card.prototype.close = function () {
        this.opened = false;
        this.setTexture("card");
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
        _this.openCard = null;
        _this.cardPairsCount = 0;
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
    };
    GameScene.prototype.create = function () {
        this.createBackground();
        this.createCards();
    };
    GameScene.prototype.restartGame = function () {
        this.openCard = null;
        this.cardPairsCount = 0;
        Phaser.Utils.Array.Shuffle(this.positionArray);
        for (var i = 0; i < this.cards.length; i++) {
            this.cards[i].close();
            this.cards[i].setPosition(this.positionArray[i].x, this.positionArray[i].y);
        }
    };
    GameScene.prototype.createBackground = function () {
        this.add.sprite(0, 0, "bg").setOrigin(0, 0);
    };
    GameScene.prototype.createCards = function () {
        var _this = this;
        this.positionArray = this.getCardsPosition();
        Phaser.Utils.Array.Shuffle(this.positionArray);
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
        this.cards.forEach(function (card) {
            card.on("pointerdown", function () { return _this.openCardClick(card); }, _this);
        });
    };
    GameScene.prototype.openCardClick = function (card) {
        if (card.opened) {
            return;
        }
        if (this.openCard) {
            if (this.openCard.value === card.value) {
                this.openCard = null;
                this.cardPairsCount++;
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
            this.restartGame();
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
                    x: utils_1.Offset.OFFSET_X + col * cardWidth,
                    y: utils_1.Offset.OFFSET_Y + row * cardHeight,
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
exports.Offset = exports.config = void 0;
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