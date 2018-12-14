cc.Class({
    extends: cc.Component,

    properties: {
        mj:{
            default:null,
            type:cc.Sprite
        },
    },

    // use this for initialization
    onLoad: function () { 
    },

    init: function (pre, mjId) {
        if (mjId < 0) {
            return;
        }
        this.mj.spriteFrame = cc.vv.controlMgr.getSpriteFrameByMJID(pre,mjId);
    },

    getMjWidth: function () {
        return this.mj.node.width;
    }
});