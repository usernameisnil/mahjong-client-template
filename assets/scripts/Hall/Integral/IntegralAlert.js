cc.Class({
    extends: cc.Component,

    properties: {
    },

    onLoad: function () {
    	cc.vv.integralAlert = this;
    },

    start: function () {
    },

    init: function (fileUrl) {
    	this.fileUrl = fileUrl;
    },

    Btn_Integral_Share_OnClick: function () {
    	if (this.fileUrl == null || this.fileUrl == undefined || this.fileUrl == "") {
    		return;
    	}
        cc.vv.anysdkMgr.shareIntegralShop(this.fileUrl, true);
    },

    Btn_Close_OnClicked: function () {
    	var self = this;
    	cc.vv.userMgr.noticePopupEnd();
    },

    removeThis: function () {
    	this.node.destroy();
    },

    onDestroy: function () {
    	cc.vv.integralAlert = null;
    },

});