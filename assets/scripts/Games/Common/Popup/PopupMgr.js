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
        _popuproot:null,
        _settings:null,
        _dissolveNotice:null,
        
        _endTime:-1,
        _extraInfo:null,
        _noticeLabel:null,
        _isBtnAgree:false
    },

    // use this for initialization
    onLoad: function () {
        if(cc.vv == null){
            return;
        }
        
        cc.vv.popupMgr = this;
        
        this._popuproot = cc.find("Canvas/layerRoot/popups");

        this._btnClose = cc.find("btn_close", this._popuproot);
        this._btnSqjsfj = cc.find("btn_sqjsfj", this._popuproot);

        this._settingsGroup = cc.find("settingsGroup", this._popuproot);

        this._settings1 = cc.find("settingsGroup/settings1", this._popuproot);
        this._settings2 = cc.find("settingsGroup/settings2", this._popuproot);
        this._settings3 = cc.find("settingsGroup/settings3", this._popuproot);


        this._dissolveNotice = cc.find("dissolve_notice", this._popuproot);
        this._noticeLabel = this._dissolveNotice.getChildByName("info").getComponent(cc.Label);
        
        this.closeAll();
        
        this.addBtnHandler("btn_close");
        this.addBtnHandler("btn_sqjsfj");
        this.addBtnHandler("dissolve_notice/btn_agree");
        this.addBtnHandler("dissolve_notice/btn_reject");
        this.addBtnHandler("dissolve_notice/btn_ok");

        this.onEventListener();
        
        var self = this;
        this.node.on("dissolve_notice",function(event){
            var data = event.detail;
            self.showDissolveNotice(data);

            var btn = cc.find("dissolve_notice/btn_agree", self._popuproot);
            if (self._isBtnAgree == true) {
                self.setGrayBtn(btn);
                var btn_reject = cc.find("dissolve_notice/btn_reject", self._popuproot);
                self.setGrayBtn(btn_reject);
            }
        });
        
        this.node.on("dissolve_cancel",function(event){
            self._endTime = -1;
            self.closeAll();
            self._isBtnAgree = false;
            var btn = cc.find("dissolve_notice/btn_agree", self._popuproot);
            self.setLightBtn(btn);
            var btn_reject = cc.find("dissolve_notice/btn_reject", self._popuproot);
            self.setLightBtn(btn_reject);
        });

        this.node.on('game_over',function(data){
            self._endTime = -1;
        });

        this.node.on('game_end',function(data){
            self.closeAll();
        });
    },
    
    start:function(){
        if(cc.vv.gameNetMgr.dissoveData){
            this.showDissolveNotice(cc.vv.gameNetMgr.dissoveData);
        }
    },

    setGrayBtn: function (btn) {
        btn.getComponent(cc.Button).interactable = false;
        btn.getComponent(cc.Button).enableAutoGrayEffect = true;
    },

    setLightBtn: function (btn) {
        btn.getComponent(cc.Button).interactable = true;
        btn.getComponent(cc.Button).enableAutoGrayEffect = false;
    },
    
    addBtnHandler:function(btnName){
        var btn = cc.find("Canvas/layerRoot/popups/" + btnName);
        this.addClickEvent(btn,this.node,"PopupMgr","onBtnClicked");
    },
    
    addClickEvent:function(node,target,component,handler){
        var eventHandler = new cc.Component.EventHandler();
        eventHandler.target = target;
        eventHandler.component = component;
        eventHandler.handler = handler;

        var clickEvents = node.getComponent(cc.Button).clickEvents;
        clickEvents.push(eventHandler);
    },
    
    onBtnClicked:function(event){
        this.closeAll();
        var btnName = event.target.name;
        if(btnName == "btn_agree"){
            this._isBtnAgree = true;
            cc.vv.net.send("dissolve_agree");
        }
        else if(btnName == "btn_reject"){
            cc.vv.net.send("dissolve_reject");
        }
        else if(btnName == "btn_sqjsfj"){
            this._isBtnAgree = true;
            cc.vv.net.send("dissolve_request"); 
        }
    },
    
    closeAll:function(){
        this._popuproot.active = false;
        this._settingsGroup.active = false;
        this._settings1.active = false;
        this._settings2.active = false;
        this._settings3.active = false;
        this._dissolveNotice.active = false;
        this._btnClose.active = false;
        this._btnSqjsfj.active = false;
    },
    
    showSettings:function(){
        this.closeAll();
        this._popuproot.active = true;
        this._settingsGroup.active = true;
        this._btnClose.active = true;
        this._btnSqjsfj.active = true;
        
        var index = cc.CGameConfigDataModel.getConfigFace();

        var CardAudioObj = cc.CGameConfigDataModel.getCardAudio();

        this.btn_sqjsfj = cc.find("btn_sqjsfj", this._popuproot);
        this.btn_close = cc.find("btn_close", this._popuproot);

        if (index == 0) {
            this.btn_sqjsfj.setPosition(cc.p(0,-224));
            this.btn_close.setPosition(cc.p(369,248));

            this._settings1.getComponent('Settings').init(CardAudioObj);
            this._settings1.active = true;
        } else  if (index == 1){
            this.btn_sqjsfj.setPosition(cc.p(0,-274));
            this.btn_close.setPosition(cc.p(369,295));

            this._settings2.getComponent('Settings').init(CardAudioObj);
            this._settings2.active = true;
        }else{
            this.btn_sqjsfj.setPosition(cc.p(0,-174));
            this.btn_close.setPosition(cc.p(369,209));

            this._settings3.getComponent('Settings').init(CardAudioObj);
            this._settings3.active = true;
        }
       
       
        var isIdle = true;
        if (cc.vv.replayMgr.isReplay() == false && cc.vv.gameNetMgr.numOfGames != 0) {
            isIdle = false;
        }
        // var isIdle = cc.vv.gameNetMgr.numOfGames == 0;
        var btn = cc.find("btn_sqjsfj", this._popuproot);
        if (isIdle) {
            this.setGrayBtn(btn);
        }else {
            this.setLightBtn(btn);
        }
    },
    
    showDissolveRequest:function(){
        this.closeAll();
        this._popuproot.active = true;
    },
    
    showDissolveNotice:function(data){
        this._endTime = Date.now()/1000 + data.time;
        this._extraInfo = "";
        for(var i = 0; i < data.states.length; ++i){
            var b = data.states[i];
            var name = cc.vv.gameNetMgr.seats[i].name;
            if(b){
                this._extraInfo += "\n[已同意] "+ name;
            }
            else{
                this._extraInfo += "\n[待确认] "+ name;
            }
        }
        this.closeAll();
        this._popuproot.active = true;
        this._dissolveNotice.active = true;;
    },
    
    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        if(this._endTime > 0){
            var lastTime = this._endTime - Date.now() / 1000;
            if(lastTime < 0){
                cc.vv.userMgr.oldRoomId = null;
                cc.vv.gameNetMgr.reset();
                if(lastTime < -3)
                {
                    this._dissolveNotice.active = false;
                    this._endTime = -1;
                    cc.director.loadScene("hall");
                }
                return;
            }
            
            var m = Math.floor(lastTime / 60);
            var s = Math.ceil(lastTime - m*60);
            
            var str = "";
            if(m > 0){
                str += m + "分"; 
            }
            
            this._noticeLabel.string = str + s + "秒后房间将自动解散" + this._extraInfo;
        }
    },

    onEventListener: function () {
        // cc.eventManager.addListener({
        //     event: cc.EventListener.TOUCH_ONE_BY_ONE,
        //     swallowTouches: true,
        //     onTouchBegan:function(touch, event){
        //         return true;},
        // }, this);

         this._popuproot.on(cc.Node.EventType.TOUCH_START,function(event){
        });
    }
});
