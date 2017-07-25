var GTE;
(function (GTE) {
    //Boot Menu Constants
    GTE.INTRO_DISTANCE = 0.15;
    GTE.INTRO_RADIUS = 0.018;
    GTE.INTRO_TWEEN_DURATION = 200;
    GTE.INTRO_TEXT_SIZE = 0.15;
    //Node Constants
    GTE.NODE_RADIUS = 0.03;
    GTE.NODE_SCALE = 3;
    GTE.LINE_WIDTH = 0.005;
    GTE.LABEL_SIZE = 1.5;
    GTE.HOVER_COLOR = 0x555555;
    GTE.HOVER_CHILDREN_COLOR = 0xaaaaaa;
    GTE.NODE_SELECTED_COLOR = 0x004991;
    GTE.PLAYER_COLORS = [0xff0000, 0x0000ff, 0x00ff00, 0xff00ff];
    //Selection Rectangle Constants
    GTE.SELECTION_INNER_COLOR = 0x0389df;
    GTE.SELECTION_BORDER_COLOR = 0x000fff;
    GTE.PREVIEW_CIRCLE_COLOR = 0xff0000;
    GTE.OVERLAY_SCALE = 3;
    //ISets
    GTE.SAME_PATH_ON_ROOT_ERROR_TEXT = "Cannot create an information set for \n nodes which share a path to the root.";
    GTE.NODES_MISSING_PLAYERS_ERROR_TEXT = "Cannot create information set for \n nodes which do not have player assigned.";
    GTE.NODES_DIFFERENT_PLAYERS_ERROR_TEXT = "Cannot create information set for \n nodes which have different players.";
    GTE.NODES_NUMBER_OF_CHILDREN_ERROR_TEXT = "Cannot create information set for \n nodes which have different number of children or are leaves.";
    GTE.IMPERFECT_RECALL_ERROR_TEXT = "The game tree does not have perfect recall";
    GTE.ISET_LINE_WIDTH = 0.05;
    //Hover Button Colors
    GTE.PLUS_BUTTON_COLOR = 0x00ff00;
    GTE.MINUS_BUTTON_COLOR = 0xff0000;
    GTE.LINK_BUTTON_COLOR = 0x0000ff;
    GTE.UNLINK_BUTTON_COLOR = 0xff9f00;
    GTE.CUT_BUTTON_COLOR = 0x07c986;
    GTE.PLAYER_BUTTON_COLOR = 0x999999;
    GTE.CUT_SPRITE_TINT = 0x444444;
    //Misc
    GTE.ERROR_MESSAGE_COLOR = 0xff4545;
    GTE.TREE_TWEEN_DURATION = 600;
    GTE.GTE_DEFAULT_FILE_NAME = "GTE_Tree";
    //Strategic Form
    GTE.CELL_WIDTH = 0.15;
    GTE.CELL_STROKE_WIDTH = 0.05;
    GTE.CELL_NUMBER_SIZE = 0.3;
    GTE.PLAYER_TEXT_SIZE = 0.35;
    GTE.MOVES_OFFSET = 0.05;
    GTE.MOVES_TEXT_SIZE = 0.25;
    GTE.STRATEGIC_PLAYERS_ERROR_TEXT = "Strategic form only available for 2 players!";
})(GTE || (GTE = {}));
//# sourceMappingURL=Constants.js.map