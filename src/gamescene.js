var gameSceneInitialized = false;

var counter = 0;
var selectedTriple = 0;
var ready = false;
var dialogOpen = false;

var BoardLayer = cc.Layer.extend({
    boards: null,
    txtMove: null,
    moves: 0,

    ctor:function () {
        this._super();

        var size = cc.director.getWinSize();
        var originX = size.width / 2;
        var originY = size.height / 2 + 100;

        this.txtMove = new ccui.Text();
        this.txtMove.setAnchorPoint(0, 0);
        this.txtMove.attr({
            textAlign: cc.TEXT_ALIGNMENT_LEFT,
            string: "Moves : 0",
            font: "Arial",
            x: 10,
            y: size.height - 25
        });
        this.addChild(this.txtMove);
        this.moves = 0;

        var gamebg = cc.Sprite.create(res.gamebg1);
        gamebg.setPosition(originX, originY);
        gamebg.setScale(1.6);
        this.addChild(gamebg, 0);

        this.boards = [];
        var normal = [res.boardnormalbg_sm, res.boardnormalbg_md, res.boardnormalbg];
        var select = [res.boardselectbg_sm, res.boardselectbg_md, res.boardselectbg];
        var radius = [90, 130, 200];
        var scale = [0.7, 0.6, 0.6];
        for (i = 0; i < 16; i ++ ){
            for (var j = 0; j < 3; j ++){
                var board = new CheckLabelScaleRotate(normal[j], select[j], select[j]);
                var angle = Math.PI / 8 * i;
                board.setAnchorPoint(0.5, 0.5);
                board.x = 5 + originX + Math.cos(angle) * radius[j];
                board.y = originY + Math.sin(angle) * radius[j];
                board.setValueScale(scale[j]);
                board.checkbox.addTouchEventListener(this.onBoard, this);
                this.boards.push(board);
                this.addChild(board);
                board.setAnswer(i * 3 + j);
            }
        }
        this.boards[2].setValueScale(1);
        this.boards[14].setValueScale(1);
        this.boards[26].setValueScale(1);
        this.boards[38].setValueScale(1);
        this.boards[38].setValueScale(1);
        this.boards[1].setValueScale(1);
        this.boards[25].setValueScale(1);
    },
    init: function() {
        // deselectAll
        for (i = 0; i < this.boards.length; i++){
            this.boards[i].checkbox.setSelected(false);
            this.boards[i].setValue(-1);
        }

        // init moves
        this.moves = 0;
        this.txtMove.setString("Moves : " + this.moves);
    },
    onReplay: function(container = this) {
        container.getParent().canLayer.init();
        container.init();
    },
    place: function() {
        this.boards[selectedTriple].setValue(selectedTriple);
        this.boards[selectedTriple+1].setValue(selectedTriple+1);
        this.boards[selectedTriple+2].setValue(selectedTriple+2);
        if (!this.getParent().canLayer.place()){
            showMessageBoxOkCancel(this, "Game over...",
            "Completed puzzle in " + this.moves + " moves...",
            this.onReplay, null, "PLAY AGAIN", "CANCEL");
            setHighscore(this.moves);
        }
    },
    onBoard: function (sender, type){
        if (type != ccui.Widget.TOUCH_ENDED)
            return;
        if (dialogOpen){
            sender.setSelected(!sender.isSelected());
            return;
        }
        else if (ready){
            sender.setSelected(!sender.isSelected());
            for (i = 0; i < this.boards.length; i ++)
                if (this.boards[i].checkbox == sender){
                    if (Math.floor(this.boards[i].answer / 3) == Math.floor(selectedTriple / 3)){
                        // increase Move
                        this.moves ++;
                        this.txtMove.setString("Moves : " + this.moves);

                        this.place();
                        this.boards[selectedTriple].checkbox.setSelected(true);
                        this.boards[selectedTriple+1].checkbox.setSelected(true);
                        this.boards[selectedTriple+2].checkbox.setSelected(true);
                        sender.setSelected(false);
                    }
                    else{
                        // increase Move
                        this.moves ++;
                        this.txtMove.setString("Moves : " + this.moves);

                        showMessageBoxOkCancel(this, "Try again",
                        "That is an incorrect place for the set.",
                        null, this.onNewTry, "TRY AGAIN", "CANCEL");
                    }
                    break;
                }
        }
        else{
            showMessageBoxOK(this, "Invalid move", 
                "You must select 3 cards before playing on the circle.", 
                null);
            sender.setSelected(!sender.isSelected());
        }
    },
    onNewTry: function (container = this) {
        container.getParent().canLayer.refresh();
    }
});

