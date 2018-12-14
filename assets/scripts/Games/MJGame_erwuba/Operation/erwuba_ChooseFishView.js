cc.Class({
    extends: cc.Component,

    properties: {
        fishPrefab: {
        	default: null,
            type: cc.Prefab
        }
    },

    onLoad: function () {

    	this.init();
    },

    init: function () {
    	
    	this.initData();

    	// this.initEventHandlers();

    	this.initFishView();

    },

    initData: function () {
    	this.fishView = null;
        this.tips = null;
    	this.fishNumber = 0;
    	this.scoreCount = 13;
    },

    addFishView: function () {
    	if (this.fishView != null) {
    		return;
    	}
    	// this.fishView = cc.instantiate(this.fishPrefab);

    	var gameChild = this.node.getChildByName("game");

    	this.tips = gameChild.getChildByName("fishTips");

    	this.seatsUI = gameChild.getChildByName("seats")

    	// var myselfNode = gameChild.getChildByName("myself");
    	// myselfNode.addChild(this.fishView);

    	// this.body = this.fishView.getChildByName("body");

    	// var fishNumber = this.body.getChildByName("fishNumber");
    	// this.lblNumber = fishNumber.getChildByName("lblNumber").getComponent("cc.Label");

    	// this.onSliderEventLinstener();

    	// this.sureBtn = this.body.getChildByName("btnSure");
    	// cc.vv.utils.addClickEvent(this.sureBtn,this.node,"ChooseFishView","onSureBtnClicked");
    },

    onSliderEventLinstener: function () {
        this.slider = this.body.getChildByName("fishSlider");
        cc.vv.utils.addSlideEvent(this.slider,this.node,"ChooseFishView","onSlided");
    },

    showFishTips: function (isShow) {
    	if (this.tips == null) {
    		return;
    	}
    	this.tips.active = true;
    	for (var i = 0; i < this.tips.childrenCount; i++) {
    		this.tips.children[i].active = isShow;
    	};
    },

    showPlayerTip: function (playerIndex, isShow) {
    	if (this.tips == null) {
    		return;
    	}
    	this.tips.children[playerIndex].active = isShow;
    },

    initSeatsXiaYu: function (isShow) {

    	if (this.seatsUI == null) {
    		return;
    	}

    	for (var i = 0; i < this.seatsUI.childrenCount; i++) {
    		var seatUI = this.seatsUI.children[i];
    		var xiayuUI = seatUI.getChildByName("xiayu");
    		xiayuUI.active = isShow;
    	};

    },

    showSeatsXiaYu: function () {
    	var seats = cc.vv.gameNetMgr.seats;
    	if (seats == null || this.seatsUI == null) {
    		return;
    	}

        for(var i = 0; i < seats.length; ++i){
            var score = seats[i].xiapao;
            if(score == null || score < 0 || score > 12){
                score = null;
            }
            
            var localIndex = cc.vv.gameNetMgr.getLocalIndex(i);
            var seatUI = this.seatsUI.children[localIndex];
    		var xiayuUI = seatUI.getChildByName("xiayu");

    		if (score == null) {
    			xiayuUI.active = false;
    		}else {
    			xiayuUI.active = true;
    			var lblScore = xiayuUI.getChildByName("lblYu").getComponent("cc.Label");
    			lblScore.string = score.toString();
    		}
        }
    },

    showSeatXiaYu: function (playerIndex, isShow) {
    	if (this.seatsUI == null) {
    		return;
    	}

    	var seatUI = this.seatsUI.children[playerIndex];
    	var xiayuUI = seatUI.getChildByName("xiayu");
    	xiayuUI.active = isShow;

    },

    initFishView: function () {
    	
    	this.addFishView();

    	this.showFishTips(false);
    	this.initSeatsXiaYu(false);

    	// this.showFishView(cc.vv.gameNetMgr.isShowPao);
    	// var isShowView = this.getFishViewActive();
    	// if (!isShowView) {
    	// 	this.showSeatsXiaYu();
    	// 	return;
    	// }
    	// this.setFishNumber(this.fishNumber);
    	// this.syncFishView();

    },

    syncFishView: function () {
    	var seats = cc.vv.gameNetMgr.seats;
    	if (seats == null) {
    		return;
    	}

    	for (var i = 0; i < seats.length; i++) {
    		var yuScore = seats[i].xiapao;
            if(yuScore == null || yuScore < 0 || yuScore > 12){
                continue;
            }
            
            var localIndex = cc.vv.gameNetMgr.getLocalIndex(i);
            this.showPlayerTip(localIndex, true);

            if (localIndex == 0) {
            	this.showFishView(false);

            	// var progress = yuScore / this.scoreCount;
            	// this.slider.getComponent("cc.Slider").progress = progress;
            	// this.setNumber(yuScore);
            }
    	};
    },

    initEventHandlers:function() {
        var self = this;

        this.node.on('game_xiapao',function(data){

            self.playerXiaYuBegin();
        });
        
        this.node.on('game_xiapao_notify',function(data){

        	var data = data.detail;
            self.playerXiaYuNotify(data);
        });
        
        this.node.on('game_xiapao_finish',function(){

        	self.gameXiaYuFinish();
        });

        this.node.on('game_xiapao_begin',function(){
            // self.initXuanPao();
        });
    },

    setFishNumber: function (number) {
    	this.lblNumber.string = number.toString();
    },

    showFishView: function (isShow) {
    	this.fishView.active = isShow;
    },

    getFishViewActive: function () {
    	return this.fishView.active;
    },

    onSlided: function (slider) {
    	this.showSlider(slider.progress);
    },

    showSlider: function (progress) {

        var number = Math.floor(progress * this.scoreCount);
        if (number == 13) {
            number--;
        }

        this.setNumber(number);
        
    },

    setNumber: function (number) {
    	this.fishNumber = number;
        this.setFishNumber(number);
    },

    onSureBtnClicked: function (event) {
        
    	cc.vv.net.send("xiapao",this.fishNumber);
    },

    initSeatsXiaYuScore: function () {
    	var seats = cc.vv.gameNetMgr.seats;
    	if (seats == null) {
    		return;
    	}

    	for (var i = 0; i < seats.length; i++) {
    		seats[i].xiapao = -1;
    	};
    },

    playerXiaYuBegin: function () {

    	if (cc.vv.gameNetMgr.gamestate == "xiapao" && cc.vv.gameNetMgr.isShowPao == true) {
            this.fishNumber = 0;
            if (this.slider != null) {
            	this.slider.getComponent("cc.Slider").progress = 0;
            }
            
            this.initSeatsXiaYuScore();
            this.initFishView();
        }
    },

    playerXiaYuNotify: function  (playerId) {

    	var seatIndex = cc.vv.gameNetMgr.getSeatIndexByID(playerId);
        var localIndex = cc.vv.gameNetMgr.getLocalIndex(seatIndex);
 
    	this.showPlayerTip(localIndex, true);

    	if (localIndex == 0) {
    		this.showFishView(false);
    	}
    	
    },

    gameXiaYuFinish: function () {

    	cc.vv.gameNetMgr.isShowPao = false;
    	this.showFishTips(false);
    	this.showFishView(false);
    	this.showSeatsXiaYu();
    },

    onDestroy: function () {
    	this.initData();
    }

});