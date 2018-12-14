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

        cc.vv.gameNetMgr.showErrorTip(this, "PlayOption this");
        cc.vv.gameNetMgr.showErrorTip(this.node, "PlayOption.node");
        
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
        if (this.playSprite.spriteFrame == null) {
            cc.vv.gameNetMgr.showErrorTip(null, "this.playSprite.spriteFrame");  
        }  

        if (mjId >= 0) {
            this.mjSprite.node.active = true;
            this.bgNode.active = true;

            cc.vv.gameNetMgr.showErrorTip(cc.vv.controlMgr, "cc.vv.controlMgr");
            this.mjSprite.spriteFrame = cc.vv.controlMgr.getSpriteFrameByMJID("M_", mjId);
            if (this.mjSprite.spriteFrame == null) {
                cc.vv.gameNetMgr.showErrorTip(null, "this.mjSprite.spriteFrame");
            }
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

        cc.vv.gameNetMgr.showErrorTip(cc.vv.gameNetMgr, "cc.vv.gameNetMgr");
        cc.vv.gameNetMgr.showErrorTip(cc.vv.gameNetMgr.mahjongPlayArray, "cc.vv.gameNetMgr.mahjongPlayArray");

        for (var i = 0; i < cc.vv.gameNetMgr.mahjongPlayArray.length; i++) {
            if (key == cc.vv.gameNetMgr.mahjongPlayArray[i]) {
                index = i;
            }
        };

        return index;
    },

    onPlayOperateClicked: function () {
        if (cc.vv.replayMgr.isReplay() || cc.vv.PKReplayMgr.isReplay() || this.playKey == null || this.controller == null) {
            return;
        }

        this.controller.onPlayOptionClicked(this.playKey, this.mjId);
    },

    onDestroy:function(){
    }
});