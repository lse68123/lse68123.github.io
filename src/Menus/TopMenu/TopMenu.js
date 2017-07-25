///<reference path="../../../lib/jquery.d.ts"/>
///<reference path="../../Controller/UserActionController.ts"/>
var GTE;
(function (GTE) {
    var TopMenu = (function () {
        function TopMenu(userActionController) {
            var _this = this;
            this.userActionController = userActionController;
            this.treeParser = new GTE.TreeParser();
            this.appendElements();
            setTimeout(function () {
                _this.newButton = $("#new-wrapper");
                _this.saveButton = $("#save-wrapper");
                _this.loadButton = $("#load-wrapper");
                _this.inputLoad = $("#input-load");
                _this.saveImageButton = $("#save-image-wrapper");
                _this.playerNumber = $("#player-number");
                _this.playerMinusButton = $("#minusP-wrapper");
                _this.playerPlusButton = $("#plusP-wrapper");
                _this.undoButton = $("#undo-wrapper");
                _this.redoButton = $("#redo-wrapper");
                _this.randomPayoffsButton = $("#random-payoffs-wrapper");
                _this.zeroSumButton = $("#zero-sum-wrapper");
                _this.fractionDecimalButton = $("#fraction-decimal-wrapper");
                _this.attachEvents();
            }, 300);
        }
        TopMenu.prototype.appendElements = function () {
            $.get("src/Menus/TopMenu/top-menu.html", function (data) {
                $('body').append(data);
            });
            var css = "<link rel=\"stylesheet\" href=\"src/Menus/TopMenu/top-menu.css\" type=\"text/css\"/>";
            $('head').append(css);
        };
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
                console.log(src);
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
                console.log(src);
                if (src === "src/Assets/Images/TopMenu/fraction.png") {
                    _this.fractionDecimalButton.find("img").attr("src", "src/Assets/Images/TopMenu/decimal.png");
                }
                else if (src === "src/Assets/Images/TopMenu/decimal.png") {
                    _this.fractionDecimalButton.find("img").attr("src", "src/Assets/Images/TopMenu/fraction.png");
                }
                _this.userActionController.toggleFractionDecimal();
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