cc.Class({
    extends: cc.Component,

    properties: {
        ytzPrefab: {
            default: null,
            type: cc.Prefab
        },
        typeFrames: {
            default: [],
            type: cc.SpriteFrame
        },
        scoreFrames: {
            default: [],
            type: cc.SpriteFrame
        }
    },

    // use this for initialization
    onLoad: function () {

        this.yatouziNumber = 0;
        this.initSeatsYTZ();
        this.initTips();
        this.addYTZ();
        this.initEventHandlers();

        if (cc.vv.gameNetMgr.gamestate == "xiapao" && cc.vv.gameNetMgr.isShowPao == true) {
            this.syncInit();
            var myChooseState = this.getSeatChooseState(0);
            if (myChooseState == false) {
                this.initYTZView();
            }
            
        }else {
            this.showSeatsYTZ(true);
        }
    },

    addYTZ: function () {
        var gameChild = this.node.getChildByName("game");
        this.ytzView = cc.instantiate(this.ytzPrefab);
        gameChild.addChild(this.ytzView);
        this.showYTZView(false);
    },

    /*
    * 玩家已压头子提示
     */
    
    initTips: function () {
        this.tipUIArray = [];

        var gameChild = this.node.getChildByName("game");
        var tips = gameChild.getChildByName("yatouziTips");
        for (var i = 0; i < tips.childrenCount; i++) {
            tips.children[i].active = false;
            this.tipUIArray.push(tips.children[i]);
        };

        this.showTips(false);
    },

    showTips: function (isShowTip) {
        if (this.tipUIArray == null) {
            return;
        }

        for (var i = 0; i < this.tipUIArray.length; i++) {
            this.tipUIArray[i].active = isShowTip;
        };
    },

    showTip: function (index, isShowTip) {
        if (this.tipUIArray == null) {
            return;
        }

        this.tipUIArray[index].active = isShowTip;
    },

    /**********************************/

    /*
    * 玩家压头子分值和类型展示
     */
    
    initSeatsYTZ: function () {
        this.seatTZUIArray = [];

        var gameChild = this.node.getChildByName("game");
        var seatsUI = gameChild.getChildByName("ytzSeatsType");

        for (var i = 0; i < seatsUI.childrenCount; i++) {
            var yatouziUI = seatsUI.children[i];
            this.seatTZUIArray.push(yatouziUI);
        };

        this.showSeatsYTZ(false);
    },

    showSeatsYTZ: function (isShow) {
        if (this.seatTZUIArray == null) {
            return;
        }

        for (var i = 0; i < this.seatTZUIArray.length; i++) {
            this.showSeatYTZ(i, isShow);
        };
    },

    showSeatYTZ: function (index, isShow) {
        if (this.seatTZUIArray == null) {
            return;
        }

        var frames = this.getSeatFrame(index);

        if(frames == undefined || frames == null){return}

        var typeSprite = this.seatTZUIArray[index].getChildByName("typeTZ").getComponent("cc.Sprite");
        if (frames.typeIndex >= 0) {
            typeSprite.spriteFrame = this.typeFrames[frames.typeIndex];
        }else {
            typeSprite.spriteFrame = null;
        }

        var scoreSprite = this.seatTZUIArray[index].getChildByName("scoreTZ").getComponent("cc.Sprite");
        if (frames.scoreIndex >= 0) {
            scoreSprite.spriteFrame = this.scoreFrames[frames.scoreIndex];
        }else {
            scoreSprite.spriteFrame = null;
        }

        this.seatTZUIArray[index].active = isShow;
    },

    getSeatFrame: function (localIndex) {
        var seat = cc.vv.gameNetMgr.getSeatByLocalIndex(localIndex);
        if (seat == null) {
            return;
        }

        var number = seat.xiapao;
        var type = -1, score = -1;
        if (number == 0) {
            type = 0;

        }else if (number > 0) {
            score = number % 10;
            type = Math.floor(number / 10);
        }

        var frameIndex = {
            typeIndex: type,
            scoreIndex: score-1
        };

        return frameIndex;
    },
    
    /**********************************/

    /*
    * 压头子预制
     */

    initYTZView: function () {

        if (this.ytzView == null) {
            this.addYTZ();
        }

        var gameType = cc.vv.gameNetMgr.conf.opType;
        var ytzScript = this.ytzView.getComponent("HA_YaTouZi");
        if (ytzScript) {
            ytzScript.init(gameType, this.yatouziNumber);
        }

        this.showYTZView(true);
    },

    showYTZView: function (isShow) {
        this.ytzView.active = isShow;
    },

    getYTZViewActive: function () {
        return this.ytzView.active;
    },

    /**********************************/

    getSeatChooseState: function (localIndex) {

        var isChoose = false;
        var seat = cc.vv.gameNetMgr.getSeatByLocalIndex(localIndex);
        var score = seat.xiapao;
        if(score == null || score < 0){
            isChoose = false;
        }else {
            isChoose = true;
        }
        return isChoose;
    },

    syncInit: function () {
        var seats = cc.vv.gameNetMgr.seats;
        cc.log("yatouzi seats = ", seats);
        if (seats == null) {
            return;
        }

        for(var i = 0; i < seats.length; ++i){
            var pao = seats[i].xiapao;
            if (pao != null && pao >= 0) {
                var localIndex = cc.vv.gameNetMgr.getLocalIndex(i);
                this.showTip(localIndex, true);
                if (localIndex == 0) {
                    this.showSeatYTZ(localIndex, true)
                }else {
                   this.yatouziNumber++; 
                }
                
            }
        }
    },

    initEventHandlers:function() {
        var self = this;

        this.node.on('game_xiapao',function(data){
            self.yatouziNumber = 0;
            if (cc.vv.gameNetMgr.gamestate == "xiapao" && cc.vv.gameNetMgr.isShowPao == true) {
                self.initYTZView();

                // self.reSet();
                // self.showXiaPao();
            }
        });
        
        this.node.on('game_xiapao_notify',function(data){
            var seatIndex = cc.vv.gameNetMgr.getSeatIndexByID(data.detail);
            var localIndex = cc.vv.gameNetMgr.getLocalIndex(seatIndex);
            console.log("------------");
            console.log("game_xiapao_notify:" + localIndex);
            console.log("------------");

            if (localIndex == 0) {
                self.showYTZView(false);
            }else {
                self.yatouziNumber++;
            }

            self.showTip(localIndex, true);

            var showState = self.getYTZViewActive();
            if (showState == true) {
                var ytzScript = self.ytzView.getComponent("HA_YaTouZi");
                if (ytzScript) {
                    ytzScript.setTip(self.yatouziNumber);
                }
            }

            // self.tips[localIndex].node.active = true;
            // self.tips[localIndex].node.getComponent(cc.Label).string = "已下跑";
        });
        
        this.node.on('game_xiapao_finish',function(){

            self.showYTZView(false);
            self.showTips(false);
            self.showSeatsYTZ(true);

            // self.hideXiaPao();
            // self.initXuanPao();
        });

        this.node.on('game_xiapao_begin',function(){
            self.showSeatsYTZ(true);
            // self.initXuanPao();
        });

        this.node.on('game_over',function(data){
            self.showYTZView(false);
            self.showTips(false);
            self.showSeatsYTZ(false);
        });
    },
});