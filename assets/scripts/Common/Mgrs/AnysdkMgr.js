var nativeLoader = require('nativeLoader');
cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        _isCapturing:false,
        _isShareResult:false,
        _isShareRedPack:false,
        _isShareIntegral:false,
        _isShareIntegralPopup:false,
        _isShareActivity:false,
    },

    // use this for initialization
    onLoad: function() {
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },

    init:function() {
		this.ANDROID_API = 'com/' + cc.vv.company + '/' + cc.vv.appname + '/WXAPI';
        this.IOS_API = "AppController";
    },
	
    login:function(){
        if (cc.sys.os == cc.sys.OS_ANDROID) {
			//cc.eventManager.removeCustomListeners(cc.game.EVENT_HIDE);

            jsb.reflection.callStaticMethod("com/yzqp/game/max/WXAPI", "Login", "()V");
        }
        else if(cc.sys.os == cc.sys.OS_IOS){
            jsb.reflection.callStaticMethod(this.IOS_API, "login");
        }
        else{
            console.log("platform:" + cc.sys.os + " dosn't implement share.");
        }
    },

    share: function(title, desc, timeline) {
        this._isShareResult = true;
        var shareUrl = cc.vv.SI.appweb + "?u=" + cc.vv.userMgr.userId
        if (cc.sys.os == cc.sys.OS_ANDROID) {
			//cc.eventManager.removeCustomListeners(cc.game.EVENT_HIDE);

            jsb.reflection.callStaticMethod("com/yzqp/game/max/WXAPI",
                                            "Share",
                                            "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Z)V",
                                            shareUrl,
                                            title,
                                            desc,
                                            timeline ? true : false);
        }
        else if(cc.sys.os == cc.sys.OS_IOS){
            jsb.reflection.callStaticMethod(this.IOS_API, "share:shareTitle:shareDesc:isTimeline:",shareUrl,title,desc,timeline ? true : false);
        }
        else{
            console.log("platform:" + cc.sys.os + " dosn't implement share.");
        }
    },

    share_club: function(title, desc, timeline,url) {
        this._isShareResult = true;
        var shareUrl = url
        if (cc.sys.os == cc.sys.OS_ANDROID) {
			//cc.eventManager.removeCustomListeners(cc.game.EVENT_HIDE);

            jsb.reflection.callStaticMethod("com/yzqp/game/max/WXAPI",
                                            "Share",
                                            "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Z)V",
                                            shareUrl,
                                            title,
                                            desc,
                                            timeline ? true : false);
        }
        else if(cc.sys.os == cc.sys.OS_IOS){
            jsb.reflection.callStaticMethod(this.IOS_API, "share:shareTitle:shareDesc:isTimeline:",shareUrl,title,desc,timeline ? true : false);
        }
        else{
            console.log("platform:" + cc.sys.os + " dosn't implement share.");
        }
    },

    shareResult:function(timeline) {
        if(this._isCapturing){
            return;
        }
        this._isShareResult = true;
        this._isCapturing = true;
        var size = cc.director.getWinSize();
        var currentDate = new Date();
        var fileName = "result_share.jpg";
        var fullPath = jsb.fileUtils.getWritablePath() + fileName;
        if(jsb.fileUtils.isFileExist(fullPath)){
            jsb.fileUtils.removeFile(fullPath);
        }
        // var texture = new cc.RenderTexture(Math.floor(size.width), Math.floor(size.height));
        var texture = new cc.RenderTexture(Math.floor(size.width), Math.floor(size.height), cc.Texture2D.PIXEL_FORMAT_RGBA8888, gl.DEPTH24_STENCIL8_OES);
        texture.setPosition(cc.p(size.width/2, size.height/2));
        texture.begin();
        cc.director.getRunningScene().visit();
        texture.end();
        texture.saveToFile(fileName, cc.IMAGE_FORMAT_JPG);

        var self = this;
        var tryTimes = 0;
        var fn = function(){
            if(jsb.fileUtils.isFileExist(fullPath)){
                var height = 100;
                var scale = height/size.height;
                var width = Math.floor(size.width * scale);

                if(cc.sys.os == cc.sys.OS_ANDROID){
                    //cc.eventManager.removeCustomListeners(cc.game.EVENT_HIDE);

                    jsb.reflection.callStaticMethod("com/yzqp/game/max/WXAPI", "ShareIMG", "(Ljava/lang/String;IIZ)V",fullPath,width,height, timeline ? true : false);
                }
                else if(cc.sys.os == cc.sys.OS_IOS){
                    jsb.reflection.callStaticMethod(self.IOS_API, "shareIMG:width:height:",fullPath,width,height);
                }
                else{
                    console.log("platform:" + cc.sys.os + " dosn't implement share.");
                }
                self._isCapturing = false;
            }
            else{
                tryTimes++;
                if(tryTimes > 10){
                    console.log("time out...");
                    return;
                }
                setTimeout(fn,50);
            }
        }
        setTimeout(fn,50);
    },

    _sharePicture:function(fullPath,size,timeline){
        var self = this;
        var tryTimes = 0;
        var fn = function(){
            if(jsb.fileUtils.isFileExist(fullPath)){
                var height = 100;
                var scale = height/size.height;
                var width = Math.floor(size.width * scale);
                if(cc.sys.os == cc.sys.OS_ANDROID){
                    jsb.reflection.callStaticMethod("com/yzqp/game/max/WXAPI", "ShareIMG", "(Ljava/lang/String;IIZ)V",fullPath,width,height, timeline ? true : false);
                }
                else if(cc.sys.os == cc.sys.OS_IOS){
                    jsb.reflection.callStaticMethod(self.IOS_API, "shareRedPackIMG:width:height:",fullPath,width,height);
                }
                else{
                    console.log("platform:" + cc.sys.os + " dosn't implement share.");
                }
                self._isCapturing = false;
            }
            else{
                tryTimes++;
                if(tryTimes > 10){
                    console.log("time out...");
                    return;
                }
                setTimeout(fn,50);
            }
        }
        setTimeout(fn,50);
    },

    _putText:function name(string) {
        var self = this;
        if(cc.sys.os == cc.sys.OS_ANDROID){
            jsb.reflection.callStaticMethod("com/yzqp/game/max/ClipboardHandler", "putText", "(Ljava/lang/String;)V",string);
        }
        else if(cc.sys.os == cc.sys.OS_IOS){
            jsb.reflection.callStaticMethod(self.IOS_API, "putText:",string);
        }
        else{
            console.log("platform:" + cc.sys.os + " dosn't implement share.");
        }
    
    },

    shareRedPack:function() {
        this.setShareTag(1);

        var timeline = true;
        var size = cc.director.getWinSize();
        var fileName = 'share_redPackFriendCricle.png';
        var fileUrl =  cc.redPackShareImgUrl+fileName;
        var fullPath = jsb.fileUtils.getWritablePath() +"img/"+ fileName;
        console.log('luobin-share','fullPath=',fullPath);
        if(jsb.fileUtils.isFileExist(fullPath)){
            this._sharePicture(fullPath,size,timeline);
        }else{
            nativeLoader.loadNativeWithCallbackFilePath(fileName, fileUrl, function(fullPath){
                if (fullPath == null) {
                    cc.log('share error: filepath is null!!');
                    return;
                }

                this._sharePicture(fullPath,size,timeline);
            }.bind(this));
        };
    },

    shareIntegralShop:function(fileUrl, isPopup, isActivity) {
        if (isActivity != null && isActivity == true) {
            this.setShareTag(4);
        } else if (isPopup == null || isPopup == undefined || isPopup == false) {
            this.setShareTag(2);
        }else {
            this.setShareTag(3);
        }
        

        var timeline = true;
        var size = cc.director.getWinSize();
        var fileName = cc.vv.utils.getFileName(fileUrl);//'share_integralShop_friendCricle.png';
        // var fileUrl =  cc.redPackShareImgUrl+fileName;
        var fullPath = jsb.fileUtils.getWritablePath() +"img/"+ fileName;
        if(jsb.fileUtils.isFileExist(fullPath)){
            this._sharePicture(fullPath,size,timeline);
        }else{
            nativeLoader.loadNativeWithCallbackFilePath(fileName, fileUrl, function(fullPath){
                if (fullPath == null) {
                    console.log('share error: filepath is null!!');
                    return;
                }

                this._sharePicture(fullPath,size,timeline);
            }.bind(this));
        };
    },

    //分享二维码图
    shareQRCode:function(node, timeline) {
        if(this._isCapturing){
            return;
        }
        this._isCapturing = true;
        this.setShareTag(0);

        var size = cc.director.getWinSize();
        var fileName = "qrcode_share.jpg";
        var fullPath = jsb.fileUtils.getWritablePath() + fileName;
        if(jsb.fileUtils.isFileExist(fullPath)){
            jsb.fileUtils.removeFile(fullPath);
        }
        
        var textureWidth = 720, textureHeight = 1280;
        var texture = new cc.RenderTexture(textureWidth, textureHeight, cc.Texture2D.PIXEL_FORMAT_RGBA8888, gl.DEPTH24_STENCIL8_OES);
        texture.setPosition(cc.p(textureWidth, textureHeight));
        texture.begin();
        node._sgNode.visit();
        texture.end();
        texture.saveToFile(fileName, cc.IMAGE_FORMAT_JPG);

        node.active = false;

        var self = this;
        var tryTimes = 0;
        var fn = function(){
            if(jsb.fileUtils.isFileExist(fullPath)){
                var height = 100;
                var scale = height/size.height;
                var width = Math.floor(size.width * scale);

                if(cc.sys.os == cc.sys.OS_ANDROID){
                    jsb.reflection.callStaticMethod("com/yzqp/game/max/WXAPI", "ShareIMG", "(Ljava/lang/String;IIZ)V",fullPath,width,height, timeline ? true : false);
                }
                else if(cc.sys.os == cc.sys.OS_IOS){
                    jsb.reflection.callStaticMethod(self.IOS_API, "shareIMG:width:height:",fullPath,width,height);
                }
                else{
                    console.log("platform:" + cc.sys.os + " dosn't implement share.");
                }
                self._isCapturing = false;
            }
            else{
                tryTimes++;
                if(tryTimes > 10){
                    console.log("time out...");
                    return;
                }
                setTimeout(fn,50);
            }
        }
        setTimeout(fn,50);
    },

    setShareTag: function (showIndexs) {
        this._isShareResult = (showIndexs == 0)?true:false;
        this._isShareRedPack = (showIndexs == 1)?true:false;
        this._isShareIntegral = (showIndexs == 2)?true:false;
        this._isShareIntegralPopup = (showIndexs == 3)?true:false;
        this._isShareActivity = (showIndexs == 4)?true:false;
    },

    onLoginResp: function(code) {
        console.log('onLoginResp');
        console.log(code)
        var fn = function(ret) {
            if (ret.errcode == 0) {
                cc.sys.localStorage.setItem("wx_account",ret.account);
                cc.sys.localStorage.setItem("wx_sign",ret.sign);
                cc.vv.userMgr.onAuth(ret);
            }
        }

		if (code != null) {
	        cc.vv.http.sendRequest("/wechat_auth", {code:code,os:cc.sys.os}, fn);
		} else {
			cc.vv.wc.hide();
		}
/*
		cc.eventManager.addCustomListener(cc.game.EVENT_HIDE, function() {
			cc.game.emit(cc.game.EVENT_HIDE, cc.game);
		});
*/
    },

	onShareResp: function(code) {
		console.log('onShareResp');
        if(this._isShareResult){
            this._isShareResult = false;
            return;
        }
        if(this._isShareRedPack){
            this._isShareRedPack = false;
            if(0 == code){
                cc.vv.userMgr.shareRP();
            }
        }
        if(this._isShareIntegral){
            this._isShareIntegral = false;
            if(0 == code){
                cc.vv.userMgr.shareIntegral();
            }
        }
        if(this._isShareIntegralPopup){
            this._isShareIntegralPopup = false;
            if(0 == code){
                cc.vv.userMgr.noticePopupEnd();
            }
        }

        if(this._isShareActivity){
            this._isShareActivity = false;
            if(0 == code){
                cc.vv.userMgr.getActivityRequest("/activity/share", cc.vv.turntable.onShareRefreshLuckyDraw.bind(cc.vv.turntable), 3);
            }
        }

/*
		cc.eventManager.addCustomListener(cc.game.EVENT_HIDE, function() {
			cc.game.emit(cc.game.EVENT_HIDE, cc.game);
		});
*/
    },
});

