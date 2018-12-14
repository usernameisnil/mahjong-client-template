String.prototype.format = function(args) { 
    if (arguments.length>0) { 
        var result = this; 
        if (arguments.length == 1 && typeof (args) == "object") { 
            for (var key in args) { 
                var reg=new RegExp ("({"+key+"})","g"); 
                result = result.replace(reg, args[key]); 
            } 
        } 
        else { 
            for (var i = 0; i < arguments.length; i++) { 
                if(arguments[i]==undefined) { 
                    return ""; 
                } 
                else { 
                    var reg=new RegExp ("({["+i+"]})","g"); 
                    result = result.replace(reg, arguments[i]); 
                } 
            } 
        } 
        return result; 
    } 
    else {
        return this; 
    } 
};
 
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
        _mima:null,
        _mimaIndex:0,
        
        _agreeCheck: null,
    },

    // use this for initialization
    onLoad: function () {
        
        if(!cc.sys.isNative && cc.sys.isMobile){
            var cvs = this.node.getComponent(cc.Canvas);
            cvs.fitHeight = true;
            cvs.fitWidth = true;
        }
        
        if(!cc.vv){
			console.log('login onLoad');
            cc.director.loadScene("loading");
            return;
        }

        this.loginDesignSize();
        
        cc.vv.http.url = cc.vv.http.master_url;
        cc.vv.net.addHandler('push_need_create_role',function(){
            console.log("onLoad:push_need_create_role");
            cc.director.loadScene("createrole");
        });
        
        cc.vv.audioMgr.playBGM("bgMain.mp3");
        // cc.vv.audioMgr.playBackGround();
        
        this._mima = ["A","A","B","B","A","B","A","B","A","A","A","B","B","B"];
        
/*        if (!cc.sys.isNative || cc.sys.os == cc.sys.OS_WINDOWS) {
            cc.find("Canvas/btnGuest").active = true;
        }*/
        
        this._agreeCheck = cc.find("Canvas/body/agreement/check").getComponent("CheckBox");

        this.androidBackEvent();
    },
    
    start:function() {

     
        var account =  cc.sys.localStorage.getItem("wx_account");
        var sign = cc.sys.localStorage.getItem("wx_sign");
		
        if(account != null && sign != null){
            var ret = {
                errcode:0,
                account:account,
                sign:sign
            }
            cc.vv.userMgr.onAuth(ret);
        }
    },
    
    onBtnQuickStartClicked: function() {
        cc.vv.audioMgr.playButtonClicked();
        
        if (this._agreeCheck.checked) {
            cc.vv.userMgr.guestAuth();
        } else {
            this.agreementAlert.active = true;
            cc.vv.alert.show("您必须先同意用户协议！", null, false);
        }
        
    },
    
    onBtnWeichatClicked: function() {

        cc.vv.http.url = cc.vv.http.master_url;//点击，强制把未知地址，换成请求地址；

        var wx_account = cc.sys.localStorage.getItem("wx_account");
        if (wx_account) {
            cc.sys.localStorage.removeItem("wx_account");
        }

        var wx_sign = cc.sys.localStorage.getItem("wx_sign");
        if (wx_sign) {
            cc.sys.localStorage.removeItem("wx_sign");
        }

        cc.vv.audioMgr.playButtonClicked();
        if (this._agreeCheck.checked) {
			cc.vv.wc.show();
			cc.vv.anysdkMgr.login();
        } else {
            cc.vv.alert.show("您必须先同意用户协议！", null, false);
        }
    },
    
    onBtnMIMAClicked:function(event){
        if(this._mima[this._mimaIndex] == event.target.name){
            this._mimaIndex++;
            if(this._mimaIndex == this._mima.length){
                // cc.find("Canvas/btnGuest").active = true;
            }
        }
        else{
            this._mimaIndex = 0;
        }
    },

    onBtnAgreementClicked: function() {
        // TODO
    },

    /********************************
    ***** 全面屏适配 *****
    ********************************/
     
    loginDesignSize: function () {
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

            this.setUIByLeftAndRightOffest();
            this.setSceneBottomOffest(sceneScale);
        }
    },

    setUIByLeftAndRightOffest: function () {
        var nodeNames = cc.AdaptationMgr.getNodeNamesByScene("login");
        cc.AdaptationMgr.setNodeOffestByName(nodeNames, this.node);
    },

    setSceneBottomOffest: function (sceneScale) {
        var homeHeight = cc.AdaptationMgr.getIOSHomeHeight();
        this.body.y = this.body.y + homeHeight * sceneScale * 0.5;
        this.layerRoot.y = this.layerRoot.y + homeHeight * sceneScale * 0.5;
    },

    /*******************************/

    androidBackEvent: function () {


        //onKeyReleased onKeyPressed
        cc.eventManager.addListener({  
            event: cc.EventListener.KEYBOARD,  
            onKeyReleased: function(keyCode, event) {  
                if (keyCode === cc.KEY.back) {      
                    console.log("return button clicked. keycode:" + keyCode); 
                    var endGame = function () {
                        cc.game.end();
                        // cc.director.end();
                    }; 
                    cc.vv.alert.show("是否退出燕赵麻将？", endGame, true);
                }  
                else if (keyCode === cc.KEY.menu) {      
                    console.log("menu button clicked. keycode:" + keyCode);  
                }  
            }}, this.node);
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
