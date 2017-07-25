/// <reference path = "../../../lib/phaser.d.ts"/>
///<reference path="../../../lib/jquery.d.ts"/>
var GTE;
(function (GTE) {
    var LabelInput = (function () {
        function LabelInput(game) {
            var _this = this;
            this.game = game;
            this.appendElements();
            this.shouldRecalculateOrder = true;
            this.active = false;
            setTimeout(function () {
                _this.labelOverlay = $('#label-overlay');
                _this.inputField = $("#input-label");
                _this.inputHandler();
            }, 500);
        }
        LabelInput.prototype.appendElements = function () {
            $.get("src/Menus/LabelInput/label-input.html", function (data) {
                $('body').append(data);
            });
            var css = "<link rel=\"stylesheet\" href=\"src/Menus/LabelInput/label-input.css\" type=\"text/css\"/>";
            $('head').append(css);
        };
        LabelInput.prototype.show = function (label, sprite) {
            var _this = this;
            this.currentlySelected = sprite;
            this.inputField.val(label.text.replace(/\n/g, " "));
            // this.inputField.click();
            if (!this.active) {
                this.labelOverlay.addClass("show-overlay");
                this.inputField.addClass("show-label");
                this.shouldRecalculateOrder = true;
            }
            else {
                this.shouldRecalculateOrder = false;
            }
            this.inputField.css({
                "left": label.x,
                "top": label.y,
            });
            setTimeout(function () {
                _this.inputField.select();
            }, 100);
            this.active = true;
        };
        LabelInput.prototype.hideLabel = function () {
            if (this.labelOverlay.hasClass("show-overlay")) {
                this.labelOverlay.removeClass("show-overlay");
            }
            if (this.inputField.hasClass("show-label")) {
                this.inputField.removeClass("show-label");
            }
            this.shouldRecalculateOrder = true;
            this.active = false;
        };
        LabelInput.prototype.inputHandler = function () {
            var _this = this;
            this.labelOverlay.on("click", function () {
                _this.hideLabel();
            });
        };
        return LabelInput;
    }());
    GTE.LabelInput = LabelInput;
})(GTE || (GTE = {}));
//# sourceMappingURL=LabelInput.js.map