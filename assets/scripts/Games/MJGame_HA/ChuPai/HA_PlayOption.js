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

        if (mjId >= 0) {
            this.mjSprite.node.active = true;
            this.bgNode.active = true;
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

        for (var i = 0; i < cc.vv.gameNetMgr.mahjongPlayArray.length; i++) {
            if (key == cc.vv.gameNetMgr.mahjongPlayArray[i]) {
                index = i;
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

    onDestroy:function(){
    }
});