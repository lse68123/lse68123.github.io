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


        constructor(userActionController: UserActionController) {
            this.userActionController = userActionController;
            this.treeParser = new TreeParser();
            this.appendElements();
            setTimeout(() => {
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
                this.attachEvents();
            }, 300);

        }

        appendElements() {
            $.get("src/Menus/TopMenu/top-menu.html", function (data) {
                $('body').append(data);
            });

            let css = `<link rel="stylesheet" href="src/Menus/TopMenu/top-menu.css" type="text/css"/>`;
            $('head').append(css);
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
                console.log(src);
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
                console.log(src);
                if (src === "src/Assets/Images/TopMenu/fraction.png") {
                    this.fractionDecimalButton.find("img").attr("src", "src/Assets/Images/TopMenu/decimal.png")
                }
                else if (src === "src/Assets/Images/TopMenu/decimal.png") {
                    this.fractionDecimalButton.find("img").attr("src", "src/Assets/Images/TopMenu/fraction.png")
                }
                this.userActionController.toggleFractionDecimal();
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