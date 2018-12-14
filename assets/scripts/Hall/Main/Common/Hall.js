cc.Class({
    extends: cc.Component,

    properties: {
        lblName: cc.Label,
        lblGems: cc.Label,
        lblID: cc.Label,
        lblNotice: cc.Label,
        joinGameWin: cc.Node,
        createRoomWin: cc.Node,
        settingsWin: cc.Node,
        helpWin: cc.Node,
        sprHeadImg: cc.Node,
        shopWin: cc.Node,
        cell: cc.Node,
        cardScrollView: cc.ScrollView,
        lblVersion: cc.Label,
        btnCreateGame: cc.Button,
        btnJoinGame: cc.Node,
        btnReturnGame: cc.Node,
        shopSupportLbl: cc.Label,
        bannerWXLbl: cc.Label,
        _isLv:false,
        _isClub:false,
        club: {
            default: null,
            type: cc.Prefab
        },
        isClubRoom: false,
        _clubid: null,
        _clubname: false,
        isClub:false,

        redPacketSharePrefab: {
            default: null,
            type: cc.Prefab
        },
        redPacketFrames: {
            default: [],
            type: cc.SpriteFrame
        },

        //俱乐部加入
        _isAlert: false,
        clubPrefab: {
            default: null,
            type: cc.Prefab
        },
        clubPromptPrefab: {
            default: null,
            type: cc.Prefab
        },
        integralShopPrefab: {
            default: null,
            type: cc.Prefab
        },
        integralAlertPrefab: {
            default: null,
            type: cc.Prefab
        },


    },

    onShare: function (event, customEventData) {

        /* 
        * 注释：红包功能和分享功能优化 *
        */
       
        this.showRedPacketOrShare(customEventData);
    },

    // use this for initialization
    onLoad: function () {
        
        if (!cc.sys.isNative && cc.sys.isMobile) {
            var cvs = this.node.getComponent(cc.Canvas);
            cvs.fitHeight = true;
            cvs.fitWidth = true;
        }

        if (!cc.vv) {
            console.log('load loading');
            cc.director.loadScene("loading");
            return;
        }

        cc.vv.hall = this;

        this.hallDesignSize();

        if (cc.vv.userMgr.returnRoomId == null) {
            this.btnJoinGame.active = true;
            this.btnReturnGame.active = false;
            this.btnCreateGame.interactable = true;
        }
        else {
            this.btnJoinGame.active = false;
            this.btnReturnGame.active = true;
            this.btnCreateGame.interactable = false;
        }
        
        this.addComponent("hallReConnect")
        this.initLabels();

        var imgLoader = this.sprHeadImg.getComponent("ImageLoader");
        imgLoader.setUserID(cc.vv.userMgr.userId);

        this.initButtonHandler("Canvas/body/top_right/btn_shezhi");
        this.initButtonHandler("Canvas/body/top_right/btn_help");
        this.initButtonHandler("Canvas/body/bottom_right/btn_zhanji");
        this.initButtonHandler("Canvas/body/bottom_right/btn_buy");

        if (!cc.vv.userMgr.notice) {
            cc.vv.userMgr.notice = {
                version: cc.VERSION,
                msg: "数据请求中...",
            }
        }

        if (!cc.vv.userMgr.agent) {
            cc.vv.userMgr.agent = {
                version: cc.VERSION,
                msg: "majiangkefu183",
            }
        }

        this.lblNotice.string = cc.vv.userMgr.notice.msg;

        this.refreshInfo();
        this.refreshMessage("notice");

        cc.vv.audioMgr.playBGM("bgMain.mp3");
        // cc.vv.audioMgr.playBackGround();

        var self = this
        this.node.on("rb-updated", function (event) {
            var index = event.detail.id;
            self.setupReceiveCard(index);
        });

        this.androidBackEvent();

        if (cc.mjVersion && cc.mjVersion.length) {
            this.lblVersion.string = cc.mjVersion
        }

        //创建红包分享预制
        this.redPacketShareView = cc.instantiate(this.redPacketSharePrefab);
        this.layerRoot.addChild(this.redPacketShareView);

        cc.vv.userMgr.boolOtherReply = false;

        // if(cc.vv.global._space == 'hallClub'){
        //     this.onBtnClubClicked();
        // }else if(cc.vv.global._space == 'hallDaiKai'){
            
        //     var openedViewScript = this.node.getChildByName('CreateRoom').getComponent('CreateRoom');
        //     openedViewScript.onBtn_Opened();
        // }else {
        //     cc.vv.global._space = 'hall';
        // };

        // if (cc.vv.global._space != 'hallClub') {
        //     this.addClubView();
        //     this.clubView = null;
        // };  

        this.initNetHandlers();

        cc.vv.hallgameNetMgr.createHallSocket();

        //积分商城
        this.integralShopView = cc.instantiate(this.integralShopPrefab);
        this.layerRoot.addChild(this.integralShopView);

        //创建房间
        this.createLayer = -1;
        this.createLayerLoad = false;

        //二维码微信分享节点
        this.initQRCodeWX();

    },

    initNetHandlers: function () {

        var self = this;
        if (cc.vv.global.clubTempData.clubNotify !== undefined) {

            var tmpList = cc.vv.global.clubTempData.clubNotify.list;
            if(tmpList.length == 0){
                this.showRedPoint(false);
            }else{
                this.showRedPoint(true);
            }            
        }
        cc.vv.hallgameNetMgr.dataEventHandler = this.node;
    },

    start: function () {
        var roomId = cc.vv.userMgr.oldRoomId;
        if (roomId != null && cc.vv.userMgr.returnRoomId == null) {
            cc.vv.userMgr.oldRoomId = null;
            cc.vv.userMgr.enterRoom(roomId);
        }
        var people = cc.find('Canvas/body/bottom_left/people');
        people.x = -598;
        people.runAction(cc.moveTo(0.5, cc.p(0, 0)));

        var logo = cc.find('Canvas/body/bottom_left/logo');
        logo.opacity = 0;
        logo.runAction(cc.fadeTo(0.8, 255));
        var br = cc.find('Canvas/body/bottom_right');
        br.opacity = 0;
        br.runAction(cc.fadeTo(0.8, 255));

        var tr = cc.find('Canvas/body/top_right');
        tr.opacity = 0;
        tr.runAction(cc.fadeTo(0.8, 255));

        var tl = cc.find('Canvas/body/top_left');
        tl.opacity = 0;
        tl.runAction(cc.fadeTo(0.8, 255));

        // this.defaultShowRedPacket();

        var self = this;
        cc.vv.userMgr.showIntegralPopup(function (ret) {
            if (ret.data == null) {
                return;
            }
            self.addIntegralPopup(ret);
        });

        this.defaultShowIntegralActivity();

        cc.vv.SelectRoom.clearGameNet();
    },

    addIntegralPopup: function (ret) {
        var integralPopup = cc.instantiate(this.integralAlertPrefab);
        var popupScript = integralPopup.getComponent("IntegralAlert");
        if (popupScript) {
            popupScript.init(ret.shareimg);
        }
        this.layerRoot.addChild(integralPopup);
    },

    refreshInfo_socket:function(){
        var self = this;
        var onGet = function (ret) {
            if (ret.errcode !== 0) {
                console.log(ret.errmsg);
            }
            else {
                cc.vv.hallgameNetMgr.createHallSocket()
            }
        };

        var data = {
            account: cc.vv.userMgr.account,
            sign: cc.vv.userMgr.sign,
        };
        cc.vv.http.sendRequest("/get_user_status", data, onGet.bind(this));

    },

    refreshInfo: function () {
        var self = this;

        cc.vv.userMgr.getUserScore(function (ret) {
            if (ret.gems != null) {
                self.lblGems.string = ret.gems;
            }
        })
    },

    refreshMessage: function (type) {

        var onGet = function (ret) {
            cc.log("refreshMessage ret = ", ret);
            if (ret.errcode !== 0) {
                console.log(ret.errmsg);
            }else {
                this.refreshMessageUI(ret);
            }
        };

        var data = {
            account: cc.vv.userMgr.account,
            sign: cc.vv.userMgr.sign,
            type: type,
            version: cc.VERSION
        };
        cc.vv.http.sendRequest("/get_message", data, onGet.bind(this));
        
    },

    refreshMessageUI: function (data) {
        switch (data.type) {
            case "notice":
                cc.vv.userMgr.notice.version = data.version;
                cc.vv.userMgr.notice.msg = data.msg;
                this.lblNotice.string = data.msg;
                break;
            case "agent":
                cc.vv.userMgr.agent.version = data.version;
                cc.vv.userMgr.agent.msg = data.msg;
                this.shopSupportLbl.string = "代理咨询请联系微信号: " + data.msg;
                this.bannerWXLbl.string = data.msg;
                break;
        }
    },

    initButtonHandler: function (btnPath) {
        var btn = cc.find(btnPath);
        cc.vv.utils.addClickEvent(btn, this.node, "Hall", "onBtnClicked");
    },

    initLabels: function () {
        this.lblName.string = cc.vv.userMgr.userName;
        this.lblGems.string = cc.vv.userMgr.gems;
        this.lblID.string = "ID:" + cc.vv.userMgr.userId;
    },

    onSettingsClose: function () {
        cc.vv.utils.showDialog(this.settingsWin, 'body', false);
    },
    onBtnClicked: function (event) {
        cc.vv.audioMgr.playButtonClicked();
        var name = event.target.name;
        if (name == "btn_shezhi") {
            cc.vv.utils.showDialog(this.settingsWin, 'body', true);
        } else if (name == "btn_help") {
            cc.vv.utils.showFrame(this.helpWin, 'head', 'body', true);
        } else if (name == 'btn_buy') {
            cc.vv.utils.showDialog(this.integralShopView, 'body', true);
        }
    },

    onJoinGameClicked: function () {
        this._isClub=false;
        cc.vv.userMgr.boolReplyJoinGame = false;

        cc.vv.utils.showDialog(this.joinGameWin, 'panel', true);
    },
    

    onReturnGameClicked: function (event) {
        event.target.getComponent(cc.Button).interactable = false;
        
        cc.vv.net_hall.endSocket()
        if (cc.vv && cc.vv.userMgr.returnRoomId != null) {
            cc.vv.userMgr.enterRoom(cc.vv.userMgr.returnRoomId, function (ret) {
                if (ret.errcode !== 0 || ret.clientErrorCode == -120) {
                    event.target.getComponent(cc.Button).interactable = true;
                }
                if (ret.errcode == 3) {
                    cc.vv.userMgr.returnRoomId = null;
                    cc.director.loadScene("hall")

                }
            });
        }

    },

    onBtnAddGemsClicked: function () {
        cc.vv.audioMgr.playButtonClicked();
        cc.vv.utils.showFrame(this.shopWin, 'head', 'body', true);
    },

    onCreateRoomClicked: function () {

        if (cc.vv.global.DelayOperation(3000) == false) {
            return;
        }
        cc.vv.audioMgr.playButtonClicked();
        cc.vv.hall.isClubRoom=false;
        this._isClub=false;
        this._isLv=false;

        this.loadCreateLayer(null);
    },

    loadCreateLayer: function (clubData) {
        var self = this;
        if(self.createLayer == -1){
            if(self.createLayerLoad == false)
            {
                cc.loader.loadRes("prefabs/Hall/CreateRoom/Common/CreateRoomNew", cc.Prefab, function (err, prefabs) {

                    self.createLayer = cc.instantiate(prefabs);
                    self.layerRoot.addChild(self.createLayer);
                    var createScript = self.createLayer.getComponent("CreateTest");
                    if (createScript) {
                        createScript.initClubData(clubData); 
                        createScript.showView(true);
                    }
                    
                    self.createLayerLoad = true;
                });
            }
        }else{
            var createScript = self.createLayer.getComponent("CreateTest");
            createScript.initClubData(clubData); 
            cc.vv.utils.showDialog(this.createLayer, 'body', true);
        }
    },

    //已开房间点击
    onYiKaiClicked: function () {
		
        var self = this;
    	var showYiKaiLayer = function (ret) {
    		cc.vv.wc.hide();
    		if (ret.errcode !== 0) {
                cc.vv.alert.show("查看已开房间失败!");
            } else {
            	cc.vv.global._space = 'hallDaiKai';
                cc.vv.roomCfg.setOpendedRoomsData(ret.data);
                //cc.vv.utils.showDialog(self.node, 'body', false);
                var openRoomsView = cc.vv.prefabMgr.getPrefab("prefabs/Hall/ReplaceRoom/Main/OpenedRoomView");
                var hallCanvas = cc.director.getScene().getChildByName('Canvas');
                var openView = cc.instantiate(openRoomsView);
                self.layerRoot.addChild(openView);
                cc.vv.hall.isClub = false;
            }
    	}

    	var data = {
            account: cc.vv.userMgr.account,
            sign: cc.vv.userMgr.sign,
            userid: cc.vv.userMgr.userId
        };

    	cc.vv.http.sendRequest("/get_daikai_rooms", data, showYiKaiLayer);
    },

    /*********************************************
    ***** 重写俱乐部 *****
    *********************************************/

    addClubView: function () {
        this.clubView = cc.instantiate(this.clubPrefab);
        this.layerRoot.addChild(this.clubView);
    },

    onBtnClubClicked: function () {

        if (this.clubView == null) {
            this.addClubView();
        }

        var clubScript = this.clubView.getComponent("ClubView");
        if (clubScript) {
            clubScript.init();
        }
    },

    showRedPoint: function (isShow) { //显示俱乐部红点
        // if (this.node !== null) {
        //     var redPoint = this.node.getChildByName("btnClub").getChildByName("applyRedPoint");
        //     redPoint.active = isShow;
        // }
    },

    /*********************************************/

    setGems: function (gems) {
        this.lblGems.string = gems.toString();
    },

    /*************红包功能和分享功能模块************/

    /*
     * Function: showRedPacketOrShare *
     * Description: 显示红包功能和分享功能页面 *
     */
    
    showRedPacketOrShare: function (customEventData) {

        var radioIndex = 0;
        if (customEventData == "RedPacket") {
            radioIndex = 0;
        }else if (customEventData == "Share") {
            radioIndex = 1;
        }else if (customEventData == "Integral") {
            radioIndex = 2;
        }
        var RPSscript = this.redPacketShareView.getComponent("RedPacketShare");
        if (RPSscript) {
            RPSscript.init(radioIndex);
        }
    },

    /*
     * Function: defaultShowRedPacket *
     * Description: 默认显示红包功能页面 *
     */

    defaultShowRedPacket: function () {

        var self = this;
        cc.vv.userMgr.getActivity(function (data) {
            if (!data) {
                return
            }
            var left_bottom = self.node.getChildByName("bottom_left");
            var spriteRP = left_bottom.getChildByName("btn_red_packet").getComponent("cc.Sprite");

            if(data.status==1){
                spriteRP.spriteFrame = self.redPacketFrames[1];
            }else {
                spriteRP.spriteFrame = self.redPacketFrames[0];
            }

        }, 1);

        var needLoadActivity = cc.sys.localStorage.getItem('needLoadActivity');
        if(needLoadActivity == 1){

            this.showRedPacketOrShare("RedPacket");
            cc.sys.localStorage.setItem('needLoadActivity',0);
        }
    },

    defaultShowIntegralActivity: function () {
        var self = this;

        var isFirst = cc.vv.userMgr.getFirstIntegralPopup();
        if (isFirst == true) {
            this.showRedPacketOrShare("Integral");
        }
    },

    /***********************************************/

    //二维码
    initQRCodeWX: function () {
        var shareWX = this.node.getChildByName("shareWechat");
        var wxHeadLoader = shareWX.getChildByName("wxHead").getComponent("ImageLoader");
        wxHeadLoader.setUserID(cc.vv.userMgr.userId);
        shareWX.active = false;
    },

    /********************************
    ***** 全面屏适配 *****
    ********************************/
     
    hallDesignSize: function () {
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
            var nodeArray = [this.body, this.layerRoot];
            cc.AdaptationMgr.setRootNodeScaleWidth(nodeArray, sceneScale);
            
            // this.body.width = this.body.width / sceneScale;
            // this.layerRoot.width = this.layerRoot.width / sceneScale;
            // this.body.setScale(sceneScale);
            // this.layerRoot.setScale(sceneScale);

            this.setUIByLeftAndRightOffest();
            this.setSceneBottomOffest(sceneScale);

            this.setNoticeWidth(sceneScale);
            // this.setScrollWidth(sceneScale);//临汾、燕赵等大厅有scrollview的需要适配
        }
    },

    setUIByLeftAndRightOffest: function () {
        var nodeNames = cc.AdaptationMgr.getNodeNamesByScene("hall");
        cc.AdaptationMgr.setNodeOffestByName(nodeNames, this.node);
    },

    setSceneBottomOffest: function (sceneScale) {
        var homeHeight = cc.AdaptationMgr.getIOSHomeHeight();
        this.body.y = this.body.y + homeHeight * sceneScale * 0.5;
        this.layerRoot.y = this.layerRoot.y + homeHeight * sceneScale * 0.5;
    },

    setNoticeWidth: function (sceneScale) {
        var noticeBg = this.body.getChildByName("notice").getChildByName("bg_notice");
        noticeBg.width = noticeBg.width + noticeBg.width * (1-sceneScale) / sceneScale;

        var showNotice = this.body.getChildByName("notice").getChildByName("showNotice");
        showNotice.width = showNotice.width + showNotice.width * (1-sceneScale) / sceneScale;
    },

    setScrollWidth: function (sceneScale) {

        var offestNumber = cc.AdaptationMgr.getNotchHeight();

        var banner = this.body.getChildByName("bottom_left").getChildByName("banner");
        var scroll = this.body.getChildByName("gameScroll");

        var widthScroll = scroll.width/sceneScale + (banner.width/sceneScale - banner.width) - 2 * offestNumber;
        scroll.width = widthScroll;
        var view = scroll.getChildByName("view");
        view.width = widthScroll;

        var content = view.getChildByName("content");
        content.x = -widthScroll;

        this.setNoticeWidth(sceneScale);
    },

    /*******************************/

    androidBackEvent: function () {
        //onKeyReleased onKeyPressed
        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyReleased: function (keyCode, event) {
                if (keyCode === cc.KEY.back) {
                    console.log("return button clicked. keycode:" + keyCode);
                    var endGame = function () {
                        cc.game.end();
                    };
                    cc.vv.alert.show("是否退出燕赵麻将？", endGame, true);
                }
                else if (keyCode === cc.KEY.menu) {
                    console.log("menu button clicked. keycode:" + keyCode);
                }
            }
        }, this.node);
    },

    /*************活动功能模块************/

    /*
     * Function: onActivity *
     */
    
    onActivity: function () {
        console.log("onActivity");
        cc.vv.userMgr.getActivityRequest("/activity/get_activity", this.showActivityLayer.bind(this), 3);
    },
    
    showActivityLayer: function(getRet) {
        var activePrefab = cc.vv.prefabMgr.getPrefab("prefabs/Hall/activityFace/turntable");
        var activeLayer = cc.instantiate(activePrefab);
        var activityScript = activeLayer.getComponent("turntable");
        if (activityScript) {
            activityScript.init(getRet);
        }

        this.layerRoot.addChild(activeLayer);
    },

    /****************************/

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        var x = this.lblNotice.node.x;
        x -= dt * 100;
        if (x + this.lblNotice.node.width < -1000) {
            x = 500;
        }
        this.lblNotice.node.x = x;
    },

    onDestroy:function(){
    },
    
});