var CanLayer = cc.Layer.extend({
    candidates: null,
    boardState: null,

    ctor:function (selCnt) {
        this._super();

        var size = cc.director.getWinSize();

        var refreshBtn = new ccui.Button();
        refreshBtn.loadTextures(res.refresh);
        refreshBtn.x = size.width - 20;
        refreshBtn.y = size.height / 2 - 160;
        this.addChild(refreshBtn);
        refreshBtn.setTouchEnabled(true);
        refreshBtn.addTouchEventListener(this.onRefresh, this);

        this.candidates = [];
        var gap = 2, space = 5;
        var firstRow = Math.ceil(sta.selectCount / 2);
        var firstWidth = (size.width - 10) / firstRow;
        for (i = 0; i < firstRow; i ++){
            var can = new CheckLabelScale(res.cannormalbg, 
                res.canselectbg, res.canselectbg);
            can.x = size.width / 2 - firstWidth * (firstRow / 2 - i - 0.5);
            can.y = size.height / 2 - 200;
            can.setSize(firstWidth - 8, -1);
            can.checkbox.addTouchEventListener(this.onCandidate, this);
            this.candidates.push(can);
            this.addChild(can);
        }
        var secondRow = Math.floor(sta.selectCount / 2);
        var secondWidth = (size.width - 10) / secondRow;
        for (i = 0; i < secondRow; i ++){
            var can = new CheckLabelScale(res.cannormalbg, 
                res.canselectbg, res.canselectbg);
            can.x = size.width / 2 - secondWidth * (secondRow / 2 - i - 0.5);
            can.y = size.height / 2 - 260;
            can.setSize(secondWidth - 8, -1);
            can.checkbox.addTouchEventListener(this.onCandidate, this);
            this.candidates.push(can);
            this.addChild(can);
        }

        this.init();
        this.refresh();
    },
    init: function() {
        for (i = 0; i < this.candidates.length; i ++)
            this.candidates[i].selected = false;
        counter = 0;
        ready = false;
        dialogOpen = false;

        this.boardState = [];
        for (i = 0; i < con.boardCount; i ++)
            this.boardState.push(con.canNormal);
        
        this.refresh();
    },
    onRefresh: function(sender, type){
        if (type != ccui.Widget.TOUCH_ENDED)
            return;
        this.refresh();
    },
    refresh: function() {
        this.deselectAll();

        for (i = 0; i < con.boardCount; i ++)
            if (this.boardState[i] == con.canSelected)
                this.boardState[i] = con.canNormal;

        var avails = [];
        // get available triples
        for (i = 0; i < con.boardCount; i += con.boardStep)
            if (this.boardState[i] == con.canNormal)
                avails.push(i);
        
        // finished
        if (avails.length == 0)
            return false;
        
        // get one triple
        var selIdx = avails[Math.floor(Math.random() * avails.length)];
        var sels = [selIdx, selIdx+1, selIdx+2];
        for (i = 0; i < sels.length; i ++)
            this.boardState[sels[i]] = con.canSelected;
        
        // get remaining candidates
        avails = [];
        for (i = 0; i < con.boardCount; i ++)
            if (this.boardState[i] == con.canNormal)
                avails.push(i);

        while (sels.length < sta.selectCount && avails.length > 0) {
            selIdx = avails[Math.floor(Math.random() * avails.length)];
            sels.push(selIdx);
            this.boardState[selIdx] = con.canSelected;
            avails.splice(selIdx, 1);
        }
        while (sels.length < sta.selectCount) {
            sels.push(Math.floor(Math.random() * con.boardCount));
        }

        // shuffle selected indices
        shuffle(sels);

        for (i = 0; i < this.candidates.length; i ++)
            this.candidates[i].setValue(sels[i]);

        return true;
    },
    checkSet: function() {
        var sels = [];
        for (i = 0; i < this.candidates.length; i ++)
            if (this.candidates[i].selected)
                sels.push(this.candidates[i].value);
        
        if (sels.length != con.boardStep)
            return false;

        sels.sort(function(a, b){return a - b});
        selectedTriple = sels[0];
        
        if (sels[0] % 3 == 0 && sels[1] == sels[0] + 1 && sels[2] == sels[0] + 2)
            return true;
        return false;
    },
    getReady: function(container = this) {
        // ready to place
        ready = true;

        // selectedTriple is set in checkSet()
    },
    onCandidate: function (sender, type){
        if (type != ccui.Widget.TOUCH_ENDED)
            return;
        if (ready || dialogOpen){
            sender.setSelected(!sender.isSelected());
            return;
        }
        
        for (i = 0; i < this.candidates.length; i ++){
            if (sender == this.candidates[i].checkbox){
                // at this point, select is not affected yet
                if (!sender.isSelected()){
                    counter ++;
                    this.candidates[i].selected = true;
                    if (counter == 3){
                        if (this.checkSet())
                            showMessageBoxOK(this, "That's a set", 
                            "Now touch the correct place on the circle to play the set.", 
                            this.getReady);
                        else
                            showMessageBoxOK(this, "Try again", 
                            "Those 3 cards do not form a set.", 
                            this.deselectAll);
                    }
                }
                else{
                    counter --;
                    this.candidates[i].selected = false;
                }
            }
            else{
                
            }
        }
    },
    deselectAll: function (container = this) {
        for (i = 0; i < container.candidates.length; i ++){
            container.candidates[i].checkbox.setSelected(false);
            container.candidates[i].selected = false;
        }
        counter = 0;
        ready = false;
    },
    place: function () {
        this.boardState[selectedTriple] = con.canFilled;
        this.boardState[selectedTriple + 1] = con.canFilled;
        this.boardState[selectedTriple + 2] = con.canFilled;
        if (!this.refresh()){
            // finished
            return false;
        }
        return true;
    }
});

