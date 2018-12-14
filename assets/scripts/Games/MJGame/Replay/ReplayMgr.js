var ACTION_QI = 0;
var ACTION_CHUPAI = 1;
var ACTION_MOPAI = 2;
var ACTION_PENG = 3;
var ACTION_GANG = 4;
var ACTION_HU = 5;
var ACTION_ZIMO = 6;
var ACTION_CHI = 7;
var ACTION_TING = 8;
var ACTION_BUHUA = 9;
var ACTION_ACTION_CHI = 21;
var ACTION_ACTION_PENG = 22;
var ACTION_ACTION_GANG = 23;
var ACTION_ACTION_HU = 24;


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
        _lastAction:null,
        _actionRecords:null,
        _currentIndex:0,
    },

    // use this for initialization
    onLoad: function () {

    },
    
    clear:function(){
        this._lastAction = null;
        this._actionRecords = null;
        this._currentIndex = 0;

        this.clearOptionData();
    },

    clearOptionData: function () {

        this.optionData.mjId = -1;

        var option_length = this.optionData.playArray.length;
        if (option_length > 0) {
            this.optionData.playArray.splice(0, option_length);
        }
        this.optionData.playArray = [];

        var option_gang_length = this.optionData.gangIdArray.length;
        if (option_gang_length > 0) {
            this.optionData.gangIdArray.splice(0, option_gang_length);
        }
        this.optionData.gangIdArray = [];
    },
    
    init:function(data){
        this._actionRecords = data.action_records;
        if(this._actionRecords == null){
            this._actionRecords = {};
        }
        this._currentIndex = 0;
        this._lastAction = null;

        this.optionData = {
            mjId: -1,
            playArray:[],
            gangIdArray:[]
        };
    },
    
    isReplay:function(){
        return this._actionRecords != null;    
    },

    getBuHuaPai: function (seatindex, paiNumber, pai) {
        var paiArray = [];
        paiArray.push(pai);
        for (var i = 0; i < paiNumber; i++) {
            var lastAction = this.getNextAction();
            if (lastAction.si != seatindex || lastAction.type != ACTION_BUHUA) {
                cc.log("ReplayMgr buhua error lastAction = ", lastAction, "           seatindex = ", seatindex);
                break;
            }
            paiArray.push(lastAction.pai);
        };

        return paiArray;
    },

    getReplyPlayOption: function (seatindex, actionType, actionMJId) {
        
        var firstKey = this.getOptionKey(actionType);
        if (firstKey == "") {
            return null;
        }

        this.optionData.playArray.push(firstKey);
        if (firstKey == "chi" || firstKey == "peng" || firstKey == "hu") {
            this.optionData.mjId = actionMJId;
        }else if (firstKey == "gang") {
            this.optionData.gangIdArray.push(actionMJId);
        };

        var nextAction = this.getNextAction();
        if (nextAction == null || (nextAction.si != seatindex || (nextAction.type != ACTION_ACTION_CHI && nextAction.type != ACTION_ACTION_PENG && nextAction.type != ACTION_ACTION_GANG && nextAction.type != ACTION_ACTION_HU))) {
            this._currentIndex -= 3;
            return this.optionData;
        }else {
            return this.getReplyPlayOption(nextAction.si, nextAction.type, nextAction.pai);
        }

    },

    getOptionKey: function (type) {

        var key = "";
        switch(type) {
            case ACTION_ACTION_CHI:
                key = "chi";
                break;
            case ACTION_ACTION_PENG:
                key = "peng";
                break;
            case ACTION_ACTION_GANG:
                key = "gang";
                break;
            case ACTION_ACTION_HU:
                key = "hu";
                break;
            default:
                break;
        }

        return key;
    },
    
    getNextAction:function(){
        if(this._currentIndex >= this._actionRecords.length){
            return null;
        }
        
        var si = this._actionRecords[this._currentIndex++];
        var action = this._actionRecords[this._currentIndex++];
        var pai = this._actionRecords[this._currentIndex++];
        return {si:si,type:action,pai:pai};
    },
    
    takeAction:function(){
        var action = this.getNextAction();
        if(this._lastAction != null && this._lastAction.type == ACTION_CHUPAI){
            if(action != null && action.type != ACTION_PENG && action.type != ACTION_GANG && action.type != ACTION_HU && action.type != ACTION_CHI && action.type != ACTION_ZIMO && action.type != ACTION_BUHUA && action.type != ACTION_QI && action.type != ACTION_ACTION_CHI && action.type != ACTION_ACTION_PENG && action.type != ACTION_ACTION_GANG && action.type != ACTION_ACTION_HU){
                console.log("wujun guo");
                cc.vv.gameNetMgr.doGuo(this._lastAction.si,this._lastAction.pai);
            }
        }
        if (action != null && action.type != ACTION_QI && action.type != ACTION_ACTION_CHI && action.type != ACTION_ACTION_PENG && action.type != ACTION_ACTION_GANG && action.type != ACTION_ACTION_HU) {
            this._lastAction = action;
        }
        if(action == null){
            return -1;
        }
        var nextActionDelay = 1.0;
        if(action.type == ACTION_CHUPAI){
            console.log("wujun chupai");
            cc.vv.gameNetMgr.doChupai(action.si,action.pai);
            return 1.0;
        }
        else if(action.type == ACTION_MOPAI){
            console.log("wujun mopai");
            cc.vv.gameNetMgr.doMopai(action.si,action.pai);
            cc.vv.gameNetMgr.doTurnChange(action.si);
            return 0.5;
        }
        else if(action.type == ACTION_PENG){
            console.log("wujun peng");
            cc.vv.gameNetMgr.doPeng(action.si,action.pai, -1, true);
            cc.vv.gameNetMgr.doTurnChange(action.si);
            return 1.0;
        }
        else if(action.type == ACTION_GANG){
            console.log("wujun gang");
            cc.vv.gameNetMgr.dispatchEvent('hangang_notify',action.si);
            cc.vv.gameNetMgr.doGang(action.si,action.pai);
            cc.vv.gameNetMgr.doTurnChange(action.si);
            return 1.0;
        }
        else if(action.type == ACTION_HU){
            console.log("wujun hu");
            cc.vv.gameNetMgr.doHu({seatindex:action.si,hupai:action.pai,iszimo:false, GameType: 2});
            return 1.5;
        }
        else if(action.type == ACTION_ZIMO){
            console.log("wujun zimohu");
            cc.vv.gameNetMgr.doHu({seatindex:action.si,hupai:action.pai,iszimo:true, GameType: 1});
            return 1.5;
        }
        else if(action.type == ACTION_CHI){
            console.log("wujun chi");
            cc.vv.gameNetMgr.doChi(action.si,action.pai, -1, true);
            cc.vv.gameNetMgr.doTurnChange(action.si);
            return 1.0;
        }
        else if(action.type == ACTION_TING){
            console.log("wujun Ting");
            return 1.0;
        }
        else if(action.type == ACTION_BUHUA){
            cc.vv.gameNetMgr.doBuHua(action);
            return 1.0;
        }
        else if(action.type == ACTION_QI){
            console.log("wujun qi");
            cc.vv.gameNetMgr.doQiAndSan(action.si, ACTION_QI);
            return 1.0;
        }
        else if(action.type == ACTION_ACTION_CHI || action.type == ACTION_ACTION_PENG || action.type == ACTION_ACTION_GANG || action.type == ACTION_ACTION_HU){
            console.log("wujun option");
            this.clearOptionData();
            var delayTime = cc.vv.gameNetMgr.doReplyPlayOption(action.si, action.type, action.pai);
            return delayTime;
        }
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
