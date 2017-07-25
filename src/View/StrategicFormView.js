/// <reference path = "../../lib/phaser.d.ts"/>
///<reference path="../Model/StrategicForm.ts"/>
///<reference path="../Utils/SCell.ts"/>
///<reference path="../Utils/Constants.ts"/>
var GTE;
(function (GTE) {
    var StrategicFormView = (function () {
        function StrategicFormView(game, strategicForm) {
            this.game = game;
            this.strategicForm = strategicForm;
            this.group = this.game.add.group();
            this.rows = strategicForm.strategyToString(strategicForm.p1Strategies);
            this.cols = strategicForm.strategyToString(strategicForm.p2Strategies);
            this.cells = [];
            this.p1Moves = [];
            this.p2Moves = [];
            this.group.scale.set(0.3);
            this.group.position.set(this.game.width * 0.8, this.game.height * 0.05);
            var cellWidth = this.game.width * GTE.CELL_WIDTH;
            var cellStroke = cellWidth * GTE.CELL_STROKE_WIDTH;
            this.generateGrid(cellWidth, cellStroke);
            this.drawDiagonalLine(cellWidth, cellStroke);
            this.createPlayerTexts(cellWidth);
            this.createStrategiesTexts(cellWidth, cellStroke);
        }
        StrategicFormView.prototype.generateGrid = function (cellWidth, cellStroke) {
            for (var i = 0; i < this.rows.length; i++) {
                for (var j = 0; j < this.cols.length; j++) {
                    this.cells.push(new GTE.SCell(this.game, j * (cellWidth - 0.5 * cellStroke), i * (cellWidth - 0.5 * cellStroke), this.group));
                }
            }
        };
        StrategicFormView.prototype.drawDiagonalLine = function (cellWidth, cellStroke) {
            this.diagonalLine = this.game.add.sprite(0, 0, this.game.cache.getBitmapData("line"), null, this.group);
            this.diagonalLine.scale.set(cellWidth * 0.75, cellStroke * 0.5);
            this.diagonalLine.anchor.set(GTE.CELL_STROKE_WIDTH, 0.5);
            this.diagonalLine.tint = 0x000000;
            this.diagonalLine.rotation = -Math.PI * 0.75;
        };
        StrategicFormView.prototype.createPlayerTexts = function (cellWidth) {
            var diagonalWidth = cellWidth * 0.75;
            var lineWidth = diagonalWidth / Math.sqrt(2);
            this.p1Text = this.game.add.text(-0.75 * lineWidth, -0.25 * lineWidth, this.strategicForm.tree.players[1].label, null, this.group);
            this.p1Text.anchor.set(0.5, 0.5);
            this.p1Text.fontSize = diagonalWidth * GTE.PLAYER_TEXT_SIZE;
            this.p1Text.fill = Phaser.Color.getWebRGB(GTE.PLAYER_COLORS[0]);
            this.p2Text = this.game.add.text(-1 / 4 * lineWidth, -3 / 4 * lineWidth, this.strategicForm.tree.players[2].label, null, this.group);
            this.p2Text.anchor.set(0.5, 0.5);
            this.p2Text.fontSize = diagonalWidth * GTE.PLAYER_TEXT_SIZE;
            this.p2Text.fill = Phaser.Color.getWebRGB(GTE.PLAYER_COLORS[1]);
        };
        StrategicFormView.prototype.createStrategiesTexts = function (cellWidth, cellStroke) {
            for (var i = 0; i < this.rows.length; i++) {
                var text = this.game.add.text(-cellWidth * GTE.MOVES_OFFSET, cellWidth * i + 0.5 * cellWidth, this.rows[i], null, this.group);
                text.anchor.set(1, 0.5);
                text.fontSize = cellWidth * GTE.MOVES_TEXT_SIZE;
                text.fill = Phaser.Color.getWebRGB(GTE.PLAYER_COLORS[0]);
                this.p1Moves.push(text);
            }
            for (var i = 0; i < this.cols.length; i++) {
                var text = this.game.add.text(cellWidth * i + 0.5 * cellWidth - 0.5 * i * cellStroke, 0, this.cols[i], null, this.group);
                text.anchor.set(0.5, 0.5);
                text.fontSize = cellWidth * GTE.MOVES_TEXT_SIZE;
                text.fill = Phaser.Color.getWebRGB(GTE.PLAYER_COLORS[1]);
                this.p2Moves.push(text);
            }
            var maxAngle = 0;
            var shouldRotate = false;
            this.p2Moves.forEach(function (m) {
                if (m.width > cellWidth) {
                    shouldRotate = true;
                    var diagonal = m.width * Math.sqrt(2);
                    var angle = Math.acos(cellWidth / diagonal);
                    if (maxAngle < angle) {
                        maxAngle = angle;
                    }
                }
            });
            if (shouldRotate) {
                this.p2Moves.forEach(function (m) {
                    m.rotation = -maxAngle;
                    m.y = -m.width * 0.5 * Math.sin(maxAngle) - m.height * 0.3;
                });
            }
            else {
                this.p2Moves.forEach(function (m) {
                    m.y = -m.height * 0.5;
                });
            }
        };
        StrategicFormView.prototype.destroy = function () {
            this.rows = null;
            this.cols = null;
            this.group.destroy(true, false);
            this.p1Moves = null;
            this.p2Moves = null;
        };
        return StrategicFormView;
    }());
    GTE.StrategicFormView = StrategicFormView;
})(GTE || (GTE = {}));
//# sourceMappingURL=StrategicFormView.js.map