var GameLayer = cc.Layer.extend({
    boardLayer: null,
    canLayer: null,

    ctor:function () {
        this._super();

        var size = cc.director.getWinSize();
        var sprite = cc.Sprite.create(res.background);
        sprite.setPosition(size.width / 2, size.height / 2);
        sprite.setScale(0.5);
        this.addChild(sprite, 0);

        this.boardLayer = new BoardLayer();
        this.addChild(this.boardLayer, 1);

        this.canLayer = new CanLayer();
        this.addChild(this.canLayer, 1);
    }
});

var GameScene = cc.Scene.extend({
    onEnter:function () {
        this._super();

        if (gameSceneInitialized)
            return;
        gameSceneInitialized = true;

        var layer = new GameLayer();
        this.addChild(layer);

        var navLayer = new NavigationLayer();
        this.addChild(navLayer);
    }
});

var showMessageBoxOK = function(parent, title, message, callback){
    dialogOpen = true;

    var layBackground = cc.LayerColor.create(cc.color(0,0,0,125));
    parent.addChild(layBackground, 10);

    var size = cc.director.getWinSize();

    var messagebg = cc.Sprite.create(res.messagebg);
    messagebg.setPosition(size.width / 2, size.height / 2);
    layBackground.addChild(messagebg, 1);

    var lblTitle = cc.LabelTTF.create(title, "Arial", 12);
    lblTitle.setFontFillColor(cc.color(0,0,0));
    lblTitle.setAnchorPoint(0,0);
    lblTitle.setPosition(size.width / 2 - 200 + 20, size.height / 2 + 50 - 35);
    layBackground.addChild(lblTitle, 2);

    var lblMessage = cc.LabelTTF.create(message, "Arial", 12);
    lblMessage.setFontFillColor(cc.color(0,0,0));
    lblMessage.setAnchorPoint(0,0);
    lblMessage.setPosition(size.width / 2 - 200 + 20, size.height / 2 - 10);
    layBackground.addChild(lblMessage, 2);

    var menu = cc.Menu.create();
    menu.setPosition(0, 0);
    layBackground.addChild(menu, 3);

    var btnText = cc.LabelTTF.create("OK", "Arial", 12);
    btnText.setFontFillColor(cc.color(0,150,150));
    //btnText.setAnchorPoint(0,0);
    var btnOK = cc.MenuItemLabel.create(
        btnText,
        function(){
            dialogOpen = false;
            layBackground.removeAllChildren(true);
            layBackground.removeFromParent(true);
            if (callback)
                callback(parent);
        },
        this
    );
    btnOK.setPosition(size.width - 80, size.height / 2 - 50 + 15);
    menu.addChild(btnOK);
};

