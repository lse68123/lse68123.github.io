/// <reference path = "../../lib/phaser.d.ts"/>
///<reference path="../Model/Node.ts"/>
///<reference path="TreeController.ts"/>
///<reference path="UserActionController.ts"/>
var GTE;
(function (GTE) {
    /** A class for controlling the input of the application. If there is a confusion over the functionality of each button
     * you can check the attachHandlersToKeysMethod*/
    //TODO: Fix bug with ctrl+s
    var KeyboardController = (function () {
        function KeyboardController(game, userActionController) {
            this.game = game;
            this.userActionController = userActionController;
            this.playersKeys = [];
            this.addKeys();
            this.attachHandlersToKeys();
            // this.deselectNodesHandler();
        }
        /**Assigning all keys to the corresponding properties in the class*/
        KeyboardController.prototype.addKeys = function () {
            var _this = this;
            this.shiftKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SHIFT);
            this.controlKey = this.game.input.keyboard.addKey(Phaser.Keyboard.CONTROL);
            this.nKey = this.game.input.keyboard.addKey(Phaser.Keyboard.N);
            this.zeroKey = this.game.input.keyboard.addKey(Phaser.Keyboard.ZERO);
            this.iKey = this.game.input.keyboard.addKey(Phaser.Keyboard.I);
            this.testButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
            this.zKey = this.game.input.keyboard.addKey(Phaser.Keyboard.Z);
            this.dKey = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
            this.uKey = this.game.input.keyboard.addKey(Phaser.Keyboard.U);
            this.cKey = this.game.input.keyboard.addKey(Phaser.Keyboard.C);
            this.sKey = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
            this.tabKey = this.game.input.keyboard.addKey(Phaser.Keyboard.TAB);
            this.enterKey = this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
            this.escapeKey = this.game.input.keyboard.addKey(Phaser.Keyboard.ESC);
            var keys = [Phaser.Keyboard.ONE, Phaser.Keyboard.TWO, Phaser.Keyboard.THREE, Phaser.Keyboard.FOUR];
            keys.forEach(function (k) {
                _this.playersKeys.push(_this.game.input.keyboard.addKey(k));
            });
            this.deleteKey = this.game.input.keyboard.addKey(Phaser.Keyboard.DELETE);
            this.game.input.keyboard.removeKeyCapture(Phaser.Keyboard.C);
            this.game.input.keyboard.removeKeyCapture(Phaser.Keyboard.N);
            this.game.input.keyboard.removeKeyCapture(Phaser.Keyboard.I);
            this.game.input.keyboard.removeKeyCapture(Phaser.Keyboard.Z);
            this.game.input.keyboard.removeKeyCapture(Phaser.Keyboard.D);
            this.game.input.keyboard.removeKeyCapture(Phaser.Keyboard.U);
            this.game.input.keyboard.removeKeyCapture(Phaser.Keyboard.S);
            this.game.input.keyboard.removeKeyCapture(Phaser.Keyboard.ZERO);
            this.game.input.keyboard.removeKeyCapture(Phaser.Keyboard.ONE);
            this.game.input.keyboard.removeKeyCapture(Phaser.Keyboard.TWO);
            this.game.input.keyboard.removeKeyCapture(Phaser.Keyboard.THREE);
            this.game.input.keyboard.removeKeyCapture(Phaser.Keyboard.FOUR);
            this.game.input.keyboard.removeKeyCapture(Phaser.Keyboard.SPACEBAR);
            this.game.input.keyboard.removeKeyCapture(Phaser.Keyboard.CONTROL);
            this.game.input.keyboard.removeKeyCapture(Phaser.Keyboard.DELETE);
        };
        /**A method which assigns action to each key via the UserActionController*/
        KeyboardController.prototype.attachHandlersToKeys = function () {
            var _this = this;
            // Children and new file
            this.nKey.onDown.add(function () {
                if (!_this.controlKey.isDown) {
                    _this.userActionController.addNodesHandler();
                }
                else {
                    _this.userActionController.createNewTree();
                }
            });
            // Delete nodes
            this.deleteKey.onDown.add(function () {
                _this.userActionController.deleteNodeHandler();
            });
            this.dKey.onDown.add(function () {
                _this.userActionController.deleteNodeHandler();
            });
            // Assigning players
            this.playersKeys.forEach(function (k) {
                var playerID = _this.playersKeys.indexOf(k) + 1;
                k.onDown.add(function () {
                    _this.userActionController.assignPlayerToNodeHandler(playerID);
                });
            });
            this.zeroKey.onDown.add(function () {
                _this.userActionController.assignChancePlayerToNodeHandler();
            });
            // Create an information set
            this.iKey.onDown.add(function () {
                if (!_this.controlKey.isDown) {
                    _this.userActionController.createISetHandler();
                }
                else {
                    _this.userActionController.saveTreeToImage();
                }
            });
            // Undo and redo
            this.zKey.onDown.add(function () {
                if (_this.controlKey.isDown && !_this.shiftKey.isDown) {
                    _this.userActionController.undoRedoHandler(true);
                }
                if (_this.controlKey.isDown && _this.shiftKey.isDown) {
                    _this.userActionController.undoRedoHandler(false);
                }
            });
            // Remove information set
            this.uKey.onDown.add(function () {
                _this.userActionController.removeISetsByNodesHandler();
            });
            // Cut information set
            this.cKey.onDown.add(function () {
                var distinctISetsSelected = _this.userActionController.treeController.getSelectedISets();
                if (distinctISetsSelected.length === 1) {
                    _this.userActionController.initiateCutSpriteHandler(_this.userActionController.treeController.treeView.findISetView(distinctISetsSelected[0]));
                }
            });
            // Change to the next label
            this.tabKey.onDown.add(function () {
                if (_this.shiftKey.isDown) {
                    _this.userActionController.activateLabel(false);
                }
                else {
                    _this.userActionController.activateLabel(true);
                }
            });
            // Enter value in label
            this.enterKey.onDown.add(function () {
                _this.userActionController.changeLabel();
            });
            // Exit label
            this.escapeKey.onDown.add(function () {
                _this.userActionController.hideInputLabel();
            });
            // Save to File
            this.sKey.onDown.add(function () {
                if (_this.controlKey.isDown) {
                    _this.userActionController.saveTreeToFile();
                }
            });
            this.testButton.onDown.add(function () {
                _this.userActionController.createStrategicForm();
            });
        };
        return KeyboardController;
    }());
    GTE.KeyboardController = KeyboardController;
})(GTE || (GTE = {}));
//# sourceMappingURL=KeyboardController.js.map