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
    },

    // use this for initialization
    onLoad: function () {
        if(cc.vv == null){
            return;
        }
        
        this.initView();
        this.initEventHandler();
    },

    start: function () {
        this.initAllFolds();
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
            self.initAllFolds();
        });  
        
        this.node.on('game_sync',function(data){
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
                self.initAllFolds();
            }
        });

        this.node.on('peng_notify', function(data) {
            if (!cc.vv.replayMgr.isReplay()) {
                self.initAllFolds();
            }
        });

        this.node.on('gang_notify',function(data) {
            if (!cc.vv.replayMgr.isReplay()) {
                var info = data.detail;

                if (info.gangtype == 'diangang') {
                    self.initAllFolds();
                }
            }
            
        });

        this.node.on('hupai',function(data) {
            if (!cc.vv.replayMgr.isReplay()) {
                self.initAllFolds();
            }
            
        });

        this.node.on('chiting_notify', function(data) {
            if (!cc.vv.replayMgr.isReplay()) {
                self.initAllFolds();
            }
        });

        this.node.on('pengting_notify', function(data) {
            if (!cc.vv.replayMgr.isReplay()) {
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
    },
    
    initFolds:function(seatData){
        var folds = seatData.folds;
        if(folds == null){
            return;
        }
        var localIndex = cc.vv.gameNetMgr.getLocalIndex(seatData.seatindex);
        var pre = cc.vv.controlMgr.getFoldPre(localIndex);
        var side = cc.vv.controlMgr.getSide(localIndex);
        
        var foldsSprites = this._folds[side];
        for(var i = 0; i < foldsSprites.length; ++i){
            var index = i;
            if(side == "right" || side == "up"){
                index = foldsSprites.length - i - 1;
            }
            var sprite = foldsSprites[index];
            sprite.node.active = true;
            this.setSpriteFrameByMJID(pre,sprite,folds[i]);
        }
        for(var i = folds.length; i < foldsSprites.length; ++i){
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

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
