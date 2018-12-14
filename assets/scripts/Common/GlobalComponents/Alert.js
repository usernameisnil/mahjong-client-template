cc.Class({
    extends: cc.Component,

    properties: {
        _alert:null,
        _btnOK:null,
        _btnCancel:null,
        //_title:null,
        _content:null,
        _onok:null,
        _onCancel:null,
        _isShow:false,
    },

    // use this for initialization
    onLoad: function() {
        if (cc.vv == null) {
            return;
        }

		var alert = cc.find("Canvas/layerRoot/alert");
        if (cc.vv.utils.isNullOrUndefined(alert)) {
            this._alert = null;
            return;
        }
        this._alert = alert;

        this._content = cc.find("body/content", alert).getComponent(cc.Label);
        this._btnOK = cc.find("body/btn_ok", alert);
        this._btnCancel = cc.find("body/btn_cancel", alert);
        cc.vv.utils.addClickEvent(this._btnOK, this.node, "Alert", "onBtnClicked");
        cc.vv.utils.addClickEvent(this._btnCancel, this.node, "Alert", "onBtnClicked");
        this._alert.active = false;
        cc.vv.alert = this;
    },

    onBtnClicked: function(event) {
        cc.vv.audioMgr.playSFX('Sound/Alert_Close.mp3');

        if (this._isShow == true) {
            this._alert.active = false;
        }

        if (event.target.name == "btn_ok") {
            if(this._onok){
                this._onok();
            }
        }
        this._onok = null;

        if (event.target.name == "btn_cancel") {
            if(this._onCancel){
                this._onCancel();
            }
        }
        this._onCancel = null;
        if (this._isShow == false) {
           cc.vv.utils.showDialog(this._alert, 'body', false); 
        }
    },

    show: function(content, onok, needcancel, changeBtnFrames, isShow, onCancel) {

        if (this._alert == null) {
            return;
        }

        cc.vv.audioMgr.playSFX('Sound/Alert_Open.mp3');
        
        this._alert.active = true;
        this._onok = onok;
        this._onCancel = onCancel;

        if (isShow) {
            this._isShow = isShow;
        }else {
            this._isShow = false;
        }

        this._content.string = content;
        if (needcancel) {
            this._btnCancel.active = true;
            this._btnOK.x = -150;
            this._btnCancel.x = 150;
        } else {
            this._btnCancel.active = false;
            this._btnOK.x = 0;
        }

        var spOk_res = "/textures/Common/Alert/632_WeChatKWX_tips_SureBtn1";
        var Cancel_res = "textures/Common/Alert/628_WeChatKWX_tips_CancelBtn1";
        if (changeBtnFrames && changeBtnFrames == "replaceCreateRoom") {
            spOk_res = "textures/Common/Alert/632_WeChatKWX_tips_SureBtn1_01";
            Cancel_res = "textures/Common/Alert/628_WeChatKWX_tips_CancelBtn1_01";
        }

        var spOk = this._btnOK.getComponent("cc.Sprite");
        cc.vv.utils.createSpriteFrame({path : spOk_res},function(sp){
            spOk.spriteFrame = sp;
        });
        var spCancel = this._btnCancel.getComponent("cc.Sprite");
        cc.vv.utils.createSpriteFrame({path : Cancel_res},function(sp){
            spCancel.spriteFrame = sp;
        }); 

		cc.vv.utils.showDialog(this._alert, 'body', true);

        this._alert.setLocalZOrder(10);
    },

    getActive: function () {
        if (this._alert == null) {
            return null;
        }
        return this._alert.active;
    },

    onDestroy:function() {
        if (cc.vv) {
            cc.vv.alert = null;
        }
    },
    close:function () {
        if (this._alert == null) {
            return;
        }
        this._alert.active = false;
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
