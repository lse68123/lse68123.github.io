///<reference path="../../../lib/jquery.d.ts"/>
///<reference path="../../Controller/UserActionController.ts"/>


module GTE {
    export class TopMenu {
        userActionController: UserActionController;
        treeParser: TreeParser;

        newButton: JQuery;
        saveButton: JQuery;
        loadButton: JQuery;
        saveImageButton: JQuery;
        inputLoad: JQuery;

        playerPlusButton: JQuery;
        playerMinusButton: JQuery;
        playerNumber: JQuery;

        undoButton: JQuery;
        redoButton: JQuery;

        randomPayoffsButton: JQuery;
        zeroSumButton: JQuery;
        fractionDecimalButton: JQuery;

        strategicFormButton: JQuery;
        infoButton: JQuery;
        infoContainer: JQuery;
        closeInfoButton: JQuery;
        overlay: JQuery;
        settingsButton: JQuery;
        settingsWindow: JQuery;
        rangeTree: JQuery;
        rangeLevel: JQuery;

        inputTree: JQuery;
        inputLevel: JQuery;

        constructor(userActionController: UserActionController) {
            this.userActionController = userActionController;
            this.treeParser = new TreeParser();
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

        attachEvents() {
            this.newButton.on("click", () => {
                this.userActionController.createNewTree();
            });
            this.saveButton.on("click", () => {
                this.userActionController.saveTreeToFile();
            });
            this.loadButton.on("click", () => {
                this.inputLoad.click();
            });

            this.inputLoad.on("change", (event) => {
                this.userActionController.toggleOpenFile();
            });

            this.saveImageButton.on("click", () => {
                this.userActionController.saveTreeToImage()
            });

            this.playerMinusButton.on("click", () => {
                let playersCount = parseInt(this.playerNumber.html());
                if (playersCount > 1) {
                    this.userActionController.removeLastPlayerHandler();
                    this.playerNumber.html((playersCount - 1).toString());
                    this.playerPlusButton.css({opacity: 1});
                }
                if (playersCount === 2) {
                    this.playerMinusButton.css({opacity: 0.3});
                }

                console.log(this.playerNumber);
            });

            this.playerPlusButton.on("click", () => {
                let playersCount = parseInt(this.playerNumber.html());
                if (playersCount < 4) {
                    this.userActionController.treeController.addPlayer(playersCount + 1);
                    this.playerNumber.html((playersCount + 1).toString());
                    this.playerMinusButton.css({opacity: 1});
                }
                if (playersCount === 3) {
                    this.playerPlusButton.css({opacity: 0.3});
                }
            });

            this.undoButton.on("click", () => {
                this.userActionController.undoRedoHandler(true);
                this.resetUndoReddoButtons();
            });

            this.redoButton.on("click", () => {
                this.userActionController.undoRedoHandler(false);
                this.resetUndoReddoButtons();
            });

            this.randomPayoffsButton.on("click", () => {
                this.userActionController.randomPayoffsHandler();
            });
            this.zeroSumButton.on("click", () => {
                let src = this.zeroSumButton.find("img").attr("src");
                if (src === "src/Assets/Images/TopMenu/zeroSum.png") {
                    this.zeroSumButton.find("img").attr("src", "src/Assets/Images/TopMenu/nonZeroSum.png")
                }
                else if (src === "src/Assets/Images/TopMenu/nonZeroSum.png") {
                    this.zeroSumButton.find("img").attr("src", "src/Assets/Images/TopMenu/zeroSum.png")
                }
                this.userActionController.toggleZeroSum();
            });

            this.fractionDecimalButton.on("click", () => {
                let src = this.fractionDecimalButton.find("img").attr("src");
                if (src === "src/Assets/Images/TopMenu/fraction.png") {
                    this.fractionDecimalButton.find("img").attr("src", "src/Assets/Images/TopMenu/decimal.png")
                }
                else if (src === "src/Assets/Images/TopMenu/decimal.png") {
                    this.fractionDecimalButton.find("img").attr("src", "src/Assets/Images/TopMenu/fraction.png")
                }
                this.userActionController.toggleFractionDecimal();
            });

            this.strategicFormButton.on("click", () => {
                this.userActionController.createStrategicForm();
            });

            this.infoButton.on("click", () => {
                this.infoContainer.addClass("show-container");
                this.overlay.addClass("show-overlay");

            });

            this.closeInfoButton.on("click", () => {
                this.infoContainer.removeClass("show-container");
                this.overlay.removeClass("show-overlay");
            });

            this.overlay.on("click", () => {
                this.closeInfoButton.click();
            });

            this.settingsButton.on("click", () => {
                if (this.settingsWindow.hasClass("slide-in")) {
                    this.settingsWindow.removeClass("slide-in");
                }
                else {
                    this.settingsWindow.addClass("slide-in");
                }
            });

            this.inputTree.val(this.rangeTree.attr("value"));
            this.inputLevel.val(this.rangeLevel.attr("value"));

            this.rangeTree.on('input', () => {
                this.inputTree.val(this.rangeTree.val());
                let scale = parseInt(this.inputTree.val()) / 50;
                if (scale && scale >= 0 && scale <= 2) {
                    this.userActionController.treeController.treeViewProperties.treeWidth = scale * this.userActionController.game.width * INITIAL_TREE_WIDTH;
                }
                this.userActionController.treeController.treeView.drawTree();

            });
            this.rangeLevel.on('input', () => {
                this.inputLevel.val(this.rangeLevel.val());
                let scale = parseInt(this.inputLevel.val()) / 50;
                if (scale && scale >= 0 && scale <= 2) {
                    this.userActionController.treeController.treeViewProperties.levelHeight = scale * this.userActionController.game.height * INITIAL_TREE_HEIGHT;
                }
                this.userActionController.treeController.treeView.drawTree();
            });

            this.inputTree.on('input', () => {
                this.rangeTree.val(this.inputTree.val());
                let scale = parseInt(this.inputTree.val()) / 50;
                if (scale && scale >= 0 && scale <= 2) {
                    this.userActionController.treeController.treeViewProperties.treeWidth = scale * this.userActionController.game.width * INITIAL_TREE_WIDTH;
                }
                this.userActionController.treeController.treeView.drawTree();
            });
            this.inputLevel.on('input', () => {
                this.rangeLevel.val(this.inputLevel.val());
                let scale = parseInt(this.inputLevel.val()) / 50;
                if (scale && scale >= 0 && scale <= 2) {
                    this.userActionController.treeController.treeViewProperties.levelHeight = scale * this.userActionController.game.height * INITIAL_TREE_HEIGHT;
                }
                this.userActionController.treeController.treeView.drawTree();
            });

        }

        resetUndoReddoButtons() {
            if (this.userActionController.undoRedoController.currentTreeIndex === 0) {
                this.undoButton.css({opacity: 0.3});
            }
            else {
                this.undoButton.css({opacity: 1});
            }
            if (this.userActionController.undoRedoController.currentTreeIndex === this.userActionController.undoRedoController.treesList.length - 1) {
                this.redoButton.css({opacity: 0.3});
            }
            else {
                this.redoButton.css({opacity: 1});
            }
        }

    }
}