"use strict";

var res = {
    //image
    background: "Background.jpg",
    dialogbg: "dialog_bg.png",
    playbg: "play_bg.png",
    selectbg: "select_select_bg.png",
    selectnormalbg: "select_normal_bg.png",
    gamebg: "gamebg.png",
    gamebg1: "gamebg1.png",
    cannormalbg: "can_normal_bg.png",
    canselectbg: "can_select_bg.png",
    boardnormalbg_sm: "board_normal_bg_sm.png",
    boardnormalbg_md: "board_normal_bg_md.png",
    boardnormalbg: "board_normal_bg.png",
    boardselectbg_sm: "board_select_bg_sm.png",
    boardselectbg_md: "board_select_bg_md.png",
    boardselectbg: "board_select_bg.png",
    refresh: "refresh.png",
    close: "close.png",
    prev: "prev.png",
    next: "next.png",
    menubg: "menubg.png",
    messagebg: "messagebox_bg.png"

    //plist

    //fnt

    //tmx

    //bgm

    //effect
};

var boardValues = ["000.png", "001.png", "002.png", "010.png", "011.png", "012.png", "020.png", "021.png", "022.png", "030.png", "031.png", "032.png", "100.png", "101.png", "102.png", "110.png", "111.png", "112.png", "120.png", "121.png", "122.png", "130.png", "131.png", "132.png", "200.png", "201.png", "202.png", "210.png", "211.png", "212.png", "220.png", "221.png", "222.png", "230.png", "231.png", "232.png", "300.png", "301.png", "302.png", "310.png", "311.png", "312.png", "320.png", "321.png", "322.png", "330.png", "331.png", "332.png"];

var instructionValues = ["one.png", "two.png", "three.png", "four.png", "five.png", "six.jpg"];
var indicatorValues = ["Choose the number of cards. \nFewer cards make the game easier.", "Click on a matching set of \nradians, degrees, and coordinates.", "If the set does not match, \nyou will need to pick again.", "If the set does match, \nyou will pick the location on the circle \nwhere it should go.", "If an incorrect location is selected, \nyou will need to pick again.", "If the correct location is selected, \nthe \"spoke\" will light up. Congratulations!"];

var g_resources = [];

for (i = 0; i < boardValues.length; i++) {
    g_resources.push(boardValues[i]);
}for (i = 0; i < instructionValues.length; i++) {
    g_resources.push(instructionValues[i]);
}for (var i in res) {
    g_resources.push(res[i]);
}var con = {
    playgame: "PLAY GAME",
    highscore: "HIGHSCORE",
    instruction: "INSTRUCTION",

    scenemenu: 0,
    sceneoption: 1,
    scenegame: 2,
    scenehighscore: 3,
    sceneinstruction: 4,

    canFilled: 0,
    canSelected: 1,
    canNormal: 2,
    boardCount: 48,
    boardStep: 3,

    invalidScore: 100000
};

var sta = {
    curScene: 0,
    selectCount: 0
};

var highscoreHistory = [{
    rank: 1,
    user: "Imhot",
    score: 16
}, {
    rank: 2,
    user: "smcos",
    score: 16
}, {
    rank: 3,
    user: "ano-",
    score: 16
}];