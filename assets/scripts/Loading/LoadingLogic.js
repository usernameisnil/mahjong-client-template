require("../DataModel/GameoverActionDataModel.js");
require("../DataModel/IntegralShopConfigDataModel.js");

cc.Class({
    extends: cc.Component,

    properties: {
        //tipLabel:cc.Label,
        _stateStr:'',
        _progress:0.0,
        _splash:null,
        _isLoading:false,

        preloadSceneNUM:null,
    },

    // use this for initialization
    onLoad: function () {

        this.preloadSceneNUM = 0;

        if(!cc.sys.isNative && cc.sys.isMobile){
            var cvs = this.node.getComponent(cc.Canvas);
            cvs.fitHeight = true;
            cvs.fitWidth = true;
        }

        this.loadingDesignSize();
        
        this.initMgr();
        this._splash = cc.find("Canvas/splash");
        this._splash.active = true;
        
        this._mianze = cc.find('Canvas/body/mianze');
        this._mianze.active = false;
    },

    start: function() {
        var self = this;
        var SHOW_TIME = 1000;
        var FADE_TIME = 300;
        if(cc.sys.os != cc.sys.OS_IOS || !cc.sys.isNative){
            self._splash.active = true;
            var t = Date.now();
            var fn = function(){
                var dt = Date.now() - t;
                if(dt < SHOW_TIME){
                    setTimeout(fn,33);
                }
                else {
                    var op = (1 - ((dt - SHOW_TIME) / FADE_TIME)) * 255;
                    if(op < 0){
                        self._splash.opacity = 0;
                        self.checkVersion();    
                    }
                    else{
                        self._splash.opacity = op;
                        setTimeout(fn,33);   
                    }
                }
            };
            setTimeout(fn,33);
        }
        else{
            this._splash.active = false;
            this.checkVersion();
        }
    },
    
    initMgr: function() {

        if (!(typeof cc.vv == "object" && cc.vv.constructor == Object)) {
            cc.vv = {};
        }

		cc.vv.company = 'szmj/game';
		cc.vv.appname = 'max';
        cc.vv.brightGameName = "china";
        cc.vv.gameName = "yanzhao";

        var RoomCfg = require("config");
        cc.vv.roomCfg = new RoomCfg();
        cc.vv.roomCfg.init();
		
        var UserMgr = require("UserMgr");
        cc.vv.userMgr = new UserMgr();
        
        var ReplayMgr = require("ReplayMgr");
        cc.vv.replayMgr = new ReplayMgr();
        
        cc.vv.http = require("HTTP");
        cc.vv.global = require("Global");
        cc.vv.net = require("Net");
        cc.vv.net_hall = require("Net_hall");
        
        var PKLogic = require("PKLogic")    //add baihua2001cn cfg
        cc.vv.PKlogic = new PKLogic();
        var PDKLogic = require("PDKLogic")
        cc.vv.PDKlogic = new PDKLogic();

        var DDZPKMgr = require('DDZPKMgr');
        cc.vv.ddzpkmgr = new DDZPKMgr();
        var PDKPKMgr = require('PDKPKMgr');
        cc.vv.pdkpkmgr = new PDKPKMgr();


        var PKReplayMgr =  require("PKReplayMgr");
        cc.vv.PKReplayMgr = new PKReplayMgr();
        var PKReplayMgr =  require("PDKReplayMgr");
        cc.vv.PDKReplayMgr = new PKReplayMgr();
       
        cc.vv.gameNetMgr = {};
        var hallGameNetMgr = require("hallGameNetMgr");
        cc.vv.hallgameNetMgr = new hallGameNetMgr();     

        // var GameNetMgr = require("GameNetMgr");
        // cc.vv.mjgameNetMgr = new GameNetMgr();  //add baihua2001cn cfg
        // var haGameNetMgr = require('HA_GameNetMgr');
        // cc.vv.hagameNetMgr = new haGameNetMgr();
        // var tdhGameNetMgr = require('TDH_GameNetMgr');
        // cc.vv.tdhgameNetMgr = new tdhGameNetMgr();
        // var tkGameNetMgr = require('TK_GameNetMgr');
        // cc.vv.tkgameNetMgr = new tkGameNetMgr();
        // var EWBGameNetMgr = require('erwuba_GameNetMgr');
        // cc.vv.EWBgameNetMgr = new EWBGameNetMgr();
        // var SXTDHGameNetMgr = require('SXTDH_GameNetMgr');
        // cc.vv.SXTDHgameNetMgr = new SXTDHGameNetMgr();

        // var ddzNetMgr=require('ddzNetMgr');
        // cc.vv.ddzNetMgr=new ddzNetMgr();
        // var pdkNetMgr=require('pdkNetMgr');
        // cc.vv.pdkNetMgr=new pdkNetMgr();
        
                        
        var AnysdkMgr = require("AnysdkMgr");
        cc.vv.anysdkMgr = new AnysdkMgr();
        cc.vv.anysdkMgr.init();
        
        var VoiceMgr = require("VoiceMgr");
        cc.vv.voiceMgr = new VoiceMgr();
        cc.vv.voiceMgr.init();
        
        var AudioMgr = require("AudioMgr");
        cc.vv.audioMgr = new AudioMgr();
        cc.vv.audioMgr.init();
        
        // var Utils = require("Utils");
        // cc.vv.utils = new Utils();

        var PrefabMgr = require("PrefabMgr");
        cc.vv.prefabMgr = new PrefabMgr();
        cc.vv.prefabMgr.init();
        var GPSMgr = require("GPSMgr");
        cc.vv.GPSMgr = new GPSMgr();
        cc.vv.GPSMgr.init();
        var SelectRoom = require("SelectRoom");
        cc.vv.SelectRoom = new SelectRoom();
        cc.vv.SelectRoom.init();
        cc.args = this.urlParse();

        cc.CCreateConfigDataModel.init();
        cc.CGameConfigDataModel.init();
        cc.CGameoverActionDataModel.init();
        cc.CIntegralShopConfigDataModel.init();
    },
    
    urlParse: function() {
        var params = {};
        if (window.location == null) {
            return params;
        }

        var name, value; 
        var str = window.location.href; //取得整个地址栏
        var num = str.indexOf("?") 
        str = str.substr(num+1); //取得所有参数   stringvar.substr(start [, length ]
        
        var arr = str.split("&"); //各个参数放到数组里
        for (var i=0; i < arr.length; i++) { 
            num = arr[i].indexOf("="); 
            if (num > 0) {
                name = arr[i].substring(0, num);
                value = arr[i].substr(num + 1);
                params[name] = value;
            }
        }

        return params;
    },
    
    checkVersion: function() {
        var self = this;
        var onGetVersion = function(ret){
            if(ret.version == null){
                console.log("error.");
            }
            else{
                cc.vv.SI = ret;
                if(ret.version != cc.VERSION){
                    cc.find("Canvas/alert").active = true;
                }
                else{
                    self.startPreloading(); 
                                   
                }
            }
        };
        
        var xhr = null;
        var complete = false;
        var fnRequest = function(){
            // self._stateStr = "正在连接服务器";
            xhr = cc.vv.http.sendRequest("/get_serverinfo",null,function(ret){
                xhr = null;
                complete = true;
                onGetVersion(ret);
            });
            setTimeout(fn,5000);            
        }
        
        var fn = function(){
            if(!complete){
                if(xhr){
                    xhr.abort();
                    self._stateStr = "连接失败，即将重试";
                    setTimeout(function(){
                        fnRequest();
                    },5000);
                }
                else{
                    fnRequest();
                }
            }
        };
        fn();
    },
    
    onBtnDownloadClicked:function(){
        cc.sys.openURL(cc.vv.SI.appweb);
    },
    
    startPreloading: function() {
        var self = this;

        cc.director.preloadScene('hall', function () {
            cc.log("hall scene preloaded");
            self.preloadSceneNUM = self.preloadSceneNUM + 1;
        });

        cc.director.preloadScene("mjgame", function () {
            cc.log("mjgame scene preloaded");
            self.preloadSceneNUM = self.preloadSceneNUM + 1;
        });       

		// if (0) {
		//     this._stateStr = "正在加载资源，请稍候";
        //     this._isLoading = true;

	    //     cc.loader.onProgress = function ( completedCount, totalCount,  item ){
	    //         //console.log("completedCount:" + completedCount + ",totalCount:" + totalCount );
	    //         if(self._isLoading){
	    //             self._progress = completedCount/totalCount;
	    //         }
	    //     };

	    //     cc.loader.loadResDir("textures", function(err, assets) {
	    //         self.onLoadComplete();
	    //     });
		// } else {
		// 	self.onLoadComplete();
		// }
    },
    
    onLoadComplete: function() {
        var loadCount = 0;
        var t = cc.sys.localStorage.getItem('loadCount');
        if (t != null) {
            loadCount = parseInt(t);
        }

        loadCount++;
        cc.sys.localStorage.setItem('loadCount', loadCount);

        cc.sys.localStorage.setItem('needLoadActivity',1);
        // var localLanguage = cc.sys.localStorage.getItem('localLanguage');
        // if (localLanguage == "Dialect" || localLanguage == "Mandarin") {
        //     cc.vv.audioMgr.setLanguageName(localLanguage);
        // }else {
        //     cc.sys.localStorage.setItem('localLanguage', "Mandarin");
        //     cc.vv.audioMgr.setLanguageName("Mandarin");
        // }

        this.regHideORShow();//注册前后台消息

        this.login();
        // if (1 == loadCount) {
        //     this._mianze.active = true;
        // } else {
        //     this.login();
        // }
    },
    
    login: function() {
        this._isLoading = false;
        this._stateStr = "准备登陆";
        cc.director.loadScene("login");
        cc.loader.onComplete = null;
    },

    onBtnOkClicked: function() {
		cc.vv.audioMgr.playButtonClicked();
        this._mianze.active = false;
        this.login();
    },

    regHideORShow:function(){

        cc.game.on(cc.game.EVENT_HIDE, function () {

            if(typeof(cc.vv.gameNetMgr) != 'object' || cc.vv.gameNetMgr == ''){
                return;
            }

            console.log("cc.audioEngine.pauseAll");
            cc.audioEngine.pauseAll();
            cc.vv.gameNetMgr.projectState = 'hideState';
            console.log("luobin", "on cc.game.EVENT_HIDE");
          
        });

        cc.game.on(cc.game.EVENT_SHOW, function () {

            if(typeof(cc.vv.gameNetMgr) != 'object' || cc.vv.gameNetMgr == ''){
                return;
            }

            console.log("cc.audioEngine.resumeAll");
            cc.audioEngine.resumeAll();
            console.log("luobin", "on cc.game.EVENT_SHOW");
            if (cc.vv.gameNetMgr.projectState == 'hideState') {
                setTimeout(function () {
                    cc.vv.gameNetMgr.projectState = 'showState';
                }, 50)
            };
        });
    },

    /********************************
    ***** 全面屏适配 *****
    ********************************/
     
    loadingDesignSize: function () {
        var cvs = this.node.getComponent(cc.Canvas);
        var isAllScreen = cc.AdaptationMgr.getAllScreenBool();
        if (isAllScreen == false) {
            cvs.fitHeight = true;
        }else {
            cvs.fitHeight = false;
        }
        cvs.fitWidth = true;

        this.body = this.node.getChildByName("body");
        this.layerRoot = this.node.getChildByName("layerRoot");

        if (isAllScreen == true) {
            var sceneScale = cc.AdaptationMgr.getNodeScale();
            // this.body.setScale(sceneScale);
            // this.layerRoot.setScale(sceneScale);
            var nodeArray = [this.body, this.layerRoot];
            cc.AdaptationMgr.setRootNodeScaleWidth(nodeArray, sceneScale);

            // this.setUIByLeftAndRightOffest();
            this.setSceneBottomOffest(sceneScale);
        }
    },

    setUIByLeftAndRightOffest: function () {
        var nodeNames = cc.AdaptationMgr.getNodeNamesByScene("loadingLogic");
        cc.AdaptationMgr.setNodeOffestByName(nodeNames, this.node);
    },

    setSceneBottomOffest: function (sceneScale) {
        var homeHeight = cc.AdaptationMgr.getIOSHomeHeight();
        this.body.y = this.body.y + homeHeight * sceneScale * 0.5;
        this.layerRoot.y = this.layerRoot.y + homeHeight * sceneScale * 0.5;
    },

    /*******************************/


    // called every frame, uncomment this function to activate update callback
    update: function (dt) {

        if(this.preloadSceneNUM == 2){
            this.preloadSceneNUM = -1;

            var filePath="data/GameConfig";
            cc.loader.loadRes(filePath,cc.Json, function (err,data)
            {
                if(err)
                {
                    cc.error(err);
                    return;
                }
                cc.vv.GameConfig = data;             
            })

            this.onLoadComplete();
            return;
        }

        // if(this._stateStr.length == 0){
        //     return;
        // }
        // this.tipLabel.string = this._stateStr + ' ';
        // if(this._isLoading){
        //     this.tipLabel.string += Math.floor(this._progress * 100) + "%";   
        // }
        // else{
        //     var t = Math.floor(Date.now() / 1000) % 4;
        //     for(var i = 0; i < t; ++ i){
        //         this.tipLabel.string += '.';
        //     }
        // }
    }

});
