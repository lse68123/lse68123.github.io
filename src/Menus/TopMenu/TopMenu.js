///<reference path="../../../lib/jquery.d.ts"/>
///<reference path="../../Controller/UserActionController.ts"/>
var GTE;
(function (GTE) {
    var TopMenu = (function () {
        function TopMenu(userActionController) {
            this.userActionController = userActionController;
            this.treeParser = new GTE.TreeParser();
            this.newButton = $("#new-wrapper");
            this.saveButton = $("#save-wrapper");
            this.loadButton = $("#load-wrapper");
            this.inputLoad = $("#input-load");
            this.saveImageButton = $("#save-image-wrapper");
            this.playerNumber = $("#player-number");
            this.playerMinusButton = $("#minusP-wrapper");
            this.playerPlusButton = $("#plusP-wrapper");
            this.undoButton = $("#undo-wrapper");
            this.redoButton = $("#redo-wrapper");
            this.randomPayoffsButton = $("#random-payoffs-wrapper");
            this.zeroSumButton = $("#zero-sum-wrapper");
            this.fractionDecimalButton = $("#fraction-decimal-wrapper");
            this.strategicFormButton = $("#strat-form-button");
            this.infoButton = $("#info-button-wrapper");
            this.infoContainer = $(".info-main-container");
            this.closeInfoButton = $(".close-info-img");
            this.overlay = $("#label-overlay");
            this.settingsButton = $("#settings-button-wrapper");
            this.settingsWindow = $(".settings-menu-container");
            this.rangeTree = $('.input-range-tree');
            this.inputTree = $('.input-field-tree');
            this.rangeLevel = $('.input-range-level');
            this.inputLevel = $('.input-field-level');
            this.attachEvents();
        }
        TopMenu.prototype.attachEvents = function () {
            var _this = this;
            this.newButton.on("click", function () {
                _this.userActionController.createNewTree();
            });
            this.saveButton.on("click", function () {
                _this.userActionController.saveTreeToFile();
            });
            this.loadButton.on("click", function () {
                _this.inputLoad.click();
            });
            this.inputLoad.on("change", function (event) {
                _this.userActionController.toggleOpenFile();
            });
            this.saveImageButton.on("click", function () {
                _this.userActionController.saveTreeToImage();
            });
            this.playerMinusButton.on("click", function () {
                var playersCount = parseInt(_this.playerNumber.html());
                if (playersCount > 1) {
                    _this.userActionController.removeLastPlayerHandler();
                    _this.playerNumber.html((playersCount - 1).toString());
                    _this.playerPlusButton.css({ opacity: 1 });
                }
                if (playersCount === 2) {
                    _this.playerMinusButton.css({ opacity: 0.3 });
                }
                console.log(_this.playerNumber);
            });
            this.playerPlusButton.on("click", function () {
                var playersCount = parseInt(_this.playerNumber.html());
                if (playersCount < 4) {
                    _this.userActionController.treeController.addPlayer(playersCount + 1);
                    _this.playerNumber.html((playersCount + 1).toString());
                    _this.playerMinusButton.css({ opacity: 1 });
                }
                if (playersCount === 3) {
                    _this.playerPlusButton.css({ opacity: 0.3 });
                }
            });
            this.undoButton.on("click", function () {
                _this.userActionController.undoRedoHandler(true);
                _this.resetUndoReddoButtons();
            });
            this.redoButton.on("click", function () {
                _this.userActionController.undoRedoHandler(false);
                _this.resetUndoReddoButtons();
            });
            this.randomPayoffsButton.on("click", function () {
                _this.userActionController.randomPayoffsHandler();
            });
            this.zeroSumButton.on("click", function () {
                var src = _this.zeroSumButton.find("img").attr("src");
                if (src === "src/Assets/Images/TopMenu/zeroSum.png") {
                    _this.zeroSumButton.find("img").attr("src", "src/Assets/Images/TopMenu/nonZeroSum.png");
                }
                else if (src === "src/Assets/Images/TopMenu/nonZeroSum.png") {
                    _this.zeroSumButton.find("img").attr("src", "src/Assets/Images/TopMenu/zeroSum.png");
                }
                _this.userActionController.toggleZeroSum();
            });
            this.fractionDecimalButton.on("click", function () {
                var src = _this.fractionDecimalButton.find("img").attr("src");
                if (src === "src/Assets/Images/TopMenu/fraction.png") {
                    _this.fractionDecimalButton.find("img").attr("src", "src/Assets/Images/TopMenu/decimal.png");
                }
                else if (src === "src/Assets/Images/TopMenu/decimal.png") {
                    _this.fractionDecimalButton.find("img").attr("src", "src/Assets/Images/TopMenu/fraction.png");
                }
                _this.userActionController.toggleFractionDecimal();
            });
            this.strategicFormButton.on("click", function () {
                _this.userActionController.createStrategicForm();
            });
            this.infoButton.on("click", function () {
                _this.infoContainer.addClass("show-container");
                _this.overlay.addClass("show-overlay");
            });
            this.closeInfoButton.on("click", function () {
                _this.infoContainer.removeClass("show-container");
                _this.overlay.removeClass("show-overlay");
            });
            this.overlay.on("click", function () {
                _this.closeInfoButton.click();
            });
            this.settingsButton.on("click", function () {
                if (_this.settingsWindow.hasClass("slide-in")) {
                    _this.settingsWindow.removeClass("slide-in");
                }
                else {
                    _this.settingsWindow.addClass("slide-in");
                }
            });
            this.inputTree.val(this.rangeTree.attr("value"));
            this.inputLevel.val(this.rangeLevel.attr("value"));
            this.rangeTree.on('input', function () {
                _this.inputTree.val(_this.rangeTree.val());
                var scale = parseInt(_this.inputTree.val()) / 50;
                if (scale && scale >= 0 && scale <= 2) {
                    _this.userActionController.treeController.treeViewProperties.treeWidth = scale * _this.userActionController.game.width * GTE.INITIAL_TREE_WIDTH;
                }
                _this.userActionController.treeController.treeView.drawTree();
            });
            this.rangeLevel.on('input', function () {
                _this.inputLevel.val(_this.rangeLevel.val());
                var scale = parseInt(_this.inputLevel.val()) / 50;
                if (scale && scale >= 0 && scale <= 2) {
                    _this.userActionController.treeController.treeViewProperties.levelHeight = scale * _this.userActionController.game.height * GTE.INITIAL_TREE_HEIGHT;
                }
                _this.userActionController.treeController.treeView.drawTree();
            });
            this.inputTree.on('input', function () {
                _this.rangeTree.val(_this.inputTree.val());
                var scale = parseInt(_this.inputTree.val()) / 50;
                if (scale && scale >= 0 && scale <= 2) {
                    _this.userActionController.treeController.treeViewProperties.treeWidth = scale * _this.userActionController.game.width * GTE.INITIAL_TREE_WIDTH;
                }
                _this.userActionController.treeController.treeView.drawTree();
            });
            this.inputLevel.on('input', function () {
                _this.rangeLevel.val(_this.inputLevel.val());
                var scale = parseInt(_this.inputLevel.val()) / 50;
                if (scale && scale >= 0 && scale <= 2) {
                    _this.userActionController.treeController.treeViewProperties.levelHeight = scale * _this.userActionController.game.height * GTE.INITIAL_TREE_HEIGHT;
                }
                _this.userActionController.treeController.treeView.drawTree();
            });
        };
        TopMenu.prototype.resetUndoReddoButtons = function () {
            if (this.userActionController.undoRedoController.currentTreeIndex === 0) {
                this.undoButton.css({ opacity: 0.3 });
            }
            else {
                this.undoButton.css({ opacity: 1 });
            }
            if (this.userActionController.undoRedoController.currentTreeIndex === this.userActionController.undoRedoController.treesList.length - 1) {
                this.redoButton.css({ opacity: 0.3 });
            }
            else {
                this.redoButton.css({ opacity: 1 });
            }
        };
        return TopMenu;
    }());
    GTE.TopMenu = TopMenu;
})(GTE || (GTE = {}));
//# sourceMappingURL=TopMenu.js.map