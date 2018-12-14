cc.Class({
    extends: cc.Component,

    properties: {
        mjs:{
            default:[],
            type:cc.Sprite
        },
        _chiType:null,
    },

    // use this for initialization
    onLoad: function () { 
    },

    init: function (mjIdList, chiType) {

        for (var j = 0; j < mjIdList.length; j++) {
            this.mjs[j].spriteFrame = cc.vv.controlMgr.getSpriteFrameByMJID("B_",mjIdList[j]);
        }

        this.setChiType(chiType);
    },

    setChiType: function (chiType) {
        this._chiType = chiType;
    },

    getChiType: function () {
        return this._chiType;
    },

    onChiOptionClicked: function(event) {
        var net = cc.vv.net;

        var type = this.getChiType();
        if (cc.vv.gameNetMgr.curaction == null) {
            return;
        }
        var data = cc.vv.gameNetMgr.curaction.chi_data;
        if (type != null && data && data.pai) {
            var pai = type * 100 + data.pai;
            net.send('chi', pai);
        }
    },
});