var showMessageBoxOkCancel = function(parent, title, message, OkCallback, CancelCallback, okText, cancelText){
    dialogOpen = true;

    var layBackground = cc.LayerColor.create(cc.color(0,0,0,125));
    parent.addChild(layBackground, 10);

    var size = cc.director.getWinSize();

    var messagebg = cc.Sprite.create(res.messagebg);
    messagebg.setPosition(size.width / 2, size.height / 2);
    layBackground.addChild(messagebg, 1);

    var lblTitle = cc.LabelTTF.create(title, "Arial", 12);
    lblTitle.setFontFillColor(cc.color(0,0,0));
    lblTitle.setAnchorPoint(0,0);
    lblTitle.setPosition(size.width / 2 - 200 + 20, size.height / 2 + 50 - 35);
    layBackground.addChild(lblTitle, 2);

    var lblMessage = cc.LabelTTF.create(message, "Arial", 12);
    lblMessage.setFontFillColor(cc.color(0,0,0));
    lblMessage.setAnchorPoint(0,0);
    lblMessage.setPosition(size.width / 2 - 200 + 20, size.height / 2 - 10);
    layBackground.addChild(lblMessage, 2);

    var menu = cc.Menu.create();
    menu.setPosition(0, 0);
    layBackground.addChild(menu, 3);

    var btnOkText = cc.LabelTTF.create(okText, "Arial", 12);
    btnOkText.setFontFillColor(cc.color(0,150,150));
    var btnOk = cc.MenuItemLabel.create(
        btnOkText,
        function(){
            dialogOpen = false;
            layBackground.removeAllChildren(true);
            layBackground.removeFromParent(true);
            if (OkCallback)
                OkCallback(parent);
        },
        this
    );
    btnOk.setPosition(size.width - 110, size.height / 2 - 50 + 15);
    menu.addChild(btnOk);

    var btnCancelText = cc.LabelTTF.create(cancelText, "Arial", 12);
    btnCancelText.setFontFillColor(cc.color(0,150,150));
    var btnCancel = cc.MenuItemLabel.create(
        btnCancelText,
        function(){
            dialogOpen = false;
            layBackground.removeAllChildren(true);
            layBackground.removeFromParent(true);
            if (CancelCallback)
                CancelCallback(parent);
        },
        this
    );
    btnCancel.setPosition(size.width - 180, size.height / 2 - 50 + 15);
    menu.addChild(btnCancel);
};

var shuffle = function (a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}
