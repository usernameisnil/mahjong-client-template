cc.AdaptationMgr = {
	_designWidth: 1280, 
	_designHeight: 720,
    _isAllScreen: false,
    _notchHieght: 0,
    _iosHomeHeight: 0,
    _iosNotchOffestScale: 1,
    _nodeScale: 1,

    init: function () {
        if (cc.allScreenApp != null && cc.allScreenApp == true) {
            this.isAllScreenPhone();
            this.phoneNotchHeight();
            this.iosHomeHeight();
            this.setNodeScale();
        }

        this.initNodeNameByScenes();
        
    },

	setNodeScale: function () {

		var frameSize = cc.view.getFrameSize();
		var scaleX = frameSize.width / this._designWidth;
        var scaleY = frameSize.height / this._designHeight;
        console.log("wujun frameSize.width = ", frameSize.width);
        console.log("wujun frameSize.height = ", frameSize.height);

        if (cc.sys.os == cc.sys.OS_ANDROID) {
            this._nodeScale = (frameSize.height * this._designWidth) / (frameSize.width * this._designHeight);
        }
        else if(cc.sys.os == cc.sys.OS_IOS){
            this._iosNotchOffestScale = (frameSize.height * this._designWidth) / (frameSize.width * this._designHeight);
            this._nodeScale = this._iosNotchOffestScale * (this._designHeight-this._iosHomeHeight)/this._designHeight;
        }
	},

	isAllScreenPhone: function () {

        if (cc.sys.os == cc.sys.OS_ANDROID) {

            this._isAllScreen = jsb.reflection.callStaticMethod("com/yzqp/game/max/AdaptationScheme/adaptationScreen",
                                            "isAllScreenDevice",
                                            "()Z");
        }
        else if(cc.sys.os == cc.sys.OS_IOS){
            this._isAllScreen = jsb.reflection.callStaticMethod("AppController", "isAllScreenAtPhone");
        }

        console.log("wujun isAllScreen = ", this._isAllScreen);
	},

    phoneNotchHeight: function () {
        if (cc.sys.os == cc.sys.OS_ANDROID) {

            this._notchHieght = jsb.reflection.callStaticMethod("com/yzqp/game/max/AdaptationScheme/adaptationScreen",
                                            "jsbNotchScreenHeight",
                                            "()I"); 
        }
        else if(cc.sys.os == cc.sys.OS_IOS){
            this._notchHieght = jsb.reflection.callStaticMethod("AppController", "getNotchHeightAtPhone");
        }

        console.log("wujun notchHieght = ", this._notchHieght);
    },

    iosHomeHeight: function () {
        if(cc.sys.os == cc.sys.OS_IOS){
            this._iosHomeHeight = jsb.reflection.callStaticMethod("AppController", "getHomeHeightAtPhone");
        }

        console.log("wujun iosHomeHeight = ", this._iosHomeHeight);
    },

    getNodeScale: function () {
        return this._nodeScale;
    },

    getAllScreenBool: function () {
        return this._isAllScreen;
    },

    getNotchHeight: function () {
        return this._notchHieght;
    },

    getIOSHomeHeight: function () {
        return this._iosHomeHeight;
    },

    setRootNodeScaleWidth: function (nodes, sceneScale) {
        if (cc.vv.utils.isArray(nodes)) {
            var nameLen = nodes.length;
            for (var i = 0; i < nameLen; i++) {
                nodes[i].width = nodes[i].width / sceneScale;
                nodes[i].setScale(sceneScale);
            };
        }else {
            nodes.width = nodes.width / sceneScale;
            nodes.setScale(sceneScale);
        }
        
    },

    initNodeNameByScenes: function () {
        this.sceneNodenames = {
            "hotUpdate": {
                "body": "lblversion"
            },
            "login": {
                "body": ["A", "B"]
            },
            "hall": {
                "body": ["lblVersion", "top_left", "bottom_right", "bottom_left", "top_right", "btnRoomList"]
            },
            "mjGame": {
                "btnNodes": ["btnRefresh", "btnClubFriend", "btn_voice", "btn_chat", "btn_settings"],
                "prepare": ["btnBack", "btnDissolve", "btnExit"],
                "game": [
                    "huanpaiinfo", 
                    "right", 
                    "left", 
                    {"moreTing": ["rightBtn", "leftBtn"]}, 
                    {"seats": ["seatMy", "seatRight", "seatLeft"]}, 
                    {"replyActionQi": ["qiRight", "qiLeft"]},
                    {"ytzSeatsType": ["yatouziRight", "yatouziLeft"]}
                ],
                "infobar": "roomTime"
            },
            "doudizhupk": {
                "btnNodes": ["btnRefresh", "btnClubFriend", "btn_voice", "btn_chat", "btn_settings"],
                "prepare": ["btnBack", "btnDissolve", "btnExit"], 
                "game": [
                    {"triple": ["playerMy", "playerRight", "playerLeft"]}, 
                    {"quadra": ["playerMy", "playerRight", "playerLeft"]}, 
                    {"penda": ["playerMy", "playerRight1", "playerRight2", "playerLeft1", "playerLeft2"]},
                    {"hexa": ["playerMy", "playerRight1", "playerRight2", "playerLeft1", "playerLeft2"]}
                ],
                "infobar": "roomTime"
            }
        }
    },

    getNodeNamesByScene: function (sceneKey) {
        return this.sceneNodenames[sceneKey];
    },

    setNodeOffestByName: function (nodeNames, parent) {

        if (!cc.vv.utils.isNullOrUndefined(parent)) {

            var offestWidth = this.getNotchHeight();
            if (cc.vv.utils.isArray(nodeNames)) {

                for (var i = 0, nameLen = nodeNames.length; i < nameLen; i++) {
                    var nameData = nodeNames[i];
                    this.setNodeOffestByName(nameData, parent);
                };

            }else if (cc.vv.utils.isObject(nodeNames)) {

                for (var key in nodeNames) {
                    var nameData = nodeNames[key];
                    var node = parent.getChildByName(key);
                    if (!cc.vv.utils.isNullOrUndefined(node)) {
                        this.setNodeOffestByName(nameData, node);
                    }
                }

            }else {
                var node = parent.getChildByName(nodeNames);
                if (!cc.vv.utils.isNullOrUndefined(node)) {
                    this.setLeftOrRightAtWidget(node, offestWidth);
                }
            }
        }
        
    },

    addLayerMask: function (isShow) {
        var layerContent = cc.find('Canvas/layerRoot/mask');
        layerContent.active = isShow;
    },

    setLeftOrRightAtWidget: function (node, offestNumber) {
        var widget = node.getComponent("cc.Widget");

        if (widget) {
            if (widget.isAlignLeft) {
                widget.left = widget.left + offestNumber;
            }

            if (widget.isAlignRight) {
                widget.right = widget.right + offestNumber;
            }
        }
    },
}