cc.Class({
    extends: cc.Component,

    properties: {
        sFrames:{
            default:[],
            type:cc.SpriteFrame
        },
        mjSprite:{
            default:null,
            type:cc.Sprite
        },
        playSprite:{
            default:null,
            type:cc.Sprite
        },
        bgNode:{
            default:null,
            type:cc.Node
        }
    },

    // use this for initialization
    onLoad: function () { 
    },

    init: function (playKey, mjId, controller) {

        this.showErrorTip(this, "PlayOption this");
        this.showErrorTip(this.node, "PlayOption.node");
        
        this.controller = null;
        this.playKey = null;
        var playIndex = this.getFrameIndex(playKey);
        if (playIndex == -1) {
            return;
        }

        this.controller = controller;
        this.playKey = playKey;
        this.mjId = mjId;

        this.playSprite.spriteFrame = this.sFrames[playIndex];

        if (mjId >= 0 && mjId < 42) {
            this.mjSprite.node.active = true;
            this.bgNode.active = true;

            this.showErrorTip(cc.vv.controlMgr, "cc.vv.controlMgr");
            this.mjSprite.spriteFrame = cc.vv.controlMgr.getSpriteFrameByMJID("M_", mjId);
        }else {
            this.mjSprite.node.active = false;
            this.bgNode.active = false;
        }
        
    },

    getFrameIndex: function (key) {
        var index = -1;

        if (key == "guo") {
           return index; 
        }

        this.showErrorTip(cc.vv.gameNetMgr, "cc.vv.gameNetMgr");
        this.showErrorTip(cc.vv.gameNetMgr.mahjongPlayArray, "cc.vv.gameNetMgr.mahjongPlayArray");
        for (var i = 0, len = cc.vv.gameNetMgr.mahjongPlayArray.length; i < len; i++) {
            if (key == cc.vv.gameNetMgr.mahjongPlayArray[i]) {
                index = i;
                break;
            }
        };

        return index;
    },

    onPlayOperateClicked: function () {
        if (cc.vv.replayMgr.isReplay() || this.playKey == null || this.controller == null) {
            return;
        }

        this.controller.onPlayOptionClicked(this.playKey, this.mjId);
    },

    showErrorTip: function (errorObj, objName) {
        var content = "显示有误，请重连！";
        if (errorObj == null) {
            content = objName + content;
        }else {
            return;
        }
        if (cc.vv.alert) {
            cc.vv.alert.show(content);  
        }
    },

    onDestroy:function(){
    }
});