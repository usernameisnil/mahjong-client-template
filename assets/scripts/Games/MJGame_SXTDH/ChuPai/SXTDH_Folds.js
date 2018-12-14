cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        _folds:null,

        _focusNode:null,
        _focusDt:0,
        _focusID:0,
        _peng_gang_chi:false,
    },

    // use this for initialization
    onLoad: function () {
        if(cc.vv == null){
            return;
        }

        var roomPeople = cc.vv.SelectRoom.getRoomPeople();
        if (roomPeople === 2) {
            this.initView_two();
        } else if (roomPeople === 3) {
            this.initView_three();
        } else if (roomPeople === 4) {
            this.initView();
        }

        
        this.initFocus();
        this.initEventHandler();
    },

    start: function () {
        this.initAllFolds();
    },


    initView_three: function () {
        this._folds = {};
        var game = this.node.getChildByName("game");
        var sides = ["myself", "right", "left"];
        for (var i = 0; i < sides.length; ++i) {
            var sideName = sides[i];
            var sideRoot = game.getChildByName(sideName);
            var folds = [];
            var foldRoot = sideRoot.getChildByName("folds");
            var shang = foldRoot.getChildByName("shang");
            var zhong = foldRoot.getChildByName("zhong");
            var xia = foldRoot.getChildByName("xia");
            for (var j = 0; j < xia.children.length; ++j) {
                var n = xia.children[j];
                if (n == null) {
                    continue;
                }
                n.active = false;
                var sprite = n.getComponent(cc.Sprite);
                sprite.spriteFrame = null;
                folds.push(sprite);
            }
            for (var j = 0; j < zhong.children.length; ++j) {
                var n = zhong.children[j];
                if (n == null) {
                    continue;
                }
                n.active = false;
                var sprite = n.getComponent(cc.Sprite);
                sprite.spriteFrame = null;
                folds.push(sprite);
            }
            for (var j = 0; j < shang.children.length; ++j) {
                var n = shang.children[j];
                if (n == null) {
                    continue;
                }
                n.active = false;
                var sprite = n.getComponent(cc.Sprite);
                sprite.spriteFrame = null;
                folds.push(sprite);
            }
            this._folds[sideName] = folds;
        }
        this.hideAllFolds();
    },

    initView_two: function () {
        this._folds = {};
        var game = this.node.getChildByName("game");
        var sides = ["myself", "up"];
        var tmpSort = ["xia", "zhong", "shang"];
        for (var i = 0; i < sides.length; i++) {
            var sideName = sides[i];
            var sideRoot = game.getChildByName(sideName);
            var folds = [];
            var foldRoot = sideRoot.getChildByName("folds");
            for (var j = 0; j < foldRoot.children.length; ++j) {
                //var n = foldRoot.children[j];

                var n = foldRoot.getChildByName(tmpSort[j])
                if (n == null) {
                    continue;
                }
                var sides_nums = n.children;
                for (var jj = 0; jj < sides_nums.length; ++jj) {
                    var sprite = sides_nums[jj].getComponent(cc.Sprite);
                    sides_nums[jj].active = false;
                    sprite.spriteFrame = null;
                    folds.push(sprite);
                }
            }
            this._folds[sideName] = folds;
        }
       // console.log(this._folds);
        this.hideAllFolds();
    },
        
        
    
    initView:function(){
        this._folds = {};
        var game = this.node.getChildByName("game");
        var sides = ["myself","right","up","left"];
        for(var i = 0; i < sides.length; ++i){
            var sideName = sides[i];
            var sideRoot = game.getChildByName(sideName);
            var folds = [];
            var foldRoot = sideRoot.getChildByName("folds");
            for(var j = 0; j < foldRoot.children.length; ++j){
                var n = foldRoot.children[j];
                if (n == null) {
                    continue;
                }
                n.active = false;
                var sprite = n.getComponent(cc.Sprite); 
                sprite.spriteFrame = null;
                folds.push(sprite);            
            }
            this._folds[sideName] = folds; 
        }
        
        this.hideAllFolds();
    },
    
    hideAllFolds:function(){
        for(var k in this._folds){
            var fold = this._folds[k];
            for(var i in fold){
                fold[i].node.active = false;
            }
        }
    },
    
    initEventHandler:function(){
        var self = this;
        this.node.on('game_begin',function(data){
            self.initFocus();
            self.initAllFolds();
        });  
        
        this.node.on('game_sync',function(data){
            self.initFocus();
            self.initAllFolds();
        });
        
        this.node.on('game_chupai_notify',function(data){
            if (cc.vv.replayMgr.isReplay()) {
                self.initFolds(data.detail);
            }else {
                self.initFolds(data.detail.seatData);
            }
        });
        
        this.node.on('guo_notify',function(data){
            if (cc.vv.replayMgr.isReplay()) {
                self.initFolds(data.detail);
            }
        });

        this.node.on('chi_notify', function(data) {
            if (!cc.vv.replayMgr.isReplay()) {
                self._peng_gang_chi = true;
                self.initAllFolds();
            }
        });

        this.node.on('peng_notify', function(data) {
            if (!cc.vv.replayMgr.isReplay()) {
                self._peng_gang_chi = true;
                self.initAllFolds();
            }
        });

        this.node.on('gang_notify',function(data) {
            if (!cc.vv.replayMgr.isReplay()) {
                var info = data.detail;

                if (info.gangtype == 'diangang') {
                    self._peng_gang_chi = true;
                    self.initAllFolds();
                }
            }
            
        });

        this.node.on('hupai',function(data) {
            if (!cc.vv.replayMgr.isReplay()) {
                self.initAllFolds();
            }

            self.showFocus(false);
            
        });

        this.node.on('chiting_notify', function(data) {
            if (!cc.vv.replayMgr.isReplay()) {
                self._peng_gang_chi = true;
                self.initAllFolds();
            }
        });

        this.node.on('pengting_notify', function(data) {
            if (!cc.vv.replayMgr.isReplay()) {
                self._peng_gang_chi = true;
                self.initAllFolds();
            }
        });
    },
    
    initAllFolds:function(){
        var seats = cc.vv.gameNetMgr.seats;
        if (seats == null) {
            return;
        }
        for(var i in seats){
            this.initFolds(seats[i]);
        }
        if(this._peng_gang_chi ==true){
            this._peng_gang_chi = false;
        }
    },
    
    initFolds:function(seatData){
        var folds = seatData.folds;
        if(folds == null){
            return;
        }
        var localIndex = cc.vv.gameNetMgr.getLocalIndex(seatData.seatindex);
        var pre = cc.vv.controlMgr.getFoldPre(localIndex);
        var side = cc.vv.controlMgr.getSide(localIndex);
        
        var len_fold = folds.length;
        var isturn = this.isTurn(seatData.seatindex);

        var foldsSprites = this._folds[side];

        for(var i = 0; i < foldsSprites.length; ++i){
            var index = i;
            if(side == "right" || side == "up"){
                index = foldsSprites.length - i - 1;
            }
            var sprite = foldsSprites[index];
            sprite.node.setScale(1, 1);

            if (folds[i] === -1){
                this.setEmptySpriteFrame(sprite,side);
            }else if (folds[i] >= 0) {
                this.setSpriteFrameByMJID(pre,sprite,folds[i]);
            }

            if (this._peng_gang_chi == true) {
                this.showFocus(false);
            }else if (isturn == true && i == (len_fold-1)) {
                this.setFocusPos(sprite.node, side, len_fold);
            } 
        }

        for(var i = len_fold; i < foldsSprites.length; ++i){
            var index = i;
            if(side == "right" || side == "up"){
                index = foldsSprites.length - i - 1;
            }
            var sprite = foldsSprites[index];
            
            sprite.spriteFrame = null;
            sprite.node.active = false;
        }  
    },
    
    setSpriteFrameByMJID:function(pre,sprite,mjid){
        sprite.spriteFrame = cc.vv.controlMgr.getSpriteFrameByMJID(pre,mjid);
        sprite.node.active = true;
    },

     /*
    * 给最新打出的麻将添加浮动焦点
     */
    
    addFocusPrefab: function () {
        var focusPrefab = cc.vv.prefabMgr.getPrefab("prefabs/Games/MJGame/ChuPai/Common/FoldMJFocusi/Common/FoldMJFocus");
        this._focusNode = cc.instantiate(focusPrefab);

        var focusRoot = this.node.getChildByName("game").getChildByName("focusRoot");
        focusRoot.addChild(this._focusNode);
    },

    initFocus: function () {
        
        if (this._focusNode == null) {
            this.addFocusPrefab();
        }

        this.showFocus(false);
    },

    showFocus: function (isShow) {
        if (this._focusNode == null) {
            return;
        }

        this._focusNode.active = isShow;
    },

    isTurn: function (seatindex) {
        if (cc.vv.gameNetMgr.turn == seatindex) {
            return true;
        }else {
            return false;
        }
    },

    setFocusPos: function (mjNode, side, lenFold) {
        
        if (this._focusNode == null) {
            return;
        }
        
        var game = this.node.getChildByName("game");
        var sideRoot = game.getChildByName(side);
        var folds = sideRoot.getChildByName("folds");
        var parent = this.getFoldMJParent(folds, lenFold);

        var mjPos = mjNode.getPosition();
        var mjWorldPos = parent.convertToWorldSpaceAR(mjPos);

        var mjNodePos = game.convertToNodeSpaceAR(mjWorldPos);

        this._focusNode.setPosition(mjNodePos);
        this.setLblFocusPosY(side);

        this.showFocus(true);

    },

    getFoldMJParent: function (folds, lenFold) {
        var parent = folds;
        var gameSeatCount = cc.vv.SelectRoom.getRoomPeople();
        if (gameSeatCount == 3) {
            var tmpSetLen = 12;
            var tmpName = this.getTmpName(lenFold, tmpSetLen);
            parent = folds.getChildByName(tmpName);
        }else if (gameSeatCount == 2) {
            var tmpSetLen = 20;
            var tmpName = this.getTmpName(lenFold, tmpSetLen);
            parent = folds.getChildByName(tmpName);
        }

        return parent;
    },

    getTmpName: function (foldLen, tmpMaxCount) {
        var tmpSort = ["xia","zhong","shang"];
        var index = Math.floor((foldLen-1)/tmpMaxCount);
        return tmpSort[index];
    },

    setLblFocusPosY: function (side) {

        var lblFocusNode = this._focusNode.getChildByName("lblFocus");

        var gameSeatCount = cc.vv.SelectRoom.getRoomPeople();
        if (gameSeatCount == 4) {
            if (side == "right" || side == "left") {
                lblFocusNode.y = 20;
            }
        }else if (gameSeatCount == 3) {
            if (side == "right" || side == "left") {
                lblFocusNode.y = 25;
            }
        }
        if (side == "myself" || side == "up") {
            lblFocusNode.y = 30;
        }
        
    },

    update: function (dt) {
        if (this._focusNode && this._focusNode.active) {
            this._focusDt += dt;
            if (this._focusDt > 0.2) {
                this._focusDt -= 0.2;

                this._focusID = (this._focusID + 1) % 6;
                var lblFocus = this._focusNode.getChildByName("lblFocus").getComponent("cc.Label");
                lblFocus.getComponent(cc.Label).string = this._focusID;
            }
        }
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
