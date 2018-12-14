cc.Class({
    extends: cc.Component,

    properties: {
        runNode:null,
        _countDownNode:null,
        _cDNumberLabel:null,
        paoArr:[],
        _isSendKou: false,
        _sendTime: 0,
        _againTime: 0,
        _firstAutomaticSend: false,
        _cdSend: null,
    },

    // use this for initialization
    onLoad: function () {
        if(cc.vv === null) {
            return;
        }

        this.initView();
        this.initEventHandlers();
    },

    initView:function() {
        var gameChild = this.node.getChildByName("game");
        this.runNode = gameChild.getChildByName("run");
        this._countDownNode = this.runNode.getChildByName("countDown");
        this._cDNumberLabel = this._countDownNode.getChildByName("timeNumber").getComponent("cc.Label");
        this.showCountDown(false);

        // this.runNode.active = cc.vv.gameNetMgr.isShowPao;

        var seatsArr = gameChild.getChildByName("seats")
        for (var i = 0; i < seatsArr.childrenCount; i++) {
            var seat = seatsArr.children[i];
            var pao = seat.getChildByName("que");
            this.paoArr.push(pao);
        }

        this.reSet();

        if(cc.vv.gameNetMgr.gamestate == "runSelect" && cc.vv.gameNetMgr.isShowPao == true){
            this.showXiaPao();
        }
    },
    
    reSet:function(){
        this.runNode.getChildByName("buPao").getComponent(cc.Button).interactable = true;
        this.runNode.getChildByName("paoYi").getComponent(cc.Button).interactable = true;  

        for(var i = 0; i < this.paoArr.length; ++i){
            for(var j = 0; j < this.paoArr[i].children.length; ++j){
                this.paoArr[i].children[j].active = false;    
            }
        }
    },

    showCountDown: function (isShow) {
        if (this._countDownNode != null) {
            this._countDownNode.active = isShow;
        }
    },

    setTimeNumber: function (time) {
        if (this._cDNumberLabel == null) {
            return;
        }

        if (time >= 10) {
            this._cDNumberLabel.string = time.toString() + "秒";
        }else if (time < 10 && time >= 0) {
            this._cDNumberLabel.string = "0" + time.toString() + "秒";
        }
    },

    showXiaPao:function(){

        this.showView();
        this.initData(false);
        this.countDownSend();
    },

    showView: function () {
        this.runNode.active = true;
    },

    hideView: function () {
        cc.vv.gameNetMgr.isShowPao = false;
        this.runNode.active = false;
    },

    hideXiaPao: function () {

        this.clearCountDownSend();
        this.showCountDown(false);
        this.hideView();
        this.initData(true);
    },
    
    initEventHandlers:function() {
        var self = this;

        this.node.on('game_runSelect',function(data){
            if (cc.vv.gameNetMgr.gamestate == "runSelect" && cc.vv.gameNetMgr.isShowPao == true) {
                self.reSet();
                self.showXiaPao();
            }
        });
        
        this.node.on('game_runSelect_notify',function(data){
            var data = data.detail;
            if (data.seatIndex == cc.vv.gameNetMgr.seatIndex) {
                self.hideXiaPao();
            }
        });
    },

    onXuanPaoClicked:function(event){
        var type = 0;
        if(event.target.name == "buPao"){
            type = 0;
        }
        else if(event.target.name == "paoYi"){
            type = 1;
        }
        cc.vv.net.send("runSelect",type);
        cc.log("onXuanPaoClicked send type = ", type);

        this.clearCountDownSend();
        this.initData(true);

    },

    initData: function (isKou) {
        this._isSendKou = isKou;
        this._sendTime = 0;
        this._againTime = 0;
        this._firstAutomaticSend = false;
    },

    countDownSend: function () {
        
        this.clearCountDownSend();

        var timeNumber = 15;
        this.setTimeNumber(timeNumber);
        this.showCountDown(true);
        
        this._cdSend = setInterval(function () {
            if (this._isSendKou == false) {
                
                this._sendTime += 1;
                if (this._sendTime > 15) {
                    if (this._firstAutomaticSend == false) {
                        this._firstAutomaticSend = true;
                        cc.vv.net.send("runSelect",0);

                        this._againTime = 0;
                        timeNumber = 5;
                        this.setTimeNumber(timeNumber);
                    }else {
                        
                        this._againTime += 1;
                        if (this._againTime > 5) {
                            cc.vv.net.send("runSelect",0);
                            this._againTime = 0;
                            timeNumber = 5;
                            this.setTimeNumber(timeNumber);
                        }else {
                            timeNumber--;
                            this.setTimeNumber(timeNumber);
                        }
                        
                        
                    }
                }else {
                    timeNumber--; 
                    this.setTimeNumber(timeNumber);
                }
                
                
            }
        }.bind(this), 1000);
    },

    clearCountDownSend: function () {
        if (this._cdSend != null) {
            clearInterval(this._cdSend);
        }
        
        this._cdSend = null;
    },

    onDestroy:function(){
        console.log("ShowHoldsSetup onDestroy");
        this.clearCountDownSend();
    }